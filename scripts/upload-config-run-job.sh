#! /usr/bin/env bash

##############################################################################
#  This script does this;
#   1. Download the analysis given as analysisId input (first argument)
#   2. Create a new SimaApplicationConfig based on the old with the CI's generated stask file as the "stask" attribute
#   3. Upload the SimaApplicationConfig
#   4. Create a job entity with the SimaApplicationConfig as "input"
#   5. Start the job
##############################################################################

set -euo pipefail # Will cause any error to abort the script execution

DMSS_API=${DMSS_API:="http://localhost:8000/api/v1"}
DMT_JOB_API=${DMT_JOB_API:="http://localhost:5000/api/job"}
ANALYSIS_ID=${1:-"AnalysisPlatformDS/4483c9b0-d505-46c9-a157-94c79f4d7a6a"}
STASK_BLOB_PATH=${2:-"./testSTask.stask"}
SIMA_CONFIG_PREFIX=${3:-"mySimaConfig"}
TOKEN=${DMSS_SECRET_TOKEN:=""}  # Should be fed in as a github secret
GITHUB_REF=${GITHUB_REF:="refs/heads/branch-name-goes-here"}  # Sets a default value incase it is not run in Github Actions CI
GITHUB_SHA=${GITHUB_SHA:="thisisalongmocksha"}
SHORT_GIT_SHA=$(echo "$GITHUB_SHA" | head -c 9)

echo "DMSS_API: '${DMSS_API}'"
echo "DMT_JOB_API: '${DMT_JOB_API}'"
echo "ANALYSIS_ID: '$ANALYSIS_ID'"
echo "STask: '${STASK_BLOB_PATH}'"

function get_document() {
    DOCUMENT_ID=$1
    OUTPUT_PATH=$2
    curl --request 'GET' \
      --fail \
      "${DMSS_API}/documents/${DOCUMENT_ID}?depth=999" \
      --header 'accept: application/json' \
      --header "Access-Key: ${TOKEN}" \
      --output "$OUTPUT_PATH" &&
      jq . "$OUTPUT_PATH"
}

function upload_document() {
  DATA_SOURCE=$1
  TARGET_DIRECTORY=$2
  DOCUMENT=$3
  BLOB_FILE=${4:=""}
  # Need curl > 7.76.0 for this option that prints the error response
  # --fail-with-body
  curl --request 'POST' \
    --fail \
    "${DMSS_API}/explorer/${DATA_SOURCE}/add-to-path?update_uncontained=true" \
    --header 'accept: application/json' \
    --header 'Content-Type: multipart/form-data' \
    --header "Access-Key: ${TOKEN}" \
    --form "document=${DOCUMENT}" \
    --form "directory=${TARGET_DIRECTORY}" \
    --form "files=@$(realpath ${BLOB_FILE})"
}

function add_document() {
  PARENT=$1
  DOCUMENT=$2

  curl -X 'POST' \
    --fail \
    "${DMSS_API}/explorer/${PARENT}?update_uncontained=false" \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    --header "Access-Key: ${TOKEN}" \
    -d "$DOCUMENT"
}

function start_job() {
  JOB_ID=$1
  curl -X 'POST' \
    --fail \
    "${DMT_JOB_API}/explorer/${PARENT}?update_uncontained=false" \
    -H 'accept: application/json' \
    -H 'Content-Type: application/json' \
    --header "Access-Key: ${TOKEN}" \
    -d "$DOCUMENT"
}

function create_SIMA_configuration(){
  TEMPLATE=$1
  NAME=$2
  STASK=$3
  echo $TEMPLATE | jq --arg name "$NAME" --argjson stask "$STASK" '.name = $name | .stask = $stask'
}

function create_stask_document(){
  NAME=$1
  FILENAME=$(basename $2)
  echo '{"name":"REPLACE_NAME","type":"AnalysisPlatformDS/Blueprints/STask", "tag": "REPLACE_TAG", "blob":{"name":"REPLACE_FILE","type":"system/SIMOS/Blob"}}' \
  | jq --arg name "$NAME" --arg file "$FILENAME" --arg tag "${GITHUB_REF##*/}-${SHORT_GIT_SHA}" '.name = $name | .tag = $tag | .blob.name = $file'
}

function create_job_document(){
  NAME=$1
  APP_INPUT_ID=$2
  REF_TARGET=$3

  echo '{"type":"WorkflowDS/Blueprints/Job","name":"myJob","label":"Example local container job","triggeredBy":"SIMA CI Pipeline","started":"REPLACE_TIMESTAMP",
    "referenceTarget":"REPLACE_REFERENCE_TARGET",
    "description": "REPLACE_DESCRIPTION",
    "result":{},
    "runner":{
      "type":"WorkflowDS/Blueprints/jobHandlers/AzureContainer",
      "image":{
        "imageName": "dmt-job/srs",
        "description": "",
        "type": "AnalysisPlatformDS/Blueprints/ContainerImage",
        "version": "latest",
        "registryName": "datamodelingtool.azurecr.io"
      }
    },
    "applicationInput":{"_id":"REPLACE_APP_INPUT","type":"AnalysisPlatformDS/Blueprints/SIMAApplicationInput","name":"simaTestAppInput","contained":false}}' | \
  jq --arg name "$NAME" --arg description "${GITHUB_REF##*/}-${SHORT_GIT_SHA}" --arg refTarget "$REF_TARGET" --arg appInput "$APP_INPUT_ID" \
    '.name = $name | .referenceTarget = $refTarget | .applicationInput._id = $appInput'
}

function update_reference_to_stask(){
  DOTTED_ID=$1
  TARGET_ID=$2
  NAME=$3

  curl --request 'PUT' \
  --fail \
  -v \
  "http://localhost:8000/api/v1/reference/${DOTTED_ID}" \
  --header 'accept: application/json' \
  --header 'Content-Type: application/json' \
  --header "Access-Key: ${TOKEN}" \
  --data '{
  "_id": "something",
  "name": "something",
  "type": "AnalysisPlatformDS/Blueprints/STask"
}'
}

echo "Fetching analysis... '${ANALYSIS_ID}'"
ANALYSIS=$(get_document "$ANALYSIS_ID" "./analysis.json")
RUNS_SO_FAR=$(echo $ANALYSIS | jq '.jobs | length')
echo "Runs so far: $RUNS_SO_FAR"
NEW_SIMA_CONFIG_NAME="${SIMA_CONFIG_PREFIX}-${GITHUB_REF##*/}-${SHORT_GIT_SHA}-$(echo $RANDOM | md5sum | head -c 5; echo;)"

echo "Creating SIMAApplicationInput with '${STASK_BLOB_PATH}' named '$NEW_SIMA_CONFIG_NAME'"
echo "----------------------------------------"
STASK=$(create_stask_document "$NEW_SIMA_CONFIG_NAME" "$STASK_BLOB_PATH")
SIMA_CONFIG=$(create_SIMA_configuration "$(echo $ANALYSIS | jq '.task.applicationInput')" "$NEW_SIMA_CONFIG_NAME" "$STASK")
echo $SIMA_CONFIG | jq
echo "------------------ OK ------------------"


echo "Uploading new SIMAApplicationInput..."
echo "----------------------------------------"
SIMA_CONFIG_UID=$(upload_document 'AnalysisPlatformDS' \
  'Data/ApplicationInputs' \
  "$SIMA_CONFIG" \
  "$STASK_BLOB_PATH" | jq .uid)

SIMA_CONFIG_UID=$(echo $SIMA_CONFIG_UID | tr -d '"')

echo "Uploaded SIMAApplicationInput with id '$SIMA_CONFIG_UID'"
echo "-----------------  OK  ------------------"


echo "Creating new job entity..."
echo "----------------------------------------"
REF_TARGET="$ANALYSIS_ID.jobs.$RUNS_SO_FAR.result"
echo "Target for result reference: $REF_TARGET"
NEW_JOB_DOCUMENT=$(create_job_document "job-number-${RUNS_SO_FAR}" "$SIMA_CONFIG_UID" "$REF_TARGET")
echo $NEW_JOB_DOCUMENT | jq
echo "-------------------  OK ---------------------"


echo "Uploading job entity..."
echo "----------------------------------------"
add_document "${ANALYSIS_ID}.jobs" "$NEW_JOB_DOCUMENT"
echo ""
echo "-------------------  OK ---------------------"


echo "Triggering job..."
echo "----------------------------------------"
JOB_ID="$ANALYSIS_ID.jobs.$RUNS_SO_FAR"
echo $JOB_ID
curl --request 'POST' --fail --header 'accept: application/json' --header "Access-Key: ${TOKEN}" "${DMT_JOB_API}/$JOB_ID"
echo ""
echo "-------------------  OK ---------------------"
echo "Script completed successfully. Exiting..."
exit 0

#! /usr/bin/env bash
# Exit on errors
set -e
time=$(date +'%d/%m/%Y %r')
echo "** Start time: ${time} **"
if [[ -z "${SIMA_LICENSE}" ]]; then
  echo "********************************************************************************"
  echo "* WARNING! The SIMA_LICENSE environment variable must be set, and its contents *"
  echo "* must be the actual licenses to use for SIMA, SIMO and RIFLEX etc.            *"
  echo "********************************************************************************"
  exit 1
else
  echo "$SIMA_LICENSE" > /root/sima.lic
fi

# default values
export SRE_HOME=/var/opt/sima

for i in "$@"; do
  case $i in
    --token=*)
      TOKEN="${i#*=}"
      shift # past argument=value
      ;;
    --application-input=*)
      APPLICATION_INPUT="${i#*=}"
      shift # past argument=value
      ;;
    --stask=*)
      STASK="${i#*=}"
      shift # past argument=value
      ;;
    --task=*)
      TASK="${i#*=}"
      shift # past argument=value
      ;;
    --workflow=*)
      WORKFLOW="${i#*=}"
      shift # past argument=value
      ;;
    --compute-service-cfg=*)
      COMPUTE_SERVICE_CFG="${i#*=}"
      shift # past argument=value
      ;;
    --remote-run)
      REMOTE_RUN="--remote-run"
      shift # past argument=value
      ;;
    --input=*)
      INPUT="${i#*=}"
      shift
      ;;
    *)
      echo "WARNING: Invalid argument '$i'"
      ;;
  esac
done


## Run the DMT wrapper. Preparing the SRE environment
#/code/job_wrapper.py run --token=$TOKEN --stask=$STASK --task=$TASK --workflow=$WORKFLOW --compute-service-cfg=$COMPUTE_SERVICE_CFG $REMOTE_RUN --input=$INPUT
## SIMA Headless
#/opt/sima/sre \
#  -data=$SRE_HOME \
#  -commands file=$SRE_HOME/commands.txt \
#  -consoleLog
## Upload results
#  /code/job_wrapper.py upload --token=$TOKEN --target=$TARGET --result-link-target=$RESULT_LINK_TARGET --task=$TASK --workflow=$WORKFLOW
APPLICATION_INPUT=`echo $APPLICATION_INPUT | sed 's/ /%20/g'` #replace space with %20 since python click cannot have space in the input value

/code/job_wrapper.py get-and-upload-result --token=$TOKEN --application-input=$APPLICATION_INPUT

time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"


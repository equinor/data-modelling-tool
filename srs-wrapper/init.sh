#! /usr/bin/env bash
set -eu

if [[ -z "${SIMA_LICENSE}" ]]; then
  echo "********************************************************************************"
  echo "* WARNING! The SIMA_LICENSE environment variable must be set, and its contents *"
  echo "* must be the actual licenses to use for SIMA, SIMO and RIFLEX etc.            *"
  echo "********************************************************************************"
else
  echo "$SIMA_LICENSE" > /root/sima.lic
fi

# default values
TOKEN=None
STASK=None
WORKFLOW=None
COMPUTE_SERVICE_CFG=None
REMOTE_RUN=
INPUT=None
TARGET=None

for i in "$@"; do
  case $i in
    --token=*)
      TOKEN="${i#*=}"
      shift # past argument=value
      ;;
    --stask=*)
      STASK="${i#*=}"
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
    --target=*)
      TARGET="${i#*=}"
      shift
      ;;
    *)
      echo "WARNING: Invalid argument '$i'"
      ;;
  esac
done


# Run the DMT wrapper. Preparing the SRS environment
/code/job_wrapper.py run --token=$TOKEN --stask=$STASK --workflow=$WORKFLOW --compute-service-cfg=$COMPUTE_SERVICE_CFG $REMOTE_RUN --input=$INPUT
# SIMA Headless
/opt/sima/sima \
  -commands file=/var/opt/sima/workspace/commands.txt \
  -application no.marintek.sima.application.headless.application \
  -consoleLog \
  -data /var/opt/sima/workspace \
  -vmargs \
  -Djdk.lang.Process.launchMechanism=vfork
# Upload results
  /code/job_wrapper.py upload --token=$TOKEN --target=$TARGET


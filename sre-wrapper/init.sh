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
    --input-id=*)
      APPLICATION_INPUT="${i#*=}"
      shift # past argument=value
      ;;
    --reference-target=*)
      REFERENCE_TARGET="${i#*=}"
      shift # past argument=value
      ;;
    *)
      echo "WARNING: Invalid argument '$i'"
      ;;
  esac
done


# Run the DMT wrapper. Preparing the SRE environment
/code/job_wrapper.py run --input-id="$APPLICATION_INPUT"
# SIMA Headless
/opt/sima/sre \
  -data=$SRE_HOME \
  -commands file=$SRE_HOME/commands.txt \
  -consoleLog

if [ "$REFERENCE_TARGET" == "" ]
then
  # Upload result
  /code/job_wrapper.py upload-result
else
  # Upload result and add reference
  /code/job_wrapper.py upload-result --reference-target="$REFERENCE_TARGET"
fi

time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"


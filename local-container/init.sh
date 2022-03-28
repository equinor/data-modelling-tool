#! /usr/bin/env bash
# Exit on errors
set -e
time=$(date +'%d/%m/%Y %r')
echo "** Start time: ${time} **"
if [[ -z "${SIMA_LICENSE}" ]]; then
  echo "********************************************************************************"
  echo "* WARNING! The SIMA_LICENSE environment variable not found                      *"
  echo "********************************************************************************"
#  exit 1
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
    --result-reference-location=*)
      RESULT_REFERENCE_LOCATION="${i#*=}"
      shift # past argument=value
      ;;
    *)
      echo "WARNING: Invalid argument '$i'"
      ;;
  esac
done


python3 /code/wrapper.py get-and-upload-result --token=$TOKEN --result-reference-location=$RESULT_REFERENCE_LOCATION --application-input=$APPLICATION_INPUT
time=$(date +'%d/%m/%Y %r')
echo "** End time: ${time} **"

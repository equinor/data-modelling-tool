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

if [ "$1" = 'run' ]; then
  shift
  # Run the DMT wrapper. Preparing the SRS environment
  /code/dmt_job_wrapper.py run "$@"
  # SIMA Headless
  /opt/sima/sima \
    -commands file=/var/opt/sima/workspace/commands.txt \
    -application no.marintek.sima.application.headless.application \
    -consoleLog \
    -data /var/opt/sima/workspace \
    -vmargs \
    -Djdk.lang.Process.launchMechanism=vfork
  # Upload results
    /code/dmt_job_wrapper.py upload
else
  exec "$@"
fi

sleep 3600
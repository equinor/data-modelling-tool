#! /usr/bin/env bash
set -eu


if [ "$1" = 'run' ]; then
  shift
  # Run the DMT wrapper. Preparing the SRS environment
  /code/dmt_job_wrapper.py run "$@"
  # Continue with SRS entrypoint
  /docker_entrypoint.sh /usr/local/bin/supervisord -d /root/ -c /etc/supervisord.conf -l /var/log/supervisord.log
else
  exec "$@"
fi
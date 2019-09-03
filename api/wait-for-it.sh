#!/bin/sh

set -e

HOST=$1
DB_PORT=$2

echo "Waiting for: $HOST:$DB_PORT"

shift 2
cmd="$@"

echo "Then execute command: $cmd"

i=1
while ! nc -z $HOST $DB_PORT; do
    sleep 1
    i=$((i+1));
    if [ $i -eq 600 ]; then
        echo "Service $NAME '$HOST:$DB_PORT' not responding. Exiting..."
        exit 1
    fi;
done


>&2 echo "Service is up - executing command"
exec $cmd

#!/usr/bin/env sh
set -eu

flask nuke-db
flask init-import

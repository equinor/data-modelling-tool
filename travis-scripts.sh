#! /bin/bash

docker_login() {
  docker login -u mariner -p $ACR_SECRET $IMAGE_REGISTRY
}

pull_api() {
  docker pull $API_IMAGE || true
}

pull_web() {
  docker pull $WEB_IMAGE || true
}

pull_nginx() {
  docker pull $NGINX_IMAGE || true
}

if [ "$1" = "pull-web" ]; then
  docker_login
  pull_web
elif [ "$1" = "pull-api" ]; then
  docker_login
  pull_api
elif [ "$1" = "pull-nginx" ]; then
  docker_login
  pull_nginx
elif [ "$1" = "build-api-dev-image" ]; then
  docker_login
  pull_api
  docker build --cache-from "$API_IMAGE" --target development --tag development ./api/
else
    echo "Error: Invalid argument"
    exit 1
fi

#! /bin/bash

docker_login() {
  docker login -u mariner -p $ACR_SECRET $IMAGE_REGISTRY
}

docker_tag_push(){
  IMAGE=$1
  if [ -n "$TRAVIS_TAG" ]; then
    echo "Tagging and pushing $IMAGE as $IMAGE:$TRAVIS_TAG"
    docker tag "$IMAGE" "$IMAGE:$TRAVIS_TAG"
    docker push "$IMAGE:$TRAVIS_TAG"

  fi
  if [ "$TRAVIS_BRANCH" == "stable" ]; then
    echo "Tagging and pushing $IMAGE as $IMAGE:stable"
    docker tag "$IMAGE" "$IMAGE:stable"
    docker push "$IMAGE:stable"

  fi
}

pull() {
  IMAGE=$1
  docker pull $IMAGE || true
}

if [ "$1" = "pull" ]; then
  docker_login
  pull $2

elif [ "$1" = "tags" ]; then
  docker_tag_push "$2"

elif [ "$1" = "build-api-dev-image" ]; then
  docker_login
  pull $API_IMAGE
  docker build --cache-from "$API_IMAGE" --target development --tag development ./api/

else
    echo "Error: Invalid argument"
    exit 1
fi

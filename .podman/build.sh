#!/bin/bash

# simple script for initialising a pod consisting of bookworm-slim
# (w/ npm/vitest/playwright & git/openssh) and nginx serving the project
# directory to localhost:8080

# to use, cd into the .podman folder and run the script, attach
# to the node container (sol-node) with vscode via the dev containers
# extension and then open folder /workspace/solastjs

# (since a recent vscode update i now need to run the script inside
# vscode via an integrated terminal as vscode won't see any containers
# running via local system terminal anymore)

# run tests using 'npm run test' or via playwright and headless
# browser using 'xnpm run test'

# help
help() {
  echo "running script without any arguments will"
  echo "build container images and create the pod"
  echo
  echo ".---------------------------------------."
  echo "| -h     displays this help message     |"
  echo "| -s     skip building container images |"
  echo "'---------------------------------------'"
}

build() {
  # pull base image (if necessary) and build container image
  # (using containerfile)
  
  set -x
  podman pull docker.io/library/node:25.0-bookworm-slim
  podman build --file node.containerfile --tag localhost/sol-node-img .

  podman pull docker.io/library/nginx:1.27-alpine
  podman build --file nginx.containerfile --tag localhost/sol-nginx-img .
  set +x
}

run() {
  # create the pod and attach containers to it

  set -x
  podman pod create --name sol-pod --volume ../:/workspace/solastjs \
    --publish 8080:80

  podman run -dt --pod sol-pod --name sol-node localhost/sol-node-img
  podman run -dt --pod sol-pod --name sol-nginx localhost/sol-nginx-img
  set +x
}

skipBuild=false;

while getopts ":hs" arg; do
  case $arg in
    h) # display help message
      help
      exit 0
      ;;
    s) # skip building container images
      skipBuild=true
      ;;
  esac
done

if test $skipBuild == false; then
  build
fi

run

#!/bin/bash -x

# simple script for initialising a pod consisting of alpine
# (w/ npm/vitest & git/openssh) and nginx serving the project directory
# to localhost:8080

# to use, cd into the .podman folder and run the script, attach
# to the node container (sol-node) with vscode via the dev containers
# extension and then open folder /workspace/solastjs

# run tests using 'npm run test' and coverage 'npm run coverage'

podman pod create --name sol-pod --volume ../:/workspace/solastjs \
  --publish 8080:80

podman pull docker.io/node:current-alpine
podman build --file node.containerfile --tag localhost/sol-node-img .
podman run -dt --pod sol-pod --name sol-node localhost/sol-node-img

podman pull docker.io/nginx:latest
podman build --file nginx.containerfile --tag localhost/sol-nginx-img .
podman run -dt --pod sol-pod --name sol-nginx localhost/sol-nginx-img

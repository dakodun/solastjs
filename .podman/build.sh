#!/bin/bash -x

# simple script for initialising a pod consisting of alpine (w/ git) and
# nginx serving the project directory

# to use, cd into the .podman folder and run the script, attach
# to the alpine container with vscode via the dev containers extension
# and then open folder /workspace/solastjs

podman pod create --name sol-pod --volume ../:/workspace/solastjs --publish 8080:80

podman pull docker.io/alpine:latest
podman build --file alpine.containerfile --tag localhost/sol-alpine-img .
podman run -dt --pod sol-pod --name sol-alpine localhost/sol-alpine-img

podman pull docker.io/nginx:latest
podman build --file nginx.containerfile --tag localhost/sol-nginx-img .
podman run -dt --pod sol-pod --name sol-nginx localhost/sol-nginx-img

# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.234.0/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use ubuntu-22.04 or ubuntu-18.04 on local arm64/Apple Silicon): ubuntu-22.04, ubuntu-20.04, ubuntu-18.04
FROM mcr.microsoft.com/vscode/devcontainers/python:3.10

ENV NODE_VERSION=16.13.0
RUN apt update && apt install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

WORKDIR /workspace
COPY . .

RUN python -m pip install -r ./backend/requirements.txt

RUN npm --prefix ./frontend install ./frontend --force






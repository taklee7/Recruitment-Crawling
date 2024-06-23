#!/usr/bin/env bash

# Google Chrome 다운로드 및 설치
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
apt-get update
apt-get install -y ./google-chrome-stable_current_amd64.deb

# 설치 후 불필요한 파일 제거
rm -f ./google-chrome-stable_current_amd64.deb

# 원래의 빌드 명령어 수행
npm install
npm run build

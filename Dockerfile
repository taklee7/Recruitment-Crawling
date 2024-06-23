# 베이스 이미지 설정
FROM node:20

# 작업 디렉토리 설정
WORKDIR /usr/src/app

# 종속성 파일 복사 및 설치
COPY package.json yarn.lock ./
RUN yarn install

# Chrome 설치 스크립트 복사 및 실행
COPY install-chrome.sh ./
RUN chmod +x install-chrome.sh && ./install-chrome.sh

# 애플리케이션 소스 코드 복사
COPY . .

# Puppeteer 환경 변수 설정
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

# 애플리케이션 실행 포트 설정
EXPOSE 10000

# 애플리케이션 실행 명령어
CMD ["node", "api/data.js"]

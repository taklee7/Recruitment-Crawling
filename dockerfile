# 베이스 이미지 설정
FROM node:14

# Chrome 설치에 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    --no-install-recommends \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json ./
RUN yarn install

# 소스 코드 복사
COPY . .

# Puppeteer가 Chrome을 찾을 수 있도록 환경 변수 설정
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "api/data.js"]

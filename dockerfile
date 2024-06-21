# Node.js 최신 LTS 이미지 기반
FROM node:18

# 작업 디렉토리 설정 (프로젝트 루트)
WORKDIR /app

# 필요한 패키지 설치
COPY package*.json ./
RUN npm install

# Puppeteer가 필요한 종속성 설치
RUN apt-get update && apt-get install -y \
    gconf-service \
    libasound2 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libxss1 \
    lsb-release \
    xdg-utils \
    wget \
    --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# chrome-aws-lambda의 크롬 바이너리 설치
RUN npm install chrome-aws-lambda

# 애플리케이션 소스 복사
COPY . .

# 환경 변수 설정
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# 앱 실행
CMD ["node", "api/data.js"]

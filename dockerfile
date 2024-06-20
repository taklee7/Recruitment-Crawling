# Node.js 이미지 선택
FROM node:14

# 작업 디렉토리 설정
WORKDIR /app

# 앱의 의존성 파일 복사
COPY package*.json ./

# Puppeteer를 위한 필요한 패키지 설치
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    && wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update && apt-get install -y \
    google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

# 의존성 설치
RUN npm install

# 애플리케이션 코드 복사
COPY . .

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "api/data.js"]

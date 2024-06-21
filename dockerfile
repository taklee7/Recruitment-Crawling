# 최신 Node.js LTS 버전 사용
FROM node:18

# Chrome 설치를 위한 종속성 패키지 설치
RUN apt-get update && apt-get install -y \
  wget \
  gnupg \
  --no-install-recommends

# Chrome 다운로드 및 설치
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] https://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list' \
  && apt-get update \
  && apt-get install -y google-chrome-stable \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json ./
RUN yarn install

# 소스 코드 복사
COPY . .

# 애플리케이션 실행
CMD ["node", "src/api/data.js"]

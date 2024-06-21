# 최신 Node.js LTS 버전 사용
FROM node:18

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json ./
RUN yarn install

# 소스 코드 복사
COPY . .

# 애플리케이션 실행
CMD ["node", "api/data.js"]

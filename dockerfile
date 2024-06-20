# 베이스 이미지 설정
FROM node:14

# 작업 디렉터리 설정
WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json ./
RUN yarn install

# 소스 코드 복사
COPY . .

# 포트 설정
EXPOSE 3000

# 애플리케이션 실행
CMD ["node", "api/data.js"]

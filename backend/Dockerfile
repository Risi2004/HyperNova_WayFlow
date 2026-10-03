FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production TZ=Asia/Colombo

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000
ENTRYPOINT ["./docker-entrypoint.sh"]

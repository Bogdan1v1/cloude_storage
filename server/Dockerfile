# Використовуємо Node 22 (Alpine)
FROM node:22-alpine

# Встановлюємо OpenSSL (критично для Prisma на Alpine)
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Генеруємо Prisma Client
RUN npx prisma generate

RUN npm run build

EXPOSE 3000

# Запускаємо міграції і сервер
CMD [  "sh", "-c", "npx prisma migrate deploy && npm run start:prod" ]
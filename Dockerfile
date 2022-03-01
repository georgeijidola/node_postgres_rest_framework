# STAGE 1
FROM node:14.17.3-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i
COPY . .

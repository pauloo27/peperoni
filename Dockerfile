FROM node:20 AS builder

RUN corepack enable pnpm

WORKDIR /app

COPY package.json .
COPY pnpm-lock.yaml .
COPY src src

RUN pnpm install

ENTRYPOINT ["node", "."]

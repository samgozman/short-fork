FROM node:18-alpine as builder
ENV NODE_OPTIONS=--max-old-space-size=1024
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:alpine-slim
COPY --from=builder /app/dist /usr/share/nginx/html

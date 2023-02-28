FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM jauderho/nginx-distroless:latest
COPY --from=builder /app/dist /usr/share/nginx/html

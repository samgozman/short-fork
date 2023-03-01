FROM node:18-alpine as builder
ENV NODE_OPTIONS=--max-old-space-size=1024
ENV VITE_API_URL=http://localhost:3000
ENV VITE_DEFAULT_LOCALE=en
ENV VITE_FALLBACK_LOCALE=en
ENV VITE_SUPPORTED_LOCALES=en,ru
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:alpine-slim
ENV PORT=80
ENV NGINX_PORT=${PORT}
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE ${NGINX_PORT}
CMD ["nginx", "-g", "daemon off;"]

FROM node:18-alpine as builder
ARG VITE_API_URL=http://localhost:3000
ARG VITE_DEFAULT_LOCALE=en
ARG VITE_FALLBACK_LOCALE=en
ARG VITE_SUPPORTED_LOCALES=en,ru
ENV NODE_OPTIONS=--max-old-space-size=1024
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_DEFAULT_LOCALE=${VITE_DEFAULT_LOCALE}
ENV VITE_FALLBACK_LOCALE=${VITE_FALLBACK_LOCALE}
ENV VITE_SUPPORTED_LOCALES=${VITE_SUPPORTED_LOCALES}
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:alpine-slim
ENV PORT=80
ENV NGINX_PORT=${PORT}
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/conf.d/default.conf
EXPOSE ${NGINX_PORT}

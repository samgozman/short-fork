FROM node:18-alpine AS build-env
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM gcr.io/distroless/nodejs18-debian11
COPY --from=build-env /app /app
WORKDIR /app
ENV NODE_ENV=production
CMD ["dist/main.js"]

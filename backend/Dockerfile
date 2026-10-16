FROM node:22-alpine AS build-env
ENV NODE_ENV=development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM node:22-alpine
COPY --from=build-env /app /app
WORKDIR /app
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]

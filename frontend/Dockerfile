# client/Dockerfile
FROM node:20-alpine AS build

ARG VITE_CAPTCHA_SITE_KEY
ENV VITE_CAPTCHA_SITE_KEY=$VITE_CAPTCHA_SITE_KEY

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve using nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY  nginx.conf /etc/nginx/nginx.conf

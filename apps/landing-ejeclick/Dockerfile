FROM node:22-alpine AS builder
WORKDIR /app
COPY apps/landing-ejeclick/package*.json ./
COPY package-lock.json ./
RUN npm ci
COPY apps/landing-ejeclick/ .
RUN npm run build

FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY apps/landing-ejeclick/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

FROM node:20-alpine AS builder
WORKDIR /app

# Instala dependencias
COPY package*.json tsconfig.json ./
RUN npm ci

# Copia el código y compila
COPY src ./src
RUN npm run build

# Imagen final
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]

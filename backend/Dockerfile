# Multi-stage build para o Backend NestJS
FROM node:20-alpine AS backend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS backend-runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=backend-builder /app/dist ./dist
# Copia a fonte consolidada JSON para runtime
COPY --from=backend-builder /app/src/infrastructure/data ./src/infrastructure/data
EXPOSE 3000
CMD ["node", "dist/main.js"]


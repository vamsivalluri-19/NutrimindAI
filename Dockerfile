# Stage 1: Build Shared Module
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY shared ./shared
COPY backend ./backend
RUN npm install
RUN npm run build:shared
RUN cd backend && npm run build

# Stage 2: Runner
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/shared/package.json ./shared/package.json
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json

EXPOSE 5050
ENV NODE_ENV=production
CMD ["npm", "start", "--workspace=backend"]

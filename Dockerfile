# Build stage
FROM node:alpine AS builder
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

# Production stage
FROM node:alpine AS prod
COPY --from=builder /app/dist ./
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "index.js"]
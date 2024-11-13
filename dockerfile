FROM node:20.15.1 as builder

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .
COPY .env.default .env.default

RUN npm run build
# Étape 2 : Image de production
FROM node:20.15.1

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.default ./

COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

USER node

EXPOSE 3000

CMD ["sh", "-c", "npm start"]

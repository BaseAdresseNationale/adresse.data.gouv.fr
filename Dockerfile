FROM node:18.19-alpine3.18 as builder

WORKDIR /app

COPY package.json yarn.lock .
RUN mkdir public
RUN yarn

COPY . .
RUN yarn build

FROM node:18.19-alpine3.18

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public
COPY --from=builder /app/lib/util ./lib/util
COPY --from=builder /app/server ./server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/scripts/ ./scripts

EXPOSE 3000

CMD ["sh", "-c", "yarn build-available-flags && yarn start"]

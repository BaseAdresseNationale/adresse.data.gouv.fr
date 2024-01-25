FROM node:20-alpine AS builder

WORKDIR /app

# installing dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copying the root folder into the workdir (takes into account the .dockerignore file)
COPY . .

RUN yarn build-available-flags
RUN yarn build

WORKDIR /app

# copy from build image
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server ./server
COPY --from=builder /app/lib/util ./lib/util
COPY --from=builder /app/process.yml ./process.yml
COPY .env.production .

# Execute script
RUN apk add --no-cache --upgrade bash
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 5100

CMD ["node", "server/index.js"]
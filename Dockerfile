FROM node:16.19.0-alpine AS builder

WORKDIR /app

# installing dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copying the root folder into the workdir (takes into account the .dockerignore file)
COPY . .

RUN yarn build

# using multi-stage building to optimize the final running image
FROM node:16.19.0-alpine AS runner

RUN npm install pm2 -g

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
COPY entrypoint.sh .
COPY .env.production .

# Execute script
RUN apk add --no-cache --upgrade bash
RUN ["chmod", "+x", "./entrypoint.sh"]
ENTRYPOINT ["./entrypoint.sh"]

EXPOSE 5100

CMD ["pm2-runtime", "process.yml"]
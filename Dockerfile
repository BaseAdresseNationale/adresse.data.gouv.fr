FROM node:16-alpine as builder

WORKDIR /app

COPY package.json yarn.lock .
RUN mkdir public
RUN yarn

COPY . .
RUN yarn build

# purger les inutiles dans node_modules en gérant proprement "dependencies" et "devDependencies"
# RUN rm -rf node_modules && yarn install --production

FROM node:16-alpine

WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next ./.next

COPY --from=builder /app/public ./public
COPY --from=builder /app/components ./components
COPY --from=builder /app/contexts ./contexts
COPY --from=builder /app/data ./data
COPY --from=builder /app/hooks ./hooks
COPY --from=builder /app/layouts ./layouts
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server
COPY --from=builder /app/styles ./styles
COPY --from=builder /app/views ./views
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["yarn", "start"]

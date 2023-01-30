# using an optimized node image
FROM node:16.19.0-alpine as BUILD_IMAGE

# optimzing caching for yarn install
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# copying the root folder into the workdir taking into account the .dockerignore file
COPY . .

# build
RUN yarn build

FROM node:16.19.0-alpine

RUN npm install pm2 -g

WORKDIR /app
# copy from build image
COPY --from=BUILD_IMAGE /app/package.json ./package.json
COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/.next ./.next
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE /app/server ./server
COPY --from=BUILD_IMAGE /app/lib/util ./lib/util
COPY --from=BUILD_IMAGE /app/process.yml ./process.yml

EXPOSE 5100

CMD ["pm2-runtime", "process.yml"]
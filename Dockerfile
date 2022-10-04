FROM node:16-alpine AS build

RUN mkdir -p /var/www/adresse.data.gouv.fr
WORKDIR /var/www/adresse.data.gouv.fr

COPY package.json yarn.lock ./
RUN yarn

FROM node:16-alpine

RUN mkdir -p /var/www/adresse.data.gouv.fr
WORKDIR /var/www/adresse.data.gouv.fr

COPY --from=build /var/www/adresse.data.gouv.fr .
COPY . .

ENV NODE_ENV=production
RUN yarn build

EXPOSE 3000
CMD ["node", "server"]


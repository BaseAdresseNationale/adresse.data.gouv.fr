# Étape 1 : Construction de l'image avec les variables d'environnement injectées
FROM node:20.15.1 as builder

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers package pour installer les dépendances
COPY package.json package-lock.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers de l'application
COPY . .

ARG NEXT_PUBLIC_API_BAN_URL
ARG NEXT_PUBLIC_BAL_ADMIN_API_URL
ARG NEXT_PUBLIC_API_GEO_URL
ARG NEXT_PUBLIC_ADRESSE_URL
ARG NEXT_PUBLIC_DATAGOUV_URL
ARG NEXT_PUBLIC_API_DEPOT_URL
ARG NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC
ARG NEXT_PUBLIC_BAL_API_URL
ARG NEXT_PUBLIC_GHOST_URL
ARG NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE
ARG NEXT_PUBLIC_GHOST_KEY
ARG S3_CONFIG_ACCESS_KEY_ID
ARG S3_CONFIG_SECRET_ACCESS_KEY
ARG S3_CONFIG_REGION
ARG S3_CONFIG_ENDPOINT
ARG NEXT_PUBLIC_MATOMO_URL
ARG NEXT_PUBLIC_MATOMO_SITE_ID

# Les variables d'environnement sont exportées avant le build
RUN export NEXT_PUBLIC_API_BAN_URL=${NEXT_PUBLIC_API_BAN_URL} \
  NEXT_PUBLIC_BAL_ADMIN_API_URL=${NEXT_PUBLIC_BAL_ADMIN_API_URL} \
  NEXT_PUBLIC_API_GEO_URL=${NEXT_PUBLIC_API_GEO_URL} \
  NEXT_PUBLIC_ADRESSE_URL=${NEXT_PUBLIC_ADRESSE_URL} \
  NEXT_PUBLIC_DATAGOUV_URL=${NEXT_PUBLIC_DATAGOUV_URL} \
  NEXT_PUBLIC_API_DEPOT_URL=${NEXT_PUBLIC_API_DEPOT_URL} \
  NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC=${NEXT_PUBLIC_API_ETABLISSEMENTS_PUBLIC} \
  NEXT_PUBLIC_BAL_API_URL=${NEXT_PUBLIC_BAL_API_URL} \
  NEXT_PUBLIC_GHOST_URL=${NEXT_PUBLIC_GHOST_URL} \
  NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE=${NEXT_PUBLIC_GHOST_URL_IMAGES_SOURCE} \
  NEXT_PUBLIC_GHOST_KEY=${NEXT_PUBLIC_GHOST_KEY} \
  S3_CONFIG_ACCESS_KEY_ID=${S3_CONFIG_ACCESS_KEY_ID} \
  S3_CONFIG_SECRET_ACCESS_KEY=${S3_CONFIG_SECRET_ACCESS_KEY} \
  S3_CONFIG_REGION=${S3_CONFIG_REGION} \
  S3_CONFIG_ENDPOINT=${S3_CONFIG_ENDPOINT} \
  NEXT_PUBLIC_MATOMO_URL=${NEXT_PUBLIC_MATOMO_URL} \
  NEXT_PUBLIC_MATOMO_SITE_ID=${NEXT_PUBLIC_MATOMO_SITE_ID} \
  && npm run build

# Étape 2 : Image de production
FROM node:20.15.1

# Définit le répertoire de travail
WORKDIR /app

# Copie les fichiers nécessaires de l'étape de build
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env.default ./

# Utilisation de l'utilisateur non-root
USER node

# Expose le port de l'application
EXPOSE 3000

# Commande de démarrage de l'application
CMD ["sh", "-c", "npm start"]

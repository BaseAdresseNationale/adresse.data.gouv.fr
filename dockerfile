# Étape 1 : Construction de l'application
FROM node:20.15.1 as builder

WORKDIR /app

# Copier les fichiers de configuration npm
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

COPY . .

RUN npm run build

# Étape 2 : Image de production
FROM node:20.15.1

# Définir le répertoire de travail
WORKDIR /app

COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/.env.default ./

# Copier les répertoires nécessaires
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/node_modules ./node_modules

# Changer l'utilisateur pour exécuter l'application en tant que "node"
USER node

EXPOSE 3000

CMD ["sh", "-c", "npm start"]

#!/bin/bash
# Lancer l'environnement de dev en local sous proxy d'entreprise.
# Le fetch natif de Node (>= 24) respecte HTTP_PROXY / HTTPS_PROXY / NO_PROXY
# quand NODE_USE_ENV_PROXY=1 est défini (déjà fait par le script npm "dev").
npm run dev

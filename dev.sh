#!/bin/bash
#lancer l'environnement de dev en local sous proxy
export NODE_OPTIONS=--require="../proxy/index.js"
npm run lint -- --fix
npm run dev
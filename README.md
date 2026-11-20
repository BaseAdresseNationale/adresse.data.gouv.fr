# adresse.data.gouv.fr

_[Le site officiel de l'Adresse en France](https://adresse.data.gouv.fr/)_

Ce dépôt contient le code logiciel FrontEnd du site [adresse.data.gouv.fr](https://adresse.data.gouv.fr/), développé sur le framework [Next.js](https://nextjs.org).

## Pré-requis

Ce site nécéssite l'instalation préalable des outils suivants :

* Node.JS version 24 ou supérieure
* NPM version 11 ou supérieure

## Développement

### Installation des dépendances

```bash
npm install
```

### Demarrer en le serveur de développement

```bash
npm run dev
```

### Demarrer le serveur de développement avec le proxy

Le script `dev` définit `NODE_USE_ENV_PROXY=1` : le `fetch` natif de Node (>= 24)
respecte alors automatiquement les variables d'environnement `HTTP_PROXY`,
`HTTPS_PROXY` et `NO_PROXY`. Il suffit donc qu'elles soient définies dans votre
shell, puis :

```bash
npm run dev
```

(L'ancien mécanisme — dossier `proxy/` avec `undici` préchargé via
`NODE_OPTIONS` — n'est plus nécessaire.)

## Production

### Assembler le code pour la production

```bash
npm run build
```

### Demarrer en le serveur de production

Apres avoir assemblé le code pour la production :

```bash
npm run start
```

Les variables d'environnement nécessaires à l'exécution doivent être fournies au
serveur au démarrage. Le rendu dynamique utilise `connection()` avant les
lectures effectuées pendant le rendu ; `env()` ne rend pas à lui seul une page
dynamique et les lectures au niveau des modules ont lieu lors de leur chargement.
Les variables `NEXT_PUBLIC_*` sont publiques et transmises au navigateur : elles
ne doivent jamais contenir de secrets. La configuration Next.js peut également
intégrer certaines valeurs publiques au moment du build.

### Contrôler la qualité et le formatage du code

La qualité et le formatage du code sont contrôlés via [ESlint](https://eslint.org/)(pour la qualité) et [ESLint Stylistic](https://eslint.style/)(pour le formatage).

```bash
npm run lint
npm run type-check
```

### Lancer les tests de bout en bout (e2e)

Les tests e2e utilisent [Playwright](https://playwright.dev/) et interrogent les vraies API (géocodeur et BAN). Ils lisent la configuration du fichier `.env` (voir `.env.default`).

```bash
npx playwright install chromium
npm run test:e2e
```

Playwright démarre son propre serveur de développement sur le port 3100. Next n'autorise qu'un seul `npm run dev` par dossier : si le vôtre tourne déjà, arrêtez-le ou réutilisez-le avec `E2E_PORT=3000 npm run test:e2e`.

## Licence

[![Logo "Licence Ouverte / Open Licence"](https://www.etalab.gouv.fr/wp-content/uploads/2011/10/licence-ouverte-open-licence.gif)](https://www.etalab.gouv.fr/licence-ouverte-open-licence/)

Le code de ce logiciel est soumis à la licence ["Licence Ouverte / Open Licence" version 2.0](https://www.etalab.gouv.fr/wp-content/uploads/2017/04/ETALAB-Licence-Ouverte-v2.0.pdf).

# adresse.data.gouv.fr

> Le site officiel de l'Adresse

Ce dépôt regroupe le code relatif à l'interface frontend du site adresse.data.gouv.fr.

Il utilise [React](https://reactjs.org), [Next.js](https://nextjs.org) et [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/api/).

## Développement

### Pré-requis

* Node.js version 12 ou supérieure
* yarn (ou npm)

### Installation des dépendances

```bash
yarn
```

### Lancer en mode développement

```bash
yarn dev
```

### Générer les assets pour la production

```bash
yarn build
```

### Lancer en mode production

Les assets doivent être générés au préalable.

```bash
yarn start
```

### Contrôler le style du code

Le style de code utilisé est [xo](https://github.com/xojs/xo).

```bash
yarn lint
```

# adresse.data.gouv.fr

> Le site officiel de l'Adresse

Ce dépôt regroupe le code relatif à l'interface frontend du site adresse.data.gouv.fr.

Il utilise [React](https://reactjs.org), [Next.js](https://nextjs.org) et [MapLibre](https://maplibre.org).

## Développement

### Pré-requis

* Node.js version 16 ou supérieure
* yarn (ou npm)

### Installation des dépendances

```bash
yarn
```

## Drapeaux disponible pour les langues régionales
```
$ yarn build-available-flags
```

### Lancer en mode développement

```bash
yarn dev
```

### Lancer en mode développement avec docker et docker-compose

```bash
docker-compose up --build -d
```

* --build permet de builder l'image qui est définie dans le Dockerfile.dev
* -d permet d'activer le 'detached mode' : execution des services en arrière-plan

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

# Licence

Le code de ce logiciel est soumis à la licence MIT.

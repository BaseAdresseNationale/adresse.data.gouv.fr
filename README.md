[![Requirements Status](https://requires.io/github/etalab/adresse.data.gouv.fr/requirements.svg?branch=master)](https://requires.io/github/etalab/adresse.data.gouv.fr/requirements/?branch=master)

# adresse.data.gouv.fr

## Pré-requis

* Python 3
* Node.js >= 4

## Installation

```
pip install -r requirements.txt
pip install gunicorn
cd adresse/static && npm install && cd ../..
```

## Lancement

```
gunicorn adresse:app
```

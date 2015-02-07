# coding=utf-8
from __future__ import unicode_literals
import os

from flask import Flask, render_template

from .constants import DEPARTEMENTS

app = Flask(__name__)

SITE_URL = os.environ.get('SITE_URL', 'http://adresse.data.gouv.fr')
API_URL = os.environ.get('API_URL', 'http://api.adresse.data.gouv.fr')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/')
def api():
    return render_template('api.html')


@app.route('/tools/')
def tools():
    return render_template('tools.html')


@app.route('/map/')
def map():
    return render_template('map.html')


@app.route('/csv/')
def csv():
    return render_template('csv.html')


@app.route('/cgu/')
def cgu():
    return render_template('cgu.html')


@app.route('/faq/')
def faq():
    return render_template('faq.html')


@app.route('/about/')
def about():
    return render_template('about.html')


@app.route('/foss/')
def foss():
    return render_template('foss.html')


@app.route('/download/')
def download():
    context = {
        'departements': DEPARTEMENTS,
        'csv_url': 'http://bano.openstreetmap.fr/data/bano-%s.csv',
        'shp_url': 'http://bano.openstreetmap.fr/data/bano-%s-shp.zip',
        'ttl_url': 'http://bano.openstreetmap.fr/data/bano-%s.ttl.gz',
    }
    return render_template('download.html', **context)


@app.context_processor
def shared_context():
    return {
        "SITE_NAME": "adresse.data.gouv.fr",
        "SITE_URL": SITE_URL,
        "BASELINE": "Un référentiel national ouvert\u2009: de l'adresse à la coordonnée géographique",
        "DESCRIPTION": "Dis Cricri, c'est quoi la BAN?",
        "TWITTER": "@etalab",
        "API_URL": API_URL,
        "CONTACT_EMAIL": "adresse@data.gouv.fr"
    }


if __name__ == '__main__':
    app.run(debug=os.environ.get('DEBUG', True))

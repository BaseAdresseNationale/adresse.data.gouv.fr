import os

from flask import Flask, render_template

from constants import DEPARTEMENTS

app = Flask(__name__)


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
    }
    return render_template('download.html', **context)


@app.context_processor
def shared_context():
    return {
        "site_name": "adresse.data.gouv.fr",
        "site_url": os.environ.get('SITE_URL', 'http://adresses.gouv.fr'),
        "baseline": "Une base d'adresses nationale libre et citoyenne",
        "description": "Dis Cricri, c'est quoi la BAN?",
        "twitter": "@etalab",
        "download_url": "https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/",
        "api_root": "http://localhost:5005",
        "contact_email": "adresses@data.gouv.fr"
    }


if __name__ == '__main__':
    app.run(debug=os.environ.get('DEBUG', True))

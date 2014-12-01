import os

from flask import Flask, render_template
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


@app.context_processor
def shared_context():
    return {
        "site_name": "adresses.gouv.fr",
        "site_url": os.environ.get('SITE_URL', 'http://adresses.gouv.fr'),
        "baseline": "Une base d'adresses nationale libre et citoyenne",
        "description": "Dis Chrichri, c'est quoi la BAN?",
        "twitter": "@etalab",
        "download_url": "https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/",
        "api_root": "http://localhost:5005"
    }


if __name__ == '__main__':
    app.run(debug=os.environ.get('DEBUG', True))

import datetime
import os

from flask import render_template

from . import app


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/')
def api():
    return render_template('api.html')


@app.route('/api-gestion/')
def api_gestion():
    return render_template('api-gestion.html')


@app.route('/tools/')
def tools():
    return render_template('tools.html')


@app.route('/map/', defaults={'url': app.config['API_URL']})
def map(url):
    return render_template('map.html', TILE_URL=app.config['TILE_URL'],
                           API_URL=url)


@app.route('/csv/', defaults={'url': app.config['API_URL']})
def csv(url):
    return render_template('csv.html', API_URL=url)


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
    context = {}
    if app.config['DELIVERY_CONTROL_FILE']:
        path = app.config['DELIVERY_CONTROL_FILE']
        try:
            t = os.path.getmtime(path)
        except FileNotFoundError:
            pass
        else:
            context['delivery_date'] = datetime.datetime.fromtimestamp(t)

    return render_template('download.html', **context)


@app.route('/contrib/')
def contrib():
    return render_template('contrib.html')


@app.route('/news/')
def news():
    return render_template('news.html')


@app.context_processor
def shared_context():
    return {
        "SITE_NAME": "adresse.data.gouv.fr",
        "SITE_URL": app.config['SITE_URL'],
        "BASELINE": "Un référentiel national ouvert\u2009: de l'adresse à la coordonnée géographique",  # noqa
        "DESCRIPTION": "Site officiel de la Base Adresse Nationale",
        "TWITTER": "@BaseAdresse",
        "API_URL": app.config['API_URL'],
        "CRUD_API_URL": app.config['CRUD_API_URL'],
        "CONTACT_EMAIL": "adresse@data.gouv.fr"
    }

from flask import abort, flash, redirect, render_template, request, url_for
from flask_mail import Message

from . import app, mail
from .tracked_download import TrackedDownload, TrackedDownloadForm


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/')
def api():
    return render_template('api.html')


@app.route('/tools/')
def tools():
    return render_template('tools.html')


@app.route('/map/', defaults={'url': app.config['API_URL']})
@app.route('/mapdev/', defaults={'url': app.config['DEVAPI_URL']})
def map(url):
    return render_template('map.html', TILE_URL=app.config['TILE_URL'],
                           API_URL=url)


@app.route('/csv/', defaults={'url': app.config['API_URL']})
@app.route('/csvdev/', defaults={'url': app.config['DEVAPI_URL']})
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


@app.route('/download/<token>')
@app.route('/download/', methods=['GET', 'POST'], defaults={'token': None})
def download(token):
    form = TrackedDownloadForm(request.form)
    if token:
        dl = TrackedDownload.from_token(token)
        if not dl:
            flash('Clé invalide.', 'error')
            return render_template('download.html', form=form), 403
        else:
            dl.use()
            flash("Merci d'avoir téléchargé la base adresse nationale !",
                  "success")
            if app.config['BAN_FILE_PATH']:
                return '', 200, {'X-Accel-Redirect':
                                 app.config['BAN_FILE_PATH']}
    if request.method == 'POST' and form.validate():
        dl = TrackedDownload(**form.data)
        dl.save()
        msg = Message()
        msg.add_recipient(dl.email)
        email_context = dict(dl.__dict__)
        download_link = "https:{domain}{path}".format(
            domain=app.config['SITE_URL'],
            path=url_for('download', token=dl.token))
        email_context['download_link'] = download_link
        msg.body = render_template('tracked_download_email.txt',
                                   **email_context)
        msg.html = render_template('tracked_download_email.html',
                                   **email_context)
        msg.subject = "Votre téléchargement de la base adresse nationale"
        mail.send(msg)
        flash('Un courriel vous a été envoyé à l\'adresse {email}'.format(
              email=dl.email), 'success')
        return redirect(url_for('download'))
    return render_template('download.html', form=form)


@app.context_processor
def shared_context():
    return {
        "SITE_NAME": "adresse.data.gouv.fr",
        "SITE_URL": app.config['SITE_URL'],
        "BASELINE": "Un référentiel national ouvert\u2009: de l'adresse à la coordonnée géographique",  # noqa
        "DESCRIPTION": "Dis Cricri, c'est quoi la BAN?",
        "TWITTER": "@etalab",
        "API_URL": app.config['API_URL'],
        "CONTACT_EMAIL": "adresse@data.gouv.fr"
    }

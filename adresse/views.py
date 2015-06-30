import json

from pathlib import Path

from flask import flash, redirect, render_template, request, url_for, session
from flask_mail import Message
from flask.ext.oauthlib.client import OAuth

from . import app, mail
from .crowdsourcing import Crowdsourcing
from .forms import ReportForm, TrackedDownloadForm, CrowdsourcingForm
from .tracked_download import TrackedDownload


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/')
def api():
    return render_template('api.html')


@app.route('/tools/')
def tools():
    return render_template('tools.html')


@app.route('/mapdev/', defaults={'url': app.config['DEVAPI_URL']})
@app.route('/map/', defaults={'url': app.config['API_URL']})
def map(url):
    return render_template('map.html', TILE_URL=app.config['TILE_URL'],
                           API_URL=url)


@app.route('/csvdev/', defaults={'url': app.config['DEVAPI_URL']})
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
                name = Path(app.config['BAN_FILE_PATH']).name
                headers = {
                    'X-Accel-Redirect': app.config['BAN_FILE_PATH'],
                    'Content-Disposition': 'attachment; filename="{}"'.format(name),  # noqa
                }
                return '', 200, headers
    if request.method == 'POST' and form.validate():
        dl = TrackedDownload.from_email(form.email.data)
        if not dl:
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


@app.route('/contrib/', methods=['GET', 'POST'])
def contrib():
    form = ReportForm(request.form)
    if request.method == 'POST' and form.validate():
        msg = Message(
            recipients=[form.email.data],
            reply_to=form.email.data,
            bcc=[app.config['REPORT_EMAIL'],
                 app.config['MAIL_DEFAULT_SENDER']])
        email_context = {
            'message': form.message.data,
            'email': form.email.data
        }
        msg.body = render_template('report_email.txt', **email_context)
        msg.html = render_template('report_email.html', **email_context)
        msg.subject = "Signalement BAN"
        mail.send(msg)
        flash('Votre signalement a bien été envoyé, merci!', 'success')
        return redirect(url_for('contrib'))
    return render_template('contrib.html', form=form)


@app.route('/crowdsourcing/', methods=['GET', 'POST'])
def crowdsourcing():
    form = CrowdsourcingForm(request.form)
    if request.method == 'POST':
        if form.validate():
            data = dict(form.data)
            data.update({
                'username': session.get('username'),
                'auth_provider': session.get('auth_provider')
            })
            contrib = Crowdsourcing(**data)
            contrib.save()
            return '{"status": "ok"}'
        else:
            return json.dumps(form.errors)
    else:
        return render_template('crowdsourcing.html', form=form,
                               session=session,
                               TILE_URL=app.config['ORTHO_TILE_URL'])


@app.route('/crowdsourcing/data/')
def crowdsourcing_data():
    data = Crowdsourcing.data(request.args.get('from', None))
    return json.dumps([c.to_json() for c in data])


@app.route('/news/')
def news():
    return render_template('news.html')


# Oauth
oauth = OAuth(app)
udata = oauth.remote_app(
    'udata',
    base_url='https://www.data.gouv.fr/api/1/',
    request_token_url=None,
    request_token_params={'scope': 'default'},
    access_token_method='POST',
    access_token_url='https://www.data.gouv.fr/oauth/token',
    authorize_url='https://www.data.gouv.fr/oauth/authorize',
    app_key='DATAGOUV'
)


@app.route('/login/')
def login():
    return udata.authorize(callback=url_for('authorized', _external=True))


@app.route('/logout/')
def logout():
    session.pop('udata_token', None)
    session.pop('username', None)
    session.pop('fullname', None)
    session.pop('auth_provider', None)
    return redirect(url_for('index'))


@app.route('/authorized')
def authorized():
    resp = udata.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['udata_token'] = (resp['access_token'], '')
    me = udata.get('me')
    session['username'] = me.data['id']
    session['auth_provider'] = 'https://www.data.gouv.fr'
    session['fullname'] = ' '.join([me.data['first_name'],
                                    me.data['last_name']])
    return render_template('ajax_authentication_redirect.html',
                           session=session)


@udata.tokengetter
def get_udata_oauth_token():
    return session.get('udata_token')


@app.context_processor
def shared_context():
    return {
        "SITE_NAME": "adresse.data.gouv.fr",
        "SITE_URL": app.config['SITE_URL'],
        "BASELINE": "Un référentiel national ouvert\u2009: de l'adresse à la coordonnée géographique",  # noqa
        "DESCRIPTION": "Site officiel de la Base Adresse Nationale",
        "TWITTER": "@etalab",
        "API_URL": app.config['API_URL'],
        "CONTACT_EMAIL": "adresse@data.gouv.fr"
    }

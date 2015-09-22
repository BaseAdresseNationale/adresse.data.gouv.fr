import datetime
import json
import os
from pathlib import Path

from flask import (abort, flash, redirect, render_template, request, session,
                   url_for)
from flask.ext.oauthlib.client import OAuth
from flask_mail import Message
from werkzeug import security

from . import app, mail
from .constants import DEPARTEMENTS
from .crowdsourcing import Crowdsourcing
from .forms import CrowdsourcingForm, ReportForm, TrackedDownloadForm
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
    context = {'form': form}
    if app.config['DELIVERY_CONTROL_FILE']:
        path = app.config['DELIVERY_CONTROL_FILE']
        try:
            t = os.path.getmtime(path)
        except FileNotFoundError:
            pass
        else:
            context['delivery_date'] = datetime.datetime.fromtimestamp(t)
    if token:
        dl = TrackedDownload.from_token(token)
        if not dl:
            flash('Clé invalide.', 'error')
            return render_template('download.html', **context), 403
        else:
            dl.use()
            flash("Merci d'avoir téléchargé la base adresse nationale !",
                  "success")
            if app.config['BAN_FILE_PATH']:
                suffix = "_%s" % dl.area if dl.area else ''
                path = app.config['BAN_FILE_PATH'].format(area=suffix)
                name = Path(path).name
                headers = {
                    'X-Accel-Redirect': path,
                    'Content-Disposition': 'attachment; filename="{}"'.format(name),  # noqa
                }
                return '', 200, headers
    if request.method == 'POST' and form.validate():
        dl = TrackedDownload.from_email(form.email.data, form.area.data)
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
        area = DEPARTEMENTS.get(dl.area)
        if area:
            msg.subject = "{} [{}]".format(msg.subject, area)
        mail.send(msg)
        flash('Un courriel vous a été envoyé à l\'adresse {email}'.format(
              email=dl.email), 'success')
        return redirect(url_for('download'))
    return render_template('download.html', **context)


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
            diff = contrib.diff
            if contrib.operation != Crowdsourcing.UPDATE \
               or list(diff.keys()) != ['coordinates']:
                msg = Message(
                    recipients=[app.config['REPORT_EMAIL']],
                    bcc=[app.config['MAIL_DEFAULT_SENDER']])
                data = contrib.to_json()
                email_context = {
                    'data': data.get('after', data.get('before')),
                    'contrib': contrib,
                    'Crowdsourcing': Crowdsourcing,
                    'diff': diff,
                }
                msg.body = render_template('crowdsourcing_report_email.txt',
                                           **email_context)
                msg.html = render_template('crowdsourcing_report_email.html',
                                           **email_context)
                msg.subject = "Contribution BAN"
                mail.send(msg)
            return '{"status": "ok"}'
        else:
            return json.dumps(form.errors)
    else:
        return render_template('crowdsourcing.html', form=form,
                               session=session,
                               TILE_URL=app.config['ORTHO_TILE_URL'],
                               ROADS_TILE_URL=app.config['ROADS_TILE_URL'],
                               PROVIDERS=['dgfr', 'france-connect', 'osm'])


@app.route('/crowdsourcing/data/')
def crowdsourcing_data():
    data = Crowdsourcing.data(request.args.get('from', None))
    return json.dumps([c.to_json() for c in data])


@app.route('/news/')
def news():
    return render_template('news.html')


# Oauth
oauth = OAuth(app)

# Data.gouv.fr
dgfr = oauth.remote_app(
    'dgfr',
    base_url='https://www.data.gouv.fr/api/1/',
    request_token_url=None,
    request_token_params={'scope': 'default'},
    access_token_method='POST',
    access_token_url='https://www.data.gouv.fr/oauth/token',
    authorize_url='https://www.data.gouv.fr/oauth/authorize',
    app_key='DATAGOUV'
)

# France Connect
fc = oauth.remote_app(
    'franceconnect',
    base_url='https://app.franceconnect.gouv.fr/api/v1/',
    request_token_url=None,
    access_token_method='POST',
    access_token_url='https://app.franceconnect.gouv.fr/api/v1/token',
    authorize_url='https://app.franceconnect.gouv.fr/api/v1/authorize',
    app_key='FRANCECONNECT',
    request_token_params={'scope': 'openid profile'}
)

# OpenStreetMap
osm = oauth.remote_app(
    'osm',
    base_url='http://www.openstreetmap.org/oauth/',
    request_token_url='http://www.openstreetmap.org/oauth/request_token',
    access_token_method='POST',
    access_token_url='http://www.openstreetmap.org/oauth/access_token',
    authorize_url='http://www.openstreetmap.org/oauth/authorize',
    app_key='OSM'
)


@osm.tokengetter
@fc.tokengetter
@dgfr.tokengetter
def get_oauth_token():
    return session.get('oauth_token')


@app.route('/login/<provider>/')
def login(provider):
    if provider == "dgfr":
        remote_app = dgfr
    elif provider == "france-connect":
        remote_app = fc
    elif provider == "osm":
        remote_app = osm
    else:
        abort(400, 'Unkown login provider')
    return remote_app.authorize(
        callback=url_for('authorized', provider=provider, _external=True),
        state=security.gen_salt(10),
        nonce=security.gen_salt(10),
    )


@app.route('/logout/')
def logout():
    session.pop('oauth_token', None)
    session.pop('username', None)
    session.pop('fullname', None)
    provider = session.pop('auth_provider', None)
    if provider == 'france-connect':
        url = '{}logout'.format(fc.base_url)
    else:
        url = request.referrer or url_for('index')
    return redirect(url)


def get_dgfr_user_details(data):
    return {
        'username': data['id'],
        'fullname': ' '.join([data['first_name'], data['last_name']])
    }


def get_fc_user_details(data):
    return {
        'username': data['sub'],
        'fullname': ' '.join([data['given_name'], data['family_name']])
    }


def get_osm_user_details(data):
    user = data.find('user')
    return {
        'username': user.attrib['id'],
        'fullname': user.attrib['display_name']
    }


@app.route('/authorized/<provider>/')
def authorized(provider):
    token_key = "access_token"
    if provider == 'dgfr':
        remote_app = dgfr
        endpoint = 'me'
        getter = get_dgfr_user_details
    elif provider == 'france-connect':
        remote_app = fc
        endpoint = 'userinfo?schema=openid'
        getter = get_fc_user_details
    elif provider == 'osm':
        remote_app = osm
        endpoint = 'http://api.openstreetmap.org/api/0.6/user/details'
        getter = get_osm_user_details
        token_key = "oauth_token"
    resp = remote_app.authorized_response()
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp[token_key],
                              resp.get('oauth_token_secret', ''))  # Oauth1
    session['auth_provider'] = provider
    data = getter(remote_app.get(endpoint).data)
    session['username'] = data['username']
    session['fullname'] = data['fullname']
    return render_template('ajax_authentication_redirect.html',
                           session=session)


@app.context_processor
def shared_context():
    return {
        "SITE_NAME": "adresse.data.gouv.fr",
        "SITE_URL": app.config['SITE_URL'],
        "BASELINE": "Un référentiel national ouvert\u2009: de l'adresse à la coordonnée géographique",  # noqa
        "DESCRIPTION": "Site officiel de la Base Adresse Nationale",
        "TWITTER": "@BaseAdresse",
        "API_URL": app.config['API_URL'],
        "CONTACT_EMAIL": "adresse@data.gouv.fr"
    }

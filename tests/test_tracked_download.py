from flask import url_for

from adresse import DB, mail
from adresse.tracked_download import TrackedDownload


def test_can_access_download_view(client):
    assert client.get(url_for('download'))


def test_can_create_new_tracked_download_request_from_form(webapp):
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    form = webapp.get(url_for('download')).forms['tracked_download']
    form['first_name'] = "Victor"
    form['last_name'] = "Hugo"
    form['email'] = 'victor@hugo.com'
    form['company'] = "Totoche SARL"
    form.submit().follow()
    assert DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    assert DB.fetchone('SELECT token as t FROM tracked_download LIMIT 1')['t']


def test_new_trackeddownload_request_should_send_an_email(webapp, config):
    with mail.record_messages() as outbox:
        form = webapp.get(url_for('download')).forms['tracked_download']
        form['first_name'] = "Victor"
        form['last_name'] = "Hugo"
        form['email'] = 'victor@hugo.com'
        form['company'] = "Totoche SARL"
        form.submit().follow()
        assert len(outbox) == 1
        assert outbox[0].subject == "Votre téléchargement de la base adresse nationale"  # noqa
        assert "Victor" in outbox[0].body
        token = DB.fetchone('SELECT token FROM tracked_download')['token']
        download_link = "https:{domain}{path}".format(
            domain=config['SITE_URL'],
            path=url_for('download', token=token))
        assert download_link in outbox[0].body


def test_new_trackeddownload_should_send_an_email_with_area(webapp, config):
    with mail.record_messages() as outbox:
        form = webapp.get(url_for('download')).forms['tracked_download']
        form['first_name'] = "Victor"
        form['last_name'] = "Hugo"
        form['email'] = 'victor@hugo.com'
        form['company'] = "Totoche SARL"
        form['area'] = "01"
        form.submit().follow()
        assert len(outbox) == 1
        assert outbox[0].subject == "Votre téléchargement de la base adresse nationale [Ain]"  # noqa
        assert "Victor" in outbox[0].body
        token = DB.fetchone('SELECT token FROM tracked_download')['token']
        download_link = "https:{domain}{path}".format(
            domain=config['SITE_URL'],
            path=url_for('download', token=token))
        assert download_link in outbox[0].body


def test_do_not_create_new_td_if_already_exist_and_valid(webapp):
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    form = webapp.get(url_for('download')).forms['tracked_download']
    form['first_name'] = "Victor"
    form['last_name'] = "Hugo"
    form['email'] = 'victor@hugo.com'
    form['company'] = "Totoche SARL"
    form.submit().follow()
    assert DB.fetchone('SELECT count(*) as t FROM tracked_download')['t'] == 1
    form = webapp.get(url_for('download')).forms['tracked_download']
    form['first_name'] = "Victor"
    form['last_name'] = "Hugo"
    form['email'] = 'victor@hugo.com'
    form['company'] = "Totoche SARL"
    form.submit().follow()
    assert DB.fetchone('SELECT count(*) as t FROM tracked_download')['t'] == 1


def test_cannot_create_new_tracked_download_if_missing_email(webapp):
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    form = webapp.get(url_for('download')).forms['tracked_download']
    form['first_name'] = "Victor"
    form['last_name'] = "Hugo"
    form['company'] = "Totoche SARL"
    form.submit()
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']


def test_cannot_create_new_tracked_download_without_csrf_token(webapp):
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    form = webapp.get(url_for('download')).forms['tracked_download']
    form['first_name'] = "Victor"
    form['last_name'] = "Hugo"
    form['email'] = 'victor@hugo.com'
    form['company'] = "Totoche SARL"
    form['csrf_token'] = ""
    form.submit(status=400)
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']


def test_trackeddownload_init_create_token():
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    assert dl.token


def test_trackeddownload_do_not_create_twice_same_token_with_different_area():
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    dl2 = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    dl3 = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='01',
    )
    assert dl.token == dl2.token
    assert dl.token != dl3.token


def test_calling_trackeddownload_save_should_persist_data_in_db():
    assert not DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    dl.save()
    assert DB.fetchone('SELECT count(*) as t FROM tracked_download')['t']


def test_cannot_download_if_invalid_token(webapp):
    url = url_for('download', token='xxxx')
    assert webapp.get(url, status=403)


def test_can_download_with_token(webapp, config):
    config['BAN_FILE_PATH'] = '/a/b/c.zip'
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    dl.save()
    url = url_for('download', token=dl.token)
    resp = webapp.get(url, status=200)
    assert resp.headers['X-Accel-Redirect'] == '/a/b/c.zip'
    assert resp.headers['Content-Disposition'] == 'attachment; filename="c.zip"'  # noqa


def test_area_in_final_url(webapp, config):
    config['BAN_FILE_PATH'] = '/a/b/c{area}.zip'
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='01',
    )
    dl.save()
    url = url_for('download', token=dl.token)
    resp = webapp.get(url, status=200)
    assert resp.headers['X-Accel-Redirect'] == '/a/b/c_01.zip'
    assert resp.headers['Content-Disposition'] == 'attachment; filename="c_01.zip"'  # noqa


def test_cant_download_if_over_max_use(webapp, config, monkeypatch):
    monkeypatch.setattr(TrackedDownload, 'MAX_USE', 2)
    config['BAN_FILE_PATH'] = '/a/b/c.zip'
    dl = TrackedDownload(
        first_name='toto',
        last_name='tata',
        email='toto@tata.com',
        company='toto SA',
        area='',
    )
    dl.save()
    url = url_for('download', token=dl.token)
    assert webapp.get(url, status=200)
    assert webapp.get(url, status=200)
    assert webapp.get(url, status=403)

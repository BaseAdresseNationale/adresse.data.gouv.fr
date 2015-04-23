import hashlib

from flask import session
from wtforms import Form, StringField, validators
from wtforms.csrf.session import SessionCSRF

from . import DB, app


class BaseForm(Form):

    class Meta:
        csrf = True
        csrf_class = SessionCSRF
        csrf_secret = app.config['SECRET_KEY'].encode()

        @property
        def csrf_context(self):
            return session


class TrackedDownloadForm(BaseForm):

    DATA_REQUIRED = 'Ce champ est obligatoire.'
    EMAIL = 'Adresse courriel invalide.'

    first_name = StringField('Prénom',
                             [validators.DataRequired(DATA_REQUIRED)])
    last_name = StringField('Nom', [validators.DataRequired(DATA_REQUIRED)])
    email = StringField('Email', [validators.DataRequired(DATA_REQUIRED),
                                  validators.Email(EMAIL)])
    company = StringField('Société')


class TrackedDownload(object):

    MAX_USE = 3

    def __init__(self, **data):
        self.token = None
        for key, value in data.items():
            setattr(self, key, value)
        if not self.token:
            salt = app.config['SECRET_KEY']
            string = self.email.encode() + salt.encode()
            self.token = hashlib.sha512(string).hexdigest()[:8]

    def save(self):
        DB.commit('INSERT INTO tracked_download '
                  '(first_name, last_name, email, company, token) '
                  'VALUES (?, ?, ?, ?, ?)',
                  [self.first_name, self.last_name, self.email, self.company,
                   self.token])

    def use(self):
        DB.commit('UPDATE tracked_download SET used=used+1 WHERE token=?',
                  [self.token])

    @classmethod
    def from_token(cls, token):
        data = DB.fetchone('SELECT * FROM tracked_download '
                           'WHERE used<? AND token=?',
                           [cls.MAX_USE, token])
        return TrackedDownload(**data) if data else None

    @classmethod
    def from_email(cls, email):
        data = DB.fetchone('SELECT * FROM tracked_download '
                           'WHERE used<? AND email=?',
                           [cls.MAX_USE, email])
        return TrackedDownload(**data) if data else None

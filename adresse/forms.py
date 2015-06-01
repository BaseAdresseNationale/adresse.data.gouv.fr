from flask import session
from wtforms import Form, StringField, validators, TextAreaField
from wtforms.csrf.session import SessionCSRF

from . import app


class BaseForm(Form):
    DATA_REQUIRED = 'Ce champ est obligatoire.'
    EMAIL = 'Adresse courriel invalide.'

    class Meta:
        csrf = True
        csrf_class = SessionCSRF
        csrf_secret = app.config['SECRET_KEY'].encode()

        @property
        def csrf_context(self):
            return session


class TrackedDownloadForm(BaseForm):

    first_name = StringField('Prénom',
                             [validators.DataRequired(BaseForm.DATA_REQUIRED)])
    last_name = StringField('Nom',
                            [validators.DataRequired(BaseForm.DATA_REQUIRED)])
    email = StringField('Email',
                        [validators.DataRequired(BaseForm.DATA_REQUIRED),
                         validators.Email(BaseForm.EMAIL)])
    company = StringField('Société')


class ReportForm(BaseForm):
    email = StringField('Votre email',
                        [validators.DataRequired(BaseForm.DATA_REQUIRED),
                         validators.Email(BaseForm.EMAIL)])
    message = TextAreaField('Signalement',
                            [validators.DataRequired(BaseForm.DATA_REQUIRED)])

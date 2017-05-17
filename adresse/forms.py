from flask_wtf import Form
from wtforms import StringField

class CrowdsourcingForm(Form):
    id = StringField()
    before = StringField()
    after = StringField()
    username = StringField()
    auth_provider = StringField()
    comment = StringField()

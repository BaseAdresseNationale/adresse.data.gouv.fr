import sqlite3

from flask import Flask

app = Flask(__name__)
app.config.from_object('adresse.default')
app.config.from_envvar('ADRESSE_SETTINGS', silent=True)

if app.debug:
    app.config['TESTING'] = True

# Import views to make Flask know about them
import adresse.views  # noqa

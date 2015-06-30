import sqlite3

from flask import Flask, g, _app_ctx_stack as stack
from flask_mail import Mail
from flask_wtf.csrf import CsrfProtect

app = Flask(__name__)
app.config.from_object('adresse.default')
app.config.from_envvar('ADRESSE_SETTINGS', silent=True)

if app.debug:
    if not app.config.get('SECRET_KEY'):
        app.config['SECRET_KEY'] = 'xxxxx'
    app.config['TESTING'] = True

mail = Mail(app)
CsrfProtect(app)


class DB(object):

    @classmethod
    def _init(cls):
        db = DB.connect()
        with app.open_resource('sql/schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()

    @classmethod
    def init(cls):
        # Make it smarter so it works both during tests AND from a shell.
        ctx = stack.top
        if ctx:
            cls._init()
        else:
            with app.app_context():
                cls._init()

    @classmethod
    def connect(cls):
        db = getattr(g, '_database', None)
        if db is None:
            db = g._database = sqlite3.connect(app.config['DATABASE'])
            db.row_factory = sqlite3.Row
        return db

    @classmethod
    def fetchall(cls, query, args=()):
        cur = DB.connect().execute(query, args)
        rv = cur.fetchall()
        cur.close()
        return rv

    @classmethod
    def fetchone(cls, query, args=()):
        cur = DB.connect().execute(query, args)
        rv = cur.fetchone()
        cur.close()
        return rv

    @classmethod
    def commit(cls, query, args=()):
        db = DB.connect()
        db.execute(query, args)
        return db.commit()


@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


# Import views to make Flask know about them
import adresse.views  # noqa

import hashlib

from . import DB, app


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
                  '(first_name, last_name, email, company, token, area) '
                  'VALUES (?, ?, ?, ?, ?, ?)',
                  [self.first_name, self.last_name, self.email, self.company,
                   self.token, self.area])

    def use(self):
        DB.commit('UPDATE tracked_download SET used=used+1 '
                  'WHERE used<? AND token=?',
                  [self.MAX_USE, self.token])

    @classmethod
    def from_token(cls, token):
        data = DB.fetchone('SELECT * FROM tracked_download '
                           'WHERE used<? AND token=?',
                           [cls.MAX_USE, token])
        return TrackedDownload(**data) if data else None

    @classmethod
    def from_email(cls, email, area):
        data = DB.fetchone('SELECT * FROM tracked_download '
                           'WHERE used<? AND email=? AND area=?',
                           [cls.MAX_USE, email, area])
        return TrackedDownload(**data) if data else None

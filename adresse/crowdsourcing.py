from . import DB


class Crowdsourcing(object):

    CREATE = 'c'
    UPDATE = 'u'
    DELETE = 'd'

    def __init__(self, **data):
        self.id = None
        self.before = None
        self.after = None
        self.username = None
        self.auth_provider = None
        for key, value in data.items():
            setattr(self, key, value)
        if not self.id and self.after:
            self.operation = Crowdsourcing.CREATE
        elif self.id and self.before and self.after:
            self.operation = Crowdsourcing.UPDATE
        elif self.id and not self.before and not self.after:
            self.operation = Crowdsourcing.DELETE
        else:
            raise ValueError('Unknown operation')

    def save(self):
        DB.commit('INSERT INTO crowdsourcing '
                  '(operation, id, before, after, username, auth_provider) '
                  'VALUES (?, ?, ?, ?, ?, ?)',
                  [self.operation, self.id, self.before, self.after,
                   self.username, self.auth_provider])

    def to_json(self):
        return self.__dict__

    @classmethod
    def data(self, _from=None):
        sql = 'SELECT * FROM crowdsourcing'
        args = []
        if _from:
            sql += ' WHERE created_at>?'
            args.append(_from)
        sql += ' ORDER BY created_at DESC'
        for row in DB.fetchall(sql, args):
            yield Crowdsourcing(**row)

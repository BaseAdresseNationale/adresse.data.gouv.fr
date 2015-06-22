from . import DB


class Contribution(object):

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
            self.operation = Contribution.CREATE
        elif self.id and self.before and self.after:
            self.operation = Contribution.UPDATE
        elif self.id and not self.before and not self.after:
            self.operation = Contribution.DELETE
        else:
            raise ValueError('Unknown operation')

    def save(self):
        DB.commit('INSERT INTO contributions '
                  '(operation, id, before, after, username, auth_provider) '
                  'VALUES (?, ?, ?, ?, ?, ?)',
                  [self.operation, self.id, self.before, self.after,
                   self.username, self.auth_provider])

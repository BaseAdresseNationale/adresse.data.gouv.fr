import json

from . import DB


class Crowdsourcing(object):

    CREATE = 'c'
    UPDATE = 'u'
    DELETE = 'd'
    PROPERTIES = ['housenumber', 'rep', 'street', 'locality']

    def __init__(self, **data):
        self.id = None
        self.before = None
        self.after = None
        self.username = None
        self.auth_provider = None
        self.created_at = None
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
        return self

    def to_json(self):
        return {
            "id": self.id,
            "before": json.loads(self.before) if self.before else None,
            "after": json.loads(self.after) if self.after else None,
            "username": self.username,
            "auth_provider": self.auth_provider,
            "operation": self.operation,
            "created_at": self.created_at,
            "diff": self.diff,
        }

    @property
    def diff(self):
        if self.operation != Crowdsourcing.UPDATE:
            return None
        d = {}
        b = json.loads(self.before)
        a = json.loads(self.after)
        if (round(b['geometry']['coordinates'][0], 6) != round(a['geometry']['coordinates'][0], 6)  # noqa
            or round(b['geometry']['coordinates'][0], 6) != round(a['geometry']['coordinates'][0], 6)):  # noqa
            d['coordinates'] = {
                'before': b['geometry']['coordinates'],
                'after': a['geometry']['coordinates']
            }
        for key in Crowdsourcing.PROPERTIES:
            if a['properties'].get(key) != b['properties'].get(key):
                d[key] = {
                    'before': b['properties'].get(key),
                    'after': a['properties'].get(key)
                }
        return d

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

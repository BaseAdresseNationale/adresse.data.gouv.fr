import re

from flask import url_for

from adresse import DB
from adresse.contrib import Contribution

csrf_token_input = re.compile(
    r'meta name="csrf" content="([0-9a-z#A-Z-\.]*)"'
)


def get_csrf_token(data):
    match = csrf_token_input.search(data.decode())
    assert match
    return match.groups()[0]


def test_can_access_crowdsourcing_view(client):
    assert client.get(url_for('crowdsourcing'))


def test_can_create_new_crowdsourcing_from_post(client):
    assert not DB.fetchone('SELECT count(*) as t FROM contributions')['t']
    url = url_for('crowdsourcing')
    response = client.get(url)
    token = get_csrf_token(response.data)
    data = {
        'id': 'xxxx',
        'before': 'yyyyy',
        'after': 'zzzzzzz'
    }
    print(client.post(url, data=data, headers={'X-CSRFToken': token}))
    assert DB.fetchone('SELECT count(*) as t FROM contributions')['t']


def test_should_update_if_id_and_after():
    assert not DB.fetchone('SELECT count(*) as t FROM contributions')['t']
    Contribution(id="xxxx", before="yyyyy", after="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM contributions WHERE operation="u"')['t']  # noqa


def test_should_create_if_no_id_but_after():
    assert not DB.fetchone('SELECT count(*) as t FROM contributions')['t']
    Contribution(after="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM contributions WHERE operation="c"')['t']  # noqa


def test_should_delete_if_id_and_no_after():
    assert not DB.fetchone('SELECT count(*) as t FROM contributions')['t']
    Contribution(id="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM contributions WHERE operation="d"')['t']  # noqa

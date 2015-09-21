import re

from flask import url_for

from adresse import DB
from adresse.crowdsourcing import Crowdsourcing

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
    assert not DB.fetchone('SELECT count(*) as t FROM crowdsourcing')['t']
    url = url_for('crowdsourcing')
    response = client.get(url)
    token = get_csrf_token(response.data)
    data = {
        'id': 'xxxx',
        'before': '{"geometry": {"coordinates": [0, 0]}, "properties": {}}',
        'after': '{"geometry": {"coordinates": [1, 1]}, "properties": {}}',
    }
    client.post(url, data=data, headers={'X-CSRFToken': token})
    assert DB.fetchone('SELECT count(*) as t FROM crowdsourcing')['t']


def test_should_update_if_id_and_after():
    assert not DB.fetchone('SELECT count(*) as t FROM crowdsourcing')['t']
    Crowdsourcing(id="xxxx", before="yyyyy", after="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM crowdsourcing WHERE operation="u"')['t']  # noqa


def test_should_create_if_no_id_but_after():
    assert not DB.fetchone('SELECT count(*) as t FROM crowdsourcing')['t']
    Crowdsourcing(after="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM crowdsourcing WHERE operation="c"')['t']  # noqa


def test_should_delete_if_id_and_no_after():
    assert not DB.fetchone('SELECT count(*) as t FROM crowdsourcing')['t']
    Crowdsourcing(id="zzzzzzz").save()
    assert DB.fetchone('SELECT count(*) as t FROM crowdsourcing WHERE operation="d"')['t']  # noqa


def test_data_should_accept_from_filter():
    Crowdsourcing(id="aaaaaaa").save()
    Crowdsourcing(id="zzzzzzz").save()
    DB.commit('UPDATE crowdsourcing SET created_at="2015-01-01" WHERE id="aaaaaaa"')  # noqa
    assert len(list(Crowdsourcing.data())) == 2
    assert list(Crowdsourcing.data())[0].id == "zzzzzzz"
    assert len(list(Crowdsourcing.data(_from="2015-01-02"))) == 1


def test_can_access_crowdsourcing_data(client):
    Crowdsourcing(id="zzzzzzz").save()
    response = client.get(url_for('crowdsourcing_data'))
    assert response.json
    assert response.json[0]['id'] == 'zzzzzzz'


def test_diff_should_return_none_if_not_an_update():
    c = Crowdsourcing(id="zzzzzzz").save()
    assert c.diff is None


def test_diff_should_diff_coordinates():
    before = '{"geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {}}'  # noqa
    after = '{"geometry": {"type": "Point", "coordinates": [1, 1]}, "properties": {}}'  # noqa
    c = Crowdsourcing(id="zzzzzzz", before=before, after=after).save()
    assert c.diff == {"coordinates": {"before": [0, 0], "after": [1, 1]}}


def test_diff_should_diff_properties():
    before = '{"geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {"housenumber": "foo", "street": "baz"}}'  # noqa
    after = '{"geometry": {"type": "Point", "coordinates": [0, 0]}, "properties": {"housenumber": "foo", "street": "bazz"}}'  # noqa
    c = Crowdsourcing(id="zzzzzzz", before=before, after=after).save()
    assert c.diff == {"street": {"before": "baz", "after": "bazz"}}

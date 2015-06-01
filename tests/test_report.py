from flask import url_for

from adresse import mail


def test_can_access_report_view(client):
    assert client.get(url_for('contrib'))


def test_new_report_should_send_an_email(webapp, config):
    with mail.record_messages() as outbox:
        form = webapp.get(url_for('contrib')).forms['report']
        form['email'] = 'victor@hugo.com'
        form['message'] = "This is a message"
        form.submit().follow()
        assert len(outbox) == 1
        assert outbox[0].subject == "Signalement BAN"  # noqa
        assert "This is a message" in outbox[0].body

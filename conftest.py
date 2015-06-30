import pytest

from flask.ext.webtest import TestApp
from adresse import app as _app, DB


def pytest_configure(config):
    _app.config['DATABASE'] = ':memory:'
    _app.config['TESTING'] = True


def pytest_runtest_setup(item):
    ctx = _app.test_request_context()
    ctx.push()
    DB.init()
    DB.commit('DELETE FROM tracked_download')
    DB.commit('DELETE FROM crowdsourcing')


@pytest.fixture
def app():
    return _app


@pytest.fixture
def webapp():
    return TestApp(_app)

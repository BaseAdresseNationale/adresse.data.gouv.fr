import os

DATABASE = 'db.sql'
MAIL_DEFAULT_SENDER = 'ban@data.gouv.fr'
DEBUG = True
TESTING = True
SITE_URL = os.environ.get('SITE_URL', '//adresse.data.gouv.fr')
API_URL = os.environ.get('API_URL', '//api-adresse.data.gouv.fr')
DEVAPI_URL = '//devapi-adresse.data.gouv.fr'
TILE_URL = os.environ.get('TILE_URL', '//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGN&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg')  # noqa
BAN_FILE_PATH = None
REPORT_EMAIL = 'sav.sna@laposte.fr'

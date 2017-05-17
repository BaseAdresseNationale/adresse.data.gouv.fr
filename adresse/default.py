import os

DATABASE = 'db.sql'
MAIL_DEFAULT_SENDER = 'ban@data.gouv.fr'
DEBUG = True
TESTING = True
SITE_URL = os.environ.get('SITE_URL', '//adresse.data.gouv.fr')
API_URL = os.environ.get('API_URL', '//api-adresse.data.gouv.fr')
CRUD_API_URL = os.environ.get('CRUD8API_URL', '//ban-dev.data.gouv.fr')
DEVAPI_URL = 'http://devapi-adresse.data.gouv.fr'
TILE_URL = os.environ.get('TILE_URL', '//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGN&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg')  # noqa
ORTHO_TILE_URL = os.environ.get('ORTHO_TILE_URL', '//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg')  # noqa
ROADS_TILE_URL = os.environ.get('ROADS_TILE_URL', '//wxs.ign.fr/14repeswer1lgaj7p7yergsz/geoportail/wmts/?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=TRANSPORTNETWORKS.ROADS&STYLE=normal&TILEMATRIXSET=PM&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fpng')  # noqa
DATAGOUV_CONSUMER_KEY = "XXXX"
DATAGOUV_CONSUMER_SECRET = "YYYY"
DELIVERY_CONTROL_FILE = None

import os

from adresse import app

app.run(debug=os.environ.get('DEBUG', True))

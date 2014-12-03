API_URL = 'http://bano.fluv.io/search/?';
TILELAYER = 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png';
CENTER = [48.72568, -3.985908];
MAXZOOM = 18;
var searchPoints = L.geoJson(null, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
var showSearchPoints = function (geojson) {
    searchPoints.clearLayers();
    searchPoints.addData(geojson);
}
var formatResult = function (feature, el) {
    var title = L.DomUtil.create('strong', '', el),
        detailsContainer = L.DomUtil.create('small', '', el),
        details = [],
        type = this.formatType(feature);
    title.innerHTML = feature.properties.name;
    details.push(feature.properties.type);
    if (feature.properties.city && feature.properties.city !== feature.properties.name) {
        details.push(feature.properties.city);
    }
    if (feature.properties.context) details.push(feature.properties.context);
    detailsContainer.innerHTML = details.join(', ');
};

var photonControlOptions = {
    resultsHandler: showSearchPoints,
    placeholder: 'Ex. 6 quai de la tourelle cergy…',
    position: 'topright',
    url: API_URL,
    formatResult: formatResult,
    noResultLabel: 'Aucun résultat',
    feedbackLabel: 'Signaler',
    feedbackEmail: 'adresses@data.gouv.fr'
};
var photonReverseControlOptions = {
    resultsHandler: showSearchPoints,
    position: 'topleft',
    url: 'http://bano.fluv.io/reverse/?',
    formatResult: formatResult,
    noResultLabel: 'Aucun résultat',
    tooltipLabel: 'Cliquer sur la carte pour obtenir l\'adresse'
};
var map = L.map('map', {
    photonControl: true,
    photonControlOptions: photonControlOptions,
    photonReverseControl: true,
    photonReverseControlOptions: photonReverseControlOptions,
    attributionControl: false
});
map.setView(CENTER, 12);
searchPoints.addTo(map);
L.tileLayer(TILELAYER, {maxZoom: MAXZOOM, attribution: 'Data \u00a9 <a href="http://www.openstreetmap.org/copyright">OpenStreetMap Contributors</a> | Tiles \u00a9 <a href="http://thunderforest.com/">Thunderforest</a>'}).addTo(map);
L.control.attribution({position: 'bottomleft'}).addTo(map);

L.Control.ReverseLabel = L.Control.extend({

    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'reverse-label');
        var reverse = new L.PhotonReverse({url: 'http://bano.fluv.io/reverse/?', handleResults: function (data) {
            container.innerHTML = 'Carte centrée sur «' + data.features[0].properties.label + '»';
        }});
        map.on('moveend', function () {
            if (this.getZoom() > 14) reverse.doReverse(this.getCenter());
            else container.innerHTML = '';
        });
        return container;
    }

});
new L.Control.ReverseLabel().addTo(map);

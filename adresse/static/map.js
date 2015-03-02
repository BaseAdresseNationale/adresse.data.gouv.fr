/* eslint strict:0, quotes:[1, "simple"], curly: 0, no-shadow:0 */
/* globals L, API_URL, TILE_URL */

var CENTER = [48.72568, -3.985908];
var MAXZOOM = 18;
var searchPoints = L.geoJson(null, {
        onEachFeature: function (feature, layer) {
            layer.bindPopup(feature.properties.name);
        }
    });
var showSearchPoints = function (geojson) {
    searchPoints.clearLayers();
    searchPoints.addData(geojson);
};
var formatResult = function (feature, el) {
    var title = L.DomUtil.create('strong', '', el),
        detailsContainer = L.DomUtil.create('small', '', el),
        details = [];
    title.innerHTML = feature.properties.label || feature.properties.name;
    var types = {
        housenumber: 'numéro',
        street: 'rue',
        locality: 'lieu-dit',
        hamlet: 'hamlet',
        village: 'village',
        city: 'city',
        commune: 'commune'
    };
    if (types[feature.properties.type]) L.DomUtil.create('span', 'type', title).innerHTML = types[feature.properties.type];
    if (feature.properties.city && feature.properties.city !== feature.properties.name) {
        details.push(feature.properties.city);
    }
    if (feature.properties.context) details.push(feature.properties.context);
    detailsContainer.innerHTML = details.join(', ');
};


var SHORT_CITY_NAMES = ['y', 'ay', 'bu', 'by', 'eu', 'fa', 'gy', 'oo', 'oz', 'py', 'ri', 'ry', 'sy', 'ur', 'us', 'uz'];
var photonControlOptions = {
    resultsHandler: showSearchPoints,
    placeholder: 'Ex. 6 quai de la tourelle cergy…',
    position: 'topright',
    url: API_URL + '/search/?',
    formatResult: formatResult,
    noResultLabel: 'Aucun résultat',
    feedbackLabel: 'Signaler',
    feedbackEmail: 'adresses@data.gouv.fr',
    minChar: function (val) {
        return SHORT_CITY_NAMES.indexOf(val) !== -1 || val.length > 3;
    }
};
var map = L.map('map', {
    photonControl: true,
    photonControlOptions: photonControlOptions,
    photonReverseControl: true,
    attributionControl: false
});
map.setView(CENTER, 12);
searchPoints.addTo(map);
L.tileLayer(TILE_URL, {minZoom: 6, maxZoom: MAXZOOM, attribution: 'Fond de plan \u00a9 <a href="http://www.ign.fr/">IGN</a>, <a href="https://www.data.gouv.fr/fr/datasets/base-d-adresses-nationale-ouverte-bano/">Adresses BANO</a> sous licence ODbL'}).addTo(map);
L.control.attribution({position: 'bottomleft'}).addTo(map);

L.Control.ReverseLabel = L.Control.extend({

    options: {
        position: 'bottomright'
    },

    onAdd: function (map) {
        var container = L.DomUtil.create('div', 'reverse-label');
        var reverse = new L.PhotonReverse({url: API_URL + '/reverse/?', handleResults: function (data) {
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

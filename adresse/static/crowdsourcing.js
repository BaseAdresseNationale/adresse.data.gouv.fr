/*global reqwest*/
'use strict';
var qs = function (selector, element) {
    return (element || document).querySelector(selector);
};

var API_URL = '//api-adresse.data.gouv.fr';

var BanUi = L.Class.extend({

    initialize: function (options) {
        this.options = options || {};
        if (this.options.user) this.markLoggedIn();
        this.panel = qs('#panel');
        this.search = qs('#search input');
        this.actionStepTitle2 = qs('#topbar h2');
        var continueButton = qs('#thanks .message a.button');
        var loginLink = qs('.login');
        L.DomEvent.on(loginLink, 'click', L.DomEvent.stop)
                  .on(loginLink, 'click', this.doLogin, this);
        L.DomEvent.on(continueButton, 'click', L.DomEvent.stop)
                  .on(continueButton, 'click', function () { this.step('search'); }, this);
        this.step('search');
        this.initMap();
    },

    initMap: function () {
        var options = {
            url: API_URL + '/search/?',
            placeholder: 'Vérifier une adresse…',
            formatResult: this.formatResult,
            onSelected: function () {}
        };
        this.housenumberLayer = new L.FeatureGroup();
        this.map = L.map('map', {zoomControl: false, editable: true, editOptions: {featuresLayer: this.housenumberLayer}, maxZoom: 18}).setView([48.843, 2.376], 18);
        this.housenumberLayer.addTo(this.map);
        this.map.on('editable:editing', this.makeDirty, this);

        this.searchControl = new L.PhotonSearch(this.map, this.search, options);
        this.searchControl.on('selected', this.onSelected, this);

        L.tileLayer(this.options.tileUrl, {
            attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);
        this.map.locate({setView: true});
        this.map.on('locationfound', this.reverse, this);
    },

    step: function (id) {
        document.body.className = L.Util.trim(document.body.className.replace(/\bstep-\w*\b/, ''));
        L.DomUtil.addClass(document.body, 'step-' + id);
        var key = 'onStep_' + id;
        if (this[key]) this[key]();
    },

    onStep_search: function () {
        this.search.focus();
    },

    onStep_edit: function () {
        this.panel.innerHTML = '';
        var fields = [
            ['properties.housenumber', {handler: 'Input', placeholder: 'Numéro', helpText: 'Numéro'}],
            ['properties.rep', {handler: 'Input', placeholder: 'Répétiteur (bis, ter…)', helpText: 'Répétiteur (bis, ter…)'}],
            ['properties.street', {handler: 'Input', placeholder: 'Nom de la voie', helpText: 'Nom de la voie'}]
        ];
        var title = L.DomUtil.create('h2', 'step-action', this.panel);
        title.innerHTML = 'Éditer les propriétés';
        var builder = new L.FormBuilder(this.housenumber, fields);
        builder.on('postsync', function (e) {
            if (e.helper.field === 'properties.housenumber') this.housenumber._icon.innerHTML = this.housenumber.properties.housenumber || '?';
            this.makeDirty();
        }, this);
        this.panel.appendChild(builder.build());
        var submit = L.DomUtil.create('a', 'button on-dirty', this.panel);
        submit.innerHTML = 'Valider';
        submit.href = '#';
        L.DomEvent.on(submit, 'click', L.DomEvent.stop).on(submit, 'click', function () {
            if (!this.isLoggedIn()) this.askForLogin(this.save);
            else this.save();
        }, this);
        var cancel = L.DomUtil.create('a', 'button neutral', this.panel);
        cancel.innerHTML = 'Annuler';
        cancel.href = '#';
        L.DomEvent.on(cancel, 'click', L.DomEvent.stop).on(cancel, 'click', function () {
            this.clear();
            this.step('search');
        }, this);
    },

    reverse: function (e) {
        var self = this,
            reverse = new L.PhotonReverse({url: API_URL + '/reverse/?', handleResults: function (data) {
                if (data.features.length) {
                    self.search.value = data.features[0].properties.label;
                    self.searchControl.search();
                }
            }});
        reverse.doReverse(e.latlng);
    },

    addHousenumber: function (geojson) {
        geojson.properties.housenumber = this.extractHousenumber(this.inputString);
        this.editHousenumber(geojson);
    },

    editHousenumber: function (geojson) {
        this.housenumber = new BanUi.Marker(geojson);
        var center = this.housenumber.getLatLng(),
            centerPoint = this.map.project(center);
        this.map.setView(this.map.unproject(centerPoint.add([100, 0])), 18, {animate: true});
        this.map.once('moveend', function () {
            this.step('edit');
            L.DomEvent.once(this.panel, 'transitionend', function () {
                this.housenumber.addTo(this.housenumberLayer);
                this.housenumber.enableEdit();
            }, this);
        }, this);
    },

    makeDirty: function () {
        L.DomUtil.addClass(document.body, 'dirty');
    },

    unmakeDirty: function () {
        L.DomUtil.removeClass(document.body, 'dirty');
    },

    clear: function () {
        this.unmakeDirty();
        this.housenumberLayer.clearLayers();
    },

    save: function () {
        if (this.housenumber) {
            this.housenumber.once('saved', function () {
                this.step('thanks');
                this.clear();
            }, this);
            this.housenumber.save();
        }
    },

    isLoggedIn: function () {
        return !!this.options.user;
    },

    markLoggedIn: function () {
        var el = qs('#menu .username');
        el.innerHTML = this.options.user;
        L.DomUtil.addClass(document.body, 'logged');
    },

    doLogin: function (callback) {
        var win = window.open('/login/');
        this.oauthProceed = function () {
            this.markLoggedIn();
            if (callback && callback.call) callback.call(this);
            win.close();
        };
    },

    askForLogin: function (callback) {
        var askOauth = qs('#login .oauth'),
            anonymous = qs('#login .anonymous');
        var proceed = function () {
            L.DomUtil.removeClass(document.body, 'ask-for-login');
            if (callback) callback.call(this);
            L.DomEvent.off(anonymous, 'click', proceed, this);
            L.DomEvent.off(askOauth, 'click', doLogin, this);
        };
        var doLogin = function () {
            this.doLogin(proceed);
        };
        L.DomUtil.addClass(document.body, 'ask-for-login');
        L.DomEvent.on(askOauth, 'click', L.DomEvent.stop)
                  .on(askOauth, 'click', doLogin, this);
        L.DomEvent.on(anonymous, 'click', L.DomEvent.stop)
                  .on(anonymous, 'click', proceed, this);
    },

    extractHousenumber: function (name) {
        var types = [
            'avenue', 'rue', 'boulevard', 'all[ée]es?', 'impasse', 'place',
            'chemin', 'rocade', 'route', 'l[ôo]tissement', 'mont[ée]e', 'c[ôo]te',
            'clos', 'champ', 'bois', 'taillis', 'boucle', 'passage', 'domaine',
            'étang', 'etang', 'quai', 'desserte', 'pré', 'porte', 'square', 'mont',
            'r[ée]sidence', 'parc', 'cours?', 'promenade', 'hameau', 'faubourg',
            'ilot', 'berges?', 'via', 'cit[ée]', 'sent(e|ier)', 'rond[- ][Pp]oint',
            'pas(se)?', 'carrefour', 'traverse', 'giratoire', 'esplanade', 'voie',
            'chauss[ée]e'
        ].join('|');
        var matched = name.match(new RegExp('(.+?) (' + types + ')', 'i'));
        return L.Util.trim(matched ? matched[1] : '');
    },

    formatResult: function (feature, el) {
        var title = L.DomUtil.create('span', '', el),
            detailsContainer = L.DomUtil.create('small', '', el),
            details = [], action = feature.properties.type === 'housenumber' ? 'Vérifier ' : 'Ajouter une adresse dans ';
        title.innerHTML = action + '<strong>' + feature.properties.name + '</strong>';
        if (feature.properties.city && feature.properties.city !== feature.properties.name) {
            details.push(feature.properties.city);
        }
        if (feature.properties.context) details.push(feature.properties.context);
        detailsContainer.innerHTML = details.join(', ');
    },

    onSelected: function (e) {
        this.inputString = this.search.value;
        if (e.choice.properties.type === 'housenumber') this.editHousenumber(e.choice);
        else if (e.choice.properties.type === 'street') this.addHousenumber(e.choice);
    }


});
var B = BanUi;

B.Icon = L.DivIcon.extend({

    options: {
        iconSize: null,
        iconAnchor: [20, 40],
        className: 'marker'
    }

});

B.Marker = L.Marker.extend({

    initialize: function (geojson) {
        this.before = JSON.stringify(geojson);
        var latlng = L.latLng(geojson.geometry.coordinates[1], geojson.geometry.coordinates[0]);
        this.properties = {};
        var housenumber = geojson.properties.housenumber || '';
        this.properties.street = L.Util.trim(geojson.properties.name.replace(housenumber, ''));
        this.properties.housenumber = housenumber.split(' ')[0];
        this.properties.rep = housenumber.split(' ')[1];
        this.properties.id = geojson.properties.id;
        var options = {
            icon: new B.Icon({html: this.properties.housenumber || '?'})
        };
        L.Marker.prototype.initialize.call(this, latlng, options);
    },

    save: function () {
        var after = JSON.parse(this.before), self = this;
        after.geometry.coordinates = [this._latlng.lng, this._latlng.lat];
        after.properties = L.extend(after.properties, this.properties);
        var settings = {
            url: '.',
            type: 'json',
            method: 'post',
            data: {
                id: this.properties.id,
                before: this.before,
                after: JSON.stringify(after)
            },
            headers: {
              'X-Requested-With': 'XMLHttpRequest'
            },
            error: function (resp) {
                self.fire('error', {errors: resp});
            },
            success: function () {
                self.fire('saved');
            }
        };
        var token = qs('meta[name=csrf]').getAttribute('content');
        if (token) settings.headers['X-CSRFToken'] = token;
        reqwest(settings);
    }

});

function initUI (options) {
    window.UI = new BanUi(options);
}

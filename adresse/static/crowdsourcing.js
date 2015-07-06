/*global reqwest*/
'use strict';
var qs = function (selector, element) {
    return (element || document).querySelector(selector);
};

var API_URL = '//api-adresse.data.gouv.fr';

var BanUi = L.Evented.extend({

    initialize: function (options) {
        this.options = options || {};
        if (this.options.user) this.markLoggedIn();
        this.panel = qs('#panel');
        this.search = qs('#search input');
        this.actionStepTitle2 = qs('#topbar h2');
        var continueButton = qs('#thanks .message a.button');
        var loginLink = qs('.login');
        var gotoSearch = qs('#menu .goto-search');
        L.DomEvent.on(loginLink, 'click', L.DomEvent.stop)
                  .on(loginLink, 'click', this.doLogin, this);
        L.DomEvent.on(continueButton, 'click', L.DomEvent.stop)
                  .on(continueButton, 'click', function () { this.step('search'); }, this);
        L.DomEvent.on(gotoSearch, 'click', L.DomEvent.stop)
                  .on(gotoSearch, 'click', function () { this.step('search'); }, this);
        this.initMap();
        this.step('search');
    },

    initMap: function () {
        var options = {
            url: API_URL + '/search/?',
            placeholder: 'Vérifier une adresse…',
            formatResult: this.formatResult,
            onSelected: function () {}
        };
        this.housenumberLayer = new L.FeatureGroup();
        this.map = L.map('map', {
            zoomControl: false,
            editable: true,
            editOptions: {featuresLayer: this.housenumberLayer},
            maxZoom: 20
        });
        this.map.setView([48.843, 2.376], 18);
        this.housenumberLayer.addTo(this.map);
        this.map.on('editable:editing', this.makeDirty, this);

        this.searchControl = new L.PhotonSearch(this.map, this.search, options);
        this.searchControl.on('selected', this.onSelected, this);
        var tooltip = L.tooltip({
            content: 'Vous pouvez chercher une adresse pour la vérifier, ou chercher une rue pour ajouter une adresse manquante.',
            duration: 10000,
            static: true}
        ).attachTo('input').open();
        this.searchControl.once('selected', function () {
            tooltip.close();
        });

        L.tileLayer(this.options.tileUrl, {
            attribution: 'Images &copy; IGN',
            maxZoom: 20,
            maxNativeZoom: 18
        }).addTo(this.map);
        L.tileLayer(this.options.roadsTileUrl, {maxZoom: 20}).addTo(this.map);
        L.control.attribution({position: 'bottomleft', prefix: false}).addTo(this.map);
        L.DomEvent.on(qs('.geolocate'), 'click', function (e) {
            L.DomEvent.stop(e);
            this.map.locate({setView: true});
        }, this);
        this.map.on('locationfound', this.reverse, this);
        this.map.on('layeradd', this.attachMarkerTooltip, this);
        var zoomIn = qs('#menu .zoom .plus'),
            zoomOut = qs('#menu .zoom .minus');
        L.DomEvent.on(zoomIn, 'click', L.DomEvent.stop).on(zoomIn, 'click', this.zoomIn, this);
        L.DomEvent.on(zoomOut, 'click', L.DomEvent.stop).on(zoomOut, 'click', this.zoomOut, this);
    },

    zoomIn: function () {
        this.map.zoomIn();
    },

    zoomOut: function () {
        this.map.zoomOut();
    },

    step: function (id) {
        document.body.className = L.Util.trim(document.body.className.replace(/\bstep-\w*\b/, ''));
        L.DomUtil.addClass(document.body, 'step-' + id);
        var key = 'onStep_' + id;
        if (this[key]) this[key]();
        this.fire('step', {step: 'id'});
    },

    onStep_search: function () {
        this.clear();
        this.search.focus();
    },

    onStep_edit: function () {
        this.panel.innerHTML = '';
        var fields = [
            ['properties.housenumber', {handler: 'Input', placeholder: 'Numéro', helpText: 'Numéro', wrapper: 'div', wrapperClass: 'half'}],
            ['properties.rep', {handler: 'Input', placeholder: 'Répétiteur (bis, ter…)', helpText: 'Répétiteur (bis, ter…)', wrapper: 'div', wrapperClass: 'half'}],
            ['properties.street', {handler: 'Input', placeholder: 'Nom de la voie', helpText: 'Nom de la voie'}],
            ['properties.locality', {handler: 'Input', placeholder: 'Lieu-dit', helpText: 'Lieu-dit (optionnel)'}],
            ['properties.comment', {handler: 'Textarea', placeholder: 'Commentaire', helpText: 'Commentaire (optionnel)'}]
        ];
        this.form = new L.FormBuilder(this.housenumber, fields);
        this.form.on('postsync', function (e) {
            if (e.helper.field === 'properties.housenumber' || e.helper.field === 'properties.rep') this.housenumber._initIcon();
            this.makeDirty();
        }, this);
        this.panel.appendChild(this.form.build());
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
        this.formTooltipContent = 'Complétez les propriétés de l\'adresse.';
        this.markerTooltipContent = 'Positionnez le marqueur sur l\'entrée du bâtiment ou terrain.';
        geojson.properties.housenumber = this.extractHousenumber(this.inputString);
        this.editHousenumber(geojson);
    },

    updateHousenumber: function (geojson) {
        this.formTooltipContent = 'Vérifiez les propriétés de l\'adresse.';
        this.markerTooltipContent = 'Déplacez le marqueur s\'il n\'est pas parfaitement positionné sur la porte d\'entrée.';
        this.editHousenumber(geojson);
    },

    editHousenumber: function (geojson) {
        this.housenumber = new BanUi.Marker(geojson);
        var center = this.housenumber.getLatLng(),
            centerPoint = this.map.project(center);
        this.map.setView(this.map.unproject(centerPoint.add([100, 0])), 20, {animate: true});
        this.map.once('moveend', function () {
            this.step('edit');
            L.DomEvent.once(this.panel, 'transitionend', this.attachFormTooltip, this);
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
        if (feature.properties.city && feature.properties.city !== feature.properties.name) details.push(feature.properties.city);
        if (feature.properties.context) details.push(feature.properties.context);
        detailsContainer.innerHTML = details.join(', ');
    },

    onSelected: function (e) {
        this.inputString = this.search.value;
        if (e.choice.properties.type === 'housenumber') this.updateHousenumber(e.choice);
        else this.addHousenumber(e.choice);
    },

    attachMarkerTooltip: function (e) {
        if (!(e.layer instanceof BanUi.Marker)) return;
        var tooltip = L.tooltip({
            content: this.markerTooltipContent,
            static: true,
            duration: 10000
        }).attachTo('.marker').open();
        this.map.once('mousedown editable:editing zoomstart', tooltip.close, tooltip);
        this.on('step', tooltip.close, tooltip);
    },

    attachFormTooltip: function () {
        var tooltip = L.tooltip({
            content: this.formTooltipContent,
            static: true,
            position: 'left',
            duration: 10000,
            offsetY: 30
        }).attachTo('#panel').open();
        this.housenumber.addTo(this.housenumberLayer);
        this.housenumber.enableEdit();
        this.on('step', tooltip.close, tooltip);
        this.form.on('postsync', tooltip.close, tooltip);
    }


});
var B = BanUi;

B.Icon = L.DivIcon.extend({

    options: {
        iconSize: null,
        iconAnchor: [20, 42],
        className: 'marker'
    },

    createIcon: function (oldIcon) {
        var div = L.DivIcon.prototype.createIcon.call(this, oldIcon),
            content = this.options.housenumber.getLabel(),
            len = content.length;
        div.innerHTML = content;
        if (len > 7) div.style.fontSize = '7px';
        else if (len > 5) div.style.fontSize = '9px';
        else div.style.fontSize = '12px';
        return div;
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
            icon: new B.Icon({housenumber: this})
        };
        L.Marker.prototype.initialize.call(this, latlng, options);
    },

    getLabel: function () {
        var label = '';
        if (this.properties.housenumber) label += this.properties.housenumber;
        if (this.properties.rep) label += ' ' + this.properties.rep;
        return label || '?';
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

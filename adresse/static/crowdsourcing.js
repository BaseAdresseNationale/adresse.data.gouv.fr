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
        this.panelBody = this.panel.querySelector('.body');
        this.panelHandle = this.panel.querySelector('.handle');
        this.search = qs('#search input');
        this.actionStepTitle2 = qs('#topbar h2');
        var continueButton = qs('#thanks .message a.button');
        var loginLink = qs('.login');
        var gotoSearch = qs('#menu .goto-search');
        L.DomEvent.on(loginLink, 'click', L.DomEvent.stop)
                  .on(loginLink, 'click', this.chooseLoginProvider, this);
        L.DomEvent.on(continueButton, 'click', L.DomEvent.stop)
                  .on(continueButton, 'click', function () { this.step('search'); }, this);
        L.DomEvent.on(gotoSearch, 'click', L.DomEvent.stop)
                  .on(gotoSearch, 'click', function () { this.step('search'); }, this);
        for (var i = 0; i < options.login_providers.length; i++) {
            this.addLoginProviderButton(options.login_providers[i]);
        }
        this.initMap();
        this.step('search');
        L.DomEvent.on(this.panelHandle, 'click', this.togglePanel, this);
        var submit = qs('#menu .submit');
        L.DomEvent.on(submit, 'click', L.DomEvent.stop).on(submit, 'click', this.submit, this);
        var cancel = qs('#menu .cancel');
        L.DomEvent.on(cancel, 'click', L.DomEvent.stop).on(cancel, 'click', this.cancel, this);
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
            attributionControl: false,
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
            static: true,
            selector: 'input'
        }).open();
        this.searchControl.once('selected', function () {
            tooltip.close();
        });
        this.on('chooseprovider', tooltip.close, tooltip);

        L.tileLayer(this.options.tileUrl, {
            attribution: 'Images &copy; IGN',
            maxZoom: 20,
            maxNativeZoom: 18
        }).addTo(this.map);
        L.tileLayer(this.options.roadsTileUrl, {
            maxZoom: 20,
            maxNativeZoom: 18,
            opacity: 0.6
        }).addTo(this.map);
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
        this.panelBody.innerHTML = '';
        var fields = [
            ['properties.housenumber', {handler: 'Input', placeholder: 'Numéro', helpText: 'Numéro', wrapper: 'div', wrapperClass: 'half'}],
            ['properties.rep', {handler: 'Input', placeholder: 'Répétiteur (bis, ter…)', helpText: 'Répétiteur (bis, ter…)', wrapper: 'div', wrapperClass: 'half'}],
            ['properties.street', {handler: 'Input', placeholder: 'Nom de la voie', helpText: 'Nom de la voie'}],
            ['properties.locality', {handler: 'Input', placeholder: 'Lieu-dit', helpText: 'Lieu-dit (optionnel)'}],
            ['comment', {handler: 'Textarea', placeholder: 'Commentaire', helpText: 'Commentaire (optionnel)'}]
        ];
        var title = L.DomUtil.create('h3', '', this.panelBody);
        title.textContent = this.housenumber.properties.city + ' (' + this.housenumber.properties.citycode + ')';
        this.form = new L.FormBuilder(this.housenumber, fields);
        this.form.on('postsync', function (e) {
            if (e.helper.field === 'properties.housenumber' || e.helper.field === 'properties.rep') this.housenumber._initIcon();
            this.makeDirty();
        }, this);
        this.panelBody.appendChild(this.form.build());
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
        geojson.properties.parentId = geojson.properties.id;
        geojson.properties.id = null;
        this.editHousenumber(geojson);
    },

    updateHousenumber: function (geojson) {
        this.formTooltipContent = 'Vérifiez les propriétés de l\'adresse.';
        this.markerTooltipContent = 'Déplacez le marqueur s\'il n\'est pas parfaitement positionné sur la porte d\'entrée.';
        this.editHousenumber(geojson);
    },

    editHousenumber: function (geojson) {
        this.housenumber = new BanUi.Marker(geojson);
        this.map.setView(this.housenumber.getLatLng(), 19);
        this.step('edit');
        var callback = function () {
            this.attachFormTooltip();
            L.DomEvent.off(this.panel, 'transitionend', callback, this);
        };
        L.DomEvent.on(this.panel, 'transitionend', callback, this);
    },

    makeDirty: function () {
        L.DomUtil.addClass(document.body, 'dirty');
    },

    unmakeDirty: function () {
        L.DomUtil.removeClass(document.body, 'dirty');
    },

    toggleClass: function (el, name) {
        if (L.DomUtil.hasClass(el, name)) L.DomUtil.removeClass(el, name);
        else L.DomUtil.addClass(el, name);
    },

    togglePanel: function () {
        this.fire('togglepanel');
        this.toggleClass(this.panel, 'toggled');
    },

    clear: function () {
        this.unmakeDirty();
        this.housenumberLayer.clearLayers();
    },

    submit: function () {
        this._loginCallback = this.save;
        if (!this.isLoggedIn()) this.askForLogin();
        else this.save();
    },

    cancel: function () {
        this.step('search');
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

    doLogin: function (provider) {
        var win = window.open('/login/' + provider + '/');
        this.oauthProceed = function () {
            this.markLoggedIn();
            if (this._loginCallback && this._loginCallback.call) this._loginCallback.call(this);
            win.close();
        };
    },

    askForLogin: function () {
        var askOauth = qs('#login .oauth'),
            anonymous = qs('#login .anonymous'),
            closeButton = qs('#login .close');
        var proceed = function () {
            close.call(this);
            this.save();
            L.DomEvent.off(anonymous, 'click', proceed, this);
            L.DomEvent.off(askOauth, 'click', this.chooseLoginProvider, this);
        };
        var close = function () {
            L.DomUtil.removeClass(document.body, 'ask-for-login');
            L.DomEvent.off(closeButton, 'click', close, this);
            this._loginCallback = null;
        };
        this._loginCallback = proceed;
        L.DomUtil.addClass(document.body, 'ask-for-login');
        L.DomEvent.on(askOauth, 'click', L.DomEvent.stop)
                  .on(askOauth, 'click', this.chooseLoginProvider, this);
        L.DomEvent.on(anonymous, 'click', L.DomEvent.stop)
                  .on(anonymous, 'click', proceed, this);
        L.DomEvent.on(closeButton, 'click', L.DomEvent.stop)
                  .on(closeButton, 'click', close, this);
    },

    chooseLoginProvider: function (callback) {
        this.fire('chooseprovider');
        L.DomUtil.addClass(document.body, 'choose-login-provider');
        var closeButton = qs('#login-provider .close');
        var close = function () {
            L.DomUtil.removeClass(document.body, 'choose-login-provider');
            L.DomEvent.off(closeButton, 'click', close, this);
        };
        L.DomEvent.on(closeButton, 'click', L.DomEvent.stop)
                  .on(closeButton, 'click', close, this);
    },

    addLoginProviderButton: function (provider) {
        var container = qs('#login-provider .message div');
        var a = L.DomUtil.create('a', 'provider ' + provider, container);
        a.href = '#';
        L.DomEvent
                .on(a, 'click', L.DomEvent.stop)
                .on(a, 'click', function () {
                    this.doLogin(provider);
                    L.DomUtil.removeClass(document.body, 'choose-login-provider');
                }, this);
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
            duration: 10000,
            selector: '.marker'
        }).open();
        this.map.once('mousedown editable:editing zoomstart', tooltip.close, tooltip);
        this.on('step togglepanel chooseprovider', tooltip.close, tooltip);
    },

    attachFormTooltip: function () {
        var tooltip = L.tooltip({
            content: this.formTooltipContent,
            static: true,
            position: 'left',
            duration: 10000,
            offsetY: 25,
            selector: '#panel .handle'
        }).open();
        this.housenumber.addTo(this.housenumberLayer);
        this.housenumber.enableEdit();
        this.on('step togglepanel chooseprovider', tooltip.close, tooltip);
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

    initialize: function (source) {
        this.source = source;
        var latlng = L.latLng(source.geometry.coordinates[1], source.geometry.coordinates[0]);
        this.properties = {};
        var housenumber = source.properties.housenumber || '';
        this.properties.street = L.Util.trim(source.properties.name.replace(housenumber, ''));
        this.properties.housenumber = housenumber.split(' ')[0];
        this.properties.rep = housenumber.split(' ')[1];
        this.properties.id = source.properties.id;
        this.properties.city = source.properties.city;
        this.properties.citycode = source.properties.citycode;
        this.before = '';
        if (this.properties.id) {
            this.before = this.source;
            this.before.properties = L.extend({}, this.before.properties, this.properties);
            this.before = JSON.stringify(this.before);
        }
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
        var after = this.source,
            self = this;
        after.geometry.coordinates = [this._latlng.lng, this._latlng.lat];
        after.properties = L.extend(after.properties, this.properties);
        var settings = {
            url: '.',
            type: 'json',
            method: 'post',
            data: {
                id: this.properties.id,
                before: this.before,
                after: JSON.stringify(after),
                comment: this.comment
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

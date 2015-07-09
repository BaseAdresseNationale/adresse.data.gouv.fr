/*global L*/
'use strict';
L.Tooltip = L.Evented.extend({

    options: {
        width: 300,
        position: 'top',
        offsetY: 0,
        offsetX: 0,
        closable: true
    },

    initialize: function (options) {
        L.setOptions(this, options);
        this._ = L.DomUtil.create('div', 'tooltip tooltip-' + this.options.position, document.body);
        this._.style.width = this.options.width + 'px';
        if (!this.options.static) L.DomEvent.on(this._, 'mousemove', this.onMouseMove, this);
        if (this.options.closable) L.DomEvent.on(this._, 'click', this.close, this);
    },

    close: function () {
        if (!this._) return;
        this._.innerHTML = '';
        this._.style.display = 'none';
        return this;
    },

    open: function () {
        this._.innerHTML = '';
        this._.innerHTML = this.options.content;
        this._.style.display = 'block';
        if (this.options.duration) window.setTimeout(L.bind(this.close, this), this.options.duration);
        return this;
    },

    attachToEl: function (el) {
        if (this.options.static) {
            if (this.options.position === 'left') this.attachLeft(el);
            else this.attachTop(el);
        } else {
            L.DomEvent.on(el, 'mouseover', this.open, this);
            L.DomEvent.on(el, 'mouseout', this.close, this);
        }
    },

    attachTop: function (el) {
        var coords = this.getPosition(el);
        this.setPosition({left: coords.left - 40 + this.options.offsetX, bottom: this.getDocHeight() - coords.top + 11 + this.options.offsetY});
    },

    attachLeft: function (el) {
        var coords = this.getPosition(el);
        this.setPosition({top: coords.top + this.options.offsetY, right: document.documentElement.offsetWidth - coords.left + 11 + this.options.offsetX});
    },

    attachTo: function (selector) {
        var els = document.querySelectorAll(selector);
        for (var i = 0; i < els.length; i++) this.attachToEl(els[i]);
        return this;
    },

    getPosition: function (el) {
        return el.getBoundingClientRect();
    },

    setPosition: function (coords) {
        if (coords.left) this._.style.left = coords.left + 'px';
        if (coords.right) this._.style.right = coords.right + 'px';
        if (coords.top) this._.style.top = coords.top + 'px';
        if (coords.bottom) this._.style.bottom = coords.bottom + 'px';
    },

    getDocHeight: function () {
        var D = document;
        return Math.max(
            D.body.scrollHeight, D.documentElement.scrollHeight,
            D.body.offsetHeight, D.documentElement.offsetHeight,
            D.body.clientHeight, D.documentElement.clientHeight
        );
    },

    onMouseMove: function (e) {
        var maxY = document.documentElement.clientHeight,
            maxX = document.documentElement.clientWidth,
            width = this._.clientWidth,
            height = this._.clientHeight,
            marginX = 20,
            x = e.clientX + marginX,
            y = e.clientY - (height / 2);

        if (x + width > maxX) {
            x = e.clientX - width - marginX;
        }

        if (y + height > maxY) {
            y = e.clientY - (height / 2);
        }

        if (this._) this.setPosition({left: x, top: y});
    }
});
L.tooltip = function (options) {
    return new L.Tooltip(options);
};

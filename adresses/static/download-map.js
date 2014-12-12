function makeMap (options) {
    var metropole = d3.select(options.selector).append('svg')
        .attr('width', '100%')
        .attr('height', options.height);

    var projection = d3.geo.mercator()
        .scale(options.scale)
        .center(options.center);
        // .translate(options.translate);
    var path = d3.geo.path()
        .projection(projection);

    d3.json(options.url, function (err, data) {
        if (options.url.indexOf('topojson') !== -1) data = topojson.feature(data, data.objects.features);
        metropole.selectAll('.subunits')
            .data(data.features)
            .enter().append('path')
            .attr('class', function(d) { return 'dep ' + d.properties.code; })
            .attr('d', path)
            .on('click', click)
            .on('mouseover', mouseover)
            .on('mouseout', mouseout);
    });
}
makeMap({
    selector: '.metropole',
    url: '/static/departements.simplified.topojson',
    scale: 2600,
    center: [4.2, 48],
    height: 700
});
makeMap({
    selector: '.guadeloupe',
    url: '/static/guadeloupe.simplified.geojson',
    scale: 10000,
    center: [-61, 15.5],
    height: 300
});
makeMap({
    selector: '.martinique',
    url: '/static/martinique.simplified.geojson',
    scale: 20000,
    center: [-60.8, 14.4],
    height: 300
});
makeMap({
    selector: '.guyane',
    url: '/static/guyane.simplified.geojson',
    scale: 5000,
    center: [-55, 4],
    height: 500
});
makeMap({
    selector: '.reunion',
    url: '/static/reunion.simplified.geojson',
    scale: 20000,
    center: [55.8, -21.25],
    height: 400
});
makeMap({
    selector: '.mayotte',
    url: '/static/mayotte.simplified.geojson',
    scale: 20000,
    center: [45.4, -13.1],
    height: 300
});

var click =  function (d) {
    window.location.hash = '#departement-' + d.properties.code;
};
var mouseover = function (d) {
    Tooltip({content: d.properties.name}).open();
};
var mouseout = function () {
    Tooltip.close();
};
// var map = document.querySelector('.download-map'),
//     offsetTop = map.offsetTop;
// window.addEventListener('scroll', function () {
//     if (offsetTop && window.pageYOffset && window.pageYOffset > (offsetTop - 10)) {
//         map.style.position = 'fixed';
//         map.style.top = '10px';
//         map.style.width = '800px';
//     } else {
//         map.style.position = 'static';
//     }
// });

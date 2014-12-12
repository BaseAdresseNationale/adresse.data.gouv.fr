function Tooltip (o) {
    var close = function () {
            if (!Tooltip._) return;
            Tooltip._.innerHTML = '';
            Tooltip._.style.display = 'none';
        },
        open = function () {
            Tooltip._.innerHTML = '';
            Tooltip._.innerHTML = o.content;
            Tooltip._.style.display = 'block';
            if (o.duration) window.setTimeout(close, o.duration);
        },
        init = function () {
            Tooltip._ = document.createElement('div');
            Tooltip._.setAttribute('class', 'tooltip');
            document.body.appendChild(Tooltip._);
            Tooltip._initialized = true;
        },
        attachTo = function (selector) {
             var els = document.querySelectorAll(selector);
             for (var i = 0; i < els.length; i++) {
                 els[i].addEventListener('mouseover', open);
                 els[i].addEventListener('mouseout', close);
             }
        },
        onMouseMove = function (e) {
            var maxY = document.documentElement.clientHeight,
                maxX = document.documentElement.clientWidth,
                width = Tooltip._.clientWidth,
                height = Tooltip._.clientHeight,
                marginX = 20,
                x = e.clientX + marginX,
                y = e.clientY - (height / 2);

            if (x + width > maxX) {
                x = e.clientX - width - marginX;
            }

            if (y + height > maxY) {
                y = e.clientY - (height / 2);
            }

            if (Tooltip._) {
                Tooltip._.style.left = x + 'px';
                Tooltip._.style.top = y + 'px';
            }
        };
    if (!Tooltip._initialized) {
        init();
    }
    document.addEventListener('mousemove', onMouseMove);
    Tooltip.close = close;
    return {
        open: open,
        close: close,
        attachTo: attachTo
    };
}
Tooltip._initialized = false;
Tooltip._ = null;

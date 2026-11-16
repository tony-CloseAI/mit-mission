// Чертежи для геометрии (F2). MM.fig(spec) возвращает SVG-строку.
// Цвета берутся из CSS-переменных приложения, поэтому чертёж правильно выглядит в светлой и тёмной теме.
//
// spec:
//   pts:    { A: [x, y], … }        координаты, ось y направлена вверх
//   poly:   ['ABC', { p: ['A1', 'M', 'C'], fill: true }, …]  замкнутые многоугольники, fill — с заливкой
//   seg:    ['AB', ['A1', 'B1'], …]  отрезки (строка из однобуквенных имён или массив имён)
//   dash:   [...]                    пунктирные отрезки
//   gold:   [...]                    отрезки, выделенные цветом
//   circ:   [{ c: 'O' | [x, y], r }] окружности
//   ang:    [['B', 'A', 'C', n]]     дуга угла с вершиной A, n дуг (по умолчанию 1)
//   right:  [['A', 'H', 'B']]        знак прямого угла при вершине H
//   ticks:  { AB: 1, AC: 2 }         чёрточки равных отрезков
//   len:    { AB: '5' }              подпись длины у середины отрезка
//   lab:    { A: 'sw' }              направление подписи точки: n, s, e, w, ne, nw, se, sw
//   hide:   ['X']                    точки без подписи и без точки на чертеже
//   w:      ширина в пикселях (по умолчанию 300), alt: описание для экранного диктора
(function () {
  var DIRS = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0], ne: [0.75, -0.75], nw: [-0.75, -0.75], se: [0.75, 0.75], sw: [-0.75, 0.75] };
  function names(s) { return Array.isArray(s) ? s : s.split(''); }
  function f(v) { return Math.round(v * 10) / 10; }
  function labelText(n) {
    var m = /^([A-Za-zА-Яа-я]+)(\d+|')?$/.exec(n);
    if (!m || !m[2]) return n;
    return m[1] + (m[2] === "'" ? "′" : '<tspan class="fs" dy="4">' + m[2] + '</tspan>');
  }

  MM.fig = function (o) {
    var P = o.pts, keys = Object.keys(P), hide = o.hide || [];
    var xs = [], ys = [];
    keys.forEach(function (k) { xs.push(P[k][0]); ys.push(P[k][1]); });
    (o.circ || []).forEach(function (c) { var C = typeof c.c === 'string' ? P[c.c] : c.c; xs.push(C[0] - c.r, C[0] + c.r); ys.push(C[1] - c.r, C[1] + c.r); });
    var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs), minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
    var W = o.w || 300, pad = 28;
    var sc = (W - 2 * pad) / Math.max(maxX - minX, 1e-9);
    if (o.maxh) sc = Math.min(sc, (o.maxh - 2 * pad) / Math.max(maxY - minY, 1e-9));
    var H = Math.round((maxY - minY) * sc + 2 * pad);
    W = Math.round((maxX - minX) * sc + 2 * pad);
    function X(p) { return pad + (p[0] - minX) * sc; }
    function Y(p) { return H - pad - (p[1] - minY) * sc; }
    function pt(n) { return typeof n === 'string' ? P[n] : n; }
    function line(a, b, cls) { a = pt(a); b = pt(b); return '<line class="' + cls + '" x1="' + f(X(a)) + '" y1="' + f(Y(a)) + '" x2="' + f(X(b)) + '" y2="' + f(Y(b)) + '"/>'; }
    var out = [];
    // центр масс видимых точек — от него отводим подписи
    var vis = keys.filter(function (k) { return hide.indexOf(k) < 0; });
    var cx = 0, cy = 0; vis.forEach(function (k) { cx += X(P[k]); cy += Y(P[k]); }); cx /= vis.length || 1; cy /= vis.length || 1;

    (o.poly || []).forEach(function (s) {
      var filled = !!(s && s.fill), ns = names(s && s.p ? s.p : s);
      out.push('<polygon class="s' + (filled ? ' fl' : '') + '" points="' + ns.map(function (n) { return f(X(P[n])) + ',' + f(Y(P[n])); }).join(' ') + '"/>');
    });
    (o.circ || []).forEach(function (c) { var C = typeof c.c === 'string' ? P[c.c] : c.c; out.push('<circle class="s' + (c.dash ? ' d' : '') + '" cx="' + f(X(C)) + '" cy="' + f(Y(C)) + '" r="' + f(c.r * sc) + '"/>'); });
    (o.seg || []).forEach(function (s) { var ns = names(s); out.push(line(ns[0], ns[1], 's')); });
    (o.dash || []).forEach(function (s) { var ns = names(s); out.push(line(ns[0], ns[1], 's d')); });
    (o.gold || []).forEach(function (s) { var ns = names(s); out.push(line(ns[0], ns[1], 's g')); });

    // дуги углов
    (o.ang || []).forEach(function (a) {
      var B = P[a[0]], V = P[a[1]], C = P[a[2]], n = a[3] || 1;
      var vx = X(V), vy = Y(V);
      var t1 = Math.atan2(Y(B) - vy, X(B) - vx), t2 = Math.atan2(Y(C) - vy, X(C) - vx);
      var d = t2 - t1; while (d <= -Math.PI) d += 2 * Math.PI; while (d > Math.PI) d -= 2 * Math.PI;
      for (var i = 0; i < n; i++) {
        var r = 21 + 5 * i, x1 = vx + r * Math.cos(t1), y1 = vy + r * Math.sin(t1), x2 = vx + r * Math.cos(t1 + d), y2 = vy + r * Math.sin(t1 + d);
        out.push('<path class="s g" d="M' + f(x1) + ' ' + f(y1) + ' A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f(x2) + ' ' + f(y2) + '"/>');
      }
    });
    // прямые углы
    (o.right || []).forEach(function (a) {
      var B = P[a[0]], V = P[a[1]], C = P[a[2]], k = 10;
      var ux = X(B) - X(V), uy = Y(B) - Y(V), ul = Math.hypot(ux, uy), wx = X(C) - X(V), wy = Y(C) - Y(V), wl = Math.hypot(wx, wy);
      ux *= k / ul; uy *= k / ul; wx *= k / wl; wy *= k / wl;
      var vx = X(V), vy = Y(V);
      out.push('<path class="s g" d="M' + f(vx + ux) + ' ' + f(vy + uy) + ' L' + f(vx + ux + wx) + ' ' + f(vy + uy + wy) + ' L' + f(vx + wx) + ' ' + f(vy + wy) + '"/>');
    });
    // чёрточки равных отрезков
    Object.keys(o.ticks || {}).forEach(function (s) {
      var ns = s.length === 2 ? s.split('') : s.split('-'), A = P[ns[0]], B = P[ns[1]], n = o.ticks[s];
      var mx = (X(A) + X(B)) / 2, my = (Y(A) + Y(B)) / 2, dx = X(B) - X(A), dy = Y(B) - Y(A), l = Math.hypot(dx, dy);
      var ex = dx / l, ey = dy / l, nx = -ey * 5, ny = ex * 5;
      for (var i = 0; i < n; i++) { var sh = (i - (n - 1) / 2) * 4; out.push('<line class="s g" x1="' + f(mx + ex * sh - nx) + '" y1="' + f(my + ey * sh - ny) + '" x2="' + f(mx + ex * sh + nx) + '" y2="' + f(my + ey * sh + ny) + '"/>'); }
    });
    // точки и подписи
    vis.forEach(function (k) {
      var x = X(P[k]), y = Y(P[k]), dir = o.lab && o.lab[k] ? DIRS[o.lab[k]] : null;
      if (!dir) { var dx = x - cx, dy = y - cy, l = Math.hypot(dx, dy) || 1; dir = [dx / l, dy / l]; }
      out.push('<circle class="p" cx="' + f(x) + '" cy="' + f(y) + '" r="2.6"/>');
      out.push('<text class="t" x="' + f(x + dir[0] * 13) + '" y="' + f(y + dir[1] * 13) + '" text-anchor="middle" dominant-baseline="central">' + labelText(k) + '</text>');
    });
    Object.keys(o.len || {}).forEach(function (s) {
      var ns = s.length === 2 ? s.split('') : s.split('-'), A = P[ns[0]], B = P[ns[1]];
      var mx = (X(A) + X(B)) / 2, my = (Y(A) + Y(B)) / 2, dx = mx - cx, dy = my - cy, l = Math.hypot(dx, dy) || 1;
      out.push('<text class="t ln" x="' + f(mx + dx / l * 12) + '" y="' + f(my + dy / l * 12) + '" text-anchor="middle" dominant-baseline="central">' + o.len[s] + '</text>');
    });
    return '<svg class="fig" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" role="img" aria-label="' + (o.alt || 'Чертёж') + '">' + out.join('') + '</svg>';
  };
})();

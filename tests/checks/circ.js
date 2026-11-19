// Проверки темы «Окружность: вписанные углы и касательные».
// Каждая задача строится в координатах: точки на окружности, пересечения, касательные; ответ измеряется.
const { near, round6 } = require('./_lib');
const G = require('./_geolib');
const { on, angle, meet, foot, dist, circumcenter, incenter, lineCircle, tangentPt, bisect, bySides, byAngles, concyclic, rng, mid, lineDist, sub, add, mul, dot } = G;
const O0 = [0, 0];
const onlyOne = list => { const u = [...new Set(list.map(round6))]; if (u.length !== 1) throw new Error('неоднозначно: ' + u); return u[0]; };
const toFrac = (x, maxDen = 200) => { for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(x - p / q) < 1e-9) return q === 1 ? String(p) : p + '/' + q; } throw new Error('toFrac ' + x); };
// длины отрезков секущей из P по направлению deg: [ближний, дальний] (или null)
const secant = (P, deg, O, r) => { const pts = lineCircle(P, add(P, on(O0, 1, deg)), O, r); if (pts.length < 2) return null; const d = pts.map(X => dist(P, X)).sort((a, b) => a - b); return d; };

module.exports = {
  expected: {
    // хорда длины 16 в окружности радиуса 10: подбираем расстояние от центра
    'circ-01': round6(bisect(d => { const Q = lineCircle([-20, d], [20, d], O0, 10); return dist(Q[0], Q[1]) - 16; }, 0, 9.99)),
    'circ-02': round6(angle(on(O0, 1, 0), on(O0, 1, 250), on(O0, 1, 110))),
    'circ-03': (() => { const A = [13, 0], B = tangentPt(A, O0, 5, 1); if (!near(dot(sub(A, B), sub(B, O0)), 0)) throw new Error('касание'); return round6(dist(A, B)); })(),
    'circ-05': (() => { const A = on(O0, 1, 250), B = on(O0, 1, 0), C = on(O0, 1, 60), Dd = on(O0, 1, 136); if (!near(angle(Dd, A, B), 68)) throw new Error('circ-05'); return round6(angle(B, C, Dd)); })(),
    'circ-06': (() => { const A = on(O0, 1, 0), B = on(O0, 1, 80), C = on(O0, 1, 200); return round6(Math.max(angle(B, A, C), angle(A, B, C), angle(A, C, B))); })(),
    // описанный четырёхугольник через отрезки касательных w, x, y, z — ответ не зависит от выбора x
    'circ-07': onlyOne([0.5, 1.5, 3, 4.5, 6].map(x => { const w = 7 - x, y = 9 - x, z = 12 - y; return z + w; })),
    // точка внутри окружности радиуса 10 со степенью 36: произведение отрезков любой хорды одно и то же
    'circ-08': (() => { const P = [0, 8], prods = [0, 23, 61, 100, 147].map(a => { const s = secant(P, a, O0, 10); return s[0] * s[1]; });
      if (!prods.every(v => near(v, prods[0]))) throw new Error('circ-08'); const ae = secant(P, bisect(t => secant(P, t, O0, 10)[0] - 4, 90, 180), O0, 10); if (!near(ae[1], 9)) throw new Error('circ-08 b'); return round6(prods[0] / 6); })(),
    'circ-09': round6(dist(circumcenter([0, 0], [6, 0], [0, 8]), [0, 0])),
    'circ-10': (() => { const A = on(O0, 1, 270), t = [1, 0]; // касательная в A горизонтальна
      const arcs = []; for (let k = 1; k < 360; k++) { const B = on(O0, 1, 270 + k); const ch = sub(B, A); const a = Math.acos(Math.abs(dot(ch, t)) / Math.hypot(...ch)) / G.D; if (near(a, 40, 1e-9) && k < 180) arcs.push(k); } return onlyOne(arcs); })(),
    'circ-11': round6(bisect(d => 2 * angle(tangentPt([d, 0], O0, 6, 1), [d, 0], O0) - 60, 6.01, 100)),
    'circ-12': (() => { const A = on(O0, 1, 0), B = on(O0, 1, 100), C = on(O0, 1, 200), Dd = on(O0, 1, 240); return round6(angle(A, meet(A, C, B, Dd), B)); })(),
    // хорда AB длины 5 в окружностях разных радиусов, P на продолжении за A, PA = 4: касательная из P всегда 6
    'circ-13': onlyOne([[3, 10], [5, 70], [8, 33], [20, 140]].map(([r, th]) => { const A = on(O0, r, th), B = on(O0, r, th + 2 * Math.asin(5 / (2 * r)) / G.D), P = add(A, mul(sub(A, B), 4 / 5)); return Math.sqrt(dot(P, P) - r * r); })),
    'circ-14': (() => { const { A, B, C } = bySides(8, 9, 7); // BC = 8, CA = 9, AB = 7
      const T = foot(incenter(A, B, C), B, C); return round6(Math.min(dist(B, T), dist(C, T))); })(),
    'circ-15': (() => { const R = 9, r = 4, d = R + r, phi = Math.acos((R - r) / d); return round6(dist(on(O0, R, phi / G.D), on([d, 0], r, phi / G.D))); })(),
    // хорда AB = 9 в окружности радиуса 7, P на продолжении за A (PA = 3); вторая секущая с PC = 4
    'circ-17': (() => { const r = 7, A = on(O0, r, 30), B = on(O0, r, 30 + 2 * Math.asin(9 / (2 * r)) / G.D), P = add(A, mul(sub(A, B), 3 / 9));
      const dir = Math.atan2(-P[1], -P[0]) / G.D, tang = Math.asin(r / dist(P, O0)) / G.D, t = bisect(a => secant(P, a, O0, r)[0] - 4, dir, dir + tang - 0.01); return round6(secant(P, t, O0, r)[1] - 4); })(),
    'circ-18': onlyOne((() => { const out = []; for (let x = 1; x < 110; x++) { const B = on(O0, 1, -55), Dd = on(O0, 1, 55), A = on(O0, 1, 180 + x / 2), C = on(O0, 1, 180 - x / 2); const P = meet(A, B, C, Dd); if (near(angle(B, P, Dd), 25, 1e-9)) out.push(x); } return out; })()),
    'circ-19': (() => { const A = on(O0, 1, 0), Dd = on(O0, 1, -80), C = on(O0, 1, -140), B = on(O0, 1, 150); if (!near(angle(A, B, Dd), 40) || !near(angle(C, A, Dd), 30)) throw new Error('circ-19'); return round6(angle(A, B, C)); })(),
    'circ-20': (() => { const h = bisect(h => { const I = [0, h / 2], P = [-4, 0], Q = [-1, h]; return lineDist(I, P, Q) - h / 2; }, 0.1, 50); return round6(h / 2); })(),
    'circ-21': (() => { const d = bisect(d => angle(tangentPt([d, 0], O0, 1, 1), [d, 0], tangentPt([d, 0], O0, 1, -1)) - 50, 1.001, 100); const P = [d, 0], B = tangentPt(P, O0, 1, 1), C = tangentPt(P, O0, 1, -1), Dd = on(O0, 1, 180); return round6(angle(B, Dd, C)); })(),
    'circ-22': (() => { const th = bisect(t => { const A = [13 * Math.cos(t), 0], B = [0, 13 * Math.sin(t)], C = [0, 0], T = foot(incenter(A, B, C), A, B); return dist(A, T) - 10; }, 0.1, 1.5);
      const A = [13 * Math.cos(th), 0], B = [0, 13 * Math.sin(th)], T = foot(incenter(A, B, [0, 0]), A, B); if (!near(dist(B, T), 3)) throw new Error('circ-22'); return round6(A[0] * B[1] / 2); })(),
    'circ-23': (() => { const O = circumcenter([-2, 0], [8, 0], [0, 4]); if (!near(dist(O, [0, -4]), dist(O, [8, 0]))) throw new Error('circ-23'); return round6(dist(O, [8, 0])); })(),
    'circ-24': (() => { const { A, B, C } = bySides(12, 10, 9); // BC = 12, CA = 10, AB = 9
      const K = add(B, mul(sub(A, B), 6 / 9)), O = circumcenter(A, C, K), M = lineCircle(B, C, O, dist(O, A)).find(X => dist(X, C) > 1e-6); return round6(dist(K, M)); })(),
    'circ-25': (() => { const a = bisect(a => lineDist([4, 4], [a, 8], [a + 6, 0]) - 4, 4.01, 60); if (!near(dist([a, 8], [a + 6, 0]), 10)) throw new Error('circ-25'); return round6((a + a + 6) / 2 * 8); })(),
    'circ-26': (() => { const { A, B, C } = byAngles(70, 60), A1 = foot(A, B, C), B1 = foot(B, A, C); return round6(angle(A1, B1, C)); })(),
    'circ-27': (() => { const R = 6, r = 2, d = 10, phi = Math.acos((R + r) / d); return round6(dist(on(O0, R, phi / G.D), sub([d, 0], on(O0, r, phi / G.D)))); })(),
    'circ-28': (() => { const B = on(O0, 1, 90), C = on(O0, 1, 140), A = on(O0, 1, 40), Dd = on(O0, 1, 270); if (!near(angle(B, A, C), 25) || !near(dist(A, B), dist(B, C))) throw new Error('circ-28'); return round6(angle(A, Dd, C)); })(),
    'circ-29': (() => { const O = circumcenter([-4, 0], [4, 0], [3, 7]); if (!near(dist(O, [-3, 7]), dist(O, [4, 0]))) throw new Error('circ-29'); return round6(dist(O, [4, 0])); })(),
    'circ-31': (() => { const { A, B, C } = bySides(15, 14, 13); const t = bisect(t => { const X = add(A, mul(sub(C, A), t)); return lineDist(X, A, B) - lineDist(X, B, C); }, 0, 1); const X = add(A, mul(sub(C, A), t)); return round6(lineDist(X, A, B)); })(),
    'circ-33': (() => { const P = [5, 0], a = bisect(t => secant(P, t, O0, 7)[0] - 3, 0, 90); return round6(secant(P, a, O0, 7)[1]); })(),
    'circ-36': (() => { const r = 3, P = [Math.sqrt(36 + 9), 0], A = tangentPt(P, O0, r, 1); if (!near(dist(P, A), 6)) throw new Error('circ-36');
      const a = bisect(t => { const s = secant(P, t, O0, r); return s ? s[0] - 4 : -1; }, 180, 200); const pts = lineCircle(P, add(P, on(O0, 1, a)), O0, r).sort((X, Y) => dist(P, X) - dist(P, Y));
      return toFrac(dist(A, pts[0]) / dist(A, pts[1])); })(),
    'circ-37': (() => { const C1 = [0, 4], C2 = [12, 9]; if (!near(dist(C1, C2), 13)) throw new Error('circ-37');
      const x = bisect(x => { const t = Math.sqrt((4 + x) ** 2 - (4 - x) ** 2); return dist([t, x], C2) - (9 + x); }, 0.01, 3.9); return round6(x); })()
  },
  choice: {
    'circ-04': p => p.opts.indexOf(Math.round(angle(on(O0, 1, 0), on(O0, 1, 73), on(O0, 1, 180))) + '°'),
    // для каждого вида перебираем случайные фигуры и проверяем, всегда ли вершины на одной окружности
    'circ-16': p => {
      const rnd = rng(17), u = () => 0.5 + rnd() * 3;
      const make = {
        'ромб': () => { const a = u(), t = 0.3 + rnd(); return [[0, 0], [a, 0], [a + a * Math.cos(t), a * Math.sin(t)], [a * Math.cos(t), a * Math.sin(t)]]; },
        'прямоугольник': () => { const a = u(), b = u(); return [[0, 0], [a, 0], [a, b], [0, b]]; },
        'параллелограмм': () => { const a = u(), b = u(), t = 0.3 + rnd(); return [[0, 0], [a, 0], [a + b * Math.cos(t), b * Math.sin(t)], [b * Math.cos(t), b * Math.sin(t)]]; },
        'трапеция': () => { const a = u() + 3, h = u(), x = rnd(), y = rnd(); return [[0, 0], [a, 0], [a - 1 - y, h], [x, h]]; }
      };
      const always = p.opts.map(o => { for (let i = 0; i < 50; i++) { const [A, B, C, Dd] = make[o](); if (!concyclic(A, B, C, Dd, 1e-6)) return false; } return true; });
      if (always.filter(Boolean).length !== 1) throw new Error('circ-16'); return always.indexOf(true);
    }
  },
  claims: {
    // ∠ABD = ∠ACD ⇒ ∠BAC = ∠BDC: точку C строим на луче так, чтобы угол ACD был равен углу ABD
    'circ-30': () => {
      const rnd = rng(5);
      for (let t = 0; t < 300; t++) {
        const A = [0, 0], Dd = [4, 0], B = [0.5 + rnd(), 1 + rnd() * 2], target = angle(A, B, Dd), dir = on(O0, 1, 60 + rnd() * 60);
        const f = s => angle(A, add(Dd, mul(dir, s)), Dd) - target; if (f(0.05) * f(30) > 0) continue;
        const C = add(Dd, mul(dir, bisect(f, 0.05, 30)));
        if (!near(angle(B, A, C), angle(B, Dd, C), 1e-6)) return false;
      }
      return true;
    },
    // угол CBD не зависит от прямой через A
    'circ-32': () => {
      const rnd = rng(9);
      for (let k = 0; k < 20; k++) {
        const A = [0, 0], B = [0, 2 + rnd() * 3], O1 = [-(0.5 + rnd() * 3), B[1] / 2], O2 = [0.5 + rnd() * 3, B[1] / 2], r1 = dist(O1, A), r2 = dist(O2, A), vals = [];
        for (let th = 1; th < 180; th += 3) {
          const d = on(O0, 1, th), C = lineCircle(add(A, mul(d, -10)), add(A, mul(d, 10)), O1, r1).find(X => dist(X, A) > 1e-6), Dd = lineCircle(add(A, mul(d, -10)), add(A, mul(d, 10)), O2, r2).find(X => dist(X, A) > 1e-6);
          if (!C || !Dd || dot(sub(C, A), sub(Dd, A)) >= 0 || dist(C, B) < 1e-3 || dist(Dd, B) < 1e-3) continue;
          vals.push(angle(C, B, Dd));
        }
        if (vals.length < 10 || Math.max(...vals) - Math.min(...vals) > 1e-6) return false;
      }
      return true;
    },
    // OC ⟂ A1B1 в остроугольном треугольнике
    'circ-34': () => {
      const rnd = rng(11); let n = 0;
      for (let t = 0; t < 2000 && n < 300; t++) {
        const A = [rnd() * 10, rnd() * 10], B = [rnd() * 10, rnd() * 10], C = [rnd() * 10, rnd() * 10];
        if (Math.max(angle(B, A, C), angle(A, B, C), angle(A, C, B)) > 85 || G.area(A, B, C) < 3) continue; n++;
        const O = circumcenter(A, B, C), A1 = foot(A, B, C), B1 = foot(B, A, C), u = sub(C, O), v = sub(A1, B1);
        if (Math.abs(dot(u, v)) > 1e-8 * Math.hypot(...u) * Math.hypot(...v)) return false;
      }
      return n === 300;
    },
    // описанный четырёхугольник: вписанные окружности ABC и ACD касаются AC в одной точке
    'circ-35': () => {
      const rnd = rng(13);
      for (let t = 0; t < 300; t++) {
        const angs = [rnd() * 60, 90 + rnd() * 50, 180 + rnd() * 50, 270 + rnd() * 50].map(a => a * G.D);
        const tl = a => [[Math.cos(a), Math.sin(a)], [Math.cos(a) - Math.sin(a), Math.sin(a) + Math.cos(a)]]; // касательная в точке под углом a
        const V = [0, 1, 2, 3].map(i => { const [p, q] = tl(angs[i]), [s, r] = tl(angs[(i + 1) % 4]); return meet(p, q, s, r); });
        const [A, B, C, Dd] = V, T1 = foot(incenter(A, B, C), A, C), T2 = foot(incenter(A, C, Dd), A, C);
        if (dist(T1, T2) > 1e-7) return false;
      }
      return true;
    },
    // лемма Архимеда: AD — биссектриса угла BAC
    'circ-38': () => {
      const rnd = rng(21);
      for (let t = 0; t < 300; t++) {
        const R = 5, B = on(O0, R, 200 + rnd() * 40), C = on(O0, R, 300 + rnd() * 40), Dd = add(B, mul(sub(C, B), 0.1 + 0.8 * rnd()));
        let n = [-(C[1] - B[1]), C[0] - B[0]]; n = mul(n, 1 / Math.hypot(...n)); if (dot(n, sub(O0, Dd)) < 0) n = mul(n, -1); // нормаль к BC в сторону центра
        const w = sub(O0, Dd), s = (R * R - dot(w, w)) / (2 * (R - dot(w, n))), I = add(Dd, mul(n, s)), A = add(O0, mul(sub(I, O0), R / dist(I, O0)));
        if (Math.abs(dist(I, A) - s) > 1e-8) return false;
        if (!near(angle(B, A, Dd), angle(Dd, A, C), 1e-7)) return false;
      }
      return true;
    },
    // общая касательная: AB делит CD пополам, ∠CAD + ∠CBD = 180°
    'circ-39': () => {
      const rnd = rng(23);
      for (let t = 0; t < 200; t++) {
        const r1 = 1 + rnd() * 3, r2 = 1 + rnd() * 3, d = Math.abs(r1 - r2) + 0.3 + rnd() * (r1 + r2 - Math.abs(r1 - r2) - 0.6), O1 = [0, 0], O2 = [d, 0];
        const phi = Math.acos((r1 - r2) / d), C = on(O1, r1, -phi / G.D), Dd = on(O2, r2, -phi / G.D); // нижняя общая касательная
        let [P, Q] = G.circleCircle(O1, r1, O2, r2); const A = P[1] < Q[1] ? P : Q, B = P[1] < Q[1] ? Q : P; // A ближе к нижней касательной
        const M = meet(A, B, C, Dd);
        if (!near(dist(M, C), dist(M, Dd), 1e-7) || !near(angle(C, A, Dd) + angle(C, B, Dd), 180, 1e-6)) return false;
      }
      return true;
    },
    // теорема Брахмагупты
    'circ-40': () => {
      const rnd = rng(29);
      for (let t = 0; t < 300; t++) {
        const P = [rnd() * 1.2 - 0.6, rnd() * 1.2 - 0.6], a = rnd() * 180, u = on(O0, 1, a), v = on(O0, 1, a + 90);
        const [A, C] = lineCircle(P, add(P, u), O0, 2), [B, Dd] = lineCircle(P, add(P, v), O0, 2);
        const n = [-(B[1] - A[1]), B[0] - A[0]], M = meet(P, add(P, n), C, Dd);
        if (dist(M, mid(C, Dd)) > 1e-7) return false;
      }
      return true;
    }
  },
  lessons: {
    'circ-l1 examples': () => near(bisect(d => { const Q = lineCircle([-30, d], [30, d], O0, 13); return dist(Q[0], Q[1]) - 24; }, 0, 12.9), 5) && near(dist([10, 0], tangentPt([10, 0], O0, 6, 1)), 8),
    'circ-l2 examples': () => {
      const rnd = rng(3); for (let t = 0; t < 200; t++) { const a = rnd() * 360, b = a + 10 + rnd() * 160, c = b + 5 + rnd() * (350 - (b - a)); if (!near(angle(on(O0, 1, a), on(O0, 1, c), on(O0, 1, b)) * 2, angle(on(O0, 1, a), O0, on(O0, 1, b)), 1e-6)) return false; }
      const A = on(O0, 1, 0), B = on(O0, 1, 70), C = on(O0, 1, 200), Dd = on(O0, 1, 250); // дуги AB = 70, CD = 50
      return near(angle(A, meet(A, C, B, Dd), B), 60);
    },
    'circ-l3 examples': () => { const A = on(O0, 1, 0), B = on(O0, 1, 90), C = on(O0, 1, 160), Dd = on(O0, 1, 270);
      return near(angle(A, B, C), 100) && near(angle(B, A, C), 35) && near(angle(A, Dd, C), 80) && near(angle(B, Dd, C), 35) && near(angle(A, C, B), 45) && near(angle(A, Dd, B), 45); },
    'circ-l4 examples': () => { const { A, B, C } = bySides(5, 6, 7), I = incenter(A, B, C), Tc = foot(I, A, B), Ta = foot(I, B, C);
      const r = lineDist(incenter([0, 0], [3, 0], [0, 4]), [0, 0], [3, 0]), phi = Math.acos(6 / 10);
      return near(dist(A, Tc), 4) && near(dist(B, Tc), 3) && near(dist(C, Ta), 2) && near(r, 1) && near(dist(on(O0, 8, phi / G.D), on([10, 0], 2, phi / G.D)), 8); },
    'circ-l5 examples': () => near(3 * 8, 4 * 6) && near(dist([5, 0], tangentPt([5, 0], O0, Math.sqrt(25 - 16), 1)), 4) && ((() => { const s = secant([2, 0], 37, O0, Math.sqrt(2 * 8 + 4)); return near(s[0] * s[1], 16); })())
      && [10, 50, 120].every(a => { const s = secant([3, 0], a, O0, 5); return near(s[0] * s[1], 16); }),
    'circ-l6 examples': () => {
      const rnd = rng(31);
      for (let t = 0; t < 200; t++) { const { A, B, C } = byAngles(40 + rnd() * 40, 40 + rnd() * 40); if (angle(A, C, B) > 89) continue;
        const A1 = foot(A, B, C), B1 = foot(B, A, C); if (!concyclic(A, B, A1, B1, 1e-6) || !near(angle(A, A1, B1), angle(A, B, B1), 1e-6) || !near(angle(A, B, B1), 90 - angle(B, A, C), 1e-6)) return false; }
      return true;
    }
  }
};

// Проверки темы «Треугольники»: задачи строятся в координатах, ответы измеряются.
const { rreal, near, round6 } = require('./_lib');

const D = Math.PI / 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], addv = (a, b) => [a[0] + b[0], a[1] + b[1]], mulv = (a, k) => [a[0] * k, a[1] * k];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const angle = (A, V, B) => { const u = sub(A, V), w = sub(B, V); return Math.acos(Math.max(-1, Math.min(1, (u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))))) / D; };
const area = (A, B, C) => Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
const polyArea = ps => Math.abs(ps.reduce((s, p, i) => { const q = ps[(i + 1) % ps.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
// Треугольник по сторонам a = BC, b = CA, c = AB: B в начале координат, C на оси x
const bySides = (a, b, c) => { const B = [0, 0], C = [a, 0], x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B, C }; };
// Треугольник по стороне AB = c и углам A, B (в градусах)
const byAngles = (Ad, Bd, c = 1) => { const A = [0, 0], B = [c, 0], b = c * Math.sin(Bd * D) / Math.sin((180 - Ad - Bd) * D); return { A, B, C: [b * Math.cos(Ad * D), b * Math.sin(Ad * D)] }; };
const foot = (P, A, B) => { const d = sub(B, A), t = ((P[0] - A[0]) * d[0] + (P[1] - A[1]) * d[1]) / (d[0] * d[0] + d[1] * d[1]); return addv(A, mulv(d, t)); };
const incenter = (A, B, C) => { const a = dist(B, C), b = dist(C, A), c = dist(A, B), s = a + b + c; return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]; };
const centroid = (A, B, C) => [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
// точка на отрезке BC, куда приходит биссектриса из A
const bisFoot = (A, B, C) => { const c = dist(A, B), b = dist(A, C); return addv(B, mulv(sub(C, B), c / (b + c))); };
const randTri = () => { for (;;) { const A = [rreal(-5, 5), rreal(-5, 5)], B = [rreal(-5, 5), rreal(-5, 5)], C = [rreal(-5, 5), rreal(-5, 5)]; if (area(A, B, C) > 2 && Math.min(angle(B, A, C), angle(A, B, C), angle(A, C, B)) > 8) return { A, B, C }; } };
const sides = ({ A, B, C }) => ({ a: dist(B, C), b: dist(C, A), c: dist(A, B) });
const bisect = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };
const r6 = v => round6(v);

module.exports = {
  expected: {
    'tri-01': (() => { const { A, B, C } = byAngles(47, 68); return r6(angle(A, C, B)); })(),
    'tri-02': (() => { const { A, B, C } = byAngles(55, 75), ext = 180 - angle(A, C, B); if (!near(ext, 130)) throw new Error('tri-02'); return r6(angle(A, B, C)); })(),
    'tri-04': (() => { const B = [0, 0], A = [Math.cos(70 * D), Math.sin(70 * D)], C = [2 * Math.cos(70 * D), 0]; if (!near(angle(B, A, C), 40)) throw new Error('tri-04'); return r6(angle(A, B, C)); })(),
    'tri-05': (() => { let n = 0; for (let c = 1; c < 30; c++) if (3 + 8 > c && 3 + c > 8 && 8 + c > 3) n++; return n; })(),
    'tri-06': Math.hypot(5, 12),
    'tri-07': (() => { const { A, B, C } = bySides(10, 8, 6); return r6(dist(mid(A, B), mid(A, C))); })(),
    'tri-09': (() => { const c = 2 * 6.5; return r6(Math.sqrt(c * c - 25)); })(),
    'tri-10': (() => { const { A, B, C } = randTri(), A1 = mid(B, C), k = 15 / dist(A, A1); return r6(dist(A, centroid(A, B, C)) * k); })(),
    'tri-11': (() => { const { A, B, C } = bySides(10, 9, 6); return r6(dist(B, bisFoot(A, B, C))); })(),
    'tri-12': (() => { const { A, B, C } = randTri(), k = Math.sqrt(50 / area(A, B, C)), M = addv(B, mulv(sub(A, B), 2 / 5)), N = addv(B, mulv(sub(C, B), 2 / 5)); return r6(area(M, B, N) * k * k); })(),
    'tri-13': (() => { const { A, B, C } = byAngles(41, 72), I = incenter(A, B, C); return r6(angle(A, I, C)); })(),
    'tri-14': (() => { const H = [0, 0], A = [-4, 0], B = [9, 0], C = [0, 6]; if (!near(angle(A, C, B), 90)) throw new Error('tri-14'); return r6(dist(C, H)); })(),
    'tri-15': (() => { const C = [0, 0], A = [9, 0], B = [0, 12]; return r6(dist(C, foot(C, A, B))); })(),
    'tri-16': (() => { const C = [0, 0], A = [8, 0], B = [0, 15], I = incenter(A, B, C); return r6(I[1]); })(),
    'tri-17': (() => {
      // AB = BC, углы при основании α; D на BC с AD = AC; найти α, при котором ∠BAD = 21°, ответ — ∠B
      const build = al => { const A = [0, 0], C = [2, 0], B = [1, Math.tan(al * D)]; const t = bisect(s => dist(A, addv(B, mulv(sub(C, B), s))) - dist(A, C), 0, 0.999); return { A, B, C, Dp: addv(B, mulv(sub(C, B), t)) }; };
      const al = bisect(x => { const { A, B, Dp } = build(x); return angle(B, A, Dp) - 21; }, 61, 89);
      const { A, B, C } = build(al); return r6(angle(A, B, C));
    })(),
    'tri-18': (() => { let n = 0; for (let b = 1; b <= 18; b++) { const c = 18 - b; if (b <= c && b + c > 12 && b + 12 > c && c + 12 > b) n++; } return n; })(),
    'tri-19': (() => { const C = [0, 0], A = [6, 0], B = [0, 8]; const g = centroid(A, B, C), d = dist(g, C); if (!near(d, 10 / 3)) throw new Error('tri-19'); return '10/3'; })(),
    'tri-20': (() => { const { A, B, C } = bySides(12, 10, 8), Dp = bisFoot(B, A, C); if (!near(dist(A, Dp), 4) || !near(dist(Dp, C), 6)) throw new Error('tri-20'); return r6(dist(A, B)); })(),
    'tri-21': (() => { const C = [0, 0], A = [6, 0], B = [0, Math.sqrt(45)], H = foot(C, A, B); if (!near(dist(A, H), 4)) throw new Error('tri-21'); return r6(dist(A, B)); })(),
    'tri-22': (() => { const { A, B, C } = byAngles(30, 60, 1), s = sides({ A, B, C }), k = 12 / Math.max(s.a, s.b, s.c); return r6(Math.min(s.a, s.b, s.c) * k); })(),
    'tri-23': (() => { const { A, B, C } = byAngles(40, 60), H = foot(C, A, B), L = bisFoot(C, A, B); return r6(angle(H, C, L)); })(),
    'tri-24': (() => { const { A, B, C } = randTri(), k2 = 60 / area(A, B, C), A1 = mid(B, C), B1 = mid(A, C), M = centroid(A, B, C); return r6(polyArea([A1, M, B1, C]) * k2); })(),
    'tri-25': (() => { // ∠ABD = ∠ACB при любом угле A; AD не зависит от угла
      const vals = [37, 61, 95].map(Ad => { const A = [0, 0], B = [6, 0], C = [9 * Math.cos(Ad * D), 9 * Math.sin(Ad * D)]; const t = bisect(s => angle(A, B, addv(A, mulv(sub(C, A), s))) - angle(A, C, B), 0.001, 0.999); return dist(A, addv(A, mulv(sub(C, A), t))); });
      if (!vals.every(v => near(v, vals[0], 1e-6))) throw new Error('tri-25'); return r6(vals[0]);
    })(),
    'tri-27': (() => { const C = [0, 0], A = [21, 0], B = [0, 28], L = bisFoot(C, A, B); if (!near(dist(A, L), 15) || !near(dist(L, B), 20)) throw new Error('tri-27'); return r6(area(A, B, C)); })(),
    'tri-28': (() => { // прямая через G, параллельная AC, пересекает BA в M и BC в N
      const { A, B, C } = randTri(), k = 18 / dist(A, C), G = centroid(A, B, C), d = sub(C, A);
      const meet = (P, Q) => { const e = sub(Q, P), det = d[0] * -e[1] - d[1] * -e[0], w = sub(P, G), t = (w[0] * -e[1] - w[1] * -e[0]) / det; return addv(G, mulv(d, t)); };
      return r6(dist(meet(B, A), meet(B, C)) * k); })(),
    'tri-36': (() => { const B = [0, 0], A = [2, 0], M = [Math.cos(40 * D), Math.sin(40 * D)], C = sub(mulv(M, 2), A); return r6(angle(A, B, C)); })()
  },
  choice: {
    'tri-03': p => { const ok = p.opts.map(o => { const [a, b, c] = o.split(',').map(Number); return a + b > c && a + c > b && b + c > a; }); if (ok.filter(Boolean).length !== 1) throw new Error('tri-03'); return ok.indexOf(true); },
    'tri-08': () => { const { A, B, C } = bySides(5, 9, 7), angs = [angle(B, A, C), angle(A, B, C), angle(A, C, B)]; return angs.indexOf(Math.max(...angs)); },
    'tri-26': () => {
      // BC = 6, AC = 8, медианы из A и B перпендикулярны: подбираем угол C
      const build = g => { const C = [0, 0], B = [6, 0], A = [8 * Math.cos(g), 8 * Math.sin(g)]; return { A, B, C }; };
      const dot = g => { const { A, B, C } = build(g), u = sub(mid(B, C), A), w = sub(mid(A, C), B); return u[0] * w[0] + u[1] * w[1]; };
      const g = bisect(dot, 0.01, Math.PI - 0.01), { A, B } = build(g), ab = dist(A, B);
      const vals = [2 * Math.sqrt(5), 5, Math.sqrt(50), 10], hits = vals.map((v, i) => (near(v, ab, 1e-6) ? i : -1)).filter(i => i >= 0);
      if (hits.length !== 1) throw new Error('tri-26'); return hits[0];
    }
  },
  claims: {
    'tri-29': () => { for (let i = 0; i < 2000; i++) { const C = [0, 0], A = [rreal(0.5, 9), 0], B = [0, rreal(0.5, 9)]; if (!near(dist(C, mid(A, B)), dist(A, B) / 2)) return false; } return true; },
    'tri-30': () => { for (let i = 0; i < 2000; i++) { const h = rreal(0.3, 9), w = rreal(0.3, 9), A = [0, h], B = [-w, 0], C = [w, 0]; if (!near(dist(B, mid(A, C)), dist(C, mid(A, B)))) return false; } return true; },
    'tri-31': () => { for (let i = 0; i < 5000; i++) { const T = randTri(), s = sides(T); if (!(dist(T.A, mid(T.B, T.C)) < (s.b + s.c) / 2)) return false; } return true; },
    'tri-32': () => { for (let i = 0; i < 3000; i++) { const T = randTri(), Dp = bisFoot(T.A, T.B, T.C); if (!near(angle(T.B, T.A, Dp), angle(Dp, T.A, T.C)) || !near(dist(T.B, Dp) / dist(Dp, T.C), dist(T.A, T.B) / dist(T.A, T.C))) return false; } return true; },
    'tri-33': () => { for (let i = 0; i < 3000; i++) { const { A, B, C } = randTri(), G = centroid(A, B, C); for (const [P, Q, R] of [[A, B, C], [B, C, A], [C, A, B]]) { const M = mid(Q, R); if (!near(dist(P, G), 2 * dist(G, M)) || Math.abs(area(P, G, M)) > 1e-9) return false; } } return true; },
    'tri-34': () => { for (let i = 0; i < 2000; i++) { const C = [0, 0], A = [rreal(0.5, 9), 0], B = [0, rreal(0.5, 9)], H = foot(C, A, B); if (!near(dist(C, H) ** 2, dist(A, H) * dist(H, B))) return false; } return true; },
    'tri-35': () => { for (let i = 0; i < 5000; i++) { const T = randTri(), s = sides(T), P = s.a + s.b + s.c, m = dist(T.A, mid(T.B, T.C)) + dist(T.B, mid(T.A, T.C)) + dist(T.C, mid(T.A, T.B)); if (!(m < P && m > 0.75 * P)) return false; } return true; },
    'tri-37': () => { for (let i = 0; i < 3000; i++) { const T = randTri(); const { A, B, C } = T; if ([angle(B, A, C), angle(A, B, C), angle(A, C, B)].some(x => x >= 89)) continue; const A1 = foot(A, B, C), B1 = foot(B, A, C), k = Math.cos(angle(A, C, B) * D); if (!near(dist(A1, B1), k * dist(A, B)) || !near(dist(C, A1), k * dist(C, A)) || !near(dist(C, B1), k * dist(C, B))) return false; } return true; },
    'tri-38': () => { for (let i = 0; i < 3000; i++) { const Cd = rreal(2, 58), { A, B, C } = byAngles(180 - 3 * Cd, 2 * Cd, rreal(0.5, 5)), s = sides({ A, B, C }); if (!near(s.b * s.b, s.c * s.c + s.a * s.c)) return false; } return true; },
    'tri-39': () => { const A = [0, 0], B = [1, 0], C = [Math.cos(20 * D), Math.sin(20 * D)], Dp = mulv(C, dist(B, C)); return near(angle(A, B, Dp), 10, 1e-9) && near(angle(B, Dp, C), 30, 1e-9) && near(angle(A, Dp, B), 150, 1e-9); },
    'tri-40': () => {
      const lb = (b, c, Ad) => 2 * b * c * Math.cos(Ad * D / 2) / (b + c); // биссектриса из вершины с углом Ad между сторонами b и c
      for (let i = 0; i < 20000; i++) { const T = randTri(), s = sides(T), la = lb(s.b, s.c, angle(T.B, T.A, T.C)), lbB = lb(s.a, s.c, angle(T.A, T.B, T.C)); if (!near(la, dist(T.A, bisFoot(T.A, T.B, T.C)))) return false; if (s.a > s.b + 1e-9 && !(la < lbB)) return false; }
      return true;
    }
  },
  lessons: {
    'tri l1 third side 2 and 5': () => { const s = []; for (let c = 1; c < 20; c++) if (2 + 5 > c && 2 + c > 5) s.push(c); return s.join() === '4,5,6'; },
    'tri l1 exterior angle': () => { for (let i = 0; i < 500; i++) { const T = randTri(), ext = 180 - angle(T.A, T.C, T.B); if (!near(ext, angle(T.B, T.A, T.C) + angle(T.A, T.B, T.C))) return false; } return true; },
    'tri l4 BIC = 90 + A/2': () => { for (let i = 0; i < 2000; i++) { const T = randTri(), I = incenter(T.A, T.B, T.C); if (!near(angle(T.B, I, T.C), 90 + angle(T.B, T.A, T.C) / 2)) return false; } return true; },
    'tri l4 medians six equal areas': () => { for (let i = 0; i < 500; i++) { const { A, B, C } = randTri(), G = centroid(A, B, C), S = area(A, B, C); if (![[A, mid(A, B)], [B, mid(A, B)], [B, mid(B, C)], [C, mid(B, C)], [C, mid(A, C)], [A, mid(A, C)]].every(([P, M]) => near(area(P, M, G), S / 6))) return false; } return true; },
    'tri l5 triples and right triangle facts': () => [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]].every(([a, b, c]) => a * a + b * b === c * c) &&
      (() => { const C = [0, 0], A = [3, 0], B = [0, 4], H = foot(C, A, B), I = incenter(A, B, C); return near(dist(C, H), 12 / 5) && near(dist(A, H) * dist(A, B), 9) && near(I[0], 1) && near(I[1], 1); })(),
    'tri l3 parallel line 3:2': () => { const { A, B, C } = randTri(), M = addv(B, mulv(sub(A, B), 0.6)), N = addv(B, mulv(sub(C, B), 0.6)); return near(dist(M, N) / dist(A, C), 0.6) && near(area(M, B, N) / area(A, B, C), 0.36); },
    'tri l6 isosceles median is altitude': () => { for (let i = 0; i < 500; i++) { const h = rreal(0.3, 9), w = rreal(0.3, 9), A = [0, h], B = [-w, 0], C = [w, 0], M = mid(B, C); if (!near(angle(A, M, B), 90) || !near(angle(B, A, M), angle(M, A, C))) return false; } return true; }
  }
};

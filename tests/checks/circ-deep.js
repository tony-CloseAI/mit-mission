// Проверки глубокого уровня темы «Окружность».
const { near, round6 } = require('./_lib');
const G = require('./_geolib');
const { on, angle, meet, foot, dist, circumcenter, lineCircle, circleCircle, bisect, bySides, byAngles, concyclic, collinear, rng, mid, lineDist, sub, add, mul, dot, cross } = G;
const O0 = [0, 0];
const onlyOne = list => { const u = [...new Set(list.map(round6))]; if (u.length !== 1) throw new Error('неоднозначно: ' + u); return u[0]; };
const pow = (P, O, r) => dot(sub(P, O), sub(P, O)) - r * r;
// радикальная ось двух окружностей: две точки на ней
const radAxis = (O1, r1, O2, r2) => { const d = dist(O1, O2), e = mul(sub(O2, O1), 1 / d), x = (d * d + r1 * r1 - r2 * r2) / (2 * d), M = add(O1, mul(e, x)); return [M, add(M, [-e[1], e[0]])]; };
const randAcute = rnd => { for (;;) { const A = [rnd() * 10, rnd() * 10], B = [rnd() * 10, rnd() * 10], C = [rnd() * 10, rnd() * 10]; if (G.area(A, B, C) > 4 && Math.max(angle(B, A, C), angle(A, B, C), angle(A, C, B)) < 85 && Math.min(angle(B, A, C), angle(A, B, C), angle(A, C, B)) > 15) return { A, B, C }; } };

module.exports = {
  expected: {
    'circ-41': (() => { const [P, Q] = circleCircle(O0, 6, [10, 0], 8); return round6(dist(P, Q)); })(),
    // правильный треугольник, P на дуге BC с PB : PC = 3 : 5, затем масштаб до PB = 3
    'circ-42': (() => { const A = on(O0, 1, 90), B = on(O0, 1, 210), C = on(O0, 1, 330); const t = bisect(a => { const P = on(O0, 1, a); return 5 * dist(P, B) - 3 * dist(P, C); }, 211, 329); const P = on(O0, 1, t), k = 3 / dist(P, B); return round6(dist(P, A) * k); })(),
    'circ-44': (() => {
      const C = [[[0, 0], 2], [[10, 0], 4], [[0, 8], 6]], [a1, b1] = radAxis(C[0][0], C[0][1], C[1][0], C[1][1]), [a2, b2] = radAxis(C[1][0], C[1][1], C[2][0], C[2][1]), X = meet(a1, b1, a2, b2);
      const p = C.map(([O, r]) => pow(X, O, r)); if (!p.every(v => near(v, p[0])) || p[0] <= 0) throw new Error('circ-44'); return round6(Math.sqrt(p[0]));
    })(),
    'circ-46': (() => { const A = [0, 0], B = [1, 0], C = [1, 1], Dd = [0, 1], P = meet(A, on(A, 1, 15), B, add(B, on(O0, 1, 165))); return round6(angle(Dd, P, C)); })(),
    // перебор вписанных четырёхугольников по дугам с шагом 5°: ∠BEC = 30°, ∠DFC = 40° — наибольший угол всегда 125°
    'circ-47': (() => {
      const out = [];
      for (let p = 5; p < 360; p += 5) for (let q = 5; p + q < 360; q += 5) for (let s = 5; p + q + s < 355; s += 5) {
        const A = on(O0, 1, 0), B = on(O0, 1, p), C = on(O0, 1, p + q), Dd = on(O0, 1, p + q + s);
        const E = meet(A, B, Dd, C), F = meet(A, Dd, B, C);
        if (!isFinite(E[0]) || !isFinite(F[0])) continue;
        // E на лучах AB (за B) и DC (за C); F на лучах AD (за D) и BC (за C)
        const beyond = (X, Y, Z) => dot(sub(Z, X), sub(Y, X)) > 0 && dist(X, Z) > dist(X, Y);
        if (!beyond(A, B, E) || !beyond(Dd, C, E) || !beyond(A, Dd, F) || !beyond(B, C, F)) continue;
        if (near(angle(B, E, C), 30, 1e-6) && near(angle(Dd, F, C), 40, 1e-6)) out.push(Math.max(angle(Dd, A, B), angle(A, B, C), angle(B, C, Dd), angle(C, Dd, A)));
      }
      if (!out.length) throw new Error('circ-47 пусто'); return onlyOne(out);
    })(),
    'circ-49': (() => { const rnd = rng(41), vals = []; for (let t = 0; t < 200; t++) { const P = [rnd() * 6 - 3, rnd() * 6 - 3], a = rnd() * 180; if (dot(P, P) > 20) continue; const [A, B] = lineCircle(P, add(P, on(O0, 1, a)), O0, 5), [C, Dd] = lineCircle(P, add(P, on(O0, 1, a + 90)), O0, 5); vals.push([A, B, C, Dd].reduce((s, X) => s + dot(sub(X, P), sub(X, P)), 0)); } return onlyOne(vals); })(),
    // окружность, касающаяся описанной в A и прямой BC: центр на OA, подбираем радиус
    'circ-50': (() => { const { A, B, C } = bySides(10, 6, 9), O = circumcenter(A, B, C), u = mul(sub(O, A), 1 / dist(O, A));
      const s = bisect(s => lineDist(add(A, mul(u, s)), B, C) - s, 1e-6, dist(O, A) * 2 - 1e-6), I = add(A, mul(u, s)), Dd = foot(I, B, C);
      if (!near(angle(B, A, Dd), angle(Dd, A, C), 1e-7)) throw new Error('circ-50'); return round6(dist(A, Dd) ** 2); })(),
    'circ-52': (() => { const B = [0, 0], C = [1, 0], A = [0.5, 0.5 * Math.tan(80 * G.D)], Dd = meet(B, on(B, 1, 60), C, A), E = meet(C, on(C, 1, 130), B, A); return round6(angle(B, Dd, E)); })()
  },
  claims: {
    // три общие хорды попарно пересекающихся окружностей проходят через одну точку
    'circ-43': () => {
      const rnd = rng(43); let n = 0;
      for (let t = 0; t < 3000 && n < 200; t++) {
        const C = [0, 1, 2].map(() => [[rnd() * 6, rnd() * 6], 2 + rnd() * 3]);
        if ([[0, 1], [1, 2], [0, 2]].some(([i, j]) => { const d = dist(C[i][0], C[j][0]); return d >= C[i][1] + C[j][1] - 0.1 || d <= Math.abs(C[i][1] - C[j][1]) + 0.1; })) continue;
        if (G.area(C[0][0], C[1][0], C[2][0]) < 0.5) continue; n++;
        const ch = ([i, j]) => circleCircle(C[i][0], C[i][1], C[j][0], C[j][1]);
        const [a, b] = ch([0, 1]), [c, d] = ch([1, 2]), [e, f] = ch([0, 2]), X = meet(a, b, c, d);
        if (lineDist(X, e, f) > 1e-7) return false;
      }
      return n === 200;
    },
    // проекции коллинеарны ⇔ P на описанной окружности
    'circ-45': () => {
      const rnd = rng(45);
      for (let t = 0; t < 200; t++) {
        const { A, B, C } = randAcute(rnd), O = circumcenter(A, B, C), R = dist(O, A);
        const onC = on(O, R, rnd() * 360), off = on(O, R * (0.6 + rnd() * 0.3), rnd() * 360);
        const ok = P => { const A1 = foot(P, B, C), B1 = foot(P, C, A), C1 = foot(P, A, B); return G.area(A1, B1, C1) < 1e-8 * R * R; };
        if (!ok(onC) || ok(off)) return false;
      }
      return true;
    },
    // теорема Микеля
    'circ-48': () => {
      const rnd = rng(47);
      for (let t = 0; t < 300; t++) {
        const { A, B, C } = randAcute(rnd), A1 = add(B, mul(sub(C, B), 0.15 + 0.7 * rnd())), B1 = add(C, mul(sub(A, C), 0.15 + 0.7 * rnd())), C1 = add(A, mul(sub(B, A), 0.15 + 0.7 * rnd()));
        const O1 = circumcenter(A, B1, C1), O2 = circumcenter(B, C1, A1), [P, Q] = circleCircle(O1, dist(O1, A), O2, dist(O2, B)), M = dist(P, C1) > dist(Q, C1) ? P : Q;
        if (!concyclic(C, A1, B1, M, 1e-6)) return false;
      }
      return true;
    },
    // IMO 1985: строим описанный около полуокружности вписанный четырёхугольник и проверяем AD + BC = AB
    'circ-51': () => {
      const tl = a => { const T = on(O0, 1, a); return [T, add(T, on(O0, 1, a + 90))]; }, xAxis = [[-10, 0], [10, 0]];
      let n = 0;
      for (let a1 = 25; a1 <= 75; a1 += 10) for (let a2 = a1 + 30; a2 <= 125; a2 += 10) {
        const build = a3 => { const [p1, q1] = tl(a1), [p2, q2] = tl(a2), [p3, q3] = tl(a3); return { B: meet(p1, q1, ...xAxis), C: meet(p1, q1, p2, q2), Dd: meet(p2, q2, p3, q3), A: meet(p3, q3, ...xAxis) }; };
        const f = a3 => { const { A, B, C, Dd } = build(a3); const O = circumcenter(A, B, C); return dist(O, Dd) - dist(O, A); };
        let lo = a2 + 5, hi = 175, found = null;
        for (let x = lo; x < hi; x += 1) if (f(x) * f(x + 1) < 0) { found = bisect(f, x, x + 1); break; }
        if (found === null) continue;
        const { A, B, C, Dd } = build(found);
        if (!(A[0] < 0 && B[0] > 0)) continue; n++;
        if (Math.abs(dist(A, Dd) + dist(B, C) - dist(A, B)) > 1e-7) return false;
      }
      return n >= 5;
    },
    // прямая Симсона точки P параллельна AQ
    'circ-53': () => {
      const rnd = rng(53);
      for (let t = 0; t < 300; t++) {
        const { A, B, C } = randAcute(rnd), O = circumcenter(A, B, C), R = dist(O, A), P = on(O, R, rnd() * 360);
        const A1 = foot(P, B, C), B1 = foot(P, C, A); if (dist(P, A1) < 1e-3) continue;
        const Q = lineCircle(P, A1, O, R).find(X => dist(X, P) > 1e-6); if (!Q || dist(Q, A) < 1e-3) continue;
        const u = sub(B1, A1), v = sub(Q, A); if (Math.abs(cross(u, v)) > 1e-7 * Math.hypot(...u) * Math.hypot(...v)) return false;
      }
      return true;
    },
    // теорема о бабочке
    'circ-54': () => {
      const rnd = rng(54);
      for (let t = 0; t < 300; t++) {
        const r = 5, h = rnd() * 4 - 2, P = [-Math.sqrt(r * r - h * h), h], Q = [Math.sqrt(r * r - h * h), h], M = mid(P, Q);
        const a1 = 20 + rnd() * 60, a2 = 100 + rnd() * 60, [B, A] = lineCircle(M, add(M, on(O0, 1, a1)), O0, r), [Dd, C] = lineCircle(M, add(M, on(O0, 1, a2)), O0, r);
        const X = meet(A, Dd, P, Q), Y = meet(B, C, P, Q);
        if (Math.abs(dist(M, X) - dist(M, Y)) > 1e-7) return false;
      }
      return true;
    },
    // IMO 2008: шесть точек на окружности с центром O
    'circ-55': () => {
      const rnd = rng(55);
      for (let t = 0; t < 300; t++) {
        const { A, B, C } = randAcute(rnd), O = circumcenter(A, B, C), H = sub(add(add(A, B), C), mul(O, 2)), pts = [];
        [[B, C], [C, A], [A, B]].forEach(([X, Y]) => { const M = mid(X, Y); pts.push(...lineCircle(X, Y, M, dist(M, H))); });
        const d = pts.map(Z => dist(O, Z)); if (pts.length !== 6 || !d.every(v => Math.abs(v - d[0]) < 1e-7)) return false;
      }
      return true;
    }
  },
  lessons: {
    'circ-l7 examples': () => {
      const [M] = radAxis(O0, 5, [6, 0], 4), rnd = rng(7);
      // середина общей внешней касательной лежит на радикальной оси
      const R = 3, r = 1.5, d = 6, phi = Math.acos((R - r) / d), T1 = on(O0, R, phi / G.D), T2 = on([d, 0], r, phi / G.D), Mt = mid(T1, T2);
      let conc = true; for (let t = 0; t < 50; t++) { const C = [0, 1, 2].map(() => [[rnd() * 8, rnd() * 8], 1 + rnd() * 2]); if (G.area(C[0][0], C[1][0], C[2][0]) < 1) continue; const [a, b] = radAxis(C[0][0], C[0][1], C[1][0], C[1][1]), [c, e] = radAxis(C[1][0], C[1][1], C[2][0], C[2][1]), [f, g] = radAxis(C[0][0], C[0][1], C[2][0], C[2][1]); if (lineDist(meet(a, b, c, e), f, g) > 1e-7) conc = false; }
      return near(M[0], 3.75) && near(pow(Mt, O0, R), pow(Mt, [d, 0], r)) && conc;
    },
    'circ-l8 examples': () => {
      const A = on(O0, 3, 150), B = on(O0, 3, 215), C = on(O0, 3, 330), P = on(O0, 3, 75), A1 = foot(P, B, C), B1 = foot(P, C, A), C1 = foot(P, A, B);
      const X = on(O0, 3, 330); // точка, диаметрально противоположная A: её проекции на AB и AC — сами B и C
      const A2 = on(O0, 3, 150), Bq = on(O0, 3, 230), Cq = on(O0, 3, 20);
      return collinear(A1, B1, C1, 1e-9) && near(dist(foot(X, A2, Bq), Bq), 0) && near(dist(foot(X, A2, Cq), Cq), 0);
    },
    'circ-l9 examples': () => {
      const A = [0, 0], B = on(A, 3, 250), C = on(A, 3, 290), Dd = on(A, 3, 150);
      const { A: a, B: b, C: c } = byAngles(50, 65), O = circumcenter(a, b, c);
      return near(angle(B, A, C), 40) && near(angle(B, Dd, C), 20) && near(dist(O, b), dist(O, c)) && near(angle(b, O, c), 100);
    }
  }
};

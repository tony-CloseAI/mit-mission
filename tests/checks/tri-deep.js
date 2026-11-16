// Проверки глубокого уровня темы «Треугольники». Всё строится в координатах независимо от формул урока:
// ортоцентр — пересечение высот, центр вписанной окружности — пересечение биссектрис и т. д.
const { rreal, near, round6 } = require('./_lib');

const D = Math.PI / 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]), mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const unit = a => { const l = Math.hypot(a[0], a[1]); return [a[0] / l, a[1] / l]; };
const perp = a => [-a[1], a[0]];
const angle = (P, V, Q) => { const u = sub(P, V), w = sub(Q, V); return Math.acos(Math.max(-1, Math.min(1, dot(u, w) / (Math.hypot(...u) * Math.hypot(...w))))) / D; };
const area = (A, B, C) => Math.abs(cross(sub(B, A), sub(C, A))) / 2;
// пересечение прямых P + s·u и Q + t·v
const meet = (P, u, Q, v) => { const t = cross(sub(Q, P), v) / cross(u, v); return add(P, mul(u, t)); };
const foot = (P, A, B) => { const d = sub(B, A); return add(A, mul(d, dot(sub(P, A), d) / dot(d, d))); };
const reflect = (P, A, B) => sub(mul(foot(P, A, B), 2), P);
const distLine = (P, A, B) => dist(P, foot(P, A, B));
const circum = (A, B, C) => meet(mid(A, B), perp(sub(B, A)), mid(A, C), perp(sub(C, A)));
const orth = (A, B, C) => meet(A, perp(sub(C, B)), B, perp(sub(C, A)));
const centroid = (A, B, C) => [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
const bisDir = (V, P, Q) => add(unit(sub(P, V)), unit(sub(Q, V)));
const extDir = (V, P, Q) => sub(unit(sub(P, V)), unit(sub(Q, V)));
const incenter = (A, B, C) => meet(A, bisDir(A, B, C), B, bisDir(B, A, C));
const excenterA = (A, B, C) => meet(B, extDir(B, A, C), C, extDir(C, A, B));
// вторая точка пересечения прямой из P (P на окружности с центром O) в направлении Q
const second = (P, Q, O) => { const e = unit(sub(Q, P)); return add(P, mul(e, 2 * dot(sub(O, P), e))); };
const ninePointCenter = (A, B, C) => circum(mid(B, C), mid(C, A), mid(A, B));
// прямая, изогональная AP: отражаем точку P относительно биссектрисы угла A
const isoLine = (A, B, C, P) => sub(reflect(P, A, add(A, bisDir(A, B, C))), A);
const isoConj = (A, B, C, P) => meet(A, isoLine(A, B, C, P), B, isoLine(B, C, A, P));

const randTri = () => { for (;;) { const A = [rreal(-5, 5), rreal(-5, 5)], B = [rreal(-5, 5), rreal(-5, 5)], C = [rreal(-5, 5), rreal(-5, 5)]; if (area(A, B, C) > 2 && Math.min(angle(B, A, C), angle(A, B, C), angle(A, C, B)) > 8) return { A, B, C }; } };
const isAcute = ({ A, B, C }) => Math.max(angle(B, A, C), angle(A, B, C), angle(A, C, B)) < 88;
const randAcute = () => { for (;;) { const T = randTri(); if (isAcute(T)) return T; } };
// треугольник по углам при B и C (в градусах): B = (0; 0), C = (1; 0)
const byBC = (Bd, Cd) => { const B = [0, 0], C = [1, 0]; return { A: meet(B, [Math.cos(Bd * D), Math.sin(Bd * D)], C, [-Math.cos(Cd * D), Math.sin(Cd * D)]), B, C }; };
const bySides = (a, b, c) => { const B = [0, 0], C = [a, 0], x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B, C }; };
// одно и то же значение на многих случайных треугольниках
const constant = (f, n = 300, gen = randTri) => { const v0 = f(gen()); for (let i = 0; i < n; i++) if (!near(f(gen()), v0, 1e-6)) throw new Error('не постоянно'); return round6(v0); };
const forAll = (n, gen, f) => { for (let i = 0; i < n; i++) if (!f(gen())) return false; return true; };

module.exports = {
  expected: {
    'tri-41': constant(({ A, B, C }) => { const O = circum(A, B, C); return 7 * dist(A, orth(A, B, C)) / distLine(O, B, C); }),
    'tri-42': constant(({ A, B, C }) => { const O = circum(A, B, C), H = orth(A, B, C); return 12 * dist(centroid(A, B, C), ninePointCenter(A, B, C)) / dist(O, H); }),
    'tri-43': (() => { const { A, B, C } = byBC(75, 45); return round6(angle(foot(A, B, C), A, circum(A, B, C))); })(),
    // ∠A = 120°: углы B и C в сумме 60°
    'tri-44': constant(({ A, B, C }) => { if (!near(angle(B, A, C), 120, 1e-9)) throw new Error('tri-44'); return 7 * dist(incenter(A, B, C), excenterA(A, B, C)) / dist(B, C); }, 100, () => { const b = rreal(5, 55); return byBC(b, 60 - b); }),
    'tri-45': (() => { const { A, B, C } = bySides(14, 15, 13), F1 = foot(A, B, C), F2 = foot(B, C, A), F3 = foot(C, A, B), N = circum(F1, F2, F3); return round6(dist(N, F1)); })(),
    'tri-53': (() => {
      const C = [0, 0], B = [3, 0], A = [0, 4];
      const K = meet(A, isoLine(A, B, C, mid(B, C)), B, isoLine(B, C, A, mid(A, C)));
      if (!near(cross(isoLine(C, A, B, mid(A, B)), sub(K, C)), 0, 1e-9)) throw new Error('tri-53: симедианы не пересеклись');
      return round6(distLine(K, A, B));
    })()
  },
  claims: {
    'tri-46': () => forAll(3000, randTri, ({ A, B, C }) => {
      if (Math.abs(dist(A, B) - dist(A, C)) < 0.05) return true;
      const I = incenter(A, B, C), W = circum(B, I, C), O = circum(A, B, C);
      if (!near(dist(O, W), dist(O, A), 1e-6) || Math.abs(cross(sub(I, A), sub(W, A))) > 1e-6 * dist(A, W) ** 2) return false;
      const e = unit(sub(A, B)), P = add(B, mul(e, -2 * dot(sub(B, W), e))); // вторая точка прямой AB на окружности BIC
      return near(dist(A, P), dist(A, C), 1e-6);
    }),
    'tri-47': () => {
      const B = [-1, 0], C = [1, 0];
      const cr = A => cross(sub(centroid(A, B, C), A), sub(circum(A, B, C), A));
      for (let i = 0; i < 3000; i++) {
        const A = [rreal(-4, 4), rreal(0.2, 4)], O = circum(A, B, C);
        if (!near(cr(A), -2 / 3 * A[0] * O[1], 1e-6)) return false; // ноль ровно при x = 0 (AB = AC) или O на BC (∠A = 90°)
        if (!near(O[1], 0, 1e-9) !== !near(angle(B, A, C), 90, 1e-9)) return false;
        const t = rreal(0.2, 3), R = [Math.cos(t), Math.sin(t)];
        if (Math.abs(cr([0, A[1]])) > 1e-9 || Math.abs(cr(R)) > 1e-9) return false;
      }
      return true;
    },
    'tri-48': () => forAll(3000, randTri, ({ A, B, C }) => {
      const O = circum(A, B, C), R = dist(O, A), H = orth(A, B, C), t = rreal(0, 2 * Math.PI), P = add(O, [R * Math.cos(t), R * Math.sin(t)]);
      return near(dist(ninePointCenter(A, B, C), mid(H, P)), R / 2, 1e-6);
    }),
    'tri-49': () => forAll(2000, () => { const b = rreal(31, 89); return byBC(b, 120 - b); }, ({ A, B, C }) => {
      if (!near(angle(B, A, C), 60, 1e-9)) return false;
      const O = circum(A, B, C), H = orth(A, B, C), I = incenter(A, B, C), Z = circum(B, C, I), r = dist(Z, B), W = second(A, I, O);
      return near(dist(Z, O), r, 1e-6) && near(dist(Z, H), r, 1e-6) && near(dist(Z, W), 0, 1e-6);
    }),
    'tri-50': () => forAll(3000, randAcute, ({ A, B, C }) => {
      const O = circum(A, B, C), R = dist(O, A), H = orth(A, B, C), H1 = reflect(H, B, C), H2 = sub(mul(mid(B, C), 2), H);
      return near(dist(O, H1), R, 1e-6) && near(dist(O, H2), R, 1e-6) && near(dist(H2, sub(mul(O, 2), A)), 0, 1e-6);
    }),
    'tri-51': () => forAll(3000, randTri, ({ A, B, C }) => {
      const Dp = meet(A, isoLine(A, B, C, mid(B, C)), B, sub(C, B));
      return near(dist(B, Dp) / dist(Dp, C), (dist(A, B) / dist(A, C)) ** 2, 1e-6) && near(dist(B, Dp) + dist(Dp, C), dist(B, C), 1e-6);
    }),
    'tri-52': () => forAll(3000, randAcute, ({ A, B, C }) => {
      const A1 = foot(A, B, C), B1 = foot(B, C, A), C1 = foot(C, A, B);
      return near(dist(incenter(A1, B1, C1), orth(A, B, C)), 0, 1e-6);
    }),
    'tri-54': () => forAll(2000, randTri, ({ A, B, C }) => {
      const u = rreal(0.1, 1), v = rreal(0.1, 1), w = rreal(0.1, 1), P = mul(add(add(mul(A, u), mul(B, v)), mul(C, w)), 1 / (u + v + w));
      const Q = isoConj(A, B, C, P);
      if (Math.abs(cross(isoLine(C, A, B, P), sub(Q, C))) > 1e-6 * (1 + dist(Q, C))) return false; // третья изогональная проходит через Q
      const M = mid(P, Q), ds = [[B, C], [C, A], [A, B]].flatMap(([X, Y]) => [dist(M, foot(P, X, Y)), dist(M, foot(Q, X, Y))]);
      return ds.every(d => near(d, ds[0], 1e-6));
    }),
    'tri-55': () => {
      for (let i = 0; i < 3000; i++) {
        const b = rreal(0.52, 1.48), c = 2 - b; if (Math.abs(b - c) < 0.01) continue;
        const { A, B, C } = bySides(1, b, c), I = incenter(A, B, C), O = circum(A, B, C), W = second(A, I, O);
        if (!near(dot(sub(O, I), unit(sub(A, I))), 0, 1e-6) || !near(dist(A, I), dist(I, W), 1e-6)) return false;
      }
      return true;
    }
  },
  lessons: {
    'tri-deep l7 AH = 2·OA1 как векторы': () => forAll(2000, randTri, ({ A, B, C }) => { const v = sub(orth(A, B, C), A), w = mul(sub(mid(B, C), circum(A, B, C)), 2); return near(v[0], w[0]) && near(v[1], w[1]); }),
    'tri-deep l7 прямая Эйлера, HG = 2·GO': () => forAll(2000, randTri, ({ A, B, C }) => { const O = circum(A, B, C), H = orth(A, B, C), G = centroid(A, B, C); return near(dist(H, G), 2 * dist(G, O)) && near(dist(H, G) + dist(G, O), dist(H, O)); }),
    'tri-deep l7 девять точек на окружности (N, R/2)': () => forAll(2000, randTri, ({ A, B, C }) => {
      const O = circum(A, B, C), H = orth(A, B, C), N = mid(O, H), r = dist(O, A) / 2;
      const nine = [mid(B, C), mid(C, A), mid(A, B), foot(A, B, C), foot(B, C, A), foot(C, A, B), mid(A, H), mid(B, H), mid(C, H)];
      return nine.every(X => near(dist(N, X), r));
    }),
    'tri-deep l7 пример 6-8-10': () => { const C = [0, 0], A = [6, 0], B = [0, 8], O = circum(A, B, C), H = orth(A, B, C), G = centroid(A, B, C); return near(dist(H, C), 0) && near(dist(C, O), 5) && near(dist(C, G), 10 / 3) && near(dist(A, B), 10); },
    'tri-deep l8 трезубец WB = WC = WI = WIa': () => forAll(2000, randTri, ({ A, B, C }) => {
      const O = circum(A, B, C), I = incenter(A, B, C), W = second(A, I, O), Ia = excenterA(A, B, C), r = dist(W, B);
      return near(dist(W, C), r) && near(dist(W, I), r) && near(dist(W, Ia), r) && near(dist(mid(I, Ia), W), 0, 1e-6);
    }),
    'tri-deep l8 пример: прямой угол, BC = 10': () => { const A = [0, 0], B = [rreal(2, 9), 0]; const C = [0, Math.sqrt(100 - B[0] * B[0])]; const O = circum(A, B, C), W = second(A, incenter(A, B, C), O); return near(dist(W, incenter(A, B, C)), 5 * Math.SQRT2); },
    'tri-deep l9 высота и AO изогональны': () => forAll(2000, randAcute, ({ A, B, C }) => near(angle(B, A, foot(A, B, C)), angle(circum(A, B, C), A, C)) && near(angle(B, A, foot(A, B, C)), 90 - angle(A, B, C))),
    'tri-deep l9 сопряжённая точка — центр окружности через отражения': () => forAll(2000, randTri, ({ A, B, C }) => {
      const P = add(centroid(A, B, C), [rreal(-0.5, 0.5), rreal(-0.5, 0.5)]), Z = circum(reflect(P, B, C), reflect(P, C, A), reflect(P, A, B));
      return near(dist(Z, isoConj(A, B, C, P)), 0, 1e-6);
    }),
    'tri-deep l9 пары: I↔I, H↔O, G↔K': () => forAll(1000, randAcute, ({ A, B, C }) => {
      const a = dist(B, C), b = dist(C, A), c = dist(A, B), s = a * a + b * b + c * c, K = mul(add(add(mul(A, a * a), mul(B, b * b)), mul(C, c * c)), 1 / s);
      const I = incenter(A, B, C);
      return near(dist(isoConj(A, B, C, I), I), 0, 1e-6) && near(dist(isoConj(A, B, C, orth(A, B, C)), circum(A, B, C)), 0, 1e-6) && near(dist(isoConj(A, B, C, centroid(A, B, C)), K), 0, 1e-6);
    }),
    'tri-deep l9 произведения расстояний равны': () => forAll(2000, randTri, ({ A, B, C }) => {
      const P = add(centroid(A, B, C), [rreal(-0.5, 0.5), rreal(-0.5, 0.5)]), Q = isoConj(A, B, C, P), pr = [[B, C], [C, A], [A, B]].map(([X, Y]) => distLine(P, X, Y) * distLine(Q, X, Y));
      return near(pr[0], pr[1], 1e-6) && near(pr[1], pr[2], 1e-6);
    })
  }
};

// Геометрия в координатах для проверок темы «Окружность».
const D = Math.PI / 180;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]], add = (a, b) => [a[0] + b[0], a[1] + b[1]], mul = (a, k) => [a[0] * k, a[1] * k];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1], cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const on = (c, r, deg) => [c[0] + r * Math.cos(deg * D), c[1] + r * Math.sin(deg * D)];
// угол AVB в градусах
const angle = (A, V, B) => { const u = sub(A, V), w = sub(B, V); return Math.acos(Math.max(-1, Math.min(1, dot(u, w) / (Math.hypot(...u) * Math.hypot(...w))))) / D; };
// пересечение прямых PQ и ST
const meet = (P, Q, S, T) => { const u = sub(Q, P), v = sub(T, S), d = cross(u, v); const t = cross(sub(S, P), v) / d; return add(P, mul(u, t)); };
const foot = (P, A, B) => { const d = sub(B, A), t = dot(sub(P, A), d) / dot(d, d); return add(A, mul(d, t)); };
const lineDist = (P, A, B) => dist(P, foot(P, A, B));
const circumcenter = (A, B, C) => {
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const a2 = dot(A, A), b2 = dot(B, B), c2 = dot(C, C);
  return [(a2 * (B[1] - C[1]) + b2 * (C[1] - A[1]) + c2 * (A[1] - B[1])) / d, (a2 * (C[0] - B[0]) + b2 * (A[0] - C[0]) + c2 * (B[0] - A[0])) / d];
};
const incenter = (A, B, C) => { const a = dist(B, C), b = dist(C, A), c = dist(A, B), s = a + b + c; return [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s]; };
const concyclic = (A, B, C, P, eps = 1e-7) => { const O = circumcenter(A, B, C); return Math.abs(dist(O, P) - dist(O, A)) < eps * Math.max(1, dist(O, A)); };
// точки пересечения прямой P + t(Q − P) с окружностью (O, r), по возрастанию t
const lineCircle = (P, Q, O, r) => {
  const d = sub(Q, P), f = sub(P, O), a = dot(d, d), b = 2 * dot(f, d), c = dot(f, f) - r * r, disc = b * b - 4 * a * c;
  if (disc < 0) return [];
  const s = Math.sqrt(disc); return [(-b - s) / (2 * a), (-b + s) / (2 * a)].map(t => add(P, mul(d, t)));
};
const circleCircle = (O1, r1, O2, r2) => {
  const d = dist(O1, O2), x = (d * d + r1 * r1 - r2 * r2) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - x * x));
  const e = mul(sub(O2, O1), 1 / d), n = [-e[1], e[0]], M = add(O1, mul(e, x));
  return [add(M, mul(n, h)), sub(M, mul(n, h))];
};
// точка касания касательной из P к окружности (O, r); sgn = ±1 выбирает одну из двух
const tangentPt = (P, O, r, sgn) => { const d = sub(P, O), L = Math.hypot(...d), a = Math.acos(r / L), b = Math.atan2(d[1], d[0]) + sgn * a; return on(O, r, b / D); };
const bisect = (f, lo, hi) => { let flo = f(lo); for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2, fm = f(m); if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };
const bySides = (a, b, c) => { const B = [0, 0], C = [a, 0], x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B, C }; };
const byAngles = (Ad, Bd, c = 1) => { const A = [0, 0], B = [c, 0], b = c * Math.sin(Bd * D) / Math.sin((180 - Ad - Bd) * D); return { A, B, C: [b * Math.cos(Ad * D), b * Math.sin(Ad * D)] }; };
const area = (A, B, C) => Math.abs(cross(sub(B, A), sub(C, A))) / 2;
const collinear = (A, B, C, eps = 1e-7) => area(A, B, C) < eps * Math.max(1, dist(A, B) * dist(A, C));
const rng = seed => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

module.exports = { D, sub, add, mul, dot, cross, dist, mid, on, angle, meet, foot, lineDist, circumcenter, incenter, concyclic, lineCircle, circleCircle, tangentPt, bisect, bySides, byAngles, area, collinear, rng };

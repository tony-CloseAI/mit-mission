// Многочлены для проверок: точная арифметика с рациональными коэффициентами (BigInt)
// и численный поиск всех комплексных корней (метод Дюрана — Кернера).
// Многочлен — массив коэффициентов от младшего к старшему: [a0, a1, …, an].

const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const Q = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return [n / g, d / g]; };
const qadd = (a, b) => Q(a[0] * b[1] + b[0] * a[1], a[1] * b[1]), qsub = (a, b) => Q(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
const qmul = (a, b) => Q(a[0] * b[0], a[1] * b[1]), qdiv = (a, b) => Q(a[0] * b[1], a[1] * b[0]);
const qzero = a => a[0] === 0n, qstr = a => a[1] === 1n ? String(a[0]) : a[0] + '/' + a[1];

const P = coeffs => trim(coeffs.map(c => Array.isArray(c) ? c : Q(c)));
function trim(p) { const r = p.slice(); while (r.length > 1 && qzero(r[r.length - 1])) r.pop(); return r; }
const deg = p => (p.length === 1 && qzero(p[0])) ? -Infinity : p.length - 1;
const add = (p, q) => trim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => qadd(p[i] || Q(0), q[i] || Q(0))));
const sub = (p, q) => trim(Array.from({ length: Math.max(p.length, q.length) }, (_, i) => qsub(p[i] || Q(0), q[i] || Q(0))));
const mul = (p, q) => { const r = Array.from({ length: p.length + q.length - 1 }, () => Q(0)); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] = qadd(r[i + j], qmul(a, b)); })); return trim(r); };
const pow = (p, k) => { let r = P([1]); for (let i = 0; i < k; i++) r = mul(r, p); return r; };
// деление с остатком
function divmod(p, d) {
  let r = p.slice(); const q = Array.from({ length: Math.max(1, p.length - d.length + 1) }, () => Q(0)), dl = d[d.length - 1];
  while (deg(r) >= deg(d)) { const k = deg(r) - deg(d), c = qdiv(r[r.length - 1], dl); q[k] = c; r = sub(r, mul(P([...Array(k).fill(0), 1]).map((x, i) => i === k ? c : x), d)); }
  return [trim(q), r];
}
const evalq = (p, x) => { x = Array.isArray(x) ? x : Q(x); let s = Q(0); for (let i = p.length - 1; i >= 0; i--) s = qadd(qmul(s, x), p[i]); return s; };
const compose = (p, q) => { let r = P([0]); for (let i = p.length - 1; i >= 0; i--) r = add(mul(r, q), [p[i]]); return r; };
const fromRoots = roots => roots.reduce((acc, r) => mul(acc, P([Array.isArray(r) ? Q(-r[0], r[1]) : -r, 1])), P([1]));
// интерполяция Лагранжа по точкам [[x, y], …] (рациональные)
function lagrange(pts) {
  let res = P([0]);
  pts.forEach(([xi, yi], i) => { let term = P([yi]); pts.forEach(([xj], j) => { if (j !== i) term = mul(term, P([qdiv(Q(-BigInt(xj)), qsub(Q(xi), Q(xj))), qdiv(Q(1), qsub(Q(xi), Q(xj)))])); }); res = add(res, term); });
  return res;
}

// численные корни (комплексные), коэффициенты — числа
function roots(pnum) {
  const n = pnum.length - 1, lead = pnum[n], a = pnum.map(c => c / lead);
  const f = z => { let re = 0, im = 0; for (let i = n; i >= 0; i--) { const nr = re * z[0] - im * z[1] + a[i], ni = re * z[1] + im * z[0]; re = nr; im = ni; } return [re, im]; };
  let z = Array.from({ length: n }, (_, k) => { const t = 0.4 + 0.9 * k; return [Math.cos(t) * (1 + k * 0.1), Math.sin(t) * (1 + k * 0.1)]; });
  for (let it = 0; it < 2000; it++) {
    let moved = 0;
    z = z.map((zi, i) => { let den = [1, 0]; z.forEach((zj, j) => { if (j !== i) { const d = [zi[0] - zj[0], zi[1] - zj[1]]; den = [den[0] * d[0] - den[1] * d[1], den[0] * d[1] + den[1] * d[0]]; } });
      const fv = f(zi), m = den[0] ** 2 + den[1] ** 2, q = [(fv[0] * den[0] + fv[1] * den[1]) / m, (fv[1] * den[0] - fv[0] * den[1]) / m]; moved = Math.max(moved, Math.hypot(...q)); return [zi[0] - q[0], zi[1] - q[1]]; });
    if (moved < 1e-15) break;
  }
  return z;
}
const cpow = (z, k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = [r[0] * z[0] - r[1] * z[1], r[0] * z[1] + r[1] * z[0]]; return r; };
const powerSum = (pnum, k) => roots(pnum).reduce((s, z) => s + cpow(z, k)[0], 0);
const realRoots = (pnum, eps = 1e-7) => roots(pnum).filter(z => Math.abs(z[1]) < eps).map(z => z[0]).sort((a, b) => a - b);
const toNum = p => p.map(c => Number(c[0]) / Number(c[1]));

module.exports = { Q, qadd, qsub, qmul, qdiv, qstr, qzero, P, deg, add, sub, mul, pow, divmod, evalq, compose, fromRoots, lagrange, roots, powerSum, realRoots, toNum, cpow };

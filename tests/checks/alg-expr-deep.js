// Проверки глубокого уровня темы «Выражения и тождества».
const { rint, rreal, near, round6, identityBig } = require('./_lib');

const gcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
// Несократимая дробь [p, q] и запись 'p/q'
const red = (p, q) => { if (q < 0n) { p = -p; q = -q; } const g = gcdB(p, q); return [p / g, q / g]; };
const fracStr = ([p, q]) => (q === 1n ? String(p) : p + '/' + q);
const add = ([a, b], [c, d]) => red(a * d + c * b, b * d);
const mul = ([a, b], [c, d]) => red(a * c, b * d);

// Многочлен — массив коэффициентов по возрастанию степени. Остаток от деления на приведённый делитель.
function polyRem(P, D) {
  const r = P.map(BigInt), d = D.map(BigInt), m = d.length - 1;
  if (d[m] !== 1n) throw new Error('делитель должен быть приведённым');
  for (let k = r.length - 1; k >= m; k--) { const c = r[k]; if (c === 0n) continue; for (let j = 0; j <= m; j++) r[k - m + j] -= c * d[j]; }
  return r.slice(0, m);
}
const isZero = r => r.every(c => c === 0n);
const sparse = terms => { const deg = Math.max(...terms.map(t => t[0])); const P = Array(deg + 1).fill(0); terms.forEach(([e, c]) => { P[e] += c; }); return P; };
const X2X1 = [1, 1, 1]; // x^2 + x + 1

// Комплексные корни приведённого многочлена степени 3 методом Дюрана — Кернера
function cubicRoots(c2, c1, c0) { // t^3 + c2 t^2 + c1 t + c0
  const f = ([x, y]) => { // значение в точке x + iy
    const mulC = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
    let r = [1, 0]; r = mulC(r, [x, y]); r = [r[0] + c2, r[1]]; r = mulC(r, [x, y]); r = [r[0] + c1, r[1]]; r = mulC(r, [x, y]); return [r[0] + c0, r[1]];
  };
  let z = [[0.4, 0.9], [-0.65, 0.72], [0.1, -1.3]];
  const sub = ([a, b], [c, d]) => [a - c, b - d], mulC = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
  const div = ([a, b], [c, d]) => { const n = c * c + d * d; return [(a * c + b * d) / n, (b * c - a * d) / n]; };
  for (let it = 0; it < 500; it++) z = z.map((zi, i) => { let den = [1, 0]; z.forEach((zj, j) => { if (j !== i) den = mulC(den, sub(zi, zj)); }); return sub(zi, div(f(zi), den)); });
  return z;
}
const cpow = ([a, b], k) => { let r = [1, 0]; for (let i = 0; i < k; i++) r = [r[0] * a - r[1] * b, r[0] * b + r[1] * a]; return r; };

module.exports = {
  expected: {
    'expr-41': (() => { let s = 0; for (let k = 1; k <= 99; k++) s += 1 / (Math.sqrt(k) + Math.sqrt(k + 1)); return round6(s); })(),
    'expr-42': (() => { let P = [1n, 1n]; for (let k = 2n; k <= 100n; k++) P = mul(P, [k * k - 1n, k * k]); return fracStr(P); })(),
    'expr-43': (() => { const x = (1 + Math.sqrt(5)) / 2, y = (1 - Math.sqrt(5)) / 2; if (!near(x + y, 1) || !near(x * y, -1)) throw new Error('expr-43'); return round6(x ** 7 + y ** 7); })(),
    'expr-44': (() => {
      // e1, e2, e3 из определений (без формул Ньютона), корни — численно; проверяем, что корни дают p1, p2, p3
      const p1 = 1, p2 = 2, p3 = 3, e1 = p1, e2 = (p1 * p1 - p2) / 2, e3 = (p3 - p1 * (p2 - e2)) / 3;
      const z = cubicRoots(-e1, e2, -e3), ps = k => z.reduce((s, w) => { const q = cpow(w, k); return [s[0] + q[0], s[1] + q[1]]; }, [0, 0]);
      [[1, p1], [2, p2], [3, p3]].forEach(([k, v]) => { const s = ps(k); if (!near(s[0], v, 1e-9) || Math.abs(s[1]) > 1e-9) throw new Error('expr-44 корни'); });
      const p4 = ps(4); if (Math.abs(p4[1]) > 1e-9 || !near(p4[0], 25 / 6, 1e-9)) throw new Error('expr-44 p4 = ' + p4);
      return '25/6';
    })(),
    'expr-47': (() => { let S = [0n, 1n]; for (let k = 1n; k <= 10n; k++) S = add(S, [k, k ** 4n + k * k + 1n]); return fracStr(S); })(),
    'expr-48': (() => { let s = 0; for (let k = 1; k <= 99; k++) s += Math.sqrt(1 + 1 / (k * k) + 1 / ((k + 1) * (k + 1))); return round6(s); })()
  },
  choice: {
    'expr-45': () => {
      const opts = [[[2026, 1], [2025, 1], [0, 1]], [[2027, 1], [2026, 1], [0, 1]], [[2028, 1], [2026, 1], [0, 1]], [[2027, 1], [2024, 1], [0, 1]]];
      const hits = opts.map((t, i) => (isZero(polyRem(sparse(t), X2X1)) ? i : -1)).filter(i => i >= 0);
      if (hits.length !== 1) throw new Error('expr-45: ' + hits); return hits[0];
    },
    'expr-46': () => {
      const P = sparse([[5, 1], [1, 1], [0, 1]]);
      const divs = [[1, 0, 1], [1, 1, 1], [1, -1, 1], [1, 1]];
      const hits = divs.map((d, i) => (isZero(polyRem(P, d)) ? i : -1)).filter(i => i >= 0);
      if (hits.length !== 1) throw new Error('expr-46: ' + hits); return hits[0];
    }
  },
  claims: {
    'expr-49': () => {
      for (let i = 0; i < 20000; i++) { const a = rreal(-5, 5), b = rreal(-5, 5), c = rreal(-5, 5); if (a ** 4 + b ** 4 + c ** 4 - a * b * c * (a + b + c) < -1e-9) return false; }
      return identityBig((x, y, z) => 2n * (x * x + y * y + z * z - x * y - y * z - z * x), (x, y, z) => (x - y) ** 2n + (y - z) ** 2n + (z - x) ** 2n, 3) &&
        identityBig((a, b, c) => a * b * (b * c) + b * c * (c * a) + c * a * (a * b), (a, b, c) => a * b * c * (a + b + c), 3);
    },
    'expr-50': () => identityBig((a, b, c, d) => 4n * (a * a + b * b + c * c + d * d - a * (b + c + d)), (a, b, c, d) => (2n * b - a) ** 2n + (2n * c - a) ** 2n + (2n * d - a) ** 2n + a * a, 4),
    'expr-51': () => identityBig((a, b, c, x, y, z) => (a * a + b * b + c * c) * (x * x + y * y + z * z) - (a * x + b * y + c * z) ** 2n,
      (a, b, c, x, y, z) => (a * y - b * x) ** 2n + (b * z - c * y) ** 2n + (c * x - a * z) ** 2n, 6),
    'expr-52': () => {
      for (let i = 0; i < 2000; i++) {
        const a = BigInt(rint(-60, 60)), b = BigInt(rint(-60, 60)), c = -a - b, p = k => a ** BigInt(k) + b ** BigInt(k) + c ** BigInt(k);
        if (6n * p(5) !== 5n * p(3) * p(2)) return false;
        const q = a * b + b * c + c * a, r = a * b * c;
        if (p(2) !== -2n * q || p(3) !== 3n * r || p(4) !== 2n * q * q || p(5) !== -5n * q * r) return false;
      }
      return true;
    },
    'expr-53': () => {
      for (let n = 1; n <= 60; n++) if (isZero(polyRem(sparse([[2 * n, 1], [n, 1], [0, 1]]), X2X1)) !== (n % 3 !== 0)) return false;
      for (let n = 1n; n <= 200n; n++) if (((4n ** n + 2n ** n + 1n) % 7n === 0n) !== (n % 3n !== 0n)) return false;
      return true;
    },
    'expr-54': () => {
      let s = 0; for (let k = 1; k <= 100; k++) {
        s += 1 / Math.sqrt(k);
        if (!(2 * (Math.sqrt(k + 1) - Math.sqrt(k)) < 1 / Math.sqrt(k))) return false;
        if (k >= 2 && !(1 / Math.sqrt(k) < 2 * (Math.sqrt(k) - Math.sqrt(k - 1)))) return false;
      }
      return s > 18 && s < 19 && 2 * (Math.sqrt(101) - 1) > 18;
    },
    'expr-55': () => {
      let P = [1n, 1n];
      for (let n = 2n; n <= 60n; n++) {
        P = mul(P, [n ** 3n - 1n, n ** 3n + 1n]);
        const want = red(2n * (n * n + n + 1n), 3n * n * (n + 1n));
        if (P[0] !== want[0] || P[1] !== want[1]) return false;
        if (!(3n * P[0] > 2n * P[1])) return false;
      }
      return true;
    }
  },
  lessons: {
    'expr l6 completing squares': () => identityBig((x, y) => 4n * (x * x + x * y + y * y), (x, y) => (2n * x + y) ** 2n + 3n * y * y, 2) &&
      identityBig((a, b) => a ** 4n + b ** 4n - a ** 3n * b - a * b ** 3n, (a, b) => (a - b) ** 2n * (a * a + a * b + b * b), 2) &&
      identityBig((x, y) => x * x + 2n * y * y + 2n * x * y - 2n * y + 1n, (x, y) => (x + y) ** 2n + (y - 1n) ** 2n, 2),
    'expr l7 power sums': () => {
      const x = 1 + Math.SQRT2, y = 1 - Math.SQRT2, ok2 = [2, 2, 6, 14, 34].every((v, k) => near(x ** k + y ** k, v));
      const r = [2, 1, -1], p = k => r.reduce((s, t) => s + t ** k, 0);
      const ok3 = p(1) === 2 && (2 * 1 + 1 * -1 + -1 * 2) === -1 && 2 * 1 * -1 === -2 && p(2) === 6 && p(3) === 8 && 2 * 6 - (-1) * 2 + 3 * (-2) === 8;
      let ok4 = true;
      for (let i = 0; i < 300; i++) {
        const a = rint(-9, 9), b = rint(-9, 9), c = rint(-9, 9), e1 = a + b + c, e2 = a * b + b * c + c * a, e3 = a * b * c, q = k => a ** k + b ** k + c ** k;
        for (let k = 3; k <= 7; k++) if (q(k) !== e1 * q(k - 1) - e2 * q(k - 2) + e3 * q(k - 3)) ok4 = false;
      }
      return ok2 && ok3 && ok4;
    },
    'expr l8 x^3=1 and telescoping': () => {
      const ok1 = identityBig(x => x ** 8n + x ** 4n + 1n, x => (x * x + x + 1n) * (x * x - x + 1n) * (x ** 4n - x * x + 1n), 1) && 100010001 === 111 * 900991;
      let ok2 = true, S = [0n, 1n];
      for (let n = 1n; n <= 50n; n++) { S = add(S, [1n, n * (n + 1n) * (n + 2n)]); const want = red((n + 1n) * (n + 2n) - 2n, 4n * (n + 1n) * (n + 2n)); if (S[0] !== want[0] || S[1] !== want[1]) ok2 = false; }
      let T = [0n, 1n]; for (let k = 1n; k <= 30n; k++) T = add(T, [1n, k * (k + 1n)]);
      return ok1 && ok2 && T[0] === 30n && T[1] === 31n;
    }
  }
};

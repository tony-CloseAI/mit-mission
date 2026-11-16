// Общие функции для проверок содержания.
const B = BigInt;

const powmod = (a, e, m) => {
  let r = 1n, b = B(a) % B(m), x = B(e); const M = B(m);
  while (x > 0n) { if (x & 1n) r = r * b % M; b = b * b % M; x >>= 1n; }
  return r;
};
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const divisors = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const fact = n => { let r = 1n; for (let i = 2n; i <= B(n); i++) r *= i; return r; };
const vp = (N, p) => { let c = 0; while (N % B(p) === 0n) { N /= B(p); c++; } return c; };
const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

// детерминированный генератор случайных чисел, чтобы проверки были воспроизводимыми
let seed = 12345;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const rint = (lo, hi) => lo + Math.floor(rnd() * (hi - lo + 1));
const rreal = (lo, hi) => lo + rnd() * (hi - lo);
const near = (a, b, eps = 1e-7) => Math.abs(a - b) <= eps * Math.max(1, Math.abs(a), Math.abs(b));
const round6 = v => Math.round(v * 1e6) / 1e6;

// Какой вариант ответа (функция) совпадает с целевым выражением во всех случайных точках.
// Возвращает индекс единственного совпадения или бросает ошибку.
function matchOption(target, options, nvars = 1, trials = 25) {
  const pts = [];
  for (let t = 0; t < trials; t++) pts.push(Array.from({ length: nvars }, () => rint(-9, 9) + rnd() * 0.5));
  const ok = options.map(f => f !== null && pts.every(v => near(f(...v), target(...v), 1e-9)));
  const idx = ok.map((v, i) => v ? i : -1).filter(i => i >= 0);
  if (idx.length !== 1) throw new Error('matchOption: ' + idx.length + ' matching options');
  return idx[0];
}

// Выполнено ли равенство двух выражений в случайных целых точках (BigInt).
function identityBig(lhs, rhs, nvars, trials = 60, lo = -30, hi = 30) {
  for (let t = 0; t < trials; t++) {
    const v = Array.from({ length: nvars }, () => B(rint(lo, hi)));
    if (lhs(...v) !== rhs(...v)) return false;
  }
  return true;
}

module.exports = { B, powmod, gcd, lcm, divisors, isPrime, fact, vp, C, rnd, rint, rreal, near, round6, matchOption, identityBig };

// Проверки глубокого уровня темы «Как доказывать».
const { rreal, near } = require('./_lib');

const gcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const red = (p, q) => { const g = gcdB(p, q); return [p / g, q / g]; };
const add = ([a, b], [c, d]) => red(a * d + c * b, b * d);
const mul = ([a, b], [c, d]) => red(a * c, b * d);
const isqrt = n => { if (n < 2n) return n; let x = n, y = (x + 1n) / 2n; while (y < x) { x = y; y = (x + n / x) / 2n; } return x; };
const isSq = n => { const r = isqrt(n); return r * r === n; };
// Пары x ≤ y ≤ N, для которых f(x, y) истинно
const pairs = (N, f) => { const s = []; for (let x = 1; x <= N; x++) for (let y = x; y <= N; y++) if (f(x, y)) s.push([x, y]); return s; };
const amgm = xs => xs.reduce((s, v) => s + v, 0) / xs.length >= Math.pow(xs.reduce((p, v) => p * v, 1), 1 / xs.length) - 1e-12;

module.exports = {
  expected: {
    'proof-41': (() => { // max abcd при a + b + c + d = 12: перебор по сетке
      let m = 0; const h = 0.05;
      for (let a = h; a < 12; a += h) for (let b = h; a + b < 12; b += h) for (let c = h; a + b + c < 12; c += h) { const d = 12 - a - b - c; if (d > 0) m = Math.max(m, a * b * c * d); }
      if (!near(m, 81, 1e-3)) throw new Error('proof-41 ' + m); return 81;
    })(),
    'proof-42': pairs(1000, (x, y) => x * x + y * y + 2 === 4 * x * y).length,
    'proof-43': (() => { let a = 1; for (let n = 1; n < 100; n++) a += 1 / a; if (a * a < 196.5 || a * a > 224.5) throw new Error('proof-43 ' + a); return Math.floor(a); })(),
    'proof-45': (() => {
      let m = 0; const h = 0.004;
      for (let a = h; a < 6; a += h) for (let b = h; a + b < 6; b += h * 2) { const c = 6 - a - b; m = Math.max(m, a * b * b * c * c * c); }
      if (!near(m, 108, 1e-3) || 1 * 4 * 27 !== 108) throw new Error('proof-45 ' + m); return 108;
    })()
  },
  claims: {
    'proof-44': () => {
      let S = [0n, 1n];
      for (let n = 1n; n <= 200n; n++) {
        S = add(S, [1n, n ** 3n]);
        if (!(4n * S[0] < 5n * S[1])) return false; // S < 5/4
        if (n >= 2n) { const bound = [10n * n * n - 4n, 8n * n * n]; if (S[0] * bound[1] > bound[0] * S[1]) return false; } // S ≤ 5/4 − 1/(2n²)
      }
      for (let n = 1; n <= 10000; n++) if (2 * n * n > (2 * n + 1) * (n + 1)) return false;
      return true;
    },
    'proof-46': () => { for (let i = 0; i < 5000; i++) { const a = rreal(0.01, 50), b = rreal(0.01, 50), c = rreal(0.01, 50), d = (a + b + c) / 3; if (!near((a + b + c + d) / 4, d) || !amgm([a, b, c]) || !amgm([a, b, c, d])) return false; } return true; },
    'proof-47': () => {
      for (let k = 1; k <= 4; k++) for (let x = 1; x <= 120; x++) for (let y = x; y <= 120; y++) for (let z = y; z <= 120; z++) if (x * x + y * y + z * z === 2 ** k * x * y * z) return false;
      return true;
    },
    'proof-48': () => {
      const F = [1, 2]; while (F[F.length - 1] < 1e6) F.push(F[F.length - 1] + F[F.length - 2]);
      for (let n = 1; n <= 20000; n++) {
        let r = n; const used = [];
        while (r > 0) { const f = F.filter(v => v <= r).pop(); if (used.includes(f)) return false; used.push(f); r -= f; }
      }
      return true;
    },
    'proof-49': () => { for (let i = 0; i < 4000; i++) { const n = 2 + (i % 11), xs = Array.from({ length: n }, () => rreal(0.01, 40)); if (!amgm(xs)) return false; } return true; },
    'proof-50': () => {
      let P = [1n, 1n];
      for (let n = 1n; n <= 150n; n++) {
        P = mul(P, [n ** 3n + 1n, n ** 3n]);
        if (P[0] * n > (3n * n - 1n) * P[1]) return false; // P ≤ 3 − 1/n
        if (!(P[0] < 3n * P[1])) return false;
      }
      for (let n = 1; n <= 100000; n++) if (n * n - n + 2 < 0 || 3 * n - 1 > (n + 1) ** 2) return false;
      return true;
    },
    'proof-51': () => {
      const ks = new Set();
      for (let x = 1; x <= 1500; x++) for (let y = 1; y <= x; y++) { const t = x * x + y * y + 1; if (t % (x * y) === 0) ks.add(t / (x * y)); }
      return ks.size === 1 && ks.has(3);
    },
    'proof-52': () => {
      let P = [1n, 1n];
      for (let n = 1n; n <= 300n; n++) {
        P = mul(P, [2n * n - 1n, 2n * n]);
        if (P[0] * P[0] * (3n * n + 1n) > P[1] * P[1]) return false; // P² ≤ 1/(3n + 1)
        if (n === 50n && !(144n * P[0] * P[0] < P[1] * P[1])) return false; // P_50 < 1/12
      }
      for (let n = 1n; n <= 1000n; n++) if ((2n * n + 1n) ** 2n * (3n * n + 4n) > (2n * n + 2n) ** 2n * (3n * n + 1n)) return false;
      return true;
    },
    'proof-53': () => {
      const fs = [x => x * x, x => Math.abs(x), x => Math.exp(x / 3), x => Math.max(0, x - 1)];
      for (const f of fs) for (let i = 0; i < 3000; i++) {
        const n = 2 + (i % 9), xs = Array.from({ length: n }, () => rreal(-6, 6)), m = xs.reduce((s, v) => s + v, 0) / n;
        if (f(m) > xs.reduce((s, v) => s + f(v), 0) / n + 1e-9) return false;
      }
      return true;
    },
    'proof-54': () => {
      let x = 1n, y = 1n;
      for (let n = 3n; n <= 90n; n++) {
        if (7n * x * x + y * y !== 2n ** n || x % 2n === 0n || y % 2n === 0n) return false;
        const X1 = (x + y) / 2n, X2 = (x - y) / 2n;
        let X = X1 % 2n !== 0n ? X1 : X2, Y = 4n * x - X; // Y = (7x ∓ y)/2
        if ((X1 % 2n === 0n) === (X2 % 2n === 0n)) return false; // ровно одно нечётно
        X = X < 0n ? -X : X; Y = Y < 0n ? -Y : Y; x = X; y = Y;
      }
      // независимо: при n ≤ 30 представление находится перебором
      for (let n = 3; n <= 30; n++) {
        const N = 2n ** BigInt(n); let ok = false;
        for (let a = 1n; 7n * a * a < N && !ok; a += 2n) { const r = N - 7n * a * a; if (isSq(r) && isqrt(r) % 2n === 1n) ok = true; }
        if (!ok) return false;
      }
      return true;
    },
    'proof-55': () => {
      for (let a = 1; a <= 1500; a++) for (let b = 1; b <= a; b++) { const t = a * a + b * b, d = a * b + 1; if (t % d === 0 && !isSq(BigInt(t / d))) return false; }
      return true;
    }
  },
  lessons: {
    'proof l7 sum 1/n^2 strengthened': () => {
      let S = [0n, 1n];
      for (let n = 1n; n <= 300n; n++) { S = add(S, [1n, n * n]); if (S[0] * n > (2n * n - 1n) * S[1]) return false; }
      return true;
    },
    'proof l8 AM-GM four, x^2 y': () => {
      for (let i = 0; i < 3000; i++) if (!amgm([rreal(0.01, 9), rreal(0.01, 9), rreal(0.01, 9), rreal(0.01, 9)])) return false;
      let m = 0, at = 0; for (let x = 0.001; x < 3; x += 0.001) { const v = x * x * (3 - x); if (v > m) { m = v; at = x; } }
      return near(m, 4, 1e-5) && Math.abs(at - 2) < 0.01;
    },
    'proof l9 x^2+y^2+1=3xy chain': () => pairs(1000, (x, y) => x * x + y * y + 1 === 3 * x * y).map(p => p.join(',')).join(' ') === '1,1 1,2 2,5 5,13 13,34 34,89 89,233 233,610'
  }
};

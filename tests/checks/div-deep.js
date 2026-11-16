// Проверки глубокого уровня темы «Делимость и остатки».
const { isPrime } = require('./_lib');

const fact = n => { let r = 1n; for (let i = 2n; i <= BigInt(n); i++) r *= i; return r; };
const binom = (n, k) => { if (k < 0 || k > n) return 0n; k = Math.min(k, n - k); let r = 1n; for (let i = 1; i <= k; i++) r = r * BigInt(n - k + i) / BigInt(i); return r; };
const vp = (x, p) => { x = BigInt(x); p = BigInt(p); if (x === 0n) return Infinity; if (x < 0n) x = -x; let c = 0; while (x % p === 0n) { x /= p; c++; } return c; };
const gcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const fib = n => { let a = 0n, b = 1n; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; }; // F0 = 0, F1 = 1
const digits = (n, p) => { const d = []; while (n > 0) { d.push(n % p); n = Math.floor(n / p); } return d; };
const carries = (a, b, p) => { let c = 0, carry = 0; while (a > 0 || b > 0 || carry) { const s = (a % p) + (b % p) + carry; carry = s >= p ? 1 : 0; c += carry; a = Math.floor(a / p); b = Math.floor(b / p); } return c; };
// Гармоническая сумма 1 + 1/2 + … + 1/n несократимой дробью [числитель, знаменатель]
const harmonic = n => { let num = 0n, den = 1n; for (let k = 1n; k <= BigInt(n); k++) { num = num * k + den; den *= k; const g = gcdB(num, den); num /= g; den /= g; } return [num, den]; };
const primes = N => { const r = []; for (let i = 2; i <= N; i++) if (isPrime(i)) r.push(i); return r; };
const lcmTo = n => { let l = 1n; for (let i = 1n; i <= BigInt(n); i++) l = l / gcdB(l, i) * i; return l; };

module.exports = {
  expected: {
    'div-43': vp(binom(100, 50), 2),
    'div-44': (() => { const c = binom(2026, 1013); return Math.min(vp(c, 2), vp(c, 5)); })(),
    'div-45': (() => { let c = 0; for (let k = 0; k <= 100; k++) if (binom(100, k) % 2n === 1n) c++; return c; })(),
    'div-46': Number(gcdB(fib(60), fib(84))),
    'div-47': (() => { let c = 0; for (let n = 1; n <= 100; n++) if (binom(2 * n, n) % 4n !== 0n) c++; return c; })()
  },
  claims: {
    'div-48': () => { for (let n = 1; n <= 300; n++) if (binom(2 * n, n) % BigInt(n + 1) !== 0n) return false; return true; },
    'div-49': () => {
      const s = [];
      for (let a = 1; a <= 2000; a++) for (let b = 1; b <= 2000; b++) if ((b + 1) % a === 0 && (a + 1) % b === 0) s.push(a + ',' + b);
      return s.join(' ') === '1,1 1,2 2,1 2,3 3,2';
    },
    'div-50': () => {
      for (let n = 2; n <= 250; n++) {
        if (harmonic(n)[1] === 1n) return false;
        let k = 0; while (2 ** (k + 1) <= n) k++;
        let cnt = 0; for (let j = 1; j <= n; j++) if (j % 2 ** k === 0) cnt++;
        if (cnt !== 1) return false; // только одно число делится на 2^k
      }
      return true;
    },
    'div-51': () => {
      for (const p of primes(200)) {
        for (let k = 1; k < p; k++) if (binom(p, k) % BigInt(p) !== 0n) return false;
        for (let a = 1n; a <= 50n; a++) if ((a ** BigInt(p) - a) % BigInt(p) !== 0n || ((a + 1n) ** BigInt(p) - a ** BigInt(p) - 1n) % BigInt(p) !== 0n) return false;
      }
      return true;
    },
    'div-52': () => {
      for (const p of primes(200)) {
        if (p === 2) continue;
        const [m] = harmonic(p - 1);
        if (m % BigInt(p) !== 0n) return false;
        if (p >= 5 && m % BigInt(p * p) !== 0n) return false; // теорема Вольстенхолма из решения
      }
      return true;
    },
    'div-53': () => {
      for (let m = 0; m <= 40; m++) for (let n = 0; n <= 40; n++) if ((fact(2 * m) * fact(2 * n)) % (fact(m) * fact(n) * fact(m + n)) !== 0n) return false;
      for (let i = 0; i < 20000; i++) { const x = Math.random() * 50, y = Math.random() * 50; if (Math.floor(2 * x) + Math.floor(2 * y) < Math.floor(x) + Math.floor(y) + Math.floor(x + y)) return false; }
      return true;
    },
    'div-54': () => {
      for (let m = 1; m <= 90; m++) for (let n = 1; n <= 90; n++) {
        if (gcdB(fib(m), fib(n)) !== fib(gcd(m, n))) return false;
        if (fib(m + n) !== fib(m) * fib(n + 1) + fib(m - 1) * fib(n)) return false;
      }
      return true;
    },
    'div-55': () => { for (let n = 1; n <= 150; n++) for (let m = 1; m <= n; m++) if ((BigInt(gcd(m, n)) * binom(n, m)) % BigInt(n) !== 0n || BigInt(m) * binom(n, m) !== BigInt(n) * binom(n - 1, m - 1)) return false; return true; },
    'div-56': () => {
      for (let n = 1; n <= 200; n++) {
        const c = binom(2 * n, n); let prod = 1n;
        for (let p = n + 1; p <= 2 * n; p++) if (isPrime(p)) { if (vp(c, p) !== 1) return false; prod *= BigInt(p); }
        if (!(prod < 4n ** BigInt(n)) || !(c < 4n ** BigInt(n))) return false;
      }
      return true;
    },
    'div-57': () => {
      for (let n = 1; n <= 120; n++) {
        const L = lcmTo(n);
        let sum = 0n;
        for (let k = 1; k <= n; k++) { const t = BigInt(k) * binom(n, k); if (L % t !== 0n) return false; sum += t; }
        if (sum !== BigInt(n) * 2n ** BigInt(n - 1) || L < 2n ** BigInt(n - 1)) return false;
      }
      return true;
    }
  },
  lessons: {
    'div l7 v_p examples': () => vp(48, 2) === 4 && vp(48, 3) === 1 && vp(48, 5) === 0 && vp(52, 2) === 2 && vp(16, 2) === 4 &&
      (() => { const num = 60n + 40n + 24n + 15n, den = 120n; return num === 139n && gcdB(num, den) === 1n && vp(den, 2) === 3; })(),
    'div l7 legendre two forms': () => {
      if (vp(fact(100), 3) !== 48 || vp(fact(100), 2) !== 97 || digits(100, 2).join('') !== '0010011') return false;
      for (const p of [2, 3, 5, 7]) for (let n = 1; n <= 500; n++) { const s = digits(n, p).reduce((a, b) => a + b, 0); if (vp(fact(n), p) * (p - 1) !== n - s) return false; }
      return true;
    },
    'div l7 C(2n,n) bound': () => { for (let n = 1; n <= 150; n++) for (const p of primes(2 * n)) if (p ** vp(binom(2 * n, n), p) > 2 * n) return false; return true; },
    'div l8 kummer': () => {
      if (binom(10, 4) !== 210n || carries(4, 6, 2) !== 1) return false;
      for (const p of [2, 3, 5]) for (let m = 0; m <= 60; m++) for (let n = 0; n <= 60; n++) if (vp(binom(m + n, m), p) !== carries(m, n, p)) return false;
      return true;
    },
    'div l8 lucas': () => {
      for (const p of [2, 3, 5, 7]) for (let n = 0; n <= 80; n++) for (let k = 0; k <= n; k++) {
        const dn = digits(n, p), dk = digits(k, p); let prod = 1n;
        dn.forEach((d, i) => { prod *= binom(d, dk[i] || 0); });
        if ((binom(n, k) - prod) % BigInt(p) !== 0n) return false;
      }
      const odd = []; for (let k = 0; k <= 10; k++) if (binom(10, k) % 2n === 1n) odd.push(k);
      return odd.join(',') === '0,2,8,10' && binom(10, 2) === 45n;
    },
    'div l9 bezout and gcd': () => 3 * 21 - 2 * 30 === 3 && gcd(30, 21) === 3 && gcdB(2n ** 12n - 1n, 2n ** 18n - 1n) === 63n &&
      (() => { const s = []; for (let n = 1; n <= 10000; n++) if ((n * n + 1) % (n + 1) === 0) s.push(n); return s.join() === '1'; })(),
    'div l9 zsigmondy exception 63': () => 2 ** 6 - 1 === 63 && [3, 7].every(p => [1, 2, 3, 4, 5].some(k => (2 ** k - 1) % p === 0)) && 63 === 9 * 7
  }
};

// Проверки вводной диагностики.
const { divisors, gcd, powmod, C } = require('./_lib');

module.exports = {
  expected: {
    d01: 2026 % 7,
    d03: gcd(391, 323),
    d04: Number(powmod(7, 2026, 10)),
    d05: (() => { for (let x = -100; x <= 100; x++) if (3 * (x - 2) === x + 8) return x; })(),
    d07: (() => { const d = Math.sqrt(49 - 20), x1 = (7 + d) / 2, x2 = (7 - d) / 2; return Math.round(x1 * x1 + x2 * x2); })(),
    d08: (() => { let m = Infinity; for (let x = -1000; x <= 1000; x += 0.5) m = Math.min(m, x * x - 6 * x + 13); return m; })(),
    d09: Math.sqrt(36 + 64),
    d10: 180 * (6 - 2),
    d11: 2 * 35,
    d12: 180 - 25 - 35,
    d13: (() => { const a = 13, b = 14, c = 15, p = (a + b + c) / 2; return Math.sqrt(p * (p - a) * (p - b) * (p - c)); })(),
    d14: 4 * 3 * 2 * 1,
    d15: (() => { let c = 0; for (let n = 10; n <= 99; n++) if (Math.floor(n / 10) % 2 === 0 && (n % 10) % 2 === 0) c++; return c; })(),
    d16: C(7, 3),
    d17: (() => { let c = 0; for (let n = 1; n <= 100; n++) if (n % 2 && n % 3) c++; return c; })()
  },
  choice: {
    d02: String(divisors(36).length),
    d06: '4ab'
  },
  claims: {},
  lessons: {}
};

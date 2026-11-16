// Проверки темы «Выражения и тождества».
const { B, rint, rreal, near, round6, matchOption, identityBig } = require('./_lib');

const quadRoots = (s, p) => { const d = Math.sqrt(s * s - 4 * p); return [(s + d) / 2, (s - d) / 2]; };

module.exports = {
  expected: {
    'expr-01': 51 * 51 - 49 * 49,
    'expr-03': 99 * 99,
    'expr-05': 2026 * 2026 - 2025 * 2025,
    'expr-07': (() => { const [x, y] = quadRoots(7, 10); return round6(x * x + y * y); })(),
    'expr-09': (1001 * 1001 - 999 * 999) / 1000,
    'expr-10': (() => { const x = (3 + Math.sqrt(13)) / 2; if (!near(x - 1 / x, 3)) throw new Error('expr-10 root'); return round6(x * x + 1 / (x * x)); })(),
    'expr-11': (() => { const [a, b] = quadRoots(5, 6); return round6(a ** 3 + b ** 3); })(),
    'expr-13': (() => { let m = Infinity; for (let x = -20; x <= 20; x += 0.001) m = Math.min(m, x * x - 10 * x + 31); return round6(m); })(),
    'expr-14': 37 * 37 + 2 * 37 * 63 + 63 * 63,
    'expr-15': (36 - 9) / (36 + 18),
    'expr-17': 2026 * 2028 - 2027 * 2027,
    'expr-18': (() => { for (let p = -50; p <= 50; p++) { const d = 9 - 4 * p; if (d < 0) continue; const [x, y] = quadRoots(3, p); if (near(x * x + y * y, 5)) return p; } })(),
    'expr-19': (2 + 1) * (4 + 1) * (16 + 1) * (256 + 1),
    'expr-20': (() => { const a = -Math.cbrt(2), b = a, c = -2 * a; if (!near(a * b * c, 4) || !near(a + b + c, 0)) throw new Error('expr-20'); return round6(a ** 3 + b ** 3 + c ** 3); })(),
    'expr-21': (() => { const x = (3 + Math.sqrt(5)) / 2; return round6(x ** 3 + 1 / x ** 3); })(),
    'expr-22': (() => { const n = 2026n * 2024n + 1n; let r = 0n; while ((r + 1n) * (r + 1n) <= n) r += 1n; if (r * r !== n) throw new Error('expr-22 not square'); return Number(r); })(),
    'expr-23': (() => { let m = Infinity; for (let x = -10; x <= 10; x += 0.01) for (let y = -10; y <= 10; y += 0.01) m = Math.min(m, x * x + y * y - 4 * x + 6 * y + 20); return round6(m); })(),
    'expr-24': (() => { let c = 0; for (let x = -60; x <= 60; x++) for (let y = -60; y <= 60; y++) if (x * x - y * y === 15) c++; return c; })(),
    'expr-25': (() => { let m = -Infinity; for (let x = -5; x <= 5; x += 0.0001) m = Math.max(m, x * (1 - x)); return round6(m); })(),
    'expr-26': (() => { const vals = new Set(); for (const b of quadRoots(-3, -10)) { const a = b + 3; if (near(a * a + b * b, 29)) vals.add(round6(a ** 3 - b ** 3)); } if (vals.size !== 1) throw new Error('expr-26'); return [...vals][0]; })(),
    'expr-27': (10 ** 4 + 10 ** 2 + 1) / (10 ** 2 + 10 + 1),
    'expr-28': (() => { const n = 2026n ** 3n - 2025n ** 3n - 1n, d = 2026n * 2025n; if (n % d !== 0n) throw new Error('expr-28'); return Number(n / d); })()
  },
  choice: {
    'expr-02': () => matchOption(x => (2 * x - 3) ** 2, [x => 4 * x * x - 9, x => 4 * x * x - 6 * x + 9, x => 4 * x * x - 12 * x + 9, x => 2 * x * x - 12 * x + 9]),
    'expr-04': () => matchOption(x => x * x - 16, [x => (x - 4) ** 2, x => (x - 4) * (x + 4), x => (x - 8) * (x + 2), x => (x - 16) * (x + 1)]),
    'expr-06': () => matchOption(a => (a + 2) * (a - 2) - a * (a - 4), [a => 4 * a - 4, a => 4 * a + 4, a => -4, a => 2 * a * a - 4 * a - 4]),
    'expr-08': () => matchOption(a => a ** 3 - 8, [a => (a - 2) ** 3, a => (a - 2) * (a * a + 2 * a + 4), a => (a - 2) * (a * a - 2 * a + 4), a => (a - 2) * (a + 2) * (a + 4)]),
    'expr-12': () => matchOption(x => x ** 4 + 4, [x => (x * x + 2) ** 2, x => (x * x - 2 * x + 2) * (x * x + 2 * x + 2), x => (x * x + 2) * (x * x - 2), null]),
    'expr-16': () => matchOption((a, b, c) => (a - b) ** 2 + (b - c) ** 2 + (c - a) ** 2,
      [() => 0, (a, b, c) => 2 * (a * a + b * b + c * c), (a, b, c) => 2 * (a * a + b * b + c * c - a * b - b * c - c * a), (a, b, c) => a * a + b * b + c * c - a * b - b * c - c * a], 3)
  },
  claims: {
    'expr-29': () => identityBig((a, b, c, d) => (a * a + b * b) * (c * c + d * d), (a, b, c, d) => (a * c - b * d) ** 2n + (a * d + b * c) ** 2n, 4),
    'expr-30': () => { for (let i = 0; i < 2000; i++) { const a = rreal(-50, 50), b = rreal(-50, 50); if (a * a + b * b < 2 * a * b - 1e-9) return false; const x = rreal(0.001, 100); if (x + 1 / x < 2 - 1e-12) return false; } return true; },
    'expr-31': () => { for (let n = 1n; n <= 3000n; n++) if (n * (n + 1n) * (n + 2n) * (n + 3n) + 1n !== (n * n + 3n * n + 1n) ** 2n) return false; return true; },
    'expr-32': () => { for (let i = 0; i < 500; i++) { const a = B(rint(-99, 99)), b = B(rint(-99, 99)), c = -a - b; if (a ** 3n + b ** 3n + c ** 3n !== 3n * a * b * c) return false; } return true; },
    'expr-33': () => { const N = 2n ** 10n + 5n ** 12n, a = 125n, b = 4n, f1 = a * a + 2n * b * b + 2n * a * b, f2 = a * a + 2n * b * b - 2n * a * b; return f1 * f2 === N && f1 === 16657n && f2 === 14657n && f2 > 1n; },
    'expr-34': () => identityBig((a, b, c) => a ** 3n + b ** 3n + c ** 3n - 3n * a * b * c, (a, b, c) => (a + b + c) * (a * a + b * b + c * c - a * b - b * c - c * a), 3) &&
      identityBig((a, b, c) => 2n * (a * a + b * b + c * c - a * b - b * c - c * a), (a, b, c) => (a - b) ** 2n + (b - c) ** 2n + (c - a) ** 2n, 3),
    'expr-35': () => identityBig((a, b, c) => (a + b + c) ** 3n - a ** 3n - b ** 3n - c ** 3n, (a, b, c) => 3n * (a + b) * (b + c) * (c + a), 3),
    'expr-36': () => { for (let n = 1n; n <= 5000n; n++) if ((n ** 5n - 5n * n ** 3n + 4n * n) % 120n !== 0n) return false; return true; },
    'expr-37': () => identityBig((x, y) => 2n * (x * x + y * y + 1n - x * y - x - y), (x, y) => (x - y) ** 2n + (x - 1n) ** 2n + (y - 1n) ** 2n, 2) && (1 + 1 + 1 === 1 + 1 + 1),
    'expr-38': () => { for (let i = 0; i < 500; i++) { const a = rreal(0.2, 5) * (rnd2() ? 1 : -1), b = rreal(0.2, 5), c = 1 / (a * b); if (!near((a - 1) * (b - 1) * (c - 1), (a + b + c) - (1 / a + 1 / b + 1 / c), 1e-9)) return false; } return true; },
    'expr-39': () => identityBig((x, y, z) => (x + y + z) ** 5n - x ** 5n - y ** 5n - z ** 5n, (x, y, z) => 5n * (x + y) * (y + z) * (z + x) * (x * x + y * y + z * z + x * y + y * z + z * x), 3),
    'expr-40': () => { const x = 5n ** 25n, m = 5n ** 13n, num = 5n ** 125n - 1n, den = x - 1n; if (num % den !== 0n) return false; const q = num / den; if (q !== x ** 4n + x ** 3n + x ** 2n + x + 1n) return false; const f1 = x * x + 3n * x + 1n - m * (x + 1n), f2 = x * x + 3n * x + 1n + m * (x + 1n); return f1 * f2 === q && f1 > 1n && 5n * x === m * m; }
  },
  lessons: {
    'expr l1 quick sums': () => 101 * 101 === 10201 && 47 * 53 === 2491 && 73 * 73 - 27 * 27 === 4600,
    'expr l2 grouping': () => identityBig((a, b) => a * b + 2n * a + 3n * b + 6n, (a, b) => (a + 3n) * (b + 2n), 2),
    'expr l2 common factor': () => identityBig((x, y) => 6n * x * x * y - 9n * x * y * y, (x, y) => 3n * x * y * (2n * x - 3n * y), 2),
    'expr l2 9x^2-25': () => identityBig(x => 9n * x * x - 25n, x => (3n * x - 5n) * (3n * x + 5n), 1),
    'expr l2 x^2-6x+10': () => identityBig(x => x * x - 6n * x + 10n, x => (x - 3n) ** 2n + 1n, 1),
    'expr l2 x^4+64': () => identityBig(x => x ** 4n + 64n, x => (x * x - 4n * x + 8n) * (x * x + 4n * x + 8n), 1),
    'expr l2 xy+x+y=5': () => { const s = []; for (let x = 1; x <= 10; x++) for (let y = 1; y <= 10; y++) if (x * y + x + y === 5) s.push(x + ',' + y); return s.join(' ') === '1,2 2,1'; },
    'expr l3 fractions': () => { for (let i = 0; i < 200; i++) { const a = rreal(1, 9), b = rreal(-9, -1), x = rreal(2, 9); if (!near((a * a - a * b) / (a * a - b * b), a / (a + b))) return false; if (!near(1 / (x - 1) - 1 / (x + 1), 2 / (x * x - 1))) return false; if (!near((x ** 3 - 1) / (x * x + x + 1), x - 1)) return false; } return true; },
    'expr l4 s=5,p=3': () => { const [x, y] = quadRoots(5, 3); return near(x * x + y * y, 19) && near(x ** 3 + y ** 3, 80) && near(1 / x + 1 / y, 5 / 3); },
    'expr l4 t=4 -> 14': () => { const x = 2 + Math.sqrt(3); return near(x + 1 / x, 4) && near(x * x + 1 / (x * x), 14); },
    'expr l4 three vars': () => 1 + 2 + 3 === 6 && 1 * 2 + 2 * 3 + 3 * 1 === 11 && 1 + 4 + 9 === 14,
    'expr l5 a+b+c=0 example': () => 1 + 8 - 27 === -18 && 3 * 1 * 2 * -3 === -18,
    'expr l5 629': () => 5 ** 4 + 4 === 629 && 37 * 17 === 629 && 25 + 2 + 10 === 37 && 25 + 2 - 10 === 17
  }
};

function rnd2() { return rint(0, 1) === 1; }

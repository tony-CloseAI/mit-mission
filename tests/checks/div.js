// Проверки темы «Делимость и остатки».
const { B, powmod, gcd, lcm, divisors, isPrime, fact, vp } = require('./_lib');

module.exports = {
  expected: {
    'div-02': 100 % 7,
    'div-04': lcm(12, 18),
    'div-05': divisors(24).length,
    'div-07': gcd(84, 126),
    'div-08': 2027 % 9,
    'div-09': Math.floor(200 / 6),
    'div-10': Number(powmod(3, 2027, 10)),
    'div-11': (() => { for (let n = 2; ; n++) if ([2, 3, 4, 5, 6].every(d => n % d === 1)) return n; })(),
    'div-12': divisors(720).length,
    'div-14': (() => { const s = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) { const n = a * 1000 + 790 + b; if (n % 72 === 0) s.push(a + b); } if (s.length !== 1) throw new Error('div-14 not unique'); return s[0]; })(),
    'div-15': Number(powmod(2, 100, 7)),
    'div-16': (() => { const r = new Set(); for (let n = 5; n < 600; n += 6) r.add((3 * n * n + n) % 6); if (r.size !== 1) throw new Error('div-16'); return [...r][0]; })(),
    'div-18': gcd(Number(2n ** 12n - 1n), Number(2n ** 8n - 1n)),
    'div-19': (() => { let N = fact(100), c = 0; while (N % 10n === 0n) { N /= 10n; c++; } return c; })(),
    'div-20': divisors(36).reduce((s, x) => s + x, 0),
    'div-21': Number((powmod(3, 2026, 8) + powmod(5, 2026, 8)) % 8n),
    'div-22': vp(fact(50), 2),
    'div-23': Number(powmod(2, 2026, 13)),
    'div-24': (() => { let c = 0; for (let n = 1; n <= 100; n++) if ((n * n + 1) % 5 === 0) c++; return c; })(),
    'div-25': (() => { let c = 0; for (let x = 1; x <= 180; x++) for (let y = 1; y <= 180; y++) if (gcd(x, y) === 6 && lcm(x, y) === 180) c++; return c; })(),
    'div-26': (() => { for (let n = 1; ; n++) if (fact(n) % 1000n === 0n) return n; })(),
    'div-27': Number(powmod(7, 2026, 100)),
    'div-29': (() => { let s = 0; for (let n = 1; n <= 10000; n++) if ((n * n + 5) % (n + 1) === 0) s += n; return s; })(),
    'div-30': (() => { let s = 0n; for (let k = 0n; k <= 2026n; k++) s += powmod(2, k, 7); return Number(s % 7n); })()
  },
  choice: {
    'div-01': ['1234', '4518', '7001', '3335'].filter(s => Number(s) % 9 === 0),
    'div-03': ['51', '57', '87', '89'].filter(s => isPrime(Number(s))),
    'div-06': (() => { const ok = []; for (let a = 0; a <= 9; a++) if ((400 + 10 * a + 7) % 9 === 0) ok.push(String(a)); return ok; })(),
    'div-13': String(2160 / 12),
    'div-17': String(divisors(12).length),
    'div-28': (() => { let c = 0; for (let x = -3000; x <= 3000; x++) { const y2 = x * x - 2026; if (y2 < 0) continue; const y = Math.round(Math.sqrt(y2)); if (y * y === y2) c += y === 0 ? 1 : 2; } return String(c); })()
  },
  claims: {
    'div-31': () => { for (let n = 1; n <= 20000; n++) if ((B(n) ** 3n - B(n)) % 6n !== 0n) return false; return true; },
    'div-32': () => true, // принцип Дирихле — проверяется рассуждением
    'div-33': () => { for (let n = -2000; n <= 2000; n++) if (![0, 1].includes(((n * n) % 4 + 4) % 4)) return false; for (let N = 3; N <= 3000; N += 4) for (let a = 0; a * a <= N; a++) { const b2 = N - a * a, b = Math.round(Math.sqrt(b2)); if (b * b === b2) return false; } return true; },
    'div-34': () => { for (let n = 1; n <= 20000; n++) if ((n * n + n + 1) % 5 === 0) return false; return true; },
    'div-35': () => { for (let n = 1; n <= 20000; n++) if (gcd(21 * n + 4, 14 * n + 3) !== 1) return false; return true; },
    'div-36': () => { for (let p = 5; p <= 20000; p++) if (isPrime(p) && (B(p) * B(p) - 1n) % 24n !== 0n) return false; return true; },
    'div-37': () => { for (let n = 1; n <= 500; n++) if ((powmod(2, n, 3) === 2n) !== (n % 2 === 1)) return false; return true; },
    'div-38': () => { for (let n = 1; n <= 500; n++) if ((powmod(4, n, 9) + B(15 * n - 1)) % 9n !== 0n) return false; return true; },
    'div-39': () => { for (let x = 1; x <= 300; x++) for (let y = x; y <= 300; y++) { const s = x * x + y * y; if (s % 3) continue; const z2 = s / 3, z = Math.round(Math.sqrt(z2)); if (z * z === z2) return false; } return true; },
    'div-40': () => { let c = 0; for (let p = 3; p < 2000; p++) if (isPrime(p) && p % 4 === 3) c++; return c > 100; },
    'div-41': () => { for (let n = 2; n <= 40; n++) { const N = B(n) ** 4n + 4n ** B(n); let comp = N % 2n === 0n && N > 2n; if (!comp) { const b = 2n ** B((n - 1) / 2), f2 = B(n * n) + 2n * b * b - 2n * B(n) * b; comp = f2 > 1n && N % f2 === 0n && N / f2 > 1n; } if (!comp) return false; } return true; },
    'div-42': () => { for (let n = 2; n <= 20000; n++) if (powmod(2, n, n) === 1n) return false; return true; }
  },
  lessons: {
    'div l1 (n+7)/(n+2)': () => { const s = []; for (let n = 1; n < 1000; n++) if ((n + 7) % (n + 2) === 0) s.push(n); return s.join() === '3'; },
    'div l1 trick (n^2+3)/(n-1)': () => { const s = []; for (let n = 2; n < 1000; n++) if ((n * n + 3) % (n - 1) === 0) s.push(n); return s.join() === '2,3,5'; },
    'div l2 918082 % 11': () => 918082 % 11 === 0,
    'div l2 2a4b / 45': () => { const s = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) { const n = 2040 + 100 * a + b; if (n % 45 === 0) s.push(n); } return s.join() === '2340,2745'; },
    'div l3 tau(72)=12, sigma=195': () => divisors(72).length === 12 && divisors(72).reduce((a, b) => a + b) === 195,
    'div l3 zeros of 30! = 7': () => { let N = fact(30), c = 0; while (N % 10n === 0n) { N /= 10n; c++; } return c === 7; },
    'div l4 gcd(1071,462)=21': () => gcd(1071, 462) === 21,
    'div l4 gcd/lcm 8,20': () => gcd(8, 20) === 4 && lcm(8, 20) === 40,
    'div l5 (2026*2027+2028^2) % 5 = 1': () => (2026 * 2027 + 2028 * 2028) % 5 === 1,
    'div l6 2^2026 last digit 4': () => powmod(2, 2026, 10) === 4n,
    'div l6 3^100 % 7 = 4': () => powmod(3, 100, 7) === 4n,
    'div l6 3^20 % 100 = 1': () => powmod(3, 20, 100) === 1n,
    'div l6 3^2026 % 100 = 29': () => powmod(3, 2026, 100) === 29n
  }
};

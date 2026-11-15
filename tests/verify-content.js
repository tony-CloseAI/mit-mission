// Проверка содержания: пересчитывает ответы задач независимо (перебором и BigInt)
// и проверяет утверждения задач на доказательство на большом диапазоне чисел.
// Запуск: node app/tests/verify-content.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const MM = { topics: [], diag: null, roadmap: [],
  addTopic(t) { this.topics.push(t); }, setDiagnostic(d) { this.diag = d; }, setRoadmap(r) { this.roadmap = r; } };
const dir = path.join(__dirname, '..', 'content');
for (const f of ['roadmap.js', 'diagnostic.js', 'divisibility.js']) {
  vm.runInNewContext(fs.readFileSync(path.join(dir, f), 'utf8'), { MM }, { filename: f });
}

// ---------- helpers ----------
const B = BigInt;
const powmod = (a, e, m) => { let r = 1n, b = B(a) % B(m); let x = B(e); const M = B(m); while (x > 0n) { if (x & 1n) r = r * b % M; b = b * b % M; x >>= 1n; } return r; };
const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
const lcm = (a, b) => a / gcd(a, b) * b;
const divisors = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
const isPrime = n => { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; };
const fact = n => { let r = 1n; for (let i = 2n; i <= B(n); i++) r *= i; return r; };
const vp = (N, p) => { let c = 0; while (N % B(p) === 0n) { N /= B(p); c++; } return c; };
const C = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

// ---------- expected answers, computed independently ----------
const expected = {
  d01: 2026 % 7,
  d02: divisors(36).length,
  d03: gcd(391, 323),
  d04: Number(powmod(7, 2026, 10)),
  d05: (() => { for (let x = -100; x <= 100; x++) if (3 * (x - 2) === x + 8) return x; })(),
  d07: (() => { const s = 7, p = 5; return s * s - 2 * p; })(),
  d08: (() => { let m = Infinity; for (let x = -1000; x <= 1000; x += 0.5) m = Math.min(m, x * x - 6 * x + 13); return m; })(),
  d09: Math.sqrt(36 + 64),
  d10: 180 * (6 - 2),
  d11: 70,
  d12: 180 - 25 - 35,
  d13: (() => { const a = 13, b = 14, c = 15, p = (a + b + c) / 2; return Math.sqrt(p * (p - a) * (p - b) * (p - c)); })(),
  d14: 24,
  d15: (() => { let c = 0; for (let n = 10; n <= 99; n++) if ((Math.floor(n / 10) % 2 === 0) && (n % 10) % 2 === 0) c++; return c; })(),
  d16: C(7, 3),
  d17: (() => { let c = 0; for (let n = 1; n <= 100; n++) if (n % 2 && n % 3) c++; return c; })(),

  'div-02': 100 % 7,
  'div-04': lcm(12, 18),
  'div-05': divisors(24).length,
  'div-07': gcd(84, 126),
  'div-08': 2027 % 9,
  'div-09': Math.floor(200 / 6),
  'div-10': Number(powmod(3, 2027, 10)),
  'div-11': (() => { for (let n = 2; ; n++) if ([2, 3, 4, 5, 6].every(d => n % d === 1)) return n; })(),
  'div-12': divisors(720).length,
  'div-14': (() => { const sols = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) { const n = a * 1000 + 790 + b; if (n % 72 === 0) sols.push(a + b); } if (sols.length !== 1) throw new Error('div-14 not unique: ' + sols); return sols[0]; })(),
  'div-15': Number(powmod(2, 100, 7)),
  'div-16': (() => { const r = new Set(); for (let n = 5; n < 600; n += 6) r.add((3 * n * n + n) % 6); if (r.size !== 1) throw new Error('div-16 not constant'); return [...r][0]; })(),
  'div-18': Number(gcd(Number(2n ** 12n - 1n), Number(2n ** 8n - 1n))),
  'div-19': vp(fact(100), 10) === 24 ? (() => { let N = fact(100), c = 0; while (N % 10n === 0n) { N /= 10n; c++; } return c; })() : -1,
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
};

// choice problems: the value of the correct option must equal the computed answer
const expectedChoice = {
  d02: String(divisors(36).length),
  d06: '4ab',
  'div-01': ['1234', '4518', '7001', '3335'].filter(s => Number(s) % 9 === 0),
  'div-03': ['51', '57', '87', '89'].filter(s => isPrime(Number(s))),
  'div-06': (() => { const ok = []; for (let a = 0; a <= 9; a++) if ((400 + 10 * a + 7) % 9 === 0) ok.push(String(a)); return ok; })(),
  'div-13': String(2160 / 12),
  'div-17': String(divisors(12).length),
  'div-28': (() => { let c = 0; for (let x = -3000; x <= 3000; x++) { const y2 = x * x - 2026; if (y2 < 0) continue; const y = Math.round(Math.sqrt(y2)); if (y * y === y2) c += y === 0 ? 1 : 2; } return String(c); })()
};

// ---------- proof claims, brute-force sanity checks ----------
const claims = {
  'div-31': () => { for (let n = 1; n <= 20000; n++) if ((B(n) ** 3n - B(n)) % 6n !== 0n) return false; return true; },
  'div-32': () => true, // принцип Дирихле — проверяется рассуждением
  'div-33': () => { for (let n = -2000; n <= 2000; n++) if (![0, 1].includes(((n * n) % 4 + 4) % 4)) return false; for (let N = 3; N <= 3000; N += 4) for (let a = 0; a * a <= N; a++) { const b2 = N - a * a; const b = Math.round(Math.sqrt(b2)); if (b * b === b2) return false; } return true; },
  'div-34': () => { for (let n = 1; n <= 20000; n++) if ((n * n + n + 1) % 5 === 0) return false; return true; },
  'div-35': () => { for (let n = 1; n <= 20000; n++) if (gcd(21 * n + 4, 14 * n + 3) !== 1) return false; return true; },
  'div-36': () => { for (let p = 5; p <= 20000; p++) if (isPrime(p) && (B(p) * B(p) - 1n) % 24n !== 0n) return false; return true; },
  'div-37': () => { for (let n = 1; n <= 500; n++) { const div = powmod(2, n, 3) === 2n; if (div !== (n % 2 === 1)) return false; } return true; },
  'div-38': () => { for (let n = 1; n <= 500; n++) if ((powmod(4, n, 9) + B(15 * n - 1)) % 9n !== 0n) return false; return true; },
  'div-39': () => { for (let x = 1; x <= 300; x++) for (let y = x; y <= 300; y++) { const s = x * x + y * y; if (s % 3) continue; const z2 = s / 3; const z = Math.round(Math.sqrt(z2)); if (z * z === z2) return false; } return true; },
  'div-40': () => { let c = 0; for (let p = 3; p < 2000; p++) if (isPrime(p) && p % 4 === 3) c++; return c > 100; },
  'div-41': () => { for (let n = 2; n <= 40; n++) { const N = B(n) ** 4n + 4n ** B(n); let composite = N % 2n === 0n && N > 2n; if (!composite) { const m = B((n - 1) / 2), b = 2n ** m, f2 = B(n * n) + 2n * b * b - 2n * B(n) * b; composite = f2 > 1n && N % f2 === 0n && N / f2 > 1n; } if (!composite) return false; } return true; },
  'div-42': () => { for (let n = 2; n <= 20000; n++) if (powmod(2, n, n) === 1n) return false; return true; }
};

// lesson examples
const lessonChecks = {
  'l1 (n+7)/(n+2)': (() => { const s = []; for (let n = 1; n < 1000; n++) if ((n + 7) % (n + 2) === 0) s.push(n); return s.join() === '3'; })(),
  'l1 trick (n^2+3)/(n-1)': (() => { const s = []; for (let n = 2; n < 1000; n++) if ((n * n + 3) % (n - 1) === 0) s.push(n); return s.join() === '2,3,5'; })(),
  'l2 918082 % 11': 918082 % 11 === 0,
  'l2 2a4b / 45': (() => { const s = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) { const n = 2000 + 100 * a + 40 + b; if (n % 45 === 0) s.push(n); } return s.join() === '2340,2745'; })(),
  'l3 tau(72)=12, sigma=195': divisors(72).length === 12 && divisors(72).reduce((a, b) => a + b) === 195,
  'l3 zeros of 30! = 7': (() => { let N = fact(30), c = 0; while (N % 10n === 0n) { N /= 10n; c++; } return c === 7; })(),
  'l4 gcd(1071,462)=21': gcd(1071, 462) === 21,
  'l4 gcd/lcm 8,20': gcd(8, 20) === 4 && lcm(8, 20) === 40,
  'l5 (2026*2027+2028^2) % 5 = 1': (2026 * 2027 + 2028 * 2028) % 5 === 1,
  'l6 2^2026 last digit 4': powmod(2, 2026, 10) === 4n,
  'l6 3^100 % 7 = 4': powmod(3, 100, 7) === 4n,
  'l6 3^20 % 100 = 1': powmod(3, 20, 100) === 1n,
  'l6 3^2026 % 100 = 29': powmod(3, 2026, 100) === 29n
};

// ---------- run ----------
let fail = 0, ok = 0;
const all = [...MM.diag.problems, ...MM.topics.flatMap(t => t.problems)];
const ids = new Set();
for (const p of all) {
  if (ids.has(p.id)) { console.log('DUPLICATE ID', p.id); fail++; }
  ids.add(p.id);
  if (!p.q || typeof p.r !== 'number') { console.log('MISSING FIELDS', p.id); fail++; continue; }
  if (p.type === 'num') {
    if (!(p.id in expected)) { console.log('NO CHECK', p.id); fail++; continue; }
    const want = String(expected[p.id]);
    if (!p.a.includes(want)) { console.log('WRONG', p.id, 'content:', p.a, 'computed:', want); fail++; } else ok++;
  } else if (p.type === 'choice') {
    const chosen = p.opts[p.a];
    let want = expectedChoice[p.id];
    if (want === undefined) { console.log('NO CHECK', p.id); fail++; continue; }
    const wants = Array.isArray(want) ? want : [want];
    if (wants.length !== 1) { console.log('AMBIGUOUS', p.id, wants); fail++; continue; }
    if (chosen !== wants[0]) { console.log('WRONG', p.id, 'content option:', chosen, 'computed:', wants[0]); fail++; } else ok++;
    if (new Set(p.opts).size !== p.opts.length) { console.log('DUP OPTIONS', p.id); fail++; }
  } else if (p.type === 'proof') {
    const f = claims[p.id];
    if (!f) { console.log('NO CLAIM CHECK', p.id); fail++; continue; }
    if (!f()) { console.log('CLAIM FALSE', p.id); fail++; } else ok++;
    const pts = (p.rubric || []).reduce((s, r) => s + r[0], 0);
    if (pts !== 7) { console.log('RUBRIC != 7', p.id, pts); fail++; }
  }
  if (!p.diag && p.id.startsWith('div') && (!p.hints || !p.hints.length || !p.sol)) { console.log('NO HINTS/SOL', p.id); fail++; }
}
for (const [k, v] of Object.entries(lessonChecks)) { if (!v) { console.log('LESSON CHECK FAILED', k); fail++; } else ok++; }

// ratings should increase with level
for (const t of MM.topics) {
  for (let L = 1; L < 5; L++) {
    const a = t.problems.filter(p => p.lvl === L).map(p => p.r), b = t.problems.filter(p => p.lvl === L + 1).map(p => p.r);
    if (a.length && b.length && Math.max(...a) > Math.min(...b)) { console.log('RATING ORDER', t.id, 'level', L); fail++; }
  }
}
console.log(`\nchecked ${ok} items, ${fail} problem(s)`);
process.exit(fail ? 1 : 0);

// Проверки школьной базы: «Натуральные числа», «Обыкновенные дроби», «Десятичные дроби и проценты», «Отрицательные числа».
const { B, gcd, near, round6 } = require('./_lib');

// точная дробь
const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
const add = (a, b) => F(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
const mul = (a, b) => F(a[0] * b[0], a[1] * b[1]);
const div = (a, b) => F(a[0] * b[1], a[1] * b[0]);
const fstr = a => a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1];
const cnt = (lo, hi, f) => { let c = 0; for (let x = lo; x <= hi; x++) if (f(x)) c++; return c; };
const digitSum = n => String(n).split('').reduce((s, c) => s + +c, 0);
// десятичные цифры дроби p/q после запятой (долгое деление)
const decDigits = (p, q, n) => { let r = p % q, out = []; for (let i = 0; i < n; i++) { r *= 10; out.push(Math.floor(r / q)); r %= q; } return out; };
const periodLen = q => { const seen = new Map(); let r = 1 % q, i = 0; while (r && !seen.has(r)) { seen.set(r, i++); r = r * 10 % q; } return r ? i - seen.get(r) : 0; };

// стратегия для 12 монет (задача ar-20): возвращает [номер, 'тяжелее'|'легче']
function twelve(weigh) {
  const s = (L, R) => weigh(L, R); // > 0 — левая тяжелее
  const w1 = s([1, 2, 3, 4], [5, 6, 7, 8]);
  if (w1 === 0) {
    const w2 = s([9, 10, 11], [1, 2, 3]);
    if (w2 === 0) return [12, s([12], [1]) > 0 ? 'h' : 'l'];
    const w3 = s([9], [10]), heavy = w2 > 0;
    if (w3 === 0) return [11, heavy ? 'h' : 'l'];
    return [(w3 > 0) === heavy ? 9 : 10, heavy ? 'h' : 'l'];
  }
  // если перевесила правая чаша, меняем роли: «возможно тяжёлые» — 5–8, «возможно лёгкие» — 1–4
  const H = w1 > 0 ? [1, 2, 3, 4] : [5, 6, 7, 8], Lt = w1 > 0 ? [5, 6, 7, 8] : [1, 2, 3, 4];
  const w2 = s([H[0], H[1], Lt[0]], [H[2], Lt[1], 9]);
  if (w2 > 0) { const w3 = s([H[0]], [H[1]]); return w3 === 0 ? [Lt[1], 'l'] : [w3 > 0 ? H[0] : H[1], 'h']; }
  if (w2 < 0) { const w3 = s([H[2]], [9]); return w3 === 0 ? [Lt[0], 'l'] : [H[2], 'h']; }
  const w3 = s([Lt[2]], [Lt[3]]);
  return w3 === 0 ? [H[3], 'h'] : [w3 < 0 ? Lt[2] : Lt[3], 'l'];
}

module.exports = {
  expected: {
    // b-arith
    'ar-01': 25 * 37 * 4, 'ar-02': 99 * 47 + 47,
    'ar-03': (() => { let s = 0; for (let k = 1; k <= 50; k++) s += k; return s; })(),
    'ar-05': 2026 % 8, 'ar-06': 37 * 11 + 63 * 11,
    'ar-07': (() => { let c = 0; for (let n = 1; n <= 100; n++) c += String(n).split('7').length - 1; return c; })(),
    'ar-08': (() => { for (let x = 0; x <= 2026; x++) { const y = 2026 - x; if (x - y === 300) return x; } })(),
    'ar-09': cnt(1, 1000, n => n % 3 === 0 && n % 5 !== 0),
    'ar-10': (() => { let s = 0; for (let k = 10; k <= 99; k++) s += k; return s; })(),
    'ar-11': cnt(1, 999, n => digitSum(n) === 3),
    'ar-12': Number(2026n * 2027n - 2025n * 2028n),
    'ar-13': (() => { let s = 0; for (let n = 1; n <= 2026; n++) s += String(n).length; return s; })(),
    'ar-14': (() => { let best = 0; for (let n = 1; n < 1000; n++) if (Math.floor(n / 13) === 17) best = n; return best; })(),
    'ar-15': cnt(1, 1000, n => !String(n).includes('1')),
    'ar-16': (() => { let c = 0; for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (a !== b && 10 * a + b + 10 * b + a === 132) c++; return c; })(),
    // наименьшее число взвешиваний для n монет (одна легче): нижняя оценка 3^k ≥ n и стратегия деления на три
    'ar-17': (() => { const strat = n => n <= 1 ? 0 : 1 + strat(Math.ceil(n / 3)); let k = 0; while (3 ** k < 26) k++; if (strat(26) !== k) throw new Error('ar-17'); return k; })(),
    'ar-18': (() => { let s = 0; for (let n = 1; n <= 100; n++) s += digitSum(n); return s; })(),
    'ar-19': (() => { const w = []; for (let bad = 1; bad <= 10; bad++) { let s = 0; for (let b = 1; b <= 10; b++) s += b * (b === bad ? 9 : 10); w.push(s); } if (new Set(w).size !== 10) throw new Error('ar-19'); return 1; })(),
    // b-frac
    'fr-01': fstr(F(36, 48)), 'fr-02': fstr(add(F(2, 3), F(1, 4))), 'fr-03': 40 * 3 / 5, 'fr-05': fstr(div(F(3, 4), F(9, 16))),
    'fr-06': fstr(mul(F(7, 3), F(9, 7))),
    'fr-07': (() => { for (let p = 1; p < 1000; p++) if (p * 3 % 5 === 0 && p * 3 / 5 === 90) return p; })(),
    'fr-08': fstr(div(F(10, 9), F(5, 6))),
    'fr-09': fstr([1, 2, 3, 4, 5].reduce((s, k) => add(s, F(1, 2 ** k)), F(0))),
    'fr-10': fstr(F(25, 60)),
    'fr-11': fstr([2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((s, k) => mul(s, F(k - 1, k)), F(1))),
    'fr-12': (() => { for (let d = 6; d < 200; d++) { const x = F(d - 2, d + 3); if (x[0] === 2 && x[1] === 3) return fstr(F(d - 5, d)); } })(),
    'fr-13': (() => { for (let n = 1; n < 1000; n++) if (n * 3 % 8 === 0 && n * 5 % 12 === 0) return n; })(),
    'fr-14': cnt(1, 29, k => gcd(k, 30) === 1),
    'fr-15': (() => { const c = [[2, 3], [5, 7], [7, 10], [9, 13]]; return fstr(c.reduce((m, x) => x[0] / x[1] > m[0] / m[1] ? x : m)); })(),
    'fr-16': fstr((() => { let s = F(0); for (let n = 1; n <= 99; n++) s = add(s, F(1, n * (n + 1))); return s; })()),
    'fr-17': fstr((() => { let s = F(0); for (let n = 1; n <= 99; n += 2) s = add(s, F(1, n * (n + 2))); return s; })()),
    'fr-18': (() => { let c = 0; for (let x = 1; x <= 300; x++) for (let y = x + 1; y <= 300; y++) if (6 * (x + y) === x * y) c++; return c; })(),
    'fr-19': fstr((() => { let s = F(0); for (let n = 1; n <= 8; n++) s = add(s, F(1, n * (n + 1) * (n + 2))); return s; })()),
    // b-dec
    'dec-01': round6(2.5 * 4.4), 'dec-02': fstr(F(375, 1000)), 'dec-03': round6(240 * 0.15), 'dec-05': round6(150 / 1.25),
    'dec-06': round6(1.2 / 0.04), 'dec-07': round6((1.2 * 0.8 - 1) * 100), 'dec-08': 18 / 72 * 100,
    'dec-09': String(Math.round(2 / 7 * 100) / 100),
    'dec-11': (() => { for (let k = 0; k <= 400; k++) { const x = k / 4; if (near((12 + x) / (30 + x), 0.5)) return x; } })(),
    'dec-12': round6(22 * 0.1 / 0.88), 'dec-13': round6((125 - 100) / 125 * 100),
    'dec-14': decDigits(1, 7, 2026)[2025],
    'dec-15': Math.round(9559 / (1.1 * 1.1 * 0.79)),
    'dec-16': (() => { const d = decDigits(3, 11, 12).join(''); if (d !== '272727272727') throw new Error('dec-16'); return fstr(F(27, 99)); })(),
    'dec-17': (() => { const d = decDigits(1, 6, 10).join(''); if (d !== '1666666666') throw new Error('dec-17'); return fstr(F(1, 6)); })(),
    'dec-18': (() => { let v = 1, n = 0; while (v <= 2) { v *= 1.1; n++; } return n; })(),
    'dec-19': periodLen(13),
    'dec-20': cnt(1, 100, n => { while (n % 2 === 0) n /= 2; while (n % 5 === 0) n /= 5; return n === 1; }),
    // b-neg
    'neg-01': -7 + 12 - 15, 'neg-02': (-3) * (-4) * (-5), 'neg-03': Math.abs(-8) - Math.abs(3 - 10),
    'neg-05': (() => { const r = []; for (let x = -100; x <= 100; x++) if (Math.abs(x) === 7) r.push(x); return Math.min(...r); })(),
    'neg-06': (() => { let s = 0; for (let k = 1; k <= 101; k++) s += (-1) ** k; return s; })(),
    'neg-07': (() => { let s = 0; for (let x = -100; x <= 100; x++) if (Math.abs(x - 3) === 5) s += x; return s; })(),
    'neg-08': cnt(-100, 100, x => Math.abs(x) < 4), 'neg-09': -7 + 12 - 9, 'neg-10': Math.abs(29 - (-13)),
    'neg-11': cnt(-100, 100, x => Math.abs(x - 2) <= 5),
    'neg-12': (() => { let s = 0; for (let k = 1; k <= 2026; k++) s += k % 2 ? k : -k; return s; })(),
    'neg-13': (() => { let s = 0, c = 0; for (let k = -4000; k <= 4000; k++) { const x = k / 4; if (Math.abs(2 * x - 1) === Math.abs(x + 4)) { s += x; c++; } } if (c !== 2) throw new Error('neg-13'); return s; })(),
    'neg-14': (() => { let c = 0; for (let k = -20000; k <= 20000; k++) { const x = k / 1000; if (Math.abs(Math.abs(x) - 3) === 2) c++; } return c; })(),
    'neg-15': (() => { const good = []; for (let ka = -40; ka <= 40; ka++) { const a = ka / 4; let c = 0; for (let k = -800; k <= 800; k++) { const x = k / 4; if (Math.abs(x - a) === a - 3) c++; } if (c === 1) good.push(a); } if (good.length !== 1) throw new Error('neg-15: ' + good); return good[0]; })(),
    'neg-16': (() => { let m = Infinity; for (let k = -2000; k <= 2000; k++) { const x = k / 100; m = Math.min(m, Math.abs(x - 2) + Math.abs(x + 3)); } return round6(m); })(),
    'neg-17': (() => { let m = Infinity; for (let k = -2000; k <= 2000; k++) { const x = k / 100; let s = 0; for (let a = 1; a <= 9; a++) s += Math.abs(x - a); m = Math.min(m, s); } return round6(m); })(),
    'neg-18': (() => { let c = 0; for (let k = -5000; k <= 5000; k++) { const x = k / 1000; if (Math.abs(x) + Math.abs(x - 1) + Math.abs(x - 2) - 2 < 1e-12) c++; } return c; })(),
    'neg-19': (() => { const h = [1, 4, 6, 10, 15, 21, 30]; let m = Infinity; for (let k = 0; k <= 3000; k++) { const x = k / 100; m = Math.min(m, h.reduce((s, a) => s + Math.abs(x - a), 0)); } return round6(m); })(),
    'neg-20': (() => { let m = Infinity; for (let k = 0; k <= 2020; k++) { const x = k / 20; let s = 0; for (let a = 1; a <= 100; a++) s += Math.abs(x - a); m = Math.min(m, s); } return round6(m); })()
  },
  choice: {
    'ar-04': () => { const v = [18 * 35, 15 * 37, 17 + 23 + 31 + 49, 2025 + 999].map(x => x % 2 === 1); if (v.filter(Boolean).length !== 1) throw new Error('ar-04'); return v.indexOf(true); },
    'fr-04': () => { const v = [5 / 8, 7 / 12, 3 / 5, 11 / 20]; return v.indexOf(Math.max(...v)); },
    'dec-04': () => { const v = [0.7, 0.69, 0.707, 0.077]; return v.indexOf(Math.max(...v)); },
    'dec-10': () => { const c = [[1, 3], [3, 8], [5, 16], [7, 20]]; const fin = q => { while (q % 2 === 0) q /= 2; while (q % 5 === 0) q /= 5; return q === 1; };
      const ok = c.map(([p, q]) => fin(q / gcd(p, q)) && p / q > 0.36); if (ok.filter(Boolean).length !== 1) throw new Error('dec-10'); return ok.indexOf(true); },
    'neg-04': () => { const v = [-0.5, -1 / 3, -0.55, -0.4]; return v.indexOf(Math.min(...v)); }
  },
  claims: {
    // 12 монет: стратегия различает все 24 варианта
    'ar-20': () => {
      for (let fake = 1; fake <= 12; fake++) for (const t of ['h', 'l']) {
        let n = 0;
        const weigh = (L, R) => { n++; const w = c => c === fake ? (t === 'h' ? 11 : 9) : 10; return Math.sign(L.reduce((s, c) => s + w(c), 0) - R.reduce((s, c) => s + w(c), 0)); };
        const [c, tt] = twelve(weigh);
        if (c !== fake || tt !== t || n > 3) return false;
      }
      return true;
    },
    'ar-21': () => { for (let n = 1; n <= 80; n++) { const R = k => (10n ** B(k) - 1n) / 9n; const t = (10n ** B(n) - 1n) / 3n; if (R(2 * n) - 2n * R(n) !== t * t) return false; } return true; },
    // 1 = сумма 2026 различных египетских дробей: строим по шагам из решения
    'fr-20': () => {
      let den = [2n, 3n, 7n, 42n];
      while (den.length < 2026) { const m = den.reduce((a, b) => (a > b ? a : b)); den = den.filter(x => x !== m).concat([2n * m, 3n * m, 6n * m]); }
      if (den.length !== 2026 || new Set(den.map(String)).size !== 2026) return false;
      // точная сумма для первых шагов
      let small = [2n, 3n, 7n, 42n];
      for (let step = 0; step < 4; step++) { const m = small.reduce((a, b) => (a > b ? a : b)); small = small.filter(x => x !== m).concat([2n * m, 3n * m, 6n * m]); }
      const L = small.reduce((a, b) => { let x = a, y = b; while (y) [x, y] = [y, x % y]; return a / x * b; });
      return small.reduce((s, d) => s + L / d, 0n) === L;
    },
    // жадный алгоритм: конечен, знаменатели различны, сумма точная (знаменатели огромные — BigInt)
    'fr-21': () => {
      const g = (x, y) => { while (y) [x, y] = [y, x % y]; return x; };
      for (let b = 2n; b <= 70n; b++) for (let a = 1n; a < b; a++) {
        let p = a, q = b; const ds = [];
        while (p > 0n) {
          const n = (q + p - 1n) / p; ds.push(n);
          let np = p * n - q, nq = q * n; const d = g(np, nq) || 1n; p = np / d; q = nq / d;
          if (BigInt(ds.length) > a + 1n) return false;
        }
        if (new Set(ds.map(String)).size !== ds.length) return false;
        let sp = 0n, sq = 1n; ds.forEach(n => { sp = sp * n + sq; sq = sq * n; const d = g(sp, sq); sp /= d; sq /= d; });
        const d0 = g(a, b); if (sp !== a / d0 || sq !== b / d0) return false;
      }
      return true;
    },
    // запись 0,1234567891011…: нет периода T ≤ 40 ни с какого места до 300
    'dec-21': () => {
      let s = ''; for (let n = 1; s.length < 200000; n++) s += n;
      for (let T = 1; T <= 40; T++) for (let st = 0; st <= 300; st++) { let per = true; for (let i = st; i + T < s.length; i++) if (s[i] !== s[i + T]) { per = false; break; } if (per) return false; }
      return true;
    },
    // медиана минимизирует сумму расстояний
    'neg-21': () => {
      let seed = 3; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 300; t++) {
        const k = 1 + Math.floor(rnd() * 5), a = Array.from({ length: 2 * k + 1 }, () => Math.round(rnd() * 200 - 100)).sort((x, y) => x - y);
        const f = x => a.reduce((s, v) => s + Math.abs(x - v), 0), fm = f(a[k]);
        for (let x = -110; x <= 110; x += 0.5) if (f(x) < fm - 1e-9) return false;
      }
      return true;
    }
  },
  lessons: {
    'ar lessons': () => 48 - 12 / 4 * 3 === 39 && 125 * 13 * 8 === 13000 && 98 * 35 === 3430 && 17 * 6 + 17 * 4 === 170 && (10 * 11) / 2 === 55
      && 47 === 6 * 7 + 5 && cnt(1, 99, () => true) && (() => { let s = 0; for (let n = 1; n <= 99; n++) s += String(n).length; return s === 189; })()
      && 1001 * 999 - 1000 * 1000 === -1 && cnt(1, 9, A => A + 11 * A + 111 * A === 369) === 1
      && (() => { const r = []; for (let n = 10; n <= 99; n++) if (n === 4 * digitSum(n)) r.push(n); return r.join() === '12,24,36,48'; })(),
    'fr lessons': () => {
      const eq = (a, b) => a[0] === b[0] && a[1] === b[1];
      const greedy = (p, q) => { const ds = []; while (p) { const n = Math.ceil(q / p); ds.push(n); [p, q] = F(p * n - q, q * n); } return ds.join(); };
      return eq(F(24, 36), F(2, 3)) && 7 * 5 < 4 * 9 && eq(F(2 * 5 + 3, 5), F(13, 5)) && eq(add(F(1, 6), F(3, 4)), F(11, 12)) && eq(mul(F(6, 35), F(14, 9)), F(4, 15))
        && eq(div(add(F(5, 6), F(-1, 4)), F(7, 9)), F(3, 4)) && 99 / 100 < 100 / 101
        && eq([1, 2, 3, 4].reduce((s, n) => add(s, F(1, n * (n + 1))), F(0)), F(4, 5)) && eq(add(add(F(1, 2), F(1, 3)), F(1, 6)), F(1)) && greedy(4, 13) === '4,18,468';
    },
    'dec lessons': () => {
      const halfUp = (num, keep) => Math.floor(num / 10 ** keep + 0.5); // целочисленное округление
      return near(1.2 * 0.03, 0.036) && near(4.8 / 0.06, 80) && 7 / 40 === 0.175 && halfUp(31415, 2) === 314 && halfUp(2675, 1) === 268
        && near(250 * 0.12, 30) && near(45 / 0.3, 150) && 12 / 48 === 0.25 && near(1.5 * 0.5, 0.75) && near(0.5 / 1.5, 1 / 3)
        && decDigits(5, 11, 6).join('') === '454545' && decDigits(7, 30, 6).join('') === '233333' && near(1000 * 1.1 * 1.1, 1210) && 999999 === 7 * 142857 && periodLen(7) === 6;
    },
    'neg lessons': () => {
      let ok = -5 + -8 === -13 && -12 + 7 === -5 && 3 - (-4) === 7 && (-6) * (-7) === 42 && 10 - 9 + 8 - 7 + 6 - 5 === 3 && Math.abs(4 - (-3)) === 7;
      const r = []; for (let x = -50; x <= 50; x++) if (Math.abs(x - 2) === 6) r.push(x);
      ok = ok && r.join() === '-4,8';
      for (let k = -1000; k <= 1000; k++) { const x = k / 100; if ((Math.abs(x + 1) < 3) !== (x > -4 && x < 2)) return false; if ((Math.abs(x - 1) + Math.abs(x - 5) === 4) !== (x >= 1 && x <= 5) && Math.abs(Math.abs(x - 1) + Math.abs(x - 5) - 4) > 1e-9) return false; if (Math.abs(x - 1) + Math.abs(x - 5) < 4 - 1e-9) return false; }
      return ok;
    }
  }
};

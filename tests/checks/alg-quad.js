// Проверки темы «Квадратные уравнения и теорема Виета».
// Ответы считаются независимо от решений: перебором, поиском корней по смене знака, численной оптимизацией.
const { B, isPrime, rnd, rint, rreal, near, round6 } = require('./_lib');

// все действительные корни функции на отрезке: смена знака + деление пополам, плюс точные нули
function realRoots(f, lo, hi, step = 0.000731) {
  const out = [];
  const add = r => { if (!out.some(x => Math.abs(x - r) < 1e-7)) out.push(r); };
  let x0 = lo, f0 = f(x0);
  if (f0 === 0) add(x0);
  for (let x1 = lo + step; x1 <= hi; x1 += step) {
    const f1 = f(x1);
    if (f1 === 0) add(x1);
    else if (f0 !== 0 && Math.sign(f0) !== Math.sign(f1) && isFinite(f0) && isFinite(f1)) {
      let a = x0, b = x1, fa = f0;
      for (let i = 0; i < 80; i++) { const m = (a + b) / 2, fm = f(m); if (fm === 0) { a = b = m; break; } if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; }
      add((a + b) / 2);
    }
    x0 = x1; f0 = f1;
  }
  return out.sort((a, b) => a - b);
}
// корни многочлена ax² + bx + c с учётом касания: ищем ещё и минимумы |f|, равные нулю
function quadRoots(a, b, c) {
  const f = x => a * x * x + b * x + c;
  const R = 1 + Math.max(Math.abs(b), Math.abs(c)) / Math.abs(a); // все корни лежат в [−R; R]
  const r = realRoots(f, -R - 0.5, R + 0.5, (2 * R + 1) / 20011);
  const v = -b / (2 * a);
  if (Math.abs(f(v)) < 1e-12 && !r.some(x => Math.abs(x - v) < 1e-6)) r.push(v);
  return r.sort((x, y) => x - y);
}
// число → несократимая дробь строкой ('7/3', '-5/3', '4')
function toFrac(x, maxDen = 2000) {
  for (let q = 1; q <= maxDen; q++) {
    const p = Math.round(x * q);
    if (Math.abs(x - p / q) < 1e-9) {
      const g = (a, b) => b ? g(b, a % b) : Math.abs(a);
      const d = g(p, q);
      return q / d === 1 ? String(p / d) : (p / d) + '/' + (q / d);
    }
  }
  throw new Error('toFrac: не дробь ' + x);
}
// минимум функции: сетка + уточнение золотым сечением
function minimize(f, lo, hi, n = 20000) {
  let bx = lo, bv = Infinity;
  for (let i = 0; i <= n; i++) { const x = lo + (hi - lo) * i / n, v = f(x); if (v < bv) { bv = v; bx = x; } }
  let a = bx - (hi - lo) / n, b = bx + (hi - lo) / n;
  const g = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 100; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) < f(d)) b = d; else a = c; }
  return { x: (a + b) / 2, v: f((a + b) / 2) };
}
const isSquareBig = n => { if (n < 0n) return false; let r = B(Math.floor(Math.sqrt(Number(n)))); while (r * r > n) r--; while ((r + 1n) * (r + 1n) <= n) r++; return r * r === n; };

module.exports = {
  expected: {
    'quad-01': Math.max(...quadRoots(3, -12, 0)),
    'quad-02': Math.min(...quadRoots(2, 0, -50)),
    'quad-03': (-5) ** 2 - 4 * 2 * (-3),
    'quad-04': Math.max(...quadRoots(1, 2, -15)),
    'quad-06': (() => { const ps = []; for (let p = -50; p <= 50; p++) if (9 + 3 * p - 12 === 0) ps.push(p); if (ps.length !== 1) throw new Error('quad-06'); const r = quadRoots(1, ps[0], -12).filter(x => !near(x, 3)); if (r.length !== 1) throw new Error('quad-06 root'); return round6(r[0]); })(),
    'quad-08': (() => { const r = quadRoots(4, -4, 1); if (r.length !== 1) throw new Error('quad-08'); return toFrac(r[0]); })(),
    'quad-09': toFrac(Math.min(...quadRoots(3, -7, 2))),
    'quad-10': (() => { const bs = []; for (let b = -50; b <= 50; b++) if (near(minimize(x => x * x + b * x + 7, -100, 100).x, 4, 1e-5)) bs.push(b); if (bs.length !== 1) throw new Error('quad-10'); return bs[0]; })(),
    'quad-11': (() => { const [x1, x2] = quadRoots(1, -5, -3); return toFrac(1 / x1 + 1 / x2); })(),
    'quad-12': realRoots(x => x ** 4 - 5 * x * x - 36, -50, 50).length,
    'quad-13': (() => { let c = 0; for (let x = -100; x <= 100; x++) if (x * x - 5 * x - 14 < 0) c++; return c; })(),
    'quad-15': (() => { const cs = []; for (let c = -100; c <= 100; c++) { const r = quadRoots(1, -7, c); if (r.length === 2 && near(r[1] - r[0], 3)) cs.push(c); } if (cs.length !== 1) throw new Error('quad-15'); return cs[0]; })(),
    'quad-16': (() => { let best = null; for (let a = 1; a <= 60; a++) for (let b = a; b <= 60; b++) if (a * b === 60 && 2 * (a + b) === 32) best = b; return best; })(),
    'quad-17': (() => { const p = -(-3 + 5), q = -3 * 5; if (9 - 3 * p + q !== 0 || 25 + 5 * p + q !== 0) throw new Error('quad-17'); return 1 + p + q; })(),
    'quad-18': (() => { const [x1, x2] = quadRoots(1, 3, -1); return round6(x1 / x2 + x2 / x1); })(),
    'quad-19': (() => {
      const f = x => 2 * x / (x + 1) + 3 / (x - 1) - 6 / (x * x - 1);
      // смена знака у полюсов не корень: оставляем только точки, где |f| мало
      const r = realRoots(f, -20, 20).filter(x => Math.abs(x - 1) > 1e-3 && Math.abs(x + 1) > 1e-3 && Math.abs(f(x)) < 1e-6);
      if (r.length !== 1) throw new Error('quad-19: ' + r);
      return toFrac(r[0]);
    })(),
    'quad-20': (() => { let c = 0; for (let p = -200; p <= 200; p++) { let ok = 0; for (let x = -200; x <= 200; x++) if (x * x + p * x + 12 === 0) ok++; if (ok === 2) c++; } return c; })(),
    'quad-21': round6(realRoots(x => (x * x - 2 * x) ** 2 - 11 * (x * x - 2 * x) + 24, -50, 50).reduce((s, x) => s + x * x, 0)),
    'quad-22': round6(realRoots(x => (x + 1) * (x + 2) * (x + 3) * (x + 4) - 120, -50, 50).reduce((s, x) => s * x, 1)),
    'quad-23': round6(minimize(x => (x - 1) * (x - 2) * (x - 3) * (x - 4), -5, 10).v),
    'quad-24': (() => {
      const as = [];
      for (let k = -400; k <= 400; k++) {
        const a = k / 20, r1 = quadRoots(1, a, 1), r2 = quadRoots(1, 1, a);
        if (r1.some(x => r2.some(y => Math.abs(x - y) < 1e-7))) as.push(a);
      }
      if (as.length !== 1) throw new Error('quad-24: ' + as);
      return as[0];
    })(),
    'quad-25': (() => {
      const as = [];
      for (let k = -1200; k <= 1200; k++) {
        const a = k / 24;
        const n = a === 0 ? 1 : quadRoots(a, -(a + 1), 1).length;
        if (n === 1) as.push(a);
      }
      return as.length;
    })(),
    'quad-26': (() => {
      let best = null, bv = Infinity;
      for (let k = -20000; k <= 20000; k++) {
        const a = k / 1000, D = 4 * a * a - 4 * (6 * a - 5);
        if (D < -1e-12) continue;
        const s = Math.sqrt(Math.max(D, 0)), x1 = (2 * a + s) / 2, x2 = (2 * a - s) / 2, v = x1 * x1 + x2 * x2;
        if (v < bv - 1e-12) { bv = v; best = a; }
      }
      return round6(best);
    })(),
    'quad-27': (() => {
      const qs = [];
      for (let p = -30; p <= 30; p++) for (let q = -30; q <= 30; q++) {
        if (!p || !q) continue;
        const r = quadRoots(1, p, q);
        const ms = r.length === 1 ? [r[0], r[0]] : r;
        const want = [p, q].sort((a, b) => a - b);
        if (ms.length === 2 && near(ms[0], want[0]) && near(ms[1], want[1])) qs.push(q);
      }
      if (qs.length !== 1) throw new Error('quad-27: ' + qs);
      return qs[0];
    })(),
    'quad-28': (() => { let c = 0; for (let x = -100; x <= 100; x++) if ((x * x - 5 * x) ** 2 < 36) c++; return c; })(),
    'quad-29': (() => {
      if (!isPrime(2027)) throw new Error('2027 not prime');
      let best = -Infinity;
      for (let r1 = -5000; r1 <= 5000; r1++) {
        if (r1 === 1) continue;
        const num = 2026 + r1, den = r1 - 1;
        if (num % den !== 0) continue;
        const r2 = num / den, p = -(r1 + r2), q = r1 * r2;
        if (p + q !== 2026) throw new Error('quad-29 algebra');
        best = Math.max(best, r1, r2);
      }
      return best;
    })(),
    'quad-31': (() => {
      // z допустимо, если найдётся x: y = 5 − z − x и xy + z(x + y) = 8
      const ok = z => { const g = x => -(x * (5 - z - x) + z * (5 - z) - 8); return minimize(g, -50, 50, 4000).v <= 1e-12; };
      let lo = 1.5, hi = 5;
      if (!ok(lo) || ok(hi)) throw new Error('quad-31 bracket');
      for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (ok(m)) lo = m; else hi = m; }
      const z = lo, x = (5 - z) / 2;
      if (!near(x + x + z, 5) || !near(x * x + 2 * x * z, 8, 1e-6)) throw new Error('quad-31 point');
      return toFrac(z);
    })(),
    'quad-33': (() => { let c = 0; for (let x = -60; x <= 60; x++) for (let y = -60; y <= 60; y++) if (x * x - x * y + y * y === x + y) c++; return c; })(),
    'quad-36': (() => {
      const vals = new Set();
      for (let a = -8; a <= 8; a++) for (let b = -8; b <= 8; b++) for (let c = -8; c <= 8; c++) for (let d = -8; d <= 8; d++) {
        if (a * a - 4 * b <= 0 || c * c - 4 * d <= 0) continue;
        const f = x => x * x + a * x + b, g = x => x * x + c * x + d;
        if (f(1) !== g(2) || g(1) !== f(2)) continue;
        const s = [...quadRoots(1, a, b), ...quadRoots(1, c, d)].reduce((s, x) => s + x, 0);
        vals.add(round6(s));
      }
      if (vals.size !== 1) throw new Error('quad-36: ' + [...vals]);
      return [...vals][0];
    })(),
    'quad-37': (() => {
      const res = new Set();
      const As = [-3, -2, -1, -0.5, 0.5, 1, 2, 3];
      for (const A of As) for (let h = -2; h <= 2; h++) for (let k2 = -12; k2 <= 12; k2++) {
        const k = k2 / 2;
        const n = v => { const t = (v - k) / A; return t > 0 ? 2 : t === 0 ? 1 : 0; };
        // проверяем и прямым поиском корней, что счёт по вершине верен
        const f = x => A * (x - h) ** 2 + k;
        const cnt = vs => vs.reduce((s, v) => s + n(v), 0);
        if (cnt([0, 2, -2]) !== 3) continue;
        // касание в вершине (k ∈ {0, 2, −2}) не даёт смены знака — его добавляем отдельно
        const rr = realRoots(x => f(x) ** 3 - 4 * f(x), -20, 20, 0.0123);
        const tangent = [0, 2, -2].includes(k) && !rr.some(x => Math.abs(x - h) < 1e-6);
        const direct = rr.length + (tangent ? 1 : 0);
        if (direct !== 3) throw new Error('quad-37 direct ' + A + ' ' + h + ' ' + k);
        res.add(cnt([1, -1]));
      }
      if (res.size !== 1) throw new Error('quad-37: ' + [...res]);
      return [...res][0];
    })()
  },
  choice: {
    'quad-05': String(quadRoots(1, -4, 5).length),
    'quad-07': () => {
      const fs = [x => x * x - 3 * x - 10, x => x * x + 3 * x - 10, x => x * x + 3 * x + 10, x => x * x - 7 * x + 10];
      const idx = fs.map((f, i) => f(2) === 0 && f(-5) === 0 ? i : -1).filter(i => i >= 0);
      if (idx.length !== 1) throw new Error('quad-07');
      return idx[0];
    },
    'quad-14': () => {
      const r = quadRoots(2, 7, 3);
      const s = r.length === 0 ? 'корней нет' : r.every(x => x > 0) ? 'оба положительные' : r.every(x => x < 0) ? 'оба отрицательные' : 'разных знаков';
      return ['оба положительные', 'оба отрицательные', 'разных знаков', 'корней нет'].indexOf(s);
    }
  },
  claims: {
    // нечётные коэффициенты: дискриминант никогда не точный квадрат
    'quad-30': () => {
      for (let a = -41; a <= 41; a += 2) for (let b = -41; b <= 41; b += 2) for (let c = -41; c <= 41; c += 2) {
        const D = B(b * b - 4 * a * c);
        if (isSquareBig(D)) return false;
      }
      return true;
    },
    // хотя бы один из трёх дискриминантов неотрицателен, и сумма D/4 равна полусумме квадратов
    'quad-32': () => {
      for (let t = 0; t < 20000; t++) {
        const a = rreal(-9, 9), b = rreal(-9, 9), c = rreal(-9, 9);
        const D = [4 * a * a - 4 * b * c, 4 * b * b - 4 * c * a, 4 * c * c - 4 * a * b];
        if (Math.max(...D) < 0) return false;
        if (!near(D.reduce((s, x) => s + x, 0) / 4, ((a - b) ** 2 + (b - c) ** 2 + (c - a) ** 2) / 2)) return false;
      }
      return true;
    },
    // дискриминант суммы трёх произведений положителен; коэффициенты восстанавливаем по значениям в 0 и ±1
    'quad-34': () => {
      for (let t = 0; t < 20000; t++) {
        const a = rreal(-9, 9), b = rreal(-9, 9), c = rreal(-9, 9);
        if (Math.min(Math.abs(a - b), Math.abs(b - c), Math.abs(c - a)) < 1e-3) continue;
        const f = x => (x - a) * (x - b) + (x - b) * (x - c) + (x - c) * (x - a);
        const C0 = f(0), A = (f(1) + f(-1)) / 2 - C0, Bc = (f(1) - f(-1)) / 2;
        if (!near(A, 3) || !(Bc * Bc - 4 * A * C0 > 0)) return false;
        const s = [a, b, c].sort((x, y) => x - y);
        if (!(f(s[1]) < 0)) return false;
      }
      return true;
    },
    // натуральные корни → a² + b² составное
    'quad-35': () => {
      for (let r1 = 1; r1 <= 80; r1++) for (let r2 = r1; r2 <= 80; r2++) {
        const a = -(r1 + r2), b = r1 * r2 - 1, N = a * a + b * b;
        if (isPrime(N) || N < 4) return false;
        if (N !== (r1 * r1 + 1) * (r2 * r2 + 1)) return false;
      }
      return true;
    },
    // стороны треугольника → корней нет
    'quad-38': () => {
      for (let t = 0; t < 20000; t++) {
        const a = rreal(0.01, 10), b = rreal(0.01, 10), c = rreal(0.01, 10);
        if (!(a < b + c && b < a + c && c < a + b)) continue;
        const D = (b * b + c * c - a * a) ** 2 - 4 * b * b * c * c;
        if (!(D < 0)) return false;
        if (!near(D, (b - c - a) * (b - c + a) * (b + c - a) * (b + c + a), 1e-6)) return false;
      }
      return true;
    },
    // xⁿ + yⁿ для корней x² − 6x + 1 = 0: целые и не делятся на 5
    'quad-39': () => {
      const x1 = 3 + 2 * Math.sqrt(2), x2 = 3 - 2 * Math.sqrt(2);
      let s0 = 2n, s1 = 6n;
      if (!near(x1 + x2, 6) || !near(x1 * x2, 1)) return false;
      for (let n = 2; n <= 400; n++) {
        const s2 = 6n * s1 - s0;
        if (n <= 15 && !near(Number(s2), x1 ** n + x2 ** n, 1e-9)) return false;
        if (s2 % 5n === 0n) return false;
        s0 = s1; s1 = s2;
      }
      return s1 % 5n !== 0n;
    },
    // max(|f(1)|, |f(2)|, |f(3)|) ≥ 1/2, и оценка точная
    'quad-40': () => {
      const m = (p, q) => Math.max(Math.abs(1 + p + q), Math.abs(4 + 2 * p + q), Math.abs(9 + 3 * p + q));
      for (let t = 0; t < 50000; t++) if (m(rreal(-20, 20), rreal(-20, 20)) < 0.5) return false;
      let best = Infinity;
      for (let p = -8; p <= 0; p += 0.01) for (let q = 0; q <= 8; q += 0.01) best = Math.min(best, m(p, q));
      return best >= 0.5 - 1e-9 && best < 0.51 && near(m(-4, 3.5), 0.5);
    }
  },
  lessons: {
    'quad-l1 examples': () => {
      const r = quadRoots(1, 6, -7), r2 = quadRoots(5, 2, 0), r3 = quadRoots(9, 0, -4);
      return near(r[0], -7) && near(r[1], 1) && near(r2[0], -0.4) && near(r2[1], 0) && near(r3[0], -2 / 3) && near(r3[1], 2 / 3) && quadRoots(1, 0, 16).length === 0;
    },
    'quad-l2 examples': () => {
      const a = quadRoots(2, -3, -2), b = quadRoots(3, -8, 5), c = quadRoots(7, -9, 2), d = quadRoots(5, 7, 2);
      return near(a[0], -0.5) && near(a[1], 2) && near(b[0], 1) && near(b[1], 5 / 3) && near(c[0], 2 / 7) && near(c[1], 1) && near(d[0], -1) && near(d[1], -0.4);
    },
    'quad-l3 examples': () => {
      const a = quadRoots(1, -9, 20), b = quadRoots(1, 2, -24), [x1, x2] = quadRoots(1, -4, 1);
      return near(a[0], 4) && near(a[1], 5) && near(b[0], -6) && near(b[1], 4) && near(x1 * x1 + x2 * x2, 14) && near((x1 - x2) ** 2, 12)
        && near(x1, 2 - Math.sqrt(3)) && near(x2, 2 + Math.sqrt(3)) && quadRoots(1, 1, 1).length === 0;
    },
    'quad-l4 examples': () => {
      for (let x = -5; x <= 5; x += 0.37) if (!near(2 * x * x - 3 * x - 2, (x - 2) * (2 * x + 1))) return false;
      const r1 = realRoots(x => x ** 4 - 10 * x * x + 9, -20, 20);
      const r2 = realRoots(x => x * (x + 1) * (x + 2) * (x + 3) - 24, -20, 20);
      const r3 = realRoots(x => 2 * x ** 4 - 5 * x ** 3 + 4 * x * x - 5 * x + 2, -20, 20);
      return r1.length === 4 && [-3, -1, 1, 3].every((v, i) => near(r1[i], v)) && r2.length === 2 && near(r2[0], -4) && near(r2[1], 1)
        && r3.length === 2 && near(r3[0], 0.5) && near(r3[1], 2);
    },
    'quad-l5 examples': () => {
      const m = minimize(x => -(-2 * x * x + 8 * x - 3), -10, 10);
      if (!near(m.x, 2, 1e-5) || !near(-m.v, 5)) return false;
      for (let x = -5; x <= 6; x += 0.013) if ((x * x - 2 * x - 3 < 0) !== (x > -1 && x < 3)) return false;
      return true;
    },
    'quad-l6 examples': () => {
      // x² + ax + a: целые корни ровно при a = 0 и a = 4
      const good = [];
      for (let a = -100; a <= 100; a++) { const r = quadRoots(1, a, a); if (r.length && r.every(x => near(x, Math.round(x)))) good.push(a); }
      if (good.join() !== '0,4') return false;
      // общий корень у x² + ax − 6 и x² − 6x + a ровно при a = 5 и a = −6
      const common = [];
      for (let a = -50; a <= 50; a++) { const r1 = quadRoots(1, a, -6), r2 = quadRoots(1, -6, a); if (r1.some(x => r2.some(y => near(x, y)))) common.push(a); }
      if (common.join() !== '-6,5') return false;
      // x² + xy + y² = 3: наибольшее x + y равно 2
      let best = -Infinity;
      for (let t = 0; t < 200000; t++) { const phi = rreal(0, 2 * Math.PI); const u = Math.cos(phi), v = Math.sin(phi), k = Math.sqrt(3 / (u * u + u * v + v * v)); best = Math.max(best, k * (u + v)); }
      return best <= 2 + 1e-9 && best > 1.9999;
    }
  }
};

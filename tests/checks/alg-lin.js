// Проверки темы «Линейные уравнения, системы, модуль».
// Уравнения решаются поиском нулей ломаной, системы — методом Гаусса, целочисленные условия — перебором.
const { near, round6 } = require('./_lib');
const { solveLin, rank, plZeros, toFrac, range, cntInt } = require('./_linlib');
const A = Math.abs;
const one = r => { if (r.inf || r.pts.length !== 1) throw new Error('ожидался один корень'); return round6(r.pts[0]); };
// значения параметра на сетке, при которых выполняется условие
const params = (pred, lo = -12, hi = 12, step = 0.25) => range(lo, hi, step).filter(pred);
const onlyOne = list => { if (list.length !== 1) throw new Error('параметр не единственный: ' + list); return list[0]; };

// сумма модулей |x − 1| + … + |x − 8|
const sum8 = x => { let s = 0; for (let k = 1; k <= 8; k++) s += A(x - k); return s; };

module.exports = {
  expected: {
    'lin-01': one(plZeros(x => 3 * x - 7 - (2 * x + 5))),
    'lin-02': one(plZeros(x => 5 * (x - 2) - 3 * (x + 4))),
    'lin-03': one(plZeros(x => x / 3 + x / 4 - 14)),
    'lin-05': one(plZeros(x => 3 * x - 12)),
    'lin-06': (() => { const r = solveLin([[1, 1], [1, -1]], [10, 4]); return round6(r.x[0] * r.x[1]); })(),
    'lin-08': cntInt(1, 1000, x => 2 * (x - 3) < x + 4),
    'lin-09': one(plZeros(x => (2 * x - 1) / 3 - (x + 2) / 4 - 1)),
    'lin-10': (() => { const r = solveLin([[1, 1], [3, 1]], [5, 11]); return round6(r.x[1]); })(), // неизвестные k, b
    'lin-11': (() => { const r = solveLin([[2, -1], [1, 1]], [-1, 7]); return round6(r.x[0] + r.x[1]); })(),
    'lin-12': (() => { const r = solveLin([[2, 3], [3, -2]], [13, 0]); return round6(r.x[0] + r.x[1]); })(),
    'lin-13': cntInt(-100, 100, x => A(x - 1) + A(x + 2) === 3),
    'lin-14': (() => { const r = plZeros(x => A(2 * x - 3) - x); if (r.inf || r.pts.length !== 2) throw new Error('lin-14'); return round6(r.pts[0] + r.pts[1]); })(),
    'lin-16': (() => { const out = []; for (let n = 10; n <= 99; n++) { const a = Math.floor(n / 10), b = n % 10; if (n === 4 * (a + b) && n + 27 === 10 * b + a) out.push(n); } return onlyOne(out); })(),
    'lin-17': onlyOne(params(a => { const r = plZeros(x => (a * a - 4) * x - (a + 2)); return !r.inf && r.pts.length === 0; })),
    'lin-18': cntInt(-100, 100, x => A(3 * x - 4) <= 8),
    'lin-19': (() => { const r = solveLin([[1, 1, 0], [0, 1, 1], [1, 0, 1]], [11, 15, 14]); return round6(Math.max(...r.x)); })(),
    'lin-20': (() => { const r = plZeros(x => A(x + 1) - A(x - 2) - 3); if (!r.inf) throw new Error('lin-20'); return round6(r.min); })(),
    'lin-21': (() => { const r = solveLin([[2, 3], [4, -1]], [7, 7]); const [x, y] = r.x; return round6((9 - y) / x); })(),
    'lin-22': (() => {
      // вершины — попарные пересечения прямых y − x = 4, y + 2x = 4, y = 0
      const L = [[-1, 1, 4], [2, 1, 4], [0, 1, 0]], P = [];
      for (let i = 0; i < 3; i++) for (let j = i + 1; j < 3; j++) P.push(solveLin([L[i].slice(0, 2), L[j].slice(0, 2)], [L[i][2], L[j][2]]).x);
      const [p, q, r] = P; return round6(A((q[0] - p[0]) * (r[1] - p[1]) - (r[0] - p[0]) * (q[1] - p[1])) / 2);
    })(),
    'lin-23': onlyOne(params(a => solveLin([[a, 4], [1, a]], [8, a + 2]).status === 'inf')),
    'lin-24': (() => { const out = []; for (let x = 1; x <= 1000; x++) for (let y = 1; y <= 1000; y++) if (12 * x + 9 * y === 10 * (x + y) && 9 * x + 12 * y === 10 * (x + y) + 150) out.push(x + y); return onlyOne(out); })(),
    'lin-25': one(plZeros(x => A(A(x - 1) - 2) - x)),
    'lin-26': Math.max(...range(-100, 100).filter(x => A(x - 3) > 2 * x)),
    'lin-27': (() => { const r = solveLin([[1, 2, 3], [2, 3, 1], [3, 1, 2]], [14, 11, 11]); return round6(r.x.reduce((s, v) => s + v * v, 0)); })(),
    'lin-28': cntInt(-100, 100, x => A(x - 1) + A(x - 5) < 10),
    'lin-29': (() => { const M = [0, 1, 2, 3, 4].map(i => { const row = Array(5).fill(0); row[i] = 1; row[(i + 1) % 5] = 1; return row; }); return round6(solveLin(M, [1, 2, 3, 4, 5]).x[0]); })(),
    'lin-31': (() => { let m = Infinity; for (const x of range(-10, 10, 1 / 60)) m = Math.min(m, A(x - 1) + A(2 * x - 3) + A(3 * x - 5)); return round6(m); })(),
    'lin-33': (() => { const r = plZeros(x => sum8(x) - 20); if (r.inf || r.pts.length !== 2) throw new Error('lin-33'); return round6(r.pts[0] + r.pts[1]); })(),
    'lin-36': (() => {
      const out = [];
      for (const k of range(-10, 10, 0.5)) for (const b of range(-20, 20, 0.5)) { const f = x => k * x + b, g = x => f(f(f(x))); if (near(g(0), 21) && near(g(1), 29)) out.push(f(5)); }
      return onlyOne(out);
    })(),
    'lin-37': (() => {
      // клетки a b c / d e f / g h i, известны a = 2, c = 8, g = 14; неизвестные b, d, e, f, h, i, S
      const v = { b: 0, d: 1, e: 2, f: 3, h: 4, i: 5, S: 6 }, known = { a: 2, c: 8, g: 14 };
      const lines = ['abc', 'def', 'ghi', 'adg', 'beh', 'cfi', 'aei', 'ceg'], M = [], rhs = [];
      lines.forEach(L => { const row = Array(7).fill(0); let r = 0; for (const ch of L) { if (ch in known) r -= known[ch]; else row[v[ch]] += 1; } row[v.S] -= 1; M.push(row); rhs.push(r); });
      const s = solveLin(M, rhs); if (s.status !== 'unique') throw new Error('lin-37 ' + s.status); return round6(s.x[v.i]);
    })()
  },
  choice: {
    'lin-04': p => { const r = plZeros(x => 2 * (x + 3) - (2 * x + 6)); const n = r.inf ? 'бесконечно много' : ['ни одного', 'один', 'два'][r.pts.length]; return p.opts.indexOf(n); },
    'lin-07': p => {
      // прямые y = kx + b из вариантов; параллельна y = 2x − 5, если k тот же, а b другой
      const parse = s => { const m = s.replace(/−/g, '-').replace(/,/g, '.').replace(/\s/g, '').match(/^y=(.*)$/)[1]; const f = new Function('x', 'return ' + m.replace(/(\d)x/g, '$1*x')); return [f(1) - f(0), f(0)]; };
      const ok = p.opts.map(parse).map(([k, b]) => near(k, 2) && !near(b, -5));
      if (ok.filter(Boolean).length !== 1) throw new Error('lin-07'); return ok.indexOf(true);
    },
    'lin-15': p => {
      const st = p.opts.map(o => { const a = Number(o.replace('a = ', '').replace('−', '-')); return solveLin([[1, 2], [2, a]], [3, 5]).status; });
      if (st.filter(s => s === 'none').length !== 1) throw new Error('lin-15'); return st.indexOf('none');
    }
  },
  claims: {
    // система с четырьмя неизвестными разрешима ровно при a + c = b + d
    'lin-30': () => {
      const M = [[1, 1, 0, 0], [0, 1, 1, 0], [0, 0, 1, 1], [1, 0, 0, 1]];
      for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) for (let c = -5; c <= 5; c++) for (let d = -5; d <= 5; d++)
        if ((solveLin(M, [a, b, c, d]).status !== 'none') !== (a + c === b + d)) return false;
      return true;
    },
    // три прямые с попарно различными a, b, c не проходят через одну точку
    'lin-32': () => {
      for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) {
        if (a === b || b === c || a === c) continue;
        const x0 = (c - b) / (a - b), y0 = a * x0 + b;
        if (near(c * x0 + a, y0)) return false;
      }
      return true;
    },
    // «каждое — среднее соседей» на круге: только постоянные наборы
    'lin-34': () => {
      for (let n = 3; n <= 14; n++) {
        const M = []; for (let i = 0; i < n; i++) { const r = Array(n).fill(0); r[i] = 2; r[(i + 1) % n] -= 1; r[(i + n - 1) % n] -= 1; M.push(r); }
        const fix = Array(n).fill(0); fix[0] = 1;
        const s = solveLin([...M, fix], [...Array(n).fill(0), 1]);
        if (s.status !== 'unique' || !s.x.every(v => near(v, 1))) return false;
      }
      return true;
    },
    // коэффициенты — арифметические прогрессии: единственное решение всегда (−1; 2)
    'lin-35': () => {
      let seen = 0;
      for (let a = -4; a <= 4; a++) for (let p = -4; p <= 4; p++) for (let d = -4; d <= 4; d++) for (let q = -4; q <= 4; q++) {
        const s = solveLin([[a, a + p], [d, d + q]], [a + 2 * p, d + 2 * q]);
        if (s.status !== 'unique') continue; seen++;
        if (!near(s.x[0], -1) || !near(s.x[1], 2)) return false;
      }
      return seen > 100;
    },
    // пять чисел восстанавливаются по набору попарных сумм (алгоритм из решения)
    'lin-38': () => {
      let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 4000; t++) {
        const a = Array.from({ length: 5 }, () => Math.floor(rnd() * 21) - 10).sort((x, y) => x - y);
        const s = []; for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) s.push(a[i] + a[j]);
        s.sort((x, y) => x - y);
        const tot = s.reduce((u, v) => u + v, 0) / 4, a3 = tot - s[0] - s[9], a1 = s[1] - a3, a2 = s[0] - a1, a5 = s[8] - a3, a4 = s[9] - a5;
        if ([a1, a2, a3, a4, a5].join() !== a.join()) return false;
      }
      return true;
    },
    // круг, где каждое число — модуль разности двух следующих: ненулевые наборы только при n, кратном 3
    'lin-39': () => {
      const found = {};
      for (let n = 3; n <= 9; n++) {
        const V = n <= 7 ? 4 : 3, total = V ** n;
        for (let code = 1; code < total; code++) {
          const a = []; let c = code; for (let i = 0; i < n; i++) { a.push(c % V); c = Math.floor(c / V); }
          let ok = true; for (let i = 0; i < n && ok; i++) if (a[i] !== A(a[(i + 1) % n] - a[(i + 2) % n])) ok = false;
          if (ok) { if (n % 3) return false; found[n] = true; }
        }
      }
      return !!(found[3] && found[6] && found[9]);
    },
    // гири: на малых аналогах (5 гирь, чашки по 2; 7 гирь, чашки по 3) свойство есть только у равных весов
    'lin-40': () => {
      const good = (w, half) => w.every((_, skip) => {
        const rest = w.filter((_, i) => i !== skip), S = rest.reduce((u, v) => u + v, 0);
        if (S % 2) return false;
        const m = rest.length;
        for (let mask = 0; mask < 1 << m; mask++) { let cnt = 0, s = 0; for (let i = 0; i < m; i++) if (mask >> i & 1) { cnt++; s += rest[i]; } if (cnt === half && 2 * s === S) return true; }
        return false;
      });
      const test = (n, V, half) => { const total = V ** n; for (let code = 0; code < total; code++) { const w = []; let c = code; for (let i = 0; i < n; i++) { w.push(c % V); c = Math.floor(c / V); } if (good(w, half) && !w.every(x => x === w[0])) return false; } return true; };
      return test(5, 8, 2) && test(7, 4, 3);
    }
  },
  lessons: {
    'lin-l1 examples': () => one(plZeros(x => 4 * (x - 3) - 2 * (x + 1) - 6)) === 10 && one(plZeros(x => x / 2 - (x - 1) / 5 - 2)) === 6
      && plZeros(x => 3 * (x + 1) - (3 * x + 3)).inf && plZeros(x => 3 * (x + 1) - (3 * x + 5)).pts.length === 0
      && [-3, 0, 2, 5].every(a => near(one(plZeros(x => (a - 1) * x - (a * a - 1))), a + 1)) && plZeros(x => 0 * x).inf
      && range(-10, 10, 0.5).every(x => (3 - 2 * x >= 7) === (x <= -2)),
    'lin-l2 examples': () => { const s = solveLin([[-1, 1], [2, 1]], [4, -2]); return near(s.x[0], -2) && near(s.x[1], 2) && one(plZeros(x => -2 * x + 2)) === 1 && one(plZeros(x => x + 1 - (-x + 3))) === 1; },
    'lin-l3 examples': () => {
      const a = solveLin([[1, 2], [3, -1]], [8, 3]), b = solveLin([[5, 3], [2, -3]], [21, 0]);
      return near(a.x[0], 2) && near(a.x[1], 3) && near(b.x[0], 3) && near(b.x[1], 2)
        && solveLin([[2, -3], [4, -6]], [4, 9]).status === 'none' && solveLin([[2, -3], [4, -6]], [4, 8]).status === 'inf'
        && 5 * -3 - 2 * 3 === -21 && 21 * -3 - 0 * 3 === -63 && 5 * 0 - 2 * 21 === -42;
    },
    'lin-l4 examples': () => {
      const n = []; for (let x = 10; x <= 99; x++) { const a = Math.floor(x / 10), b = x % 10; if (a + b === 11 && (10 * b + a) - x === 45) n.push(x); }
      const p = solveLin([[3, 2], [2, 3]], [13, 12]), m = solveLin([[1, 1], [0.3, 0.6]], [12, 6]);
      return n.join() === '38' && near(p.x[0], 3) && near(p.x[1], 2) && near(m.x[0], 4) && near(m.x[1], 8);
    },
    'lin-l5 examples': () => {
      const r1 = plZeros(x => A(x - 4) - (2 * x + 1)), r2 = plZeros(x => A(x + 1) + A(x - 3) - 6);
      const grid = range(-10, 10, 0.25);
      return r1.pts.map(round6).join() === '1' && !r1.inf && r2.pts.map(round6).join() === '-2,4'
        && grid.every(x => (A(2 * x - 1) < 5) === (x > -2 && x < 3)) && grid.every(x => (A(x + 2) >= 3) === (x <= -5 || x >= 1))
        && grid.every(x => A(x - 1) + A(7 - x) >= 6 - 1e-9 && (near(A(x - 1) + A(7 - x), 6) === (x >= 1 && x <= 7)));
    },
    'lin-l6 examples': () => {
      const s = solveLin([[0, 1, 1, 1], [1, 0, 1, 1], [1, 1, 0, 1], [1, 1, 1, 0]], [10, 11, 12, 15]), t = solveLin([[1, 2], [2, 1]], [5, 7]);
      let m = Infinity; for (const x of range(-10, 10, 1 / 60)) m = Math.min(m, 2 * A(x - 1) + A(x - 5));
      const f = x => 2 * x + 1;
      return s.x.map(round6).join() === '6,5,4,1' && near(t.x[0] + t.x[1], 4) && near(t.x[0] - t.x[1], 2) && near(m, 4)
        && rank([[2, -1, -1], [-1, 2, -1], [-1, -1, 2]]) === 2 && [0, 1, 7].every(x => f(f(x)) === 4 * x + 3);
    }
  }
};

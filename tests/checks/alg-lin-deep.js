// Проверки глубокого уровня темы «Линейные уравнения, системы, модуль».
const { near, round6 } = require('./_lib');
const { solveLin, rank, plZeros, gridArea, shoelace, toFrac, range } = require('./_linlib');
const A = Math.abs;
const onlyOne = list => { if (list.length !== 1) throw new Error('параметр не единственный: ' + list); return list[0]; };
const nest = x => A(A(A(A(x) - 1) - 1) - 1);
// циркулянтная матрица: в строке i коэффициенты coef[j] при x_{i+j}
const circ = (n, coef) => Array.from({ length: n }, (_, i) => { const r = Array(n).fill(0); Object.entries(coef).forEach(([j, c]) => { r[(i + +j + n) % n] += c; }); return r; });

module.exports = {
  expected: {
    'lin-41': onlyOne(range(-12, 12, 0.25).filter(a => solveLin([[a + 1, 8], [a, a + 3]], [4 * a, 3 * a - 1]).status === 'none')),
    'lin-42': (() => {
      const inside = (x, y) => A(x) + A(y) + A(x + y) <= 4, s = gridArea(inside, 4.5, 0.005);
      const hex = [[2, 0], [0, 2], [-2, 2], [-2, 0], [0, -2], [2, -2]];
      if (!hex.every(([x, y]) => near(A(x) + A(y) + A(x + y), 4)) || A(s - shoelace(hex)) > 0.1) throw new Error('lin-42');
      return shoelace(hex);
    })(),
    'lin-44': (() => {
      let c = 0;
      for (let k = -10; k <= 10; k++) { const r = plZeros(x => A(x + 2) + A(x - 2) - k * x - 6, -100, 100, 12); if (!r.inf && r.pts.length === 2) c++; }
      return c;
    })(),
    'lin-46': (() => {
      const M = [[1, 2, 3, 4, 5], [5, 1, 2, 3, 4], [4, 5, 1, 2, 3], [3, 4, 5, 1, 2], [2, 3, 4, 5, 1]];
      const s = solveLin(M, [8, 10, 7, 14, 6]); if (s.status !== 'unique') throw new Error('lin-46'); return round6(s.x[3]);
    })(),
    'lin-47': (() => {
      const inside = (x, y) => A(x - 2) + A(x + 2) + A(y) <= 6, s = gridArea(inside, 6.5, 0.005);
      const poly = [[3, 0], [2, 2], [-2, 2], [-3, 0], [-2, -2], [2, -2]];
      if (A(s - shoelace(poly)) > 0.15) throw new Error('lin-47 ' + s); return shoelace(poly);
    })(),
    // единственность: перебираем a; при каждом считаем решения по x (y выражается через x)
    'lin-49': onlyOne(range(-6, 6, 0.25).filter(a => { const r = plZeros(x => A(x) + A(A(x) + a) - 2, -20, 20, 12); return !r.inf && r.pts.length === 1; })),
    // цепочка из 2025 уравнений: x_k = c_k + s_k · x_1, замыкаем круг
    'lin-50': (() => {
      let c = 0, s = 1; // x_1 = 0 + 1 · x_1
      for (let k = 1; k <= 2024; k++) { c = k - c; s = -s; } // x_{k+1} = k − x_k
      // последнее уравнение: x_2025 + x_1 = 2025, то есть c + (s + 1) x_1 = 2025
      return toFrac((2025 - c) / (s + 1));
    })(),
    'lin-52': (() => {
      const odd = range(-1, 4, 0.125).filter(a => { const r = plZeros(x => nest(x) - a, -10, 10, 8); return !r.inf && r.pts.length % 2 === 1; });
      const r1 = plZeros(x => nest(x) - 1, -10, 10, 8);
      if (r1.pts.map(round6).join() !== '-4,-2,0,2,4') throw new Error('lin-52');
      return onlyOne(odd);
    })()
  },
  claims: {
    // x_k + x_{k+1} + x_{k+2} = 0 на круге из 100: только нули (а на круге из 99 есть ненулевые решения)
    'lin-43': () => rank(circ(100, { 0: 1, 1: 1, 2: 1 })) === 100 && rank(circ(99, { 0: 1, 1: 1, 2: 1 })) < 99,
    // |x − y| = z, |y − z| = x, |z − x| = y: решения — две равные неотрицательные и ноль
    'lin-45': () => {
      const vals = range(-6, 6, 0.5); let seen = 0;
      for (const x of vals) for (const y of vals) for (const z of vals) {
        const sol = near(A(x - y), z) && near(A(y - z), x) && near(A(z - x), y);
        const form = [x, y, z].filter(v => v === 0).length >= 1 && [x, y, z].every(v => v >= 0) && [[x, y, z], [y, z, x], [z, x, y]].some(([p, q, r]) => r === 0 && p === q);
        if (sol !== form) return false; if (sol) seen++;
      }
      return seen > 20;
    },
    // если система разрешима, то a³ + b³ + c³ = 3abc
    'lin-48': () => {
      let seen = 0;
      for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) for (let c = -5; c <= 5; c++) {
        if (solveLin([[a, b], [b, c], [c, a]], [c, a, b]).status === 'none') continue;
        seen++; if (a ** 3 + b ** 3 + c ** 3 !== 3 * a * b * c) return false;
      }
      return seen > 30;
    },
    // круг из n чисел, каждое — сумма соседей: ненулевые решения ровно при n, кратном 6; при n = 2026 — только нули
    'lin-51': () => {
      for (let n = 3; n <= 30; n++) if ((rank(circ(n, { '-1': 1, 0: -1, 1: 1 })) < n) !== (n % 6 === 0)) return false;
      const n = 2026; let m = Infinity; for (let j = 0; j < n; j++) m = Math.min(m, A(1 - 2 * Math.cos(2 * Math.PI * j / n)));
      return m > 1e-4;
    },
    // IMO 1965: при таких коэффициентах определитель не ноль
    'lin-53': () => {
      let seed = 3; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 3000; t++) {
        const M = [0, 1, 2].map(i => { const r = [0, 1, 2].map(j => i === j ? 0 : -(0.01 + rnd() * 5)); r[i] = -r.reduce((u, v) => u + v, 0) + 0.001 + rnd() * 2; return r; });
        if (rank(M) !== 3) return false;
      }
      return true;
    },
    // IMO 1966: решение x1 = x4 = 1/(a1 − a4), x2 = x3 = 0
    'lin-54': () => {
      let seed = 5; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 2000; t++) {
        const a = Array.from({ length: 4 }, () => rnd() * 20 - 10).sort((p, q) => q - p);
        if (a[0] - a[1] < 1e-3 || a[1] - a[2] < 1e-3 || a[2] - a[3] < 1e-3) continue;
        const M = a.map(ai => a.map(aj => A(ai - aj))), s = solveLin(M, [1, 1, 1, 1]), w = 1 / (a[0] - a[3]);
        if (s.status !== 'unique' || !near(s.x[0], w, 1e-6) || !near(s.x[3], w, 1e-6) || !near(s.x[1], 0, 1e-6) || !near(s.x[2], 0, 1e-6)) return false;
      }
      return true;
    },
    // IMO 1977: пример из 16 членов подходит, а таблица 7 × 11 для 17 членов даёт одну и ту же сумму двумя способами
    'lin-55': () => {
      const ex = [5, 5, -13, 5, 5, 5, -13, 5, 5, -13, 5, 5, 5, -13, 5, 5];
      const sums = (L) => { const out = []; for (let i = 0; i + L <= ex.length; i++) out.push(ex.slice(i, i + L).reduce((u, v) => u + v, 0)); return out; };
      const exOk = ex.length === 16 && sums(7).every(s => s < 0) && sums(11).every(s => s > 0);
      const byRows = Array(18).fill(0), byCols = Array(18).fill(0);
      for (let i = 1; i <= 7; i++) for (let j = i; j <= i + 10; j++) byRows[j]++;
      for (let j = 1; j <= 11; j++) for (let i = j; i <= j + 6; i++) byCols[i]++;
      return exOk && byRows.join() === byCols.join() && Math.max(...byRows.map((v, i) => v ? i : 0)) === 17;
    }
  },
  lessons: {
    'lin-l7 examples': () => {
      const okA = [-3, 0, 2, 4, 0.5].every(a => { const s = solveLin([[a, 1], [1, a]], [2, a + 1]); return s.status === 'unique' && near(s.x[0], 1 / (a + 1)) && near(s.x[1], (a + 2) / (a + 1)); });
      const pos = range(-4, 4, 0.25).every(a => { const s = solveLin([[1, -1], [1, 2]], [a, 3]); return ((s.x[0] > 0 && s.x[1] > 0) === (a > -1.5 && a < 3)); });
      const sym = [0, 0.3, 0.7, 1].every(x => A(x) + A(1 - x) === 1);
      return okA && solveLin([[1, 1], [1, 1]], [2, 2]).status === 'inf' && solveLin([[-1, 1], [1, -1]], [2, 0]).status === 'none' && pos && sym;
    },
    'lin-l8 examples': () => {
      const s = solveLin([[1, 1, 0], [0, 1, 1], [1, 0, 1]], [3, 5, 6]), t = solveLin([[1, 2, 3], [3, 1, 2], [2, 3, 1]], [3, 7, 2]);
      return s.x.map(round6).join() === '2,1,4' && t.x.map(round6).join() === '2,-1,1' && rank(circ(7, { 0: 1, 1: 1 })) === 7;
    },
    'lin-l9 examples': () => {
      const tr = a => plZeros(x => A(x + 1) + A(x - 3) - a);
      const pencil = range(-3, 3, 0.25).every(k => { const r = plZeros(x => A(x) - k * x - 1, -40, 40, 12); return r.pts.length === (A(k) < 1 ? 2 : 1); });
      const d = gridArea((x, y) => A(x) + A(y) <= 3, 3.5, 0.005), q = gridArea((x, y) => A(x + y) + A(x - y) <= 4, 4.5, 0.005);
      let seed = 1; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648 * 20 - 10;
      let idOk = true; for (let i = 0; i < 1000; i++) { const x = rnd(), y = rnd(); if (!near(A(x + y) + A(x - y), 2 * Math.max(A(x), A(y)))) idOk = false; }
      return tr(3).pts.length === 0 && !tr(3).inf && tr(4).inf && tr(6).pts.map(round6).join() === '-2,4' && pencil && A(d - 18) < 0.1 && A(q - 16) < 0.1 && idOk;
    }
  }
};

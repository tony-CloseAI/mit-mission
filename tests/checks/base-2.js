// Проверки школьной базы: «Отношения и пропорции», «Текстовые задачи», «Наглядная геометрия».
const { gcd, near, round6 } = require('./_lib');

const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
const fstr = a => a[1] === 1 ? String(a[0]) : a[0] + '/' + a[1];
function toFrac(x, maxDen = 2000) { for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(x - p / q) < 1e-9) return fstr(F(p, q)); } throw new Error('toFrac ' + x); }
// пересечение прямых PQ и RS
function meet(P, Q, R, S) {
  const d = (Q[0] - P[0]) * (S[1] - R[1]) - (Q[1] - P[1]) * (S[0] - R[0]);
  const t = ((R[0] - P[0]) * (S[1] - R[1]) - (R[1] - P[1]) * (S[0] - R[0])) / d;
  return [P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])];
}
const dist = (P, Q) => Math.hypot(P[0] - Q[0], P[1] - Q[1]);
const lerp = (P, Q, t) => [P[0] + t * (Q[0] - P[0]), P[1] + t * (Q[1] - P[1])];
// бисекция для монотонной функции
function solve(f, lo, hi) { let a = lo, b = hi; for (let i = 0; i < 200; i++) { const m = (a + b) / 2; if (Math.sign(f(m)) === Math.sign(f(a))) a = m; else b = m; } return (a + b) / 2; }
// площадь по формуле шнурка и узлы для формулы Пика
const shoe = P => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
function latticeCounts(P) {
  const xs = P.map(p => p[0]), ys = P.map(p => p[1]);
  const inside = (x, y) => { let s = 0; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; const c = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); if (c === 0 && Math.min(a[0], b[0]) <= x && x <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= y && y <= Math.max(a[1], b[1])) return 'B'; s += Math.sign(c); } return Math.abs(s) === P.length ? 'I' : 'O'; };
  let I = 0, Bn = 0;
  for (let x = Math.min(...xs); x <= Math.max(...xs); x++) for (let y = Math.min(...ys); y <= Math.max(...ys); y++) { const r = inside(x, y); if (r === 'I') I++; if (r === 'B') Bn++; }
  return { I, B: Bn };
}

module.exports = {
  expected: {
    // b-ratio
    'rat-01': (() => { for (let x = 0; x <= 100; x++) if (x * 4 === 12 * 5) return x; })(),
    'rat-02': 60 / 5 * 3, 'rat-03': 6 * 50000 / 100000, 'rat-05': 7.5 / 3 * 8, 'rat-06': 6 * 10 / 15, 'rat-07': 84 / 7 * 4,
    'rat-08': 28 / 7 * 4 - 28 / 7 * 3,
    'rat-09': (() => { for (let x = -100; x <= 100; x++) if (2 * (x + 2) === 3 * (x - 1)) return x; })(),
    'rat-10': (() => { for (let k = 1; k < 100; k++) if (2 * (2 * k + 5 * k) === 42) return 2 * k * 5 * k; })(),
    'rat-11': fstr(F(2 * 4, 3 * 5)), 'rat-12': round6((3 * 0.2 + 2 * 0.45) / 5 * 100), 'rat-13': 12 * 1000 * 1000 / 10000,
    'rat-14': fstr(F(2 * 3 + 4, 3 + 3 * 4)), 'rat-15': 9000 * 10 / 36 - 9000 * 8 / 30,
    'rat-16': (() => { const vals = new Set(); for (let t = 0; t < 50; t++) { const b = 1 + t % 13, d = 2 + (t * 7) % 11, f = 30 - b - d; vals.add(round6(2 / 3 * (b + d + f))); } if (vals.size !== 1) throw new Error('rat-16'); return [...vals][0]; })(),
    // метод масс проверяем координатами на нескольких треугольниках
    'rat-17': (() => { const r = new Set(); [[[0, 0], [7, 1], [2, 5]], [[1, 1], [9, -2], [4, 6]]].forEach(([A, Bp, C]) => { const M = lerp(Bp, C, 0.5), N = lerp(A, C, 1 / 3), O = meet(A, M, Bp, N); r.add(round6(dist(Bp, O) / dist(O, N))); }); if (r.size !== 1) throw new Error('rat-17'); return [...r][0]; })(),
    'rat-18': (() => { let juice = 20; for (let i = 0; i < 2; i++) juice -= juice * 4 / 20; return round6(juice); })(),
    'rat-19': (() => { const r = new Set(); [[[0, 0], [7, 1], [2, 5]], [[1, 1], [9, -2], [4, 6]]].forEach(([A, Bp, C]) => { const D = lerp(Bp, C, 2 / 5), E = lerp(A, C, 1 / 5), O = meet(A, D, Bp, E); r.add(toFrac(dist(A, O) / dist(O, D))); }); if (r.size !== 1) throw new Error('rat-19'); return [...r][0]; })(),
    'rat-20': (() => { for (let k = 1; k <= 2000; k++) { const x = k / 10, gold = 4 + 0.3 * x, silver = 6 + 0.7 * x; if (near(gold / silver, 5 / 11)) return x; } })(),
    // b-word
    'wd-01': 70 * 3, 'wd-02': 18 / (4 + 5), 'wd-03': 45 / (12 - 3), 'wd-04': round6(1 / (1 / 6 + 1 / 3)),
    'wd-05': (() => { for (let p = 1; p < 48; p++) if (p + 3 * p === 48) return p; })(),
    'wd-06': (() => { for (let v = 1; v < 100; v++) if (v * 1 === 5 * 3) return v; })(),
    'wd-07': round6(1 / (1 / 12 + 1 / 24)), 'wd-08': round6(300 / 15 * 3.6),
    'wd-09': (() => { for (let s = 1; s < 50; s++) if (50 - s + 5 === 3 * (s + 5)) return s; })(),
    'wd-10': round6(240 / (120 / 60 + 120 / 40)),
    'wd-11': (() => { const v1 = 1, v2 = solve(v => 3 * v / v1 - 4, 0.01, 100); return round6(3 * v1 / v2); })(),
    'wd-12': (48 / 3 - 48 / 4) / 2, 'wd-13': round6(1 / (1 / 2 - 1 / 6 - 1 / 5)),
    'wd-14': toFrac(solve(t => 6 * t - (90 + 0.5 * t), 0, 60)),
    'wd-15': (() => { for (let n = 6; n < 200; n++) for (let k = 3; k < 200; k++) if ((n + 5) * (k - 2) === n * k && (n - 5) * (k + 3) === n * k) return n * k; })(),
    // фляга: моделируем на земле при двух разных скоростях пловца — ответ не зависит от неё
    'wd-16': (() => { const r = new Set(); [5, 8].forEach(sw => { const u = solve(u => { const tb = 1 / 3, x0 = -(sw - u) * tb; const t = solve(t => x0 + (sw + u) * (t - tb) - u * t, tb, 50); return u * t - 2; }, 0.01, sw - 0.01); r.add(round6(u)); }); if (r.size !== 1) throw new Error('wd-16'); return [...r][0]; })(),
    // две встречи: подбираем расстояние, при котором вторая встреча в 6 км от B
    'wd-17': (() => { for (let D = 13; D <= 200; D++) { const v1 = 12, v2 = D - 12; // за время первой встречи
      // вторая встреча: время, когда суммарный путь равен 3D
      const t = 3 * D / (v1 + v2), p1 = v1 * t; const pos1 = p1 <= D ? p1 : 2 * D - p1; // положение первого от A
      if (near(D - pos1, 6)) return D; } })(),
    'wd-18': round6(1 / (1 / 40 - 1 / 60)), 'wd-19': round6((2 / (12 - 4) + 2 / (12 + 4)) * 60),
    'wd-20': (() => { const b = (1 - 4 / 6) / 5, a = 1 / 6 - b; return round6(1 / a); })(),
    // b-geo
    'bg-01': 180 - 50 - 60, 'bg-02': 7 * 12, 'bg-03': (() => { for (let x = 0; x <= 180; x++) if (x + x + 40 === 180) return x + 40; })(),
    'bg-04': 100 * 100, 'bg-05': 4 ** 3, 'bg-06': (36 / 4) ** 2, 'bg-07': 6 * 8 / 2, 'bg-08': 4 * 30,
    // периметр фигуры из клеток: считаем рёбра на границе
    'bg-09': (() => { const cell = (x, y) => x >= 0 && x < 10 && y >= 0 && y < 10 && !(x >= 6 && y >= 6); let p = 0; for (let x = 0; x < 10; x++) for (let y = 0; y < 10; y++) if (cell(x, y)) [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => { if (!cell(x + dx, y + dy)) p++; }); return p; })(),
    'bg-10': 2 * (2 * 3 + 3 * 4 + 2 * 4), 'bg-11': 180 / 9 * 4,
    'bg-12': (() => { let c = 0; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) { const f = [i, j, k].filter(v => v === 0 || v === 2).length; if (f === 2) c++; } return c; })(),
    'bg-13': (() => { let c = 0; for (let s = 1; s <= 4; s++) for (let x = 0; x + s <= 4; x++) for (let y = 0; y + s <= 4; y++) c++; return c; })(),
    'bg-14': (() => { const v = new Set(); for (let w1 = 1; w1 <= 30; w1++) for (let h1 = 1; h1 <= 30; h1++) { if (w1 * h1 !== 6) continue; const w2 = 9 / h1, h2 = 12 / w1; v.add(round6(w2 * h2)); } if (v.size !== 1) throw new Error('bg-14'); return [...v][0]; })(),
    'bg-15': (() => { for (let n = 3; n < 50; n++) if ((n - 2) * 180 === 1440) return n; })(),
    'bg-16': (() => { const P = [[0, 0], [6, 2], [2, 5]], s = shoe(P), { I, B } = latticeCounts(P); if (!near(s, I + B / 2 - 1)) throw new Error('bg-16'); return s; })(),
    'bg-17': (() => { // формула Пика верна на случайных треугольниках
      let seed = 9; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 200; t++) { const P = Array.from({ length: 3 }, () => [Math.floor(rnd() * 12), Math.floor(rnd() * 12)]); const s = shoe(P); if (s === 0) continue; const { I, B } = latticeCounts(P); if (!near(s, I + B / 2 - 1)) throw new Error('Pick'); }
      return 10 + 8 / 2 - 1; })(),
    'bg-18': latticeCounts([[0, 0], [10, 0], [0, 10]]).I,
    // 21 полоска: явное разрезание из решения и оценка ⌊64/3⌋
    'bg-19': (() => {
      const g = Array.from({ length: 8 }, () => Array(8).fill(0)); let id = 0;
      const put = cells => { id++; cells.forEach(([r, c]) => { if (g[r][c]) throw new Error('overlap'); g[r][c] = id; }); };
      for (let c = 0; c < 8; c++) put([[0, c], [1, c], [2, c]]);            // три верхних ряда — 8 вертикальных
      for (let r = 3; r < 8; r++) put([[r, 0], [r, 1], [r, 2]]);            // левые три столбца — 5 горизонтальных
      const R = 3, Cc = 3; // квадрат 5 × 5: ряды 3–7, столбцы 3–7, центр (5, 5)
      const rect = (r0, c0, h, w) => { if (w === 3) { for (let i = 0; i < h; i++) put([[r0 + i, c0], [r0 + i, c0 + 1], [r0 + i, c0 + 2]]); } else { for (let j = 0; j < w; j++) put([[r0, c0 + j], [r0 + 1, c0 + j], [r0 + 2, c0 + j]]); } };
      rect(R, Cc, 2, 3); rect(R, Cc + 3, 3, 2); rect(R + 3, Cc + 2, 2, 3); rect(R + 2, Cc, 3, 2);
      let empty = 0; g.forEach(row => row.forEach(v => { if (!v) empty++; }));
      if (id !== 21 || empty !== 1 || g[5][5] !== 0 || Math.floor(64 / 3) !== 21) throw new Error('bg-19');
      return id;
    })()
  },
  choice: {
    'rat-04': () => {
      const fs = [t => 5 * t, v => 60 / v, q => 3 * q, a => 4 * a]; // путь(время), время(скорость), стоимость(количество), периметр(сторона)
      const inv = fs.map(f => near(f(2) * 2, f(1)) && near(f(6) * 3, f(2)));
      if (inv.filter(Boolean).length !== 1) throw new Error('rat-04'); return inv.indexOf(true);
    }
  },
  claims: {
    'rat-21': () => {
      let seed = 4; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 5000; t++) { const n = 1 + Math.floor(rnd() * 6), a = Array.from({ length: n }, () => rnd() * 20 - 10), b = Array.from({ length: n }, () => 0.1 + rnd() * 10);
        const r = a.map((x, i) => x / b[i]), m = a.reduce((s, x) => s + x, 0) / b.reduce((s, x) => s + x, 0);
        if (m < Math.min(...r) - 1e-12 || m > Math.max(...r) + 1e-12) return false; }
      return true;
    },
    'wd-21': () => { for (let v1 = 1; v1 <= 40; v1 += 0.7) for (let v2 = 1; v2 <= 40; v2 += 1.3) { if (near(v1, v2)) continue; if (!((v1 + v2) / 2 > 2 * v1 * v2 / (v1 + v2))) return false; } return true; },
    // доминошки: доска 8 × 8 без противоположных углов не разрезается (перебор с запоминанием по профилю)
    'bg-20': () => {
      const blocked = (r, c) => (r === 0 && c === 0) || (r === 7 && c === 7);
      const memo = new Map();
      const go = (cell, mask) => { // mask — занятость следующих 8 клеток
        if (cell === 64) return mask === 0 ? 1 : 0;
        const key = cell * 512 + mask; if (memo.has(key)) return memo.get(key);
        const r = cell >> 3, c = cell & 7; let res = 0;
        if (blocked(r, c) || (mask & 1)) res = go(cell + 1, mask >> 1);
        else {
          if (c < 7 && !(mask & 2) && !blocked(r, c + 1)) res += go(cell + 2, mask >> 2);
          if (r < 7 && !blocked(r + 1, c)) res += go(cell + 1, (mask >> 1) | 128);
        }
        memo.set(key, res); return res;
      };
      // контроль: целая доска разрезается (12 988 816 способов)
      const full = (() => { const m2 = new Map(); const g2 = (cell, mask) => { if (cell === 64) return mask === 0 ? 1 : 0; const k = cell * 512 + mask; if (m2.has(k)) return m2.get(k); const r = cell >> 3, c = cell & 7; let res = 0; if (mask & 1) res = g2(cell + 1, mask >> 1); else { if (c < 7 && !(mask & 2)) res += g2(cell + 2, mask >> 2); if (r < 7) res += g2(cell + 1, (mask >> 1) | 128); } m2.set(k, res); return res; }; return g2(0, 0); })();
      return go(0, 0) === 0 && full === 12988816;
    },
    // равносторонних треугольников с вершинами в узлах нет
    'bg-21': () => { const N = 14; for (let ux = -N; ux <= N; ux++) for (let uy = -N; uy <= N; uy++) { const a = ux * ux + uy * uy; if (!a) continue; for (let vx = -N; vx <= N; vx++) for (let vy = -N; vy <= N; vy++) { if (vx * vx + vy * vy !== a) continue; if ((ux - vx) ** 2 + (uy - vy) ** 2 === a) return false; } } return true; }
  },
  lessons: {
    'rat lessons': () => {
      const A = [0, 0], Bp = [8, 1], C = [3, 6], M = lerp(Bp, C, 0.5), Cm = lerp(A, C, 0.5), O = meet(A, M, Bp, Cm);
      return 63 / 21 === 3 && [1, 3, 5].map(k => 72 / 9 * k).join() === '8,24,40' && 4 * 9 / 6 === 6 && near((1 * 10 + 3 * 30) / 4, 25) && near(dist(A, O) / dist(O, M), 2) && 100 * 100 === 10000;
    },
    'wd lessons': () => 300 / (70 + 80) === 2 && near(2 / (1 / 30 + 1 / 60), 40) && near(1 / (1 / 4 + 1 / 12), 3),
    'bg lessons': () => {
      const sq = latticeCounts([[0, 0], [2, 0], [2, 2], [0, 2]]);
      const onSeg = (a, b) => { let c = 0; for (let t = 0; t <= Math.max(a, b) * 4; t++) { const x = t / 4, y = x * b / a; if (Number.isInteger(x) && Math.abs(y - Math.round(y)) < 1e-9) c++; } return c; };
      let colorsOk = true; for (let x = 0; x < 6; x++) for (let y = 0; y < 6; y++) { const h = new Set([0, 1, 2].map(i => (x + i + y) % 3)), v = new Set([0, 1, 2].map(i => (x + y + i) % 3)); if (h.size !== 3 || v.size !== 3) colorsOk = false; }
      return 180 - 90 - 35 === 55 && 2 * 30 === 60 && sq.I === 1 && sq.B === 8 && onSeg(6, 4) === gcd(6, 4) + 1 && 5 * 2 + 2 * 3 === 16 && colorsOk;
    },
    // глубокий урок «метод масс»: пример с неравными грузами, теоремы Чевы и Ван-Обеля на случайных точках
    'rat deep lesson': () => {
      const A = [1, 5], Bp = [0, 0], C = [7, 1], D = lerp(Bp, C, 1 / 3), E = lerp(A, C, 0.5), O = meet(A, D, Bp, E);
      if (!near(dist(A, O) / dist(O, D), 3) || !near(dist(Bp, O) / dist(O, E), 1)) return false;
      let seed = 11; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 300; t++) {
        const P = [rnd() * 10, rnd() * 10], Q = [rnd() * 10, rnd() * 10], R = [rnd() * 10, rnd() * 10];
        let u = rnd() + 0.05, v = rnd() + 0.05, w = rnd() + 0.05; const s = u + v + w;
        const X = [(u * P[0] + v * Q[0] + w * R[0]) / s, (u * P[1] + v * Q[1] + w * R[1]) / s]; // точка внутри
        const Dd = meet(P, X, Q, R), Ee = meet(Q, X, R, P), Ff = meet(R, X, P, Q);
        const ceva = dist(P, Ff) / dist(Ff, Q) * dist(Q, Dd) / dist(Dd, R) * dist(R, Ee) / dist(Ee, P);
        const aubel = dist(P, X) / dist(X, Dd) - (dist(P, Ff) / dist(Ff, Q) + dist(P, Ee) / dist(Ee, R));
        if (Math.abs(ceva - 1) > 1e-6 || Math.abs(aubel) > 1e-6) return false;
      }
      return true;
    },
    // глубокий урок «Пик и раскраски»: пример двумя способами, прямоугольники, квадрат 5 × 5 без клетки
    'bg deep lesson': () => {
      const T = [[0, 0], [4, 1], [1, 3]], lc = latticeCounts(T);
      if (!near(shoe(T), 5.5) || lc.I !== 5 || lc.B !== 3 || !near(12 - 2 - 3 - 1.5, 5.5)) return false;
      for (let a = 1; a <= 7; a++) for (let b = 1; b <= 7; b++) { const r = latticeCounts([[0, 0], [a, 0], [a, b], [0, b]]); if (r.I !== (a - 1) * (b - 1) || r.B !== 2 * a + 2 * b || r.I + r.B / 2 - 1 !== a * b) return false; }
      const tiles = (n, hole) => {
        const g = Array.from({ length: n }, () => Array(n).fill(0)); g[hole[0]][hole[1]] = 1;
        const go = () => {
          let r = -1, c = -1;
          for (let i = 0; i < n && r < 0; i++) for (let j = 0; j < n; j++) if (!g[i][j]) { r = i; c = j; break; }
          if (r < 0) return true;
          if (c + 2 < n && !g[r][c + 1] && !g[r][c + 2]) { g[r][c] = g[r][c + 1] = g[r][c + 2] = 1; if (go()) return true; g[r][c] = g[r][c + 1] = g[r][c + 2] = 0; }
          if (r + 2 < n && !g[r + 1][c] && !g[r + 2][c]) { g[r][c] = g[r + 1][c] = g[r + 2][c] = 1; if (go()) return true; g[r][c] = g[r + 1][c] = g[r + 2][c] = 0; }
          return false;
        };
        return go();
      };
      const ok = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if (tiles(5, [i, j])) ok.push(i * 5 + j);
      const c1 = [0, 0, 0], c2 = [0, 0, 0]; for (let x = 1; x <= 5; x++) for (let y = 1; y <= 5; y++) { c1[(x + y) % 3]++; c2[((x - y) % 3 + 3) % 3]++; }
      return ok.length === 1 && ok[0] === 12 && c1.join() === '9,8,8' && c2.join() === '9,8,8';
    }
  }
};

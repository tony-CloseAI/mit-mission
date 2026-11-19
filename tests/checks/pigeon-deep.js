// Проверки глубокого уровня темы «Принцип Дирихле».
const { near } = require('./_lib');
const rng = seed => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
const lis = a => { const t = []; for (const x of a) { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (t[m] < x) lo = m + 1; else hi = m; } t[lo] = x; } return t.length; };
const lds = a => lis(a.map(x => -x));
function perms(a, f) { const n = a.length, c = Array(n).fill(0); f(a); let i = 0; while (i < n) { if (c[i] < i) { const j = i % 2 ? c[i] : 0; [a[j], a[i]] = [a[i], a[j]]; f(a); c[i]++; i = 0; } else { c[i] = 0; i++; } } }
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const frac = x => x - Math.floor(x), dz = x => Math.min(frac(x), 1 - frac(x)); // расстояние до ближайшего целого
const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
// четыре точки — вершины выпуклого четырёхугольника: ни одна не внутри треугольника из остальных
const inTri = (p, a, b, c) => { const s1 = Math.sign(cross(a, b, p)), s2 = Math.sign(cross(b, c, p)), s3 = Math.sign(cross(c, a, p)); return s1 === s2 && s2 === s3; };
const convex4 = q => !q.some((p, i) => { const o = q.filter((_, j) => j !== i); return inTri(p, o[0], o[1], o[2]); });
const hasConvex4 = P => { const n = P.length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) for (let d = c + 1; d < n; d++) if (convex4([P[a], P[b], P[c], P[d]])) return true; return false; };

module.exports = {
  expected: {
    // Эрдёш — Секереш при n = 3: все перестановки 10 чисел против примера из 9
    'pg-41': (() => { const ex = [7, 8, 9, 4, 5, 6, 1, 2, 3]; if (Math.max(lis(ex), lds(ex)) !== 3) throw new Error('пример');
      let ok = true; perms([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], p => { if (ok && lis(p) < 4 && lds(p) < 4) ok = false; }); if (!ok) throw new Error('pg-41'); return 10; })(),
    'pg-42': (() => { const works = (N, a) => { for (let q = 1; q <= N; q++) if (dz(q * a) < 0.1 - 1e-12) return true; return false; };
      for (let k = 0; k < 10000; k++) if (!works(10, k / 10000 + 1e-7 * Math.SQRT2)) throw new Error('N = 10'); for (let N = 1; N <= 9; N++) if (works(N, 0.1)) throw new Error('N < 10'); return 10; })(),
    'pg-44': (() => { const P = []; for (let m = 0; m < 8; m++) P.push([m & 1, m >> 1 & 1, m >> 2 & 1]); for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) if (P[i].every((v, k) => (v + P[j][k]) % 2 === 0)) throw new Error('pg-44'); return 2 ** 3 + 1; })(),
    'pg-46': (() => { const P = [[0, 0]]; for (let k = 0; k < 6; k++) P.push([Math.cos(k * Math.PI / 3), Math.sin(k * Math.PI / 3)]); for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) if (dist(P[i], P[j]) < 1 - 1e-12) throw new Error('пример');
      // поиск восьми точек с попарными расстояниями ≥ 1 случайным спуском: лучше 0,95 не находится
      const rnd = rng(46); let bestAll = 0; const inDisk = () => { for (;;) { const p = [rnd() * 2 - 1, rnd() * 2 - 1]; if (p[0] ** 2 + p[1] ** 2 <= 1) return p; } };
      const md = P => { let m = 9; for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) m = Math.min(m, dist(P[i], P[j])); return m; };
      for (let t = 0; t < 60; t++) { let Q = Array.from({ length: 8 }, inDisk), cur = md(Q); for (let s = 0; s < 3000; s++) { const i = Math.floor(rnd() * 8), step = 0.3 * (1 - s / 3000), R = Q.slice(); const np = [R[i][0] + (rnd() - 0.5) * step, R[i][1] + (rnd() - 0.5) * step]; if (np[0] ** 2 + np[1] ** 2 > 1) continue; R[i] = np; const v = md(R); if (v >= cur) { Q = R; cur = v; } } bestAll = Math.max(bestAll, cur); }
      if (bestAll >= 0.95) throw new Error('pg-46 ' + bestAll); return 8; })(),
    'pg-47': (() => { const sizes = [6, 6, 6, 6, 6, 6, 7, 7], a = []; let top = 50; sizes.forEach(s => { const blk = []; for (let i = 0; i < s; i++) blk.push(top - s + 1 + i); a.push(...blk); top -= s; });
      if (a.length !== 50 || new Set(a).size !== 50) throw new Error('блоки'); if (!(50 >= 7 * 7 + 1)) throw new Error('ЭС'); return Math.max(lis(a), lds(a)); })(),
    'pg-49': (() => { const pc = x => x.toString(2).split('1').length - 1; let best = 0; const rec = (rows, st) => { if (rows.length === 5) { best = Math.max(best, rows.reduce((u, r) => u + pc(r), 0)); return; } for (let r = st; r < 32; r++) if (rows.every(q => pc(q & r) <= 1)) { rows.push(r); rec(rows, r); rows.pop(); } }; rec([], 0); return best + 1; })(),
    // счастливый конец: 4 точки без выпуклого четырёхугольника есть; любые 5 точек сетки 5 × 5 общего положения его содержат
    'pg-52': (() => { if (hasConvex4([[0, 0], [10, 0], [5, 9], [5, 3]])) throw new Error('пример');
      const G = []; for (let x = 0; x < 5; x++) for (let y = 0; y < 5; y++) G.push([x, y]); const n = G.length;
      for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) for (let d = c + 1; d < n; d++) for (let e = d + 1; e < n; e++) {
        const P = [G[a], G[b], G[c], G[d], G[e]]; let col = false; for (let i = 0; i < 5 && !col; i++) for (let j = i + 1; j < 5 && !col; j++) for (let k = j + 1; k < 5; k++) if (cross(P[i], P[j], P[k]) === 0) { col = true; break; }
        if (!col && !hasConvex4(P)) throw new Error('pg-52'); }
      return 5; })()
  },
  claims: {
    'pg-43': () => { let a = 0, b = 1; for (let n = 1; n <= 2026 * 2026 * 6; n++) { [a, b] = [b, (a + b) % 2026]; if (a === 0) return true; } return false; },
    // Эрдёш — Секереш для mn + 1: полный перебор малых m, n и точность оценки
    'pg-45': () => { for (const [m, n] of [[1, 2], [2, 1], [2, 2], [1, 3], [2, 3], [3, 2]]) {
        let ok = true; perms(Array.from({ length: m * n + 1 }, (_, i) => i), p => { if (lis(p) <= m && lds(p) <= n) ok = false; }); if (!ok) return false;
        let sharp = false; perms(Array.from({ length: m * n }, (_, i) => i), p => { if (lis(p) <= m && lds(p) <= n) sharp = true; }); if (!sharp) return false; }
      return true; },
    'pg-48': () => { let x = 1; for (let k = 1; k <= 10001; k++) { x = x * 3 % 10000; if (x === 1) return true; } return false; },
    // 20 натуральных с суммой 30: всегда есть подряд идущие с суммой 10; полный перебор аналога «10 чисел, сумма 15, ищем 5»
    'pg-50': () => {
      const block = (a, t) => { for (let i = 0; i < a.length; i++) { let s = 0; for (let j = i; j < a.length; j++) { s += a[j]; if (s === t) return true; if (s > t) break; } } return false; };
      const comps = (n, k, cur, f) => { if (k === 1) { if (n >= 1) f([...cur, n]); return; } for (let x = 1; x <= n - k + 1; x++) comps(n - x, k - 1, [...cur, x], f); };
      let ok = true; comps(15, 10, [], a => { if (!block(a, 5)) ok = false; }); if (!ok) return false;
      const rnd = rng(50); for (let t = 0; t < 50000; t++) { const a = Array(20).fill(1); for (let r = 0; r < 10; r++) a[Math.floor(rnd() * 20)]++; if (!block(a, 10)) return false; }
      return 42 > 41;
    },
    // IMO 1964: R(3,3) = 6 и 16 корреспондентов на 3 темы дают 6 на одну тему
    'pg-51': () => { const n = 6, pairs = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) pairs.push([a, b]);
      for (let m = 0; m < 1 << pairs.length; m++) { const col = {}; pairs.forEach(([a, b], i) => { col[a + ',' + b] = m >> i & 1; }); let found = false;
        for (let a = 0; a < n && !found; a++) for (let b = a + 1; b < n && !found; b++) for (let c = b + 1; c < n; c++) if (col[a + ',' + b] === col[a + ',' + c] && col[a + ',' + b] === col[b + ',' + c]) { found = true; break; }
        if (!found) return false; }
      return 16 > 3 * 5; },
    // 2^589 начинается с 2026
    'pg-53': () => (2n ** 589n).toString().startsWith('2026') && Math.log10(2.027) - Math.log10(2.026) > 0,
    // Блихфельдт: у эллипса площади больше 1 есть две точки с целой разностью (разность лежит в удвоенном эллипсе)
    'pg-54': () => { const rnd = rng(54);
      for (let t = 0; t < 2000; t++) { const ratio = 1 + rnd() * 30, area = 1.001 + rnd() * 0.5, a = Math.sqrt(area / Math.PI * ratio), b = Math.sqrt(area / Math.PI / ratio), th = rnd() * Math.PI, c = Math.cos(th), s = Math.sin(th);
        const in2E = (x, y) => { const u = (x * c + y * s) / (2 * a), v = (-x * s + y * c) / (2 * b); return u * u + v * v <= 1; }; // точка разности v лежит в E − E = 2(E − центр)
        const R = Math.ceil(2 * a) + 1; let found = false; for (let x = -R; x <= R && !found; x++) for (let y = -R; y <= R; y++) if ((x || y) && in2E(x, y)) { found = true; break; }
        if (!found) return false; }
      return true; },
    // IMO 1985: моделируем 1985 чисел с простыми делителями ≤ 23 и находим четыре с произведением — четвёртой степенью
    'pg-55': () => { const rnd = rng(55);
      for (let t = 0; t < 20; t++) { const seen = new Set(), M = []; while (M.length < 1985) { const e = Array.from({ length: 9 }, () => Math.floor(rnd() * 6)); const k = e.join(); if (!seen.has(k)) { seen.add(k); M.push(e); } }
        // корзины по набору чётностей: из каждой корзины берём числа парами (это и есть жадный выбор пар из решения)
        const par = e => e.map(x => x % 2).join(), buckets = new Map(); M.forEach(e => { const k = par(e); if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(e); });
        const pairs = []; for (const b of buckets.values()) for (let i = 0; i + 1 < b.length; i += 2) pairs.push(b[i].map((x, q) => (x + b[i + 1][q]) / 2));
        if (buckets.size > 512 || pairs.length < 737) return false;
        const by = new Map(); let ok = false; for (const c of pairs) { const k = par(c); if (by.has(k)) { const d = by.get(k); if (c.every((x, q) => (2 * x + 2 * d[q]) % 4 === 0)) { ok = true; break; } } else by.set(k, c); }
        if (!ok) return false; }
      return 1985 - 2 * 736 === 513 && 737 > 512; }
  },
  lessons: {
    'pg-l7 examples': () => { const p9 = [], p8 = []; for (let n = 1; n <= 6; n++) { p9.push(2 ** n % 9); p8.push(2 ** n % 8); } const rnd = rng(7);
      for (let t = 0; t < 2000; t++) { const a = rnd() * 10, N = 1 + Math.floor(rnd() * 12); let ok = false; for (let q = 1; q <= N; q++) if (dz(q * a) < 1 / N) { ok = true; break; } if (!ok) return false; }
      return p9[5] === 1 && p8.join() === '2,4,0,0,0,0'; },
    'pg-l8 examples': () => { const rnd = rng(8);
      for (let t = 0; t < 500; t++) { const a = Array.from({ length: 30 }, () => rnd()); const piles = []; a.forEach(x => { const i = piles.findIndex(top => top > x); if (i < 0) piles.push(x); else piles[i] = x; }); if (piles.length !== lis(a)) return false; }
      const ex = [7, 8, 9, 4, 5, 6, 1, 2, 3];
      // десять натуральных чисел: цепочка делимости из 4 или 4 попарно не делящихся
      for (let t = 0; t < 300; t++) { const s = new Set(); while (s.size < 10) s.add(1 + Math.floor(rnd() * 60)); const a = [...s].sort((x, y) => x - y); const ch = a.map(() => 1); for (let i = 0; i < 10; i++) for (let j = 0; j < i; j++) if (a[i] % a[j] === 0) ch[i] = Math.max(ch[i], ch[j] + 1);
        let anti = 0; for (let m = 0; m < 1024; m++) { const b = a.filter((_, i) => m >> i & 1); if (b.length <= anti) continue; let ok = true; for (let i = 0; i < b.length && ok; i++) for (let j = i + 1; j < b.length; j++) if (b[j] % b[i] === 0) { ok = false; break; } if (ok) anti = b.length; }
        if (Math.max(...ch) < 4 && anti < 4) return false; }
      return lis(ex) === 3 && lds(ex) === 3; },
    'pg-l9 examples': () => { const rnd = rng(9);
      for (let t = 0; t < 200; t++) { const d1 = Array(200).fill(0); let red = 0; while (red < 100) { const i = Math.floor(rnd() * 200); if (!d1[i]) { d1[i] = 1; red++; } } const d2 = Array.from({ length: 200 }, () => rnd() < 0.5 ? 1 : 0);
        let best = 0; for (let r = 0; r < 200; r++) { let s = 0; for (let i = 0; i < 200; i++) if (d2[i] === d1[(i + r) % 200]) s++; best = Math.max(best, s); } if (best < 100) return false; }
      // дуги суммарной длины 2,5 на окружности длины 1: какая-то точка покрыта трижды
      for (let t = 0; t < 300; t++) { const arcs = []; let L = 2.5; while (L > 1e-9) { const l = Math.min(L, 0.05 + rnd() * 0.9); arcs.push([rnd(), l]); L -= l; }
        let best = 0; for (let k = 0; k < 2000; k++) { const x = (k + 0.5) / 2000; let c = 0; arcs.forEach(([s, l]) => { if (frac(x - s) < l) c++; }); best = Math.max(best, c); } if (best < 3) return false; }
      return 30 * 4 / 10 === 12; }
  }
};

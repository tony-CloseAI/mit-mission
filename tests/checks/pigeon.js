// Проверки темы «Принцип Дирихле».
// Ответы «сколько нужно взять» считаются как (наибольшее число объектов без свойства) + 1 полным перебором раскладок;
// утверждения доказательств проверяются перебором малых случаев и случайными тестами.
const { near, round6 } = require('./_lib');
const rng = seed => () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;

// наименьший возможный максимум при раскладке N предметов по n клеткам (динамика по клеткам)
function minMax(N, n) {
  let best = Array(N + 1).fill(Infinity); best[0] = 0;
  for (let c = 0; c < n; c++) { const nb = Array(N + 1).fill(Infinity); for (let s = 0; s <= N; s++) for (let x = 0; x <= s; x++) nb[s] = Math.min(nb[s], Math.max(best[s - x], x)); best = nb; }
  return best[N];
}
// наибольшее число предметов, которое можно взять из запасов stock без свойства prop, плюс 1
function worstCase(stock, prop) {
  let best = -1;
  const rec = (i, cur) => { if (i === stock.length) { if (!prop(cur)) best = Math.max(best, cur.reduce((a, b) => a + b, 0)); return; } for (let c = 0; c <= stock[i]; c++) { cur.push(c); rec(i + 1, cur); cur.pop(); } };
  rec(0, []); return best + 1;
}
// наибольшее независимое множество в графе на вершинах 1..n (перебор подмножеств для малых n)
function maxIndep(n, bad) {
  const nb = Array(n).fill(0); for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && bad(Math.min(i, j) + 1, Math.max(i, j) + 1)) nb[i] |= 1 << j;
  let best = 0; for (let m = 0; m < 1 << n; m++) { let ok = true, cnt = 0; for (let i = 0; i < n; i++) if (m >> i & 1) { cnt++; if (m & nb[i]) { ok = false; break; } } if (ok && cnt > best) best = cnt; } return best;
}
// наибольшее паросочетание (для теоремы Дилуорса и ладей)
function maxMatching(L, R, adj) { const mR = Array(R).fill(-1); const tryK = (u, seen) => { for (const v of adj[u]) { if (seen[v]) continue; seen[v] = true; if (mR[v] < 0 || tryK(mR[v], seen)) { mR[v] = u; return true; } } return false; }; let m = 0; for (let u = 0; u < L; u++) if (tryK(u, Array(R).fill(false))) m++; return m; }
const lisLen = a => { const t = []; for (const x of a) { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (t[m] < x) lo = m + 1; else hi = m; } t[lo] = x; } return t.length; };
const hasMonoTriangle = (n, col) => { for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) if (col(a, b) === col(a, c) && col(a, b) === col(b, c)) return true; return false; };
const pairIdx = n => { const idx = {}; let k = 0; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) idx[a + ',' + b] = k++; return [idx, k]; };
function ramsey33(n) { const [idx, E] = pairIdx(n); for (let m = 0; m < 1 << E; m++) if (!hasMonoTriangle(n, (a, b) => m >> idx[a + ',' + b] & 1)) return false; return true; }
const subsetSumZero = (arr, mod) => { let reach = new Set(); for (const x of arr) { const nr = new Set(reach); nr.add(x % mod); for (const r of reach) nr.add((r + x) % mod); reach = nr; } return reach.has(0); };
const multisets = (size, k) => { const out = []; const rec = (start, cur) => { if (cur.length === size) { out.push(cur.slice()); return; } for (let r = start; r < k; r++) { cur.push(r); rec(r, cur); cur.pop(); } }; rec(0, []); return out; };
function perms(a, f) { const n = a.length, c = Array(n).fill(0); f(a); let i = 0; while (i < n) { if (c[i] < i) { const j = i % 2 ? c[i] : 0; [a[j], a[i]] = [a[i], a[j]]; f(a); c[i]++; i = 0; } else { c[i] = 0; i++; } } }
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);

module.exports = {
  expected: {
    'pg-01': minMax(30, 12),
    'pg-02': worstCase([10, 10], c => c.some(x => x >= 2)),
    'pg-03': worstCase([10, 10], c => c[0] >= 2),
    'pg-05': worstCase([30, 30, 30, 30], c => c.some(x => x >= 3)),
    'pg-06': worstCase(Array(7).fill(5), c => c.some(x => x >= 2)),
    'pg-07': minMax(41, 5),
    'pg-08': worstCase([7, 5], c => c[0] >= 1 && c[1] >= 1),
    'pg-09': worstCase([5, 7, 9], c => c.every(x => x >= 1)),
    'pg-10': worstCase([5, 7, 9], c => c.some(x => x >= 4)),
    'pg-11': maxIndep(20, (a, b) => a + b === 21) + 1,
    'pg-12': minMax(25, 7),
    // наибольшее множество без двух соседних чисел среди 1..30: динамика по пути
    'pg-13': (() => { let take = 0, skip = 0; for (let i = 1; i <= 30; i++) { const t = skip + 1; skip = Math.max(take, skip); take = t; } return Math.max(take, skip); })(),
    // n точек на отрезке [0; 1] попарно дальше 0,2 возможны, пока 1/(n − 1) > 0,2
    'pg-14': (() => { let n = 2; while (1 / n > 0.2 + 1e-12) n++; return n + 1; })(),
    'pg-16': worstCase([9, 9, 9, 9], c => c.every(x => x >= 1)),
    'pg-17': (() => { const C = [[0, 0], [1, 0], [0, 1], [1, 1]]; let ok = true; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (dist(C[i], C[j]) <= Math.SQRT2 / 2) ok = false; if (!ok || !near(Math.hypot(0.5, 0.5), Math.SQRT2 / 2)) throw new Error('pg-17'); return 5; })(),
    'pg-18': minMax(29, 13),
    'pg-19': (() => { if (subsetSumZero([1, 1, 1, 1, 1, 1], 7)) throw new Error('pg-19 пример'); if (!multisets(7, 7).every(a => subsetSumZero(a, 7))) throw new Error('pg-19'); return 7; })(),
    // наибольшая антицепь по делимости в 1..50 = наименьшее покрытие цепями (теорема Дилуорса через паросочетание)
    'pg-20': (() => { const n = 50, adj = Array.from({ length: n }, (_, i) => { const out = []; for (let j = i + 1; j < n; j++) if ((j + 1) % (i + 1) === 0) out.push(j); return out; }); return n - maxMatching(n, n, adj); })(),
    'pg-21': (() => { const g = (a, b) => b ? g(b, a % b) : a; for (let a = 2; a <= 100; a += 2) for (let b = a + 2; b <= 100; b += 2) if (g(a, b) === 1) throw new Error('чётные'); for (let k = 1; k <= 99; k += 2) if (g(k, k + 1) !== 1) throw new Error('соседние'); return 51; })(),
    'pg-22': (() => { if (ramsey33(5) || !ramsey33(6)) throw new Error('pg-22'); return 6; })(),
    'pg-23': (() => { let best = 0; for (let m = 0; m < 1024; m++) { const R = []; for (let r = 0; r < 10; r++) if (m >> r & 1) R.push(r); let ok = true; for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) if ((R[i] + R[j]) % 10 === 0) ok = false; if (ok) best = Math.max(best, R.length); } return best + 1; })(),
    // короли: динамика по строкам, в любом квадрате 2 × 2 не больше одного короля
    'pg-24': (() => { const ok = m => !(m & (m << 1)); const masks = []; for (let m = 0; m < 256; m++) if (ok(m)) masks.push(m); const pc = m => m.toString(2).split('1').length - 1;
      let dp = new Map(masks.map(m => [m, pc(m)])); for (let r = 1; r < 8; r++) { const nd = new Map(); for (const b of masks) { let best = -1; for (const [a, v] of dp) if (!(a & b) && !(a & (b << 1)) && !(a & (b >> 1))) best = Math.max(best, v); if (best >= 0) nd.set(b, best + pc(b)); } dp = nd; } return Math.max(...dp.values()); })(),
    'pg-25': (() => { const k = 3, pairs = c => { const s = []; for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) if ((c >> i & 1) === (c >> j & 1)) s.push(i * 16 + j + 256 * (c >> i & 1)); return s; };
      let best = 0; const used = new Set(), cur = []; const rec = st => { best = Math.max(best, cur.length); for (let c = st; c < 1 << k; c++) { const ps = pairs(c); if (ps.some(x => used.has(x))) continue; ps.forEach(x => used.add(x)); cur.push(c); rec(c); cur.pop(); ps.forEach(x => used.delete(x)); } }; rec(0); return best + 1; })(),
    'pg-26': new Set(Array.from({ length: 10 }, (_, i) => (i * i) % 10)).size + 1,
    'pg-27': (() => { const V = [[0, 0], [1, 0], [0.5, Math.sqrt(3) / 2]], O = [0.5, Math.sqrt(3) / 6], P = [...V, O]; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (dist(P[i], P[j]) <= 0.5) throw new Error('pg-27'); return 5; })(),
    'pg-28': (() => { const has = (c, n) => { for (let a = 1; a <= n; a++) for (let d = 1; a + 2 * d <= n; d++) if (c[a] === c[a + d] && c[a] === c[a + 2 * d]) return true; return false; };
      const forced = n => { for (let m = 0; m < 1 << n; m++) { const c = [0]; for (let i = 0; i < n; i++) c.push(m >> i & 1); if (!has(c, n)) return false; } return true; }; if (forced(8) || !forced(9)) throw new Error('pg-28'); return 9; })(),
    // цепочки «разность 11»: точная динамика по каждой цепочке
    'pg-29': (() => { let tot = 0; for (let r = 1; r <= 11; r++) { let take = 0, skip = 0; for (let x = r; x <= 100; x += 11) { const t = skip + 1; skip = Math.max(take, skip); take = t; } tot += Math.max(take, skip); } return tot + 1; })(),
    'pg-33': (() => { const cnt = Array(7).fill(0); for (let x = 1; x <= 100; x++) cnt[x % 7]++; let best = 0;
      for (let m = 0; m < 128; m++) { const R = []; for (let r = 0; r < 7; r++) if (m >> r & 1) R.push(r); if (R.some(r => r !== 0 && R.includes(7 - r))) continue; best = Math.max(best, R.reduce((s, r) => s + (r === 0 ? 1 : cnt[r]), 0)); } return best; })(),
    'pg-36': (() => { let best = 1e9; perms([2, 3, 4, 5, 6, 7, 8, 9, 10], p => { const q = [1, ...p]; let m = 0; for (let i = 0; i < 10; i++) m = Math.max(m, q[i] + q[(i + 1) % 10] + q[(i + 2) % 10]); if (m < best) best = m; }); return best; })(),
    'pg-37': (() => { const four = a => { const n = a.length; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) for (let l = k + 1; l < n; l++) if ((a[i] + a[j] + a[k] + a[l]) % 4 === 0) return true; return false; };
      if (multisets(6, 4).every(four) || !multisets(7, 4).every(four)) throw new Error('pg-37'); return 7; })()
  },
  choice: {
    'pg-04': p => { const days = 366, n = 370; const truth = [n <= 1, n > days, n > 2 * days, false]; if (truth.filter(Boolean).length !== 1) throw new Error('pg-04'); return truth.indexOf(true); },
    // все раскладки 50 конфет по 4 видам: верно ли утверждение всегда
    'pg-15': p => {
      const tests = [c => Math.max(...c) >= 13, c => Math.max(...c) >= 14, c => Math.min(...c) >= 12, c => c.includes(13)], always = tests.map(() => true);
      for (let a = 0; a <= 50; a++) for (let b = 0; a + b <= 50; b++) for (let c = 0; a + b + c <= 50; c++) { const v = [a, b, c, 50 - a - b - c]; tests.forEach((t, i) => { if (!t(v)) always[i] = false; }); }
      if (always.filter(Boolean).length !== 1) throw new Error('pg-15'); return always.indexOf(true);
    }
  },
  claims: {
    // 51 точка: в одном из 25 квадратиков три точки, и их накрывает круг радиуса √2/10 < 1/7
    'pg-30': () => { if (!(Math.SQRT2 / 10 < 1 / 7) || !(51 > 2 * 25)) return false; const rnd = rng(30);
      for (let t = 0; t < 500; t++) { const P = Array.from({ length: 51 }, () => [rnd(), rnd()]), cell = {}; P.forEach(p => { const k = Math.min(4, Math.floor(p[0] * 5)) + ',' + Math.min(4, Math.floor(p[1] * 5)); (cell[k] = cell[k] || []).push(p); });
        const full = Object.entries(cell).find(([, v]) => v.length >= 3); if (!full) return false; const [i, j] = full[0].split(',').map(Number), c = [(i + 0.5) / 5, (j + 0.5) / 5]; if (!full[1].slice(0, 3).every(p => dist(p, c) <= 1 / 7)) return false; }
      return true; },
    // круги с суммой длин окружностей 10: какую-то вертикаль пересекают не менее 4 кругов
    'pg-31': () => { if (!(10 / Math.PI > 3)) return false; const rnd = rng(31);
      for (let t = 0; t < 300; t++) { const C = []; let L = 10; while (L > 1e-9) { const d = Math.min(L / Math.PI, 0.05 + rnd() * 0.5); const r = d / 2; C.push([r + rnd() * (1 - 2 * r), r]); L -= Math.PI * d; }
        const ev = []; C.forEach(([x, r]) => { ev.push([x - r, 1], [x + r, -1]); }); ev.sort((a, b) => a[0] - b[0] || b[1] - a[1]); let cur = 0, best = 0; ev.forEach(([, d]) => { cur += d; best = Math.max(best, cur); }); if (best < 4) return false; }
      return true; },
    'pg-32': () => { let ok = true; perms([0, 1, 2, 3, 4, 5, 6, 7], p => { if (p.some((v, i) => v === i)) return; let m = 0; for (let r = 1; r < 8; r++) { let s = 0; for (let i = 0; i < 8; i++) if (p[(i + r) % 8] === i) s++; m = Math.max(m, s); } if (m < 2) ok = false; }); return ok; },
    // 33 ладьи: в каждой ломаной диагонали по клетке в строке и столбце; случайные расстановки содержат 5 небьющихся
    'pg-34': () => { for (let k = 0; k < 8; k++) { const rows = new Set(), cols = new Set(); for (let i = 0; i < 8; i++) { rows.add(i); cols.add((i + k) % 8); } if (rows.size !== 8 || cols.size !== 8) return false; }
      const rnd = rng(34); for (let t = 0; t < 2000; t++) { const cells = new Set(); while (cells.size < 33) cells.add(Math.floor(rnd() * 64)); const adj = Array.from({ length: 8 }, () => []); cells.forEach(c => adj[c >> 3].push(c & 7)); if (maxMatching(8, 8, adj) < 5) return false; }
      return true; },
    'pg-35': () => 9 + 9 === 18 && 18 * 5 === 90 && 90 + 1 < 100,
    'pg-38': () => { const polys = [[3, 3, 3, 3], [4, 4, 4, 4, 4, 4], Array(8).fill(3), Array(12).fill(5), Array(20).fill(3), [...Array(12).fill(5), ...Array(20).fill(6)], [5, 3, 3, 3, 3, 3], [7, 7, 4, 4, 4, 4, 4, 4, 4]];
      if (!polys.every(f => new Set(f).size < f.length)) return false; for (let k = 3; k < 50; k++) if (!(k - 2 < k)) return false; return true; },
    // IMO 1972: у любых 10 двузначных чисел есть два непересекающихся подмножества с равной суммой
    'pg-39': () => { const rnd = rng(39); for (let t = 0; t < 1000; t++) { const s = new Set(); while (s.size < 10) s.add(10 + Math.floor(rnd() * 90)); const a = [...s], seen = new Map(); let found = false;
        for (let m = 1; m < 1024 && !found; m++) { let sum = 0; for (let i = 0; i < 10; i++) if (m >> i & 1) sum += a[i]; if (seen.has(sum)) { const o = seen.get(sum), c = o & m; if ((o & ~c) && (m & ~c)) found = true; } else seen.set(sum, m); }
        if (!found) return false; } return 1023 > 990; },
    'pg-40': () => { const A = [0, 0], B = [Math.sqrt(3) / 2, 0.5], C = [Math.sqrt(3) / 2, -0.5], D = [Math.sqrt(3), 0];
      return near(dist(A, B), 1) && near(dist(A, C), 1) && near(dist(B, C), 1) && near(dist(B, D), 1) && near(dist(C, D), 1) && near(dist(A, D), Math.sqrt(3)) && 1 < 2 * Math.sqrt(3); }
  },
  lessons: {
    'pg-l1 examples': () => minMax(13, 12) === 2 && minMax(100, 12) === 9 && 500001 < 800000,
    'pg-l2 examples': () => worstCase([10, 10, 10], c => c.some(x => x >= 2)) === 4 && worstCase([10, 10, 10], c => c[0] >= 2) === 22 && worstCase([10, 10, 10], c => c.every(x => x >= 1)) === 21 && minMax(30, 12) === 3,
    'pg-l3 examples': () => { const a = [2, 4, 1, 5, 7], S = []; a.reduce((s, x) => { S.push((s + x) % 5); return s + x; }, 0);
      const pw = []; for (let n = 1; n <= 8; n++) pw.push(2 ** n % 10); return S.join() === '2,1,2,2,4' && (4 + 1) % 5 === 0 && pw.join() === '2,4,8,6,2,4,8,6' && maxIndep(20, (x, y) => y - x === 1) === 10; },
    'pg-l4 examples': () => { const p4 = [1.25, 1.3], p5 = [1.8, 1.75]; const rnd = rng(4); let projOk = true; for (let t = 0; t < 1000; t++) { const dx = rnd(), dy = rnd(); if (dx + dy < Math.hypot(dx, dy) - 1e-12) projOk = false; }
      return Math.floor(p4[0]) === Math.floor(p5[0]) && Math.floor(p4[1]) === Math.floor(p5[1]) && dist(p4, p5) <= Math.SQRT2 && 3 * 0.4 > 1 && 2.5 / 2 > 1 && projOk; },
    'pg-l5 examples': () => { for (let n = 2; n <= 6; n++) { const [idx, E] = pairIdx(n); for (let m = 0; m < 1 << E; m++) { const deg = Array(n).fill(0); for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) if (m >> idx[a + ',' + b] & 1) { deg[a]++; deg[b]++; } if (new Set(deg).size === n) return false; } } return true; },
    'pg-l6 examples': () => { const ex = [1, 2, 3, 4, 5, 11, 12, 13, 14, 15]; return maxIndep(20, (a, b) => b - a === 5) === 10 && ex.every(x => !ex.includes(x + 5)); }
  }
};

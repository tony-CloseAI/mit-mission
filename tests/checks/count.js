// Проверки темы «Правила подсчёта, перестановки, сочетания».
// Почти все ответы получены прямым перебором объектов, а не по формулам из уроков.
const { B, C, fact, rnd } = require('./_lib');

// все перестановки массива (обход в глубину)
function forEachPerm(arr, cb) {
  const n = arr.length, used = Array(n).fill(false), cur = [];
  (function go() {
    if (cur.length === n) { cb(cur); return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; cur.push(arr[i]); go(); cur.pop(); used[i] = false; }
  })();
}
const countPerms = (n, ok) => { let c = 0; forEachPerm([...Array(n).keys()], p => { if (ok(p)) c++; }); return c; };
// все k-элементные подмножества {0..n-1}
function forEachComb(n, k, cb) {
  const cur = [];
  (function go(s) {
    if (cur.length === k) { cb(cur); return; }
    for (let i = s; i < n; i++) { cur.push(i); go(i + 1); cur.pop(); }
  })(0);
}
const countCombs = (n, k, ok) => { let c = 0; forEachComb(n, k, s => { if (ok(s)) c++; }); return c; };
const digits = x => String(x).split('').map(Number);
const distinctWords = w => { const s = new Set(); forEachPerm([...w], p => s.add(p.join(''))); return s.size; };
// число монотонных путей (вправо/вверх) из (0,0) в (m,n), избегающих запрещённых точек — перебором строк из шагов
function paths(m, n, banned = []) {
  let c = 0;
  for (let mask = 0; mask < 1 << (m + n); mask++) {
    let ups = 0; for (let i = 0; i < m + n; i++) if (mask >> i & 1) ups++;
    if (ups !== n) continue;
    let x = 0, y = 0, ok = true;
    for (let i = 0; i < m + n && ok; i++) { if (mask >> i & 1) y++; else x++; if (banned.some(([a, b]) => a === x && b === y)) ok = false; }
    if (ok) c++;
  }
  return c;
}
// число разбиений на пары — перебором
function pairingsBrute(items) {
  if (!items.length) return 1;
  let c = 0; const [a, ...rest] = items;
  for (let j = 0; j < rest.length; j++) c += pairingsBrute(rest.filter((_, i) => i !== j));
  return c;
}

module.exports = {
  expected: {
    'cnt-01': (() => { let c = 0; for (let s = 0; s < 4; s++) for (let m = 0; m < 6; m++) c++; return c; })(),
    'cnt-02': (() => { let c = 0; for (let x = 100; x <= 999; x++) if (digits(x).every(d => d % 2)) c++; return c; })(),
    'cnt-03': countPerms(5, () => true),
    'cnt-04': (() => { let c = 0; for (let x = 100; x <= 999; x++) if (new Set(digits(x)).size === 3) c++; return c; })(),
    'cnt-05': (() => { let c = 0; for (let a = 0; a < 20; a++) for (let b = 0; b < 20; b++) if (a !== b) c++; return c; })(),
    'cnt-06': countCombs(8, 2, () => true),
    'cnt-07': (() => { let c = 0; for (let x = 10000; x <= 99999; x++) { const s = String(x); if (s === [...s].reverse().join('')) c++; } return c; })(),
    'cnt-09': (() => { let c = 0; for (let m = 0; m < 3 ** 4; m++) c++; return c; })(),
    'cnt-10': (() => { let c = 0; forEachComb(12, 2, ([i, j]) => { const d = j - i; if (d !== 1 && d !== 11) c++; }); return c; })(),
    'cnt-11': distinctWords('ЗАДАЧА'),
    'cnt-12': (() => { const ts = []; for (let t = 0; t <= 15; t++) if (18 + 15 - t === 30 - 5) ts.push(t); if (ts.length !== 1) throw new Error('cnt-12'); return ts[0]; })(),
    'cnt-13': (() => { let c = 0; for (let m = 0; m < 1 << 10; m++) c++; return c; })(),
    'cnt-14': countPerms(6, p => Math.abs(p.indexOf(0) - p.indexOf(1)) === 1),
    'cnt-15': (() => { let c = 0; for (let x = 1000; x <= 9999; x++) if (String(x).includes('7')) c++; return c; })(),
    'cnt-16': paths(5, 3),
    // круговые рассадки: перестановки, нормализованные поворотом так, чтобы человек 0 сидел на месте 0
    'cnt-17': (() => { const s = new Set(); forEachPerm([...Array(7).keys()], p => { const k = p.indexOf(0); s.add([...p.slice(k), ...p.slice(0, k)].join()); }); return s.size; })(),
    'cnt-18': (() => { let c = 0; for (let a = 0; a < 64; a++) for (let b = 0; b < 64; b++) if (a !== b && a % 8 !== b % 8 && (a >> 3) !== (b >> 3)) c++; return c; })(),
    'cnt-19': countCombs(10, 3, s => s.some(i => i >= 6)),
    'cnt-20': (() => { let c = 0; for (let x1 = 0; x1 <= 8; x1++) for (let x2 = x1 + 1; x2 <= 8; x2++) for (let y1 = 0; y1 <= 8; y1++) for (let y2 = y1 + 1; y2 <= 8; y2++) c++; return c; })(),
    'cnt-21': distinctWords('КОЛОКОЛ'),
    'cnt-22': pairingsBrute([0, 1, 2, 3, 4, 5]),
    'cnt-23': (() => { let c = 0; for (let x = 1000; x <= 9999; x++) { const d = digits(x); if (d.every((v, i) => i === 0 || v > d[i - 1])) c++; } return c; })(),
    'cnt-24': (() => {
      const P = [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [0, 1], [1.5, 1], [2.2, 1], [5, 1]];
      return countCombs(9, 3, ([a, b, c]) => { const [p, q, r] = [P[a], P[b], P[c]]; return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]) !== 0; });
    })(),
    'cnt-25': countCombs(20, 3, s => s.reduce((x, y) => x + y + 1, 0) % 2 === 0),
    // мальчики 0..4, девочки 5..9: перебор шаблонов «мальчик/девочка» без двух мальчиков рядом, люди различимы
    'cnt-26': (() => {
      let pat = 0;
      for (let m = 0; m < 1 << 10; m++) { let ones = 0; for (let i = 0; i < 10; i++) if (m >> i & 1) ones++; if (ones === 5 && !(m & (m >> 1))) pat++; }
      return pat * Number(fact(5)) * Number(fact(5));
    })(),
    'cnt-27': paths(4, 4, [[2, 2]]),
    'cnt-28': (() => { let c = 0; for (let x = 100000; x <= 999999; x++) { let s = 0, y = x; while (y) { s += y % 10; y = (y / 10) | 0; } if (s % 2) c++; } return c; })(),
    'cnt-29': (() => { let c = 0; for (let m = 0; m < 1 << 10; m++) if (!(m & (m >> 1))) c++; return c; })(),
    'cnt-31': (() => { let c = 0; forEachComb(20, 3, ([a, b, d]) => { if (b - a === d - b) c++; }); return c; })(),
    // хорды: 10 случайных точек на окружности, считаем пары пересекающихся хорд геометрически
    'cnt-33': (() => {
      const ang = [...Array(10).keys()].map(i => (i + 0.3 * rnd()) * 2 * Math.PI / 10), P = ang.map(t => [Math.cos(t), Math.sin(t)]);
      const ch = []; forEachComb(10, 2, ([i, j]) => ch.push([i, j]));
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const pts = [];
      for (let u = 0; u < ch.length; u++) for (let v = u + 1; v < ch.length; v++) {
        const [a, b] = ch[u], [c, d] = ch[v];
        if (new Set([a, b, c, d]).size < 4) continue;
        const A = P[a], Bq = P[b], Cq = P[c], D = P[d];
        if (cr(A, Bq, Cq) * cr(A, Bq, D) < 0 && cr(Cq, D, A) * cr(Cq, D, Bq) < 0) {
          const t = cr(Cq, D, A) / (cr(Cq, D, A) - cr(Cq, D, Bq));
          pts.push([A[0] + t * (Bq[0] - A[0]), A[1] + t * (Bq[1] - A[1])]);
        }
      }
      // никакие три хорды не проходят через одну точку: все точки различны
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 1e-9) throw new Error('cnt-33 concurrent');
      return pts.length;
    })(),
    // перестановки, где каждое число (кроме первого) отличается на 1 от одного из стоящих левее — обход в глубину
    'cnt-35': (() => {
      let c = 0; const n = 10, used = Array(n + 2).fill(false);
      (function go(k) {
        if (k === n) { c++; return; }
        for (let v = 1; v <= n; v++) if (!used[v] && (k === 0 || used[v - 1] || used[v + 1])) { used[v] = true; go(k + 1); used[v] = false; }
      })(0);
      return c;
    })(),
    // разрезы и раскраски: перебор множеств разрезов и раскрасок частей
    'cnt-37': (() => { let c = 0; for (let cuts = 0; cuts < 1 << 9; cuts++) { let parts = 1; for (let i = 0; i < 9; i++) if (cuts >> i & 1) parts++; c += 2 ** parts; } return c; })(),
    'cnt-39': (() => {
      let c = 0;
      for (let m = 0; m < 3 ** 10; m++) {
        const col = []; let x = m; for (let i = 0; i < 10; i++) { col.push(x % 3); x = (x / 3) | 0; }
        if (col.every((v, i) => i === 0 || v !== col[i - 1]) && col[0] !== col[9]) c++;
      }
      return c;
    })()
  },
  choice: {
    'cnt-08': () => {
      const a = countCombs(10, 3, () => true), b = countCombs(10, 7, () => true);
      return a > b ? 0 : b > a ? 1 : 2;
    }
  },
  claims: {
    // чётных и нечётных подмножеств поровну при n = 1..16
    'cnt-30': () => {
      for (let n = 1; n <= 16; n++) {
        let ev = 0, od = 0;
        for (let m = 0; m < 1 << n; m++) { let k = 0; for (let i = 0; i < n; i++) if (m >> i & 1) k++; if (k % 2) od++; else ev++; }
        if (ev !== od) return false;
      }
      return true;
    },
    // (2n)!/(2ⁿ n!) — целое и равно числу разбиений на пары
    'cnt-32': () => {
      for (let n = 1; n <= 40; n++) { const d = B(2) ** B(n) * fact(n); if (fact(2 * n) % d !== 0n) return false; }
      for (let n = 1; n <= 5; n++) if (Number(fact(2 * n) / (B(2) ** B(n) * fact(n))) !== pairingsBrute([...Array(2 * n).keys()])) return false;
      return true;
    },
    // Σ C(n,k)² = C(2n,n), сверено с подсчётом выборов n человек из 2n
    'cnt-34': () => {
      const Cb = (n, k) => k < 0 || k > n ? 0n : fact(n) / (fact(k) * fact(n - k));
      for (let n = 0; n <= 60; n++) { let s = 0n; for (let k = 0; k <= n; k++) s += Cb(n, k) ** 2n; if (s !== Cb(2 * n, n)) return false; }
      for (let n = 1; n <= 7; n++) if (countCombs(2 * n, n, () => true) !== Number(Cb(2 * n, n))) return false;
      return true;
    },
    // хоккейная клюшка: подсчёт подмножеств перебором при малых m, n
    'cnt-36': () => {
      for (let m = 0; m <= 12; m++) for (let n = 0; n <= m; n++) {
        let s = 0; for (let j = n; j <= m; j++) s += countCombs(j, n, () => true);
        if (s !== countCombs(m + 1, n + 1, () => true)) return false;
      }
      return true;
    },
    // «01» и «10» поровну ровно в половине строк
    'cnt-38': () => {
      for (let n = 2; n <= 16; n++) {
        let c = 0;
        for (let m = 0; m < 1 << n; m++) { let a = 0, b = 0; for (let i = 0; i + 1 < n; i++) { const x = m >> i & 1, y = m >> (i + 1) & 1; if (!x && y) a++; if (x && !y) b++; } if (a === b) c++; }
        if (c * 2 !== 2 ** n) return false;
      }
      return true;
    },
    // замощения 1×n плитками 1×1 и 1×2: перебор против рекурсии и суммы C(n−k, k)
    'cnt-40': () => {
      const tilings = n => { let c = 0; (function go(r) { if (r === 0) { c++; return; } if (r >= 1) go(r - 1); if (r >= 2) go(r - 2); })(n); return c; };
      const t = [];
      for (let n = 0; n <= 25; n++) t.push(tilings(n));
      for (let n = 2; n <= 25; n++) if (t[n] !== t[n - 1] + t[n - 2]) return false;
      for (let n = 0; n <= 25; n++) { let s = 0; for (let k = 0; 2 * k <= n; k++) s += C(n - k, k); if (s !== t[n]) return false; }
      return true;
    }
  },
  lessons: {
    'cnt-l1 examples': () => {
      let a = 0, b = 0, c = 0;
      for (let x = 100; x <= 999; x++) { if (x % 5 === 0) a++; if (x % 2 === 0 && new Set(digits(x)).size === 3) c++; }
      for (let x = 1000; x <= 9999; x++) if (new Set(digits(x)).size === 4) b++;
      return a === 180 && b === 4536 && c === 328;
    },
    'cnt-l2 examples': () => {
      let medals = 0; for (let g = 0; g < 7; g++) for (let s = 0; s < 7; s++) for (let br = 0; br < 7; br++) if (g !== s && s !== br && g !== br) medals++;
      const books = countPerms(7, p => { const pos = [0, 1, 2].map(i => p.indexOf(i)).sort((x, y) => x - y); return pos[2] - pos[0] === 2; });
      const round = new Set(); forEachPerm([0, 1, 2, 3, 4], p => { const k = p.indexOf(0); round.add([...p.slice(k), ...p.slice(0, k)].join()); });
      return medals === 210 && books === 720 && round.size === 24;
    },
    'cnt-l3 examples': () => {
      const team = countCombs(10, 4, () => true);
      let mixed = 0; forEachComb(12, 5, s => { if (s.filter(i => i < 5).length === 2) mixed++; });
      let diag = 0; for (let n = 4; n <= 20; n++) { let d = 0; forEachComb(n, 2, ([i, j]) => { if (j - i !== 1 && j - i !== n - 1) d++; }); if (d !== n * (n - 3) / 2) return false; }
      return team === 210 && mixed === 350 && countCombs(12, 3, () => true) === 220;
    },
    'cnt-l4 examples': () => {
      // треугольник Паскаля из правила сложения совпадает с C(n,k); строки суммируются в 2ⁿ
      let row = [1];
      for (let n = 0; n <= 20; n++) {
        if (row.some((v, k) => v !== C(n, k)) || row.reduce((s, v) => s + v, 0) !== 2 ** n) return false;
        row = [1, ...row.slice(1).map((v, i) => v + row[i]), 1];
      }
      for (let n = 1; n <= 12; n++) for (let k = 1; k <= n; k++) {
        let teams = 0; forEachComb(n, k, () => { teams += k; });
        if (teams !== n * countCombs(n - 1, k - 1, () => true)) return false;
      }
      return paths(4, 2) === 15;
    },
    'cnt-l5 examples': () => {
      // МАТЕМАТИКА: 10!/(2!3!2!) — проверяем формулу перебором на коротком слове и считаем по ней
      if (distinctWords('МАТЕМАТ') !== Number(fact(7) / (fact(2) * fact(2) * fact(2)))) return false;
      const w = Number(fact(10) / (fact(2) * fact(3) * fact(2)));
      // 9 человек на три группы по 3: группы различимы → разметки; неразличимы → множества разбиений
      let labeled = 0; const unl = new Set();
      forEachComb(9, 3, g1 => {
        const rest = [...Array(9).keys()].filter(x => !g1.includes(x));
        forEachComb(6, 3, idx => { labeled++; const g2 = idx.map(i => rest[i]), g3 = rest.filter(x => !g2.includes(x)); unl.add([g1, g2, g3].map(g => g.join('')).sort().join('|')); });
      });
      return w === 151200 && labeled === 1680 && unl.size === 280;
    },
    'cnt-l6 examples': () => {
      let rep = 0; for (let x = 10000; x <= 99999; x++) if (new Set(digits(x)).size < 5) rep++;
      let by25 = 0; for (let x = 1; x <= 100; x++) if (x % 2 === 0 || x % 5 === 0) by25++;
      const left = countPerms(6, p => p.indexOf(0) < p.indexOf(1));
      // домино 2×5: перебор замощений по клеткам
      const tile = n => { const grid = Array(2 * n).fill(false); let c = 0;
        (function go() { const i = grid.indexOf(false); if (i < 0) { c++; return; } const r = i % 2, col = (i / 2) | 0;
          if (r === 0 && !grid[i + 1]) { grid[i] = grid[i + 1] = true; go(); grid[i] = grid[i + 1] = false; }
          if (col + 1 < n && !grid[i + 2]) { grid[i] = grid[i + 2] = true; go(); grid[i] = grid[i + 2] = false; } })();
        return c; };
      return rep === 62784 && by25 === 60 && left === 360 && tile(5) === 8 && tile(1) === 1 && tile(2) === 2;
    }
  }
};

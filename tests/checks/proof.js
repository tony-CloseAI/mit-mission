// Проверки темы «Как доказывать».
const { B, isPrime, fact, near } = require('./_lib');

// Индекс единственного варианта, для которого ok(значение) истинно; иначе ошибка.
function only(values, ok, id) {
  const hits = values.map((v, i) => (ok(v) ? i : -1)).filter(i => i >= 0);
  if (hits.length !== 1) throw new Error(id + ': подходит вариантов ' + hits.length);
  return hits[0];
}
// Все наборы истинности для k высказываний.
function worlds(k, vals = [false, true]) {
  let ws = [[]];
  for (let i = 0; i < k; i++) ws = ws.flatMap(w => vals.map(v => [...w, v]));
  return ws;
}
// Вариант, совпадающий с target во всех мирах.
function sameEverywhere(target, preds, ws, id) {
  return only(preds, f => ws.every(w => f(w) === target(w)), id);
}
const isqrtB = n => { if (n < 2n) return n; let x = n, y = (x + 1n) / 2n; while (y < x) { x = y; y = (x + n / x) / 2n; } return x; };
const isSquareB = n => { const r = isqrtB(n); return r * r === n; };
const digitSum = n => String(n).split('').reduce((s, d) => s + Number(d), 0);

// Рыцари и лжецы: перебор всех расстановок. say[i](K) — утверждение i-го при массиве K (true = рыцарь).
function knights(n, say) {
  const sols = [];
  for (let m = 0; m < 1 << n; m++) {
    const K = Array.from({ length: n }, (_, i) => !!(m >> i & 1));
    if (K.every((k, i) => say[i](K) === k)) sols.push(K);
  }
  return sols;
}

// Число разбиений доски на доминошки (динамика по профилю). free[r][c] — клетка есть.
function dominoTilings(free) {
  const R = free.length, Cn = free[0].length;
  let dp = new Map([[0, 1]]);
  for (let c = 0; c < Cn; c++) {
    const next = new Map();
    for (const [mask, cnt] of dp) {
      // mask — клетки столбца c, уже занятые горизонтальными доминошками из столбца c − 1
      const go = (r, cur, out) => {
        if (r === R) { next.set(out, (next.get(out) || 0) + cnt); return; }
        const busy = (cur >> r & 1) || !free[r][c];
        if (busy) { if ((cur >> r & 1) && !free[r][c]) return; go(r + 1, cur, out); return; }
        if (c + 1 < Cn && free[r][c + 1]) go(r + 1, cur, out | 1 << r);
        if (r + 1 < R && !(cur >> (r + 1) & 1) && free[r + 1][c]) go(r + 2, cur, out);
      };
      go(0, mask, 0);
    }
    dp = next;
  }
  return dp.get(0) || 0;
}

// Ханойская башня: кратчайшее число ходов поиском в ширину по всем состояниям.
function hanoiBFS(n) {
  const start = 0; // состояние: номер стержня каждого диска — цифра в троичной записи
  const peg = (s, d) => Math.floor(s / 3 ** d) % 3;
  const target = Array.from({ length: n }, (_, d) => 2 * 3 ** d).reduce((a, b) => a + b, 0);
  const dist = new Map([[start, 0]]), q = [start];
  while (q.length) {
    const s = q.shift();
    if (s === target) return dist.get(s);
    const top = [-1, -1, -1];
    for (let d = n - 1; d >= 0; d--) top[peg(s, d)] = d; // наименьший диск на стержне
    for (let from = 0; from < 3; from++) {
      const d = top[from]; if (d < 0) continue;
      for (let to = 0; to < 3; to++) {
        if (to === from || (top[to] >= 0 && top[to] < d)) continue;
        const t = s + (to - from) * 3 ** d;
        if (!dist.has(t)) { dist.set(t, dist.get(s) + 1); q.push(t); }
      }
    }
  }
  return -1;
}

// Части плоскости: вокруг каждой точки пересечения берём 4 точки и считаем разные наборы знаков.
function lineRegions(n) {
  let seed = 7; const r = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const L = Array.from({ length: n }, (_, i) => { const t = Math.PI * (i + 0.3 * r()) / n; return [Math.cos(t), Math.sin(t), r() * 4 - 2]; });
  const sig = (x, y) => L.map(([a, b, c]) => (a * x + b * y > c ? '+' : '-')).join('');
  const seen = new Set();
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
    const [a1, b1, c1] = L[i], [a2, b2, c2] = L[j], det = a1 * b2 - a2 * b1;
    const x = (c1 * b2 - c2 * b1) / det, y = (a1 * c2 - a2 * c1) / det, e = 1e-7;
    const u = [b1, -a1], v = [b2, -a2];
    for (const s of [1, -1]) for (const t of [1, -1]) seen.add(sig(x + e * (s * u[0] + t * v[0]), y + e * (s * u[1] + t * v[1])));
  }
  return seen.size;
}

// Покрытие доски 2^k × 2^k без клетки уголками (перебор с возвратом).
function trominoTile(N, hole) {
  const g = Array.from({ length: N }, () => Array(N).fill(false));
  g[hole[0]][hole[1]] = true;
  const shapes = [[[0, 0], [0, 1], [1, 0]], [[0, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [1, 1]], [[0, 0], [1, 0], [1, -1]]];
  const dead = new Set(); // запоминаем тупиковые состояния, иначе перебор на доске 8 × 8 слишком долгий
  const solve = () => {
    const key = g.map(row => row.map(v => (v ? 1 : 0)).join('')).join('');
    if (dead.has(key)) return false;
    const ok = step();
    if (!ok) dead.add(key);
    return ok;
  };
  const step = () => {
    let fr = -1, fc = -1;
    outer: for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!g[i][j]) { fr = i; fc = j; break outer; }
    if (fr < 0) return true;
    for (const sh of shapes) {
      const cells = sh.map(([a, b]) => [fr + a, fc + b]);
      if (cells.every(([a, b]) => a >= 0 && b >= 0 && a < N && b < N && !g[a][b])) {
        cells.forEach(([a, b]) => { g[a][b] = true; });
        if (solve()) return true;
        cells.forEach(([a, b]) => { g[a][b] = false; });
      }
    }
    return false;
  };
  return solve();
}

// Разрезание квадрата side × side на квадраты: список [строка, столбец, сторона]; проверяем, что покрыто ровно один раз.
function tilesSquare(side, squares) {
  const g = Array.from({ length: side }, () => Array(side).fill(0));
  for (const [r0, c0, s] of squares) for (let r = r0; r < r0 + s; r++) for (let c = c0; c < c0 + s; c++) { if (r >= side || c >= side) return false; g[r][c]++; }
  return g.every(row => row.every(v => v === 1));
}

module.exports = {
  expected: {
    'proof-03': (() => { for (let n = 1; ; n++) if (!isPrime(n * n + n + 41)) return n; })(),
    'proof-05': (() => { for (let n = 1; ; n++) if (digitSum(n) % 7 === 0 && n % 7 !== 0) return n; })(),
    'proof-08': (() => { let s = 0; for (let k = 1; k <= 99; k += 2) s += k; return s; })(),
    'proof-09': (() => {
      // A: «B — лжец»; B: «C — лжец»; C: «A и B — лжецы»
      const s = knights(3, [K => !K[1], K => !K[2], K => !K[0] && !K[1]]);
      if (s.length !== 1) throw new Error('proof-09: решений ' + s.length);
      return s[0].filter(Boolean).length;
    })(),
    'proof-10': (() => {
      // i-й (с единицы) говорит: «здесь ровно i лжецов»
      const s = knights(10, Array.from({ length: 10 }, (_, i) => K => K.filter(k => !k).length === i + 1));
      if (s.length !== 1 || s[0].filter(Boolean).length !== 1) throw new Error('proof-10');
      return s[0].indexOf(true) + 1;
    })(),
    'proof-11': (() => { let best = Infinity; for (let m = 0; m < 1 << 10; m++) { let s = 0; for (let i = 0; i < 10; i++) s += (m >> i & 1 ? 1 : -1) * (i + 1); if (s >= 0) best = Math.min(best, s); } return best; })(),
    'proof-12': (() => { for (let n = 2; ; n++) if (isPrime(n) && !isPrime(2 ** n - 1)) return n; })(),
    'proof-14': (() => { let c = 0; for (let n = 1; n <= 100; n++) if ((n * n + 2) % 3 === 0) c++; return c; })(),
    'proof-15': (() => {
      // наименьшее M, при котором 100 — сумма семи натуральных чисел из [1, M] (динамика)
      for (let M = 1; ; M++) {
        let can = new Set([0]);
        for (let k = 0; k < 7; k++) { const nx = new Set(); for (const s of can) for (let v = 1; v <= M; v++) if (s + v <= 100) nx.add(s + v); can = nx; }
        if (can.has(100)) return M;
      }
    })(),
    'proof-16': (() => {
      const n = 12, s = knights(n, Array.from({ length: n }, (_, i) => K => !K[(i + 1) % n] && !K[(i + n - 1) % n]));
      return Math.min(...s.map(K => K.filter(Boolean).length));
    })(),
    'proof-18': (() => {
      // по кругу 1..9; первое число закрепляем, остальные переставляем
      let best = Infinity;
      const rest = [2, 3, 4, 5, 6, 7, 8, 9], used = Array(8).fill(false), cur = [1];
      const rec = () => {
        if (cur.length === 9) { let c = 0; for (let i = 0; i < 9; i++) if ((cur[i] + cur[(i + 1) % 9]) % 2 === 0) c++; best = Math.min(best, c); return; }
        for (let i = 0; i < 8; i++) if (!used[i]) { used[i] = true; cur.push(rest[i]); rec(); cur.pop(); used[i] = false; }
      };
      rec(); return best;
    })(),
    'proof-19': (() => { let s = 0n; for (let k = 1; k <= 6; k++) s += B(k) * fact(k); return Number(s); })(),
    'proof-20': hanoiBFS(7),
    'proof-22': (() => { let s = 0; for (let p = 2; p < 100000; p++) if (isPrime(p) && isPrime(p + 10) && isPrime(p + 14)) s += p; return s; })(),
    'proof-24': lineRegions(10),
    'proof-25': (() => { let c = 0; for (let n = 1n; n <= 1000n; n++) if ((n ** 3n - n) % 24n === 0n) c++; return c; })(),
    'proof-26': (() => {
      const found = [];
      for (let q = 2; q < 20000; q++) if (isPrime(q)) { const t = 1n + 2n * B(q) * B(q); if (isSquareB(t)) { const p = Number(isqrtB(t)); if (isPrime(p)) found.push(p + q); } }
      if (found.length !== 1) throw new Error('proof-26: ' + found);
      return found[0];
    })(),
    'proof-27': (() => { let last = 0; for (let n = 1; n <= 500; n++) if (2n ** B(n) <= B(n) ** 3n) last = n; return last + 1; })(),
    'proof-28': (() => { let c = 0; for (let x = 1; x <= 60; x++) for (let y = x; y <= 60; y++) for (let z = y; z <= 60; z++) if (y * z + x * z + x * y === x * y * z) c++; return c; })()
  },
  choice: {
    'proof-01': () => only([1, 2, 9, 15], v => isPrime(v) && v % 2 === 0, 'proof-01'),
    'proof-02': () => {
      // 3 ученика, у каждого 0, 1 или 2 решённые задачи из 2; утверждение: каждый решил хотя бы одну
      const ws = worlds(3, [0, 1, 2]);
      const not = w => !w.every(s => s >= 1);
      return sameEverywhere(not, [w => w.every(s => s === 0), w => w.some(s => s === 0), w => w.some(s => s === 2), w => w.every(s => s < 2)], ws, 'proof-02');
    },
    'proof-04': () => only([[2, 2], [3, -3], [0, 0], [1, 2]], ([a, b]) => a * a === b * b && a !== b, 'proof-04'),
    'proof-06': () => {
      // p — «делится на 6», q — «делится на 3»
      const imp = (x, y) => !x || y;
      return sameEverywhere(([p, q]) => imp(p, q), [([p, q]) => imp(q, p), ([p, q]) => imp(!q, !p), ([p, q]) => imp(!p, !q), ([p, q]) => p === q], worlds(2), 'proof-06');
    },
    'proof-07': () => {
      const forAll = f => { for (let n = 1; n <= 60; n++) if (!f(B(n))) return false; return true; };
      const isPrimeB = x => { if (x < 2n) return false; for (let d = 2n; d * d <= x; d++) if (x % d === 0n) return false; return true; };
      return only([n => (n * n + n) % 2n === 0n, n => (n * n + 1n) % 2n === 0n, n => (n ** 3n - n) % 4n === 0n, n => n > 20n || isPrimeB(2n ** n + 1n)], forAll, 'proof-07');
    },
    'proof-13': () => only([[2, 4], [3, 5], [2, 3], [0, 6]], ([a, b]) => (a + b) % 2 === 0 && !(a % 2 === 0 && b % 2 === 0), 'proof-13'),
    'proof-17': p => {
      const free = Array.from({ length: 8 }, (_, r) => Array.from({ length: 8 }, (_, c) => !((r === 0 && c === 0) || (r === 7 && c === 7))));
      if (dominoTilings(Array.from({ length: 8 }, () => Array(8).fill(true))) !== 12988816) throw new Error('proof-17: проверка счётчика');
      return p.opts.indexOf(dominoTilings(free) > 0 ? 'Да' : 'Нет');
    },
    'proof-21': p => {
      // при переходе n → n + 1 две группы по n лошадей пересекаются по n − 1 лошади; ищем первый n, где пересечения нет
      let n = 1; while (n - 1 >= 1) n++;
      return only(p.opts, o => o.includes('n = ' + n + ' к n = ' + (n + 1)), 'proof-21');
    },
    'proof-23': () => {
      const vals = [Math.SQRT2 + Math.sqrt(8), Math.SQRT2 * Math.sqrt(18), Math.sqrt(6) / Math.SQRT2, Math.sqrt(3) + 1];
      const rational = v => { for (let q = 1; q <= 2000; q++) if (Math.abs(v * q - Math.round(v * q)) < 1e-9) return true; return false; };
      return only(vals, rational, 'proof-23');
    }
  },
  claims: {
    // √3 иррационально: из 3 | p² следует 3 | p, и p² = 3q² не бывает
    'proof-29': () => { for (let p = 1; p <= 3000; p++) if ((p * p) % 3 === 0 && p % 3 !== 0) return false; for (let q = 1n; q <= 100000n; q++) if (isSquareB(3n * q * q)) return false; return true; },
    'proof-30': () => { let s = 0n; for (let n = 1n; n <= 2000n; n++) { s += n * n; if (6n * s !== n * (n + 1n) * (2n * n + 1n)) return false; } return true; },
    'proof-31': () => worlds(5, [0, 1, 2]).every(w => { for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) for (let k = j + 1; k < 5; k++) if ((w[i] + w[j] + w[k]) % 3 === 0) return true; return false; }),
    'proof-32': () => { for (let n = 5n; n <= 1000n; n++) if (!(2n ** n > n * n)) return false; return 2n ** 4n === 16n && 2n ** 3n < 9n; },
    'proof-33': () => {
      const can = n => { for (let a = 0; 4 * a <= n; a++) if ((n - 4 * a) % 5 === 0) return true; return false; };
      for (let n = 12; n <= 5000; n++) if (!can(n)) return false;
      return !can(11);
    },
    'proof-34': () => {
      for (let q = 1n; q <= 100000n; q++) if (isSquareB(2n * q * q)) return false; // √2 иррационально
      const x = Math.SQRT2 + Math.sqrt(3);
      if (!near((x * x - 1) / (2 * x), Math.SQRT2)) return false; // √2 = (x² − 1)/(2x)
      for (let q = 1; q <= 5000; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-7) return false;
      return true;
    },
    'proof-35': () => { let r = 1n; for (let k = 2; k <= 80; k++) { r = r * 10n + 1n; if (r % 4n !== 3n || isSquareB(r)) return false; } for (let m = 0n; m < 1000n; m++) if ((m * m) % 4n > 1n) return false; return true; },
    'proof-36': () => { for (const N of [2, 4, 8]) for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!trominoTile(N, [i, j])) return false; return true; },
    'proof-37': () => {
      // ни одно непустое подмножество сетки 4 × 4 не обладает свойством «каждая точка — середина двух других»
      const P = []; for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) P.push([x, y]);
      for (let m = 1; m < 1 << 16; m++) {
        const S = P.filter((_, i) => m >> i & 1), key = new Set(S.map(([x, y]) => x + ',' + y));
        const good = S.every(([x, y]) => S.some(([bx, by]) => (bx !== x || by !== y) && key.has((2 * x - bx) + ',' + (2 * y - by))));
        if (good) return false;
      }
      return true;
    },
    'proof-38': () => {
      const six = [[0, 0, 2], [0, 2, 1], [1, 2, 1], [2, 0, 1], [2, 1, 1], [2, 2, 1]];
      const seven = [[0, 0, 2], [0, 2, 2], [2, 0, 2], [2, 2, 1], [2, 3, 1], [3, 2, 1], [3, 3, 1]];
      const eight = [[0, 0, 3], [0, 3, 1], [1, 3, 1], [2, 3, 1], [3, 0, 1], [3, 1, 1], [3, 2, 1], [3, 3, 1]];
      if (!tilesSquare(3, six) || six.length !== 6) return false;
      if (!tilesSquare(4, seven) || seven.length !== 7) return false;
      if (!tilesSquare(4, eight) || eight.length !== 8) return false;
      if (!tilesSquare(2, [[0, 0, 1], [0, 1, 1], [1, 0, 1], [1, 1, 1]])) return false; // квадрат режется на 4: +3 штуки
      const reach = new Set([6, 7, 8]); for (let n = 9; n <= 1000; n++) { if (!reach.has(n - 3)) return false; reach.add(n); }
      return true;
    },
    'proof-39': () => {
      const cube = new Map(); for (let z = 1; z <= 400; z++) cube.set(z ** 3, z);
      for (let x = 1; x <= 200; x++) for (let y = 1; y <= 200; y++) { const t = x ** 3 + 2 * y ** 3; if (t % 4 === 0 && cube.has(t / 4)) return false; }
      return true;
    },
    'proof-40': () => {
      // построение из решения: перед числом приписываем 1 или 2
      let a = 2n;
      for (let n = 1; n <= 60; n++) {
        if (String(a).length !== n || /[^12]/.test(String(a)) || a % 2n ** B(n) !== 0n) return false;
        const t = 10n ** B(n), c1 = t + a, c2 = 2n * t + a, m = 2n ** B(n + 1);
        if ((c1 % m === 0n) === (c2 % m === 0n)) return false; // подходит ровно одна приписка
        a = c1 % m === 0n ? c1 : c2;
      }
      // независимо: при n ≤ 12 нужное число находится полным перебором
      for (let n = 1; n <= 12; n++) {
        let ok = false;
        for (let m = 0; m < 1 << n && !ok; m++) { let v = 0n; for (let i = 0; i < n; i++) v = v * 10n + (m >> i & 1 ? 2n : 1n); if (v % 2n ** B(n) === 0n) ok = true; }
        if (!ok) return false;
      }
      return true;
    }
  },
  lessons: {
    'proof l1 three consecutive': () => { for (let n = 2; n <= 1000; n++) if (((n - 1) + n + (n + 1)) % 3 !== 0) return false; return true; },
    'proof l1 converse 4 -> even': () => 6 % 2 === 0 && 6 % 4 !== 0,
    'proof l2 fermat 641': () => 2 ** 32 + 1 === 641 * 6700417 && [3, 5, 17, 257, 65537].every(isPrime),
    'proof l2 a>b but a2<b2': () => 1 > -2 && 1 * 1 < (-2) * (-2) && 0.5 * 0.5 < 0.5,
    'proof l3 n(n+1)(2n+1)': () => { for (let n = 1; n <= 1000; n++) if ((n * (n + 1) * (2 * n + 1)) % 3 !== 0) return false; return true; },
    'proof l3 x+y+z=xyz': () => { const s = []; for (let x = 1; x <= 50; x++) for (let y = x; y <= 50; y++) for (let z = y; z <= 50; z++) if (x + y + z === x * y * z) s.push([x, y, z].join(',')); return s.join(' ') === '1,2,3'; },
    'proof l3 both liars': () => { const s = []; for (const a of [false, true]) for (const b of [false, true]) if (a === (!a && !b)) s.push([a, b]); return s.length === 1 && !s[0][0] && s[0][1]; },
    'proof l4 five numbers >20': () => 5 * 4 === 20,
    'proof l5 1..n': () => { let s = 0; for (let n = 1; n <= 2000; n++) { s += n; if (2 * s !== n * (n + 1)) return false; } return true; },
    'proof l5 7^n-1': () => { for (let n = 1n; n <= 200n; n++) if ((7n ** n - 1n) % 6n !== 0n) return false; return true; },
    'proof l5 2^n >= n+1': () => { for (let n = 1n; n <= 500n; n++) if (2n ** n < n + 1n) return false; return true; }
  }
};

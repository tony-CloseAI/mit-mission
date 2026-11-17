// Проверки глубокого уровня темы «Правила подсчёта, перестановки, сочетания».
const { B, C, fact, rnd } = require('./_lib');

function forEachPerm(arr, cb) {
  const n = arr.length, used = Array(n).fill(false), cur = [];
  (function go() {
    if (cur.length === n) { cb(cur); return; }
    for (let i = 0; i < n; i++) if (!used[i]) { used[i] = true; cur.push(arr[i]); go(); cur.pop(); used[i] = false; }
  })();
}
const countPerms = (n, ok) => { let c = 0; forEachPerm([...Array(n).keys()], p => { if (ok(p)) c++; }); return c; };
function forEachComb(n, k, cb) {
  const cur = [];
  (function go(s) { if (cur.length === k) { cb(cur); return; } for (let i = s; i < n; i++) { cur.push(i); go(i + 1); cur.pop(); } })(0);
}
const Cb = (n, k) => k < 0 || k > n ? 0n : fact(n) / (fact(k) * fact(n - k));
// правильные скобочные последовательности из n пар — перебором всех строк
function dyck(n) { let c = 0; for (let m = 0; m < 1 << (2 * n); m++) { let h = 0, ok = true; for (let i = 0; i < 2 * n && ok; i++) { h += (m >> i & 1) ? 1 : -1; if (h < 0) ok = false; } if (ok && h === 0) c++; } return c; }
// разбиения n на слагаемые с ограничениями (порядок не важен): перебор невозрастающих последовательностей
function partitions(n, okPart, okList) {
  let c = 0; const cur = [];
  (function go(rest, maxPart) {
    if (rest === 0) { if (okList(cur)) c++; return; }
    for (let p = Math.min(rest, maxPart); p >= 1; p--) if (okPart(p)) { cur.push(p); go(rest - p, p); cur.pop(); }
  })(n, n);
  return c;
}

module.exports = {
  expected: {
    'cnt-41': (() => { let c = 0; for (let x = 1; x <= 10; x++) for (let y = 1; y <= 20; y++) { const z = 20 - x - y; if (z >= 1) c++; } return c; })(),
    'cnt-42': (() => { let c = 0; forEachComb(20, 5, s => { if (s.every((v, i) => i === 0 || v - s[i - 1] >= 2)) c++; }); return c; })(),
    'cnt-43': countPerms(6, p => p.every((v, i) => v !== i)),
    'cnt-44': (() => { let c = 0; for (let m = 0; m < 3 ** 7; m++) { const got = new Set(); let x = m; for (let i = 0; i < 7; i++) { got.add(x % 3); x = (x / 3) | 0; } if (got.size === 3) c++; } return c; })(),
    // очередь: перебор всех расстановок пятёрок и десяток с моделированием кассы
    'cnt-45': (() => {
      let c = 0;
      forEachComb(10, 5, fives => { let cash = 0, ok = true; for (let i = 0; i < 10 && ok; i++) { if (fives.includes(i)) cash++; else if (cash > 0) cash--; else ok = false; } if (ok) c++; });
      return c;
    })(),
    // части 10-угольника: строим картинку геометрически и считаем грани по формуле Эйлера V − E + F = 2
    'cnt-47': (() => {
      const n = 10, ang = [...Array(n).keys()].map(i => (i + 0.35 * rnd()) * 2 * Math.PI / n), P = ang.map(t => [Math.cos(t), Math.sin(t)]);
      const diags = []; forEachComb(n, 2, ([i, j]) => { if (j - i !== 1 && j - i !== n - 1) diags.push([i, j]); });
      const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
      const onDiag = diags.map(() => 0), pts = [];
      for (let u = 0; u < diags.length; u++) for (let v = u + 1; v < diags.length; v++) {
        const [a, b] = diags[u], [c, d] = diags[v];
        if (new Set([a, b, c, d]).size < 4) continue;
        const A = P[a], Bq = P[b], Cq = P[c], D = P[d];
        if (cr(A, Bq, Cq) * cr(A, Bq, D) < 0 && cr(Cq, D, A) * cr(Cq, D, Bq) < 0) {
          const t = cr(Cq, D, A) / (cr(Cq, D, A) - cr(Cq, D, Bq));
          pts.push([A[0] + t * (Bq[0] - A[0]), A[1] + t * (Bq[1] - A[1])]); onDiag[u]++; onDiag[v]++;
        }
      }
      for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) if (Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) < 1e-9) throw new Error('cnt-47 concurrent');
      const V = n + pts.length, E = n + onDiag.reduce((s, k) => s + k + 1, 0), F = 2 - V + E;
      return F - 1; // без внешней грани
    })(),
    // триангуляции 9-угольника: наборы из 6 попарно не пересекающихся диагоналей
    'cnt-50': (() => {
      const n = 9, diags = []; forEachComb(n, 2, ([i, j]) => { if (j - i !== 1 && j - i !== n - 1) diags.push([i, j]); });
      const cross = ([a, b], [c, d]) => (a < c && c < b && b < d) || (c < a && a < d && d < b);
      let cnt = 0;
      forEachComb(diags.length, n - 3, s => { for (let i = 0; i < s.length; i++) for (let j = i + 1; j < s.length; j++) if (cross(diags[s[i]], diags[s[j]])) return; cnt++; });
      return cnt;
    })(),
    'cnt-52': countPerms(8, p => { for (let i = 0; i + 1 < 8; i++) if ((p[i] >> 1) === (p[i + 1] >> 1)) return false; return true; }),
    'cnt-53': (() => { const s3 = Array(28).fill(0); for (let a = 0; a < 10; a++) for (let b = 0; b < 10; b++) for (let c = 0; c < 10; c++) s3[a + b + c]++; let c = 0; for (let x = 0; x <= 999999; x++) { const d = [x % 10, (x / 10 | 0) % 10, (x / 100 | 0) % 10, (x / 1000 | 0) % 10, (x / 10000 | 0) % 10, (x / 100000 | 0) % 10]; if (d[0] + d[1] + d[2] === d[3] + d[4] + d[5]) c++; } if (c !== s3.reduce((t, v) => t + v * v, 0)) throw new Error('cnt-53'); return c; })()
  },
  claims: {
    // Σ C(n,k) C(k,m) = C(n,m) 2^(n−m): BigInt и перебор пар «комиссия ⊇ подкомиссия»
    'cnt-46': () => {
      for (let n = 0; n <= 40; n++) for (let m = 0; m <= n; m++) { let s = 0n; for (let k = m; k <= n; k++) s += Cb(n, k) * Cb(k, m); if (s !== Cb(n, m) * 2n ** B(n - m)) return false; }
      for (let n = 0; n <= 9; n++) for (let m = 0; m <= n; m++) {
        let c = 0; for (let A = 0; A < 1 << n; A++) for (let S = A; ; S = (S - 1) & A) { let k = 0; for (let i = 0; i < n; i++) if (S >> i & 1) k++; if (k === m) c++; if (S === 0) break; }
        if (BigInt(c) !== Cb(n, m) * 2n ** B(n - m)) return false;
      }
      return true;
    },
    // разбиения со слагаемыми ≤ k и разбиения на ≤ k слагаемых
    'cnt-48': () => {
      for (let n = 1; n <= 30; n++) for (let k = 1; k <= n; k++)
        if (partitions(n, p => p <= k, () => true) !== partitions(n, () => true, l => l.length <= k)) return false;
      return true;
    },
    // теорема Эйлера: различные слагаемые и нечётные слагаемые
    'cnt-49': () => {
      for (let n = 1; n <= 45; n++)
        if (partitions(n, () => true, l => new Set(l).size === l.length) !== partitions(n, p => p % 2 === 1, () => true)) return false;
      return partitions(6, () => true, l => new Set(l).size === l.length) === 4;
    },
    // теорема о баллотировке: перебор порядков бюллетеней
    'cnt-51': () => {
      for (let a = 1; a <= 9; a++) for (let b = 0; b < a; b++) {
        let good = 0;
        forEachComb(a + b, a, As => { let d = 0, ok = true; for (let i = 0; i < a + b && ok; i++) { d += As.includes(i) ? 1 : -1; if (d <= 0) ok = false; } if (ok) good++; });
        if (good * (a + b) !== (a - b) * C(a + b, a)) return false;
      }
      return true;
    },
    // системы троек: необходимые условия ⇔ n ≡ 1, 3 (mod 6); для n = 7 и 9 такие системы есть
    'cnt-54': () => {
      for (let n = 3; n <= 600; n++) { const nec = (n - 1) % 2 === 0 && (n * (n - 1)) % 6 === 0; if (nec !== (n % 6 === 1 || n % 6 === 3)) return false; }
      const fano = [[0, 1, 2], [0, 3, 4], [0, 5, 6], [1, 3, 5], [1, 4, 6], [2, 3, 6], [2, 4, 5]];
      const affine = []; // тройки на прямых плоскости 3 × 3 (по модулю 3)
      const pt = (x, y) => 3 * x + y;
      for (let x = 0; x < 3; x++) affine.push([0, 1, 2].map(y => pt(x, y)));
      for (let y = 0; y < 3; y++) affine.push([0, 1, 2].map(x => pt(x, y)));
      for (let s = 1; s <= 2; s++) for (let c = 0; c < 3; c++) affine.push([0, 1, 2].map(x => pt(x, (s * x + c) % 3)));
      const isSystem = (n, T) => { const cnt = {}; T.forEach(t => forEachComb(3, 2, ([i, j]) => { const k = Math.min(t[i], t[j]) + ',' + Math.max(t[i], t[j]); cnt[k] = (cnt[k] || 0) + 1; })); return Object.keys(cnt).length === n * (n - 1) / 2 && Object.values(cnt).every(v => v === 1); };
      return isSystem(7, fano) && isSystem(9, affine);
    },
    // p_n = D_n + D_{n−1}: перебор перестановок
    'cnt-55': () => {
      const D = [1, 0]; for (let n = 2; n <= 9; n++) D.push(countPerms(n, p => p.every((v, i) => v !== i)));
      for (let n = 2; n <= 9; n++) {
        const pn = countPerms(n, p => { for (let i = 0; i + 1 < n; i++) if (p[i + 1] === p[i] + 1) return false; return true; });
        if (pn !== D[n] + D[n - 1]) return false;
      }
      return true;
    }
  },
  lessons: {
    'cnt-l7 examples': () => {
      let candies = 0, pos = 0;
      for (let a = 0; a <= 10; a++) for (let b = 0; a + b <= 10; b++) for (let c = 0; a + b + c <= 10; c++) { candies++; const d = 10 - a - b - c; if (a && b && c && d) pos++; }
      let noAdj = 0; forEachComb(10, 3, s => { if (s[1] - s[0] >= 2 && s[2] - s[1] >= 2) noAdj++; });
      return candies === 286 && pos === 84 && noAdj === 56 && C(13, 3) === 286 && C(8, 3) === 56;
    },
    'cnt-l8 examples': () => {
      // существует расписание: 15 учеников, у каждого 4 кружка, в каждом кружке 6 — тогда кружков 10 (проверяем подсчётом пар)
      const pairs = 15 * 4; if (pairs % 6 || pairs / 6 !== 10) return false;
      for (let n = 1; n <= 20; n++) { let s = 0; for (let k = 1; k <= n; k++) s += k * C(n, k); if (s !== n * 2 ** (n - 1)) return false; }
      const D5 = countPerms(5, p => p.every((v, i) => v !== i)), D4 = countPerms(4, p => p.every((v, i) => v !== i));
      let cop = 0; for (let x = 1; x <= 1000; x++) if (x % 2 && x % 3 && x % 5) cop++;
      return D5 === 44 && D4 === 9 && countPerms(3, p => p.every((v, i) => v !== i)) === 2 && cop === 266;
    },
    'cnt-l9 examples': () => {
      const cat = [1, 1, 2, 5, 14, 42, 132, 429, 1430];
      for (let n = 1; n <= 8; n++) if (dyck(n) !== cat[n] || C(2 * n, n) - C(2 * n, n + 1) !== cat[n] || C(2 * n, n) / (n + 1) !== cat[n]) return false;
      for (let n = 1; n <= 8; n++) { let s = 0; for (let k = 0; k < n; k++) s += cat[k] * cat[n - 1 - k]; if (s !== cat[n]) return false; }
      // путь на чертеже: касается y = −1 впервые в x = 3, отражённый хвост приходит в (8, −2)
      const h = [0, 1, 0, -1, 0, 1, 2, 1, 0];
      return h.indexOf(-1) === 3 && -2 - h[8] === -2 && h.every((y, i) => i === 0 || Math.abs(y - h[i - 1]) === 1);
    }
  }
};

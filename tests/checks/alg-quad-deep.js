// Проверки глубокого уровня темы «Квадратные уравнения и теорема Виета».
const { rint, rreal, near, round6, isPrime } = require('./_lib');

// корни по смене знака + касания (локальный минимум |f|, равный нулю)
function allRoots(f, lo, hi, step = 0.000917) {
  const out = [];
  const add = r => { if (!out.some(x => Math.abs(x - r) < 1e-6)) out.push(r); };
  let xp = lo, fp = f(lo), xpp = null, fpp = null;
  if (fp === 0) add(lo);
  for (let x = lo + step; x <= hi; x += step) {
    const fx = f(x);
    if (fx === 0) add(x);
    else if (fp !== 0 && Math.sign(fp) !== Math.sign(fx)) {
      let a = xp, b = x, fa = fp;
      for (let i = 0; i < 80; i++) { const m = (a + b) / 2, fm = f(m); if (fm === 0) { a = b = m; break; } if (Math.sign(fm) === Math.sign(fa)) { a = m; fa = fm; } else b = m; }
      add((a + b) / 2);
    }
    // касание: |f| имеет локальный минимум в xp
    if (fpp !== null && Math.abs(fp) <= Math.abs(fpp) && Math.abs(fp) <= Math.abs(fx) && Math.sign(fpp) === Math.sign(fx)) {
      let a = xpp, b = x; const gr = (Math.sqrt(5) - 1) / 2, h = t => Math.abs(f(t));
      for (let i = 0; i < 100; i++) { const c = b - gr * (b - a), d = a + gr * (b - a); if (h(c) < h(d)) b = d; else a = c; }
      const m = (a + b) / 2;
      if (Math.abs(f(m)) < 1e-11) add(m);
    }
    xpp = xp; fpp = fp; xp = x; fp = fx;
  }
  return out.sort((a, b) => a - b);
}
// корни ax² + bx + c без формулы корней: от вершины параболы делим отрезок пополам в обе стороны
// (по одну сторону от вершины трёхчлен монотонен); касание оси — значение в вершине равно нулю
function quadRoots(a, b, c) {
  const f = x => a * x * x + b * x + c, v = -b / (2 * a), fv = f(v);
  const R = 2 + 2 * Math.max(Math.abs(b), Math.abs(c)) / Math.abs(a); // все корни в [v − R; v + R]
  if (Math.abs(fv) <= 1e-12 * Math.max(1, Math.abs(c), Math.abs(b * v))) return [v];
  if (Math.sign(fv) === Math.sign(a)) return [];
  const bis = (lo, hi) => {
    let flo = f(lo);
    for (let i = 0; i < 200; i++) {
      const m = (lo + hi) / 2; if (m === lo || m === hi) break;
      const fm = f(m); if (fm === 0) return m;
      if (Math.sign(fm) === Math.sign(flo)) { lo = m; flo = fm; } else hi = m;
    }
    return (lo + hi) / 2;
  };
  return [bis(v - R, v), bis(v, v + R)];
}
function minimize(f, lo, hi, n = 20000) {
  let bx = lo, bv = Infinity;
  for (let i = 0; i <= n; i++) { const x = lo + (hi - lo) * i / n, v = f(x); if (v < bv) { bv = v; bx = x; } }
  let a = bx - (hi - lo) / n, b = bx + (hi - lo) / n; const g = (Math.sqrt(5) - 1) / 2;
  for (let i = 0; i < 100; i++) { const c = b - g * (b - a), d = a + g * (b - a); if (f(c) < f(d)) b = d; else a = c; }
  return { x: (a + b) / 2, v: f((a + b) / 2) };
}
function toFrac(x, maxDen = 2000) {
  for (let q = 1; q <= maxDen; q++) {
    const p = Math.round(x * q);
    if (Math.abs(x - p / q) < 1e-9) { const g = (a, b) => b ? g(b, a % b) : Math.abs(a); const d = g(p, q); return q / d === 1 ? String(p / d) : (p / d) + '/' + (q / d); }
  }
  throw new Error('toFrac: ' + x);
}
// корни уравнения с модулями: перебираем знаки подмодульных выражений, решаем квадратное, оставляем подходящие
function absRoots(branches) {
  const out = [];
  for (const { a, b, c, ok } of branches) for (const r of quadRoots(a, b, c)) if (ok(r) && !out.some(x => Math.abs(x - r) < 1e-6)) out.push(r);
  return out;
}

module.exports = {
  expected: {
    'quad-41': toFrac(-minimize(x => -(x + 1) / (x * x + 3), -100, 100).v),
    'quad-42': (() => {
      let c = 0;
      for (let a = -100; a <= 100; a++) {
        const r = a === 2 ? [(2 * a - 3) / (2 * a)] : quadRoots(a - 2, -2 * a, 2 * a - 3);
        if (r.length && r.every(x => x > 1e-12)) c++;
      }
      return c;
    })(),
    // наибольшее e: точки сферы Σx² = 16 на плоскости Σx = 8 — это центр (8/5, …) плюс вектор длины √3,2, перпендикулярный (1, …, 1)
    'quad-44': (() => {
      const m = 8 / 5, R2 = 16 - 5 * m * m;
      let best = -Infinity;
      for (let t = 0; t < 200000; t++) {
        const u = Array.from({ length: 5 }, () => rreal(-1, 1)); const s = u.reduce((x, y) => x + y, 0) / 5;
        const w = u.map(x => x - s), L = Math.sqrt(w.reduce((x, y) => x + y * y, 0));
        const v = w.map(x => m + Math.sqrt(R2) * x / L);
        if (!near(v.reduce((x, y) => x + y, 0), 8) || !near(v.reduce((x, y) => x + y * y, 0), 16)) throw new Error('quad-44 sample');
        best = Math.max(best, v[4]);
      }
      const exact = m + Math.sqrt(R2 * 4 / 5);
      if (!(best <= exact + 1e-9 && best > exact - 0.02)) throw new Error('quad-44 sampling');
      const pt = [6 / 5, 6 / 5, 6 / 5, 6 / 5, exact];
      if (!near(pt.reduce((x, y) => x + y, 0), 8) || !near(pt.reduce((x, y) => x + y * y, 0), 16)) throw new Error('quad-44 point');
      return toFrac(exact);
    })(),
    'quad-46': (() => {
      const good = [];
      for (let k = 0; k <= 600; k++) {
        const a = k / 50;
        const r = absRoots([
          { a: 1, b: -2, c: -3 - a, ok: x => x >= -1e-9 && x * x - 2 * x - 3 >= -1e-7 }, { a: 1, b: -2, c: -3 + a, ok: x => x >= -1e-9 && x * x - 2 * x - 3 <= 1e-7 },
          { a: 1, b: 2, c: -3 - a, ok: x => x <= 1e-9 && x * x + 2 * x - 3 >= -1e-7 }, { a: 1, b: 2, c: -3 + a, ok: x => x <= 1e-9 && x * x + 2 * x - 3 <= 1e-7 }
        ]);
        if (r.length === 5) good.push(a);
      }
      if (good.length !== 1) throw new Error('quad-46: ' + good);
      return good[0];
    })(),
    'quad-47': (() => {
      const good = [];
      for (let k = -1000; k <= 1000; k++) {
        const a = k / 100;
        if (a === 0) continue;
        const r = absRoots([
          { a: 1, b: a - 2, c: a * a - a - 8, ok: x => x >= 1 - 1e-9 },
          { a: 1, b: -(a + 2), c: a * a + a - 8, ok: x => x <= 1 + 1e-9 }
        ]);
        if (r.length === 1) good.push(a);
      }
      if (good.length !== 1) throw new Error('quad-47: ' + good);
      return good[0];
    })(),
    'quad-49': (() => {
      // по определению: корни по формуле, решения — отрезок между ними
      const good = a => { const D = 4 * a * a - 4 * (2 * a + 3); if (D < 0) return true; const s = Math.sqrt(D), x1 = (2 * a - s) / 2, x2 = (2 * a + s) / 2; return x1 >= -1e-12 && x2 <= 4 + 1e-12; };
      for (let k = -600; k <= 900; k++) { const a = k / 120; const inside = a > -1 && a <= 19 / 6 + 1e-12; if (good(a) !== inside) throw new Error('quad-49 at ' + a); }
      let lo = -2, hi = 0; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (good(m)) hi = m; else lo = m; }
      const L = hi; lo = 3; hi = 4; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if (good(m)) lo = m; else hi = m; }
      return toFrac(lo - L);
    })(),
    'quad-50': (() => {
      const res = new Set(), A = [-9, -7, -5, -3], Bv = [-35, -33, -29, -27];
      for (let q1 = -60; q1 <= 60; q1++) for (let q0 = -400; q0 <= 400; q0++) {
        const Q = x => x * x + q1 * x + q0;
        const vals = [...new Set(A.map(Q))];
        if (vals.length !== 2) continue;
        const P = x => (x - vals[0]) * (x - vals[1]);
        if (!Bv.every(x => Q(P(x)) === 0)) continue;
        if (Bv.length !== new Set(Bv).size) continue;
        const minP = minimize(P, -1000, 1000).v, minQ = minimize(Q, -1000, 1000).v;
        res.add(round6(minP + minQ));
      }
      if (res.size !== 1) throw new Error('quad-50: ' + [...res]);
      return [...res][0];
    })(),
    'quad-52': (() => {
      const g = a => x => x ** 4 - 2 * a * x * x - x + a * a - a;
      const two = [];
      for (let k = -800; k <= 1200; k++) { const a = k / 400; if (allRoots(g(a), -6, 6, 0.000731).length === 2) two.push(a); }
      const best = Math.max(...two);
      if (allRoots(g(best + 1 / 400), -6, 6, 0.000731).length !== 4) throw new Error('quad-52 right');
      return toFrac(best);
    })()
  },
  claims: {
    // 2a + 3b + 6c = 0 → корень на (0; 1); отдельно крайние случаи c = 0 и a + b + c = 0
    'quad-43': () => {
      const test = (a, b, c) => quadRoots(a, b, c).some(x => x > 1e-9 && x < 1 - 1e-9);
      for (let t = 0; t < 3000; t++) { const a = rreal(-9, 9), b = rreal(-9, 9); if (Math.abs(a) < 1e-3) continue; if (!test(a, b, -(2 * a + 3 * b) / 6)) return false; }
      for (const a of [1, -2, 3.5]) { if (!test(a, -2 * a / 3, 0)) return false; if (!test(a, -4 * a / 3, a / 3)) return false; }
      return true;
    },
    // f(x) = x не имеет корней → f(f(x)) − x > 0 везде
    'quad-45': () => {
      for (let t = 0; t < 400; t++) {
        const p = rreal(-6, 6), q = rreal(-6, 12);
        if ((p - 1) ** 2 - 4 * q >= 0) continue;
        const f = x => x * x + p * x + q;
        if (!(minimize(x => f(f(x)) - x, -30, 30, 6000).v > 0)) return false;
      }
      return true;
    },
    // (a + c)(a + b + c) < 0 → (b − c)² > 4a(a + b + c), в том числе при a = 0
    'quad-48': () => {
      let n = 0;
      for (let t = 0; t < 100000; t++) {
        const a = t % 10 === 0 ? 0 : rreal(-9, 9), b = rreal(-9, 9), c = rreal(-9, 9);
        if (!((a + c) * (a + b + c) < 0)) continue;
        n++;
        if (!((b - c) ** 2 > 4 * a * (a + b + c))) return false;
      }
      return n > 1000;
    },
    // ровно три пары натуральных p, q
    'quad-51': () => {
      const intRoots = (p, q) => { const D = p * p - 4 * q; if (D < 0) return false; const s = Math.round(Math.sqrt(D)); return s * s === D && (p + s) % 2 === 0; };
      const found = [];
      for (let p = 1; p <= 400; p++) for (let q = 1; q <= 400; q++) if (intRoots(p, q) && intRoots(q, p)) found.push(p + ',' + q);
      return found.join(' ') === '4,4 5,6 6,5';
    },
    // неравенство Ацеля на случайных наборах
    'quad-53': () => {
      for (let t = 0; t < 50000; t++) {
        const b = rreal(-5, 5), c = rreal(-5, 5), a = (rnd2() < 0.5 ? -1 : 1) * (Math.sqrt(b * b + c * c) + rreal(0.001, 3));
        const x = rreal(-9, 9), y = rreal(-9, 9), z = rreal(-9, 9);
        const L = (a * x - b * y - c * z) ** 2, R = (a * a - b * b - c * c) * (x * x - y * y - z * z);
        if (L < R - 1e-9 * Math.max(1, Math.abs(R))) return false;
      }
      return true;
    },
    // при a ≤ 4 двух различных корней на (0; 1) не бывает; при a = 5 бывает
    'quad-54': () => {
      const ok = (a, b, c) => { const r = quadRoots(a, b, c); return r.length === 2 && r.every(x => x > 1e-12 && x < 1 - 1e-12); };
      let first = null;
      for (let a = 1; a <= 12 && first === null; a++) for (let b = -30; b <= 30; b++) for (let c = -30; c <= 30; c++) if (ok(a, b, c)) { first = a; break; }
      return first === 5 && ok(5, -5, 1);
    },
    // f(f(x)) = 0 с четырьмя корнями и парой с суммой −1 → b ≤ −1/4
    'quad-55': () => {
      // случай 1: a = 1, пара из одного уравнения
      for (let k = -4000; k < 250; k++) {
        const b = k / 1000, D = 1 - 4 * b;
        if (D <= 0) continue;
        const r1 = (-1 - Math.sqrt(D)) / 2;
        if (1 - 4 * (b - r1) <= 0) continue; // у f(x) = r1 нет двух корней
        if (!(b < -0.25)) return false;
      }
      // случай 2: пары из разных уравнений, ищем b, где сумма равна −1
      let hits = 0;
      for (let t = 0; t < 300; t++) {
        const a = rreal(-6, 6);
        const roots = b => {
          const D = a * a - 4 * b; if (D <= 0) return null;
          const r1 = (-a - Math.sqrt(D)) / 2, r2 = (-a + Math.sqrt(D)) / 2, e1 = a * a - 4 * (b - r1), e2 = a * a - 4 * (b - r2);
          if (e1 <= 0 || e2 <= 0) return null;
          return [[(-a - Math.sqrt(e1)) / 2, (-a + Math.sqrt(e1)) / 2], [(-a - Math.sqrt(e2)) / 2, (-a + Math.sqrt(e2)) / 2]];
        };
        for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
          const s = b => { const R = roots(b); return R ? R[0][i] + R[1][j] + 1 : null; };
          let pb = null, ps = null;
          for (let b = -40; b < a * a / 4; b += 0.01) {
            const v = s(b);
            if (v !== null && ps !== null && Math.sign(v) !== Math.sign(ps)) {
              let lo = pb, hi = b;
              for (let it = 0; it < 60; it++) { const m = (lo + hi) / 2, sm = s(m); if (sm === null) break; if (Math.sign(sm) === Math.sign(s(lo))) lo = m; else hi = m; }
              const bb = (lo + hi) / 2, R = roots(bb);
              if (R && Math.abs(R[0][i] + R[1][j] + 1) < 1e-8) { hits++; if (bb > -0.25 + 1e-9) return false; }
            }
            pb = b; ps = v;
          }
        }
      }
      return hits > 50;
    }
  },
  lessons: {
    'quad-l7 lemma and examples': () => {
      for (let t = 0; t < 5000; t++) {
        const a = rreal(-5, 5), b = rreal(-5, 5), c = rreal(-5, 5), x = rreal(-5, 5);
        if (Math.abs(a) < 1e-3) continue;
        const r = quadRoots(a, b, c), between = r.length === 2 && r[0] < x && x < r[1];
        if ((a * (a * x * x + b * x + c) < 0) !== between) return false;
      }
      for (let t = 0; t < 2000; t++) {
        const a = rreal(0.01, 5), b = rreal(-5, 5), c = -a - b - rreal(0.01, 5);
        const r = quadRoots(a, b, c);
        if (!(r.length === 2 && r[0] < 1 && r[1] > 1)) return false;
      }
      for (let k = -800; k <= 800; k++) {
        const a = k / 160, r = quadRoots(1, -2 * a, a + 2), ok = r.length > 0 && r.every(x => x > 1);
        if (ok !== (a >= 2 && a < 3)) return false;
      }
      return true;
    },
    'quad-l8 examples': () => {
      for (let t = 0; t < 3000; t++) {
        const n = rint(1, 6), A = Array.from({ length: n }, () => rreal(-5, 5)), Bv = Array.from({ length: n }, () => rreal(-5, 5));
        const C = A.reduce((s, x, i) => s + x * Bv[i], 0);
        if (C * C > A.reduce((s, x) => s + x * x, 0) * Bv.reduce((s, x) => s + x * x, 0) + 1e-9) return false;
      }
      const h = x => (x * x + x + 1) / (x * x + 1);
      const mn = minimize(h, -200, 200), mx = minimize(x => -h(x), -200, 200);
      if (!near(mn.v, 0.5) || !near(-mx.v, 1.5) || !near(h(1), 1.5) || !near(h(-1), 0.5)) return false;
      let m = Infinity;
      for (let x = -10; x <= 10; x += 0.01) for (let y = -10; y <= 10; y += 0.01) m = Math.min(m, x * x + 5 * y * y - 4 * x * y + 2 * x - 6 * y + 3);
      return m > 0.999 && m < 1.001;
    },
    'quad-l9 examples': () => {
      const s3 = Math.sqrt(3), r = allRoots(x => x ** 3 - (s3 + 1) * x * x + 3, -10, 10);
      const want = [(1 - Math.sqrt(1 + 4 * s3)) / 2, s3, (1 + Math.sqrt(1 + 4 * s3)) / 2].sort((a, b) => a - b);
      if (r.length !== 3 || !r.every((x, i) => near(x, want[i]))) return false;
      const cnt = a => absRoots([{ a: 1, b: -4, c: 3 - a, ok: x => x >= -1e-9 }, { a: 1, b: 4, c: 3 - a, ok: x => x <= 1e-9 }]).length;
      if ([[-1.5, 0], [-1, 2], [0, 4], [1.5, 4], [2.9, 4], [3, 3], [3.5, 2], [10, 2]].some(([a, n]) => cnt(a) !== n)) return false;
      const uniq = [];
      for (let k = -500; k <= 500; k++) {
        const a = k / 100;
        const n = absRoots([{ a: 1, b: a, c: a * a - 4, ok: x => x >= -1e-9 }, { a: 1, b: -a, c: a * a - 4, ok: x => x <= 1e-9 }]).length;
        if (n === 1) uniq.push(a);
      }
      return uniq.join() === '2';
    }
  }
};

// отдельный генератор для знака, чтобы не сбивать общую последовательность
let s2 = 777;
function rnd2() { s2 = (s2 * 1103515245 + 12345) % 2147483648; return s2 / 2147483648; }

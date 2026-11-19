// Общие инструменты для проверок темы «Линейные уравнения, системы, модуль».
// Все ответы считаются численно, независимо от решений в тексте.

// метод Гаусса: статус системы A·x = b ('unique' | 'none' | 'inf') и решение
function solveLin(A, b) {
  const m = A.length, n = A[0].length, M = A.map((r, i) => [...r, b[i]]);
  let row = 0; const piv = [];
  for (let c = 0; c < n && row < m; c++) {
    let p = row;
    for (let r = row + 1; r < m; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-10) continue;
    [M[row], M[p]] = [M[p], M[row]];
    for (let r = 0; r < m; r++) if (r !== row) { const f = M[r][c] / M[row][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[row][k]; }
    piv.push(c); row++;
  }
  for (let r = row; r < m; r++) if (Math.abs(M[r][n]) > 1e-8) return { status: 'none', rank: row };
  if (row < n) return { status: 'inf', rank: row };
  const x = Array(n).fill(0); piv.forEach((c, i) => { x[c] = M[i][n] / M[i][c]; });
  return { status: 'unique', x, rank: row };
}
const rank = A => solveLin(A, A.map(() => 0)).rank;

// нули кусочно-линейной функции, у которой все изломы — точки вида k/den на [lo; hi]:
// на каждом маленьком отрезке функция линейна, поэтому корни находятся точно.
// Возвращает корни, признак «нули на целом отрезке» и наименьший ноль.
function plZeros(f, lo = -60, hi = 60, den = 60) {
  const N = Math.round((hi - lo) * den), eps = 1e-9, pts = [];
  let inf = false, min = Infinity;
  const add = x => { if (!pts.some(y => Math.abs(y - x) < 1e-7)) pts.push(x); if (x < min) min = x; };
  let x0 = lo, f0 = f(x0);
  for (let i = 1; i <= N; i++) {
    const x1 = lo + i / den, f1 = f(x1);
    if (Math.abs(f0) < eps && Math.abs(f1) < eps) { inf = true; if (x0 < min) min = x0; }
    else if (Math.abs(f0) < eps) add(x0);
    else if (Math.abs(f1) >= eps && f0 * f1 < 0) add(x0 + (x1 - x0) * f0 / (f0 - f1));
    x0 = x1; f0 = f1;
  }
  if (Math.abs(f0) < eps && !inf) add(x0);
  return { pts: pts.sort((a, b) => a - b), inf, min };
}

// площадь фигуры {(x, y): inside(x, y)} подсчётом клеток сетки с шагом h
function gridArea(inside, R, h = 0.004) {
  let c = 0;
  for (let x = -R + h / 2; x < R; x += h) for (let y = -R + h / 2; y < R; y += h) if (inside(x, y)) c++;
  return c * h * h;
}
const shoelace = P => Math.abs(P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;

function toFrac(x, maxDen = 2000) {
  for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(x - p / q) < 1e-9) { return q === 1 ? String(p) : p + '/' + q; } }
  throw new Error('toFrac ' + x);
}
const range = (a, b, step = 1) => { const out = []; for (let i = 0; a + i * step <= b + 1e-9; i++) out.push(+(a + i * step).toFixed(10)); return out; };
const cntInt = (lo, hi, pred) => { let c = 0; for (let x = lo; x <= hi; x++) if (pred(x)) c++; return c; };

module.exports = { solveLin, rank, plZeros, gridArea, shoelace, toFrac, range, cntInt };

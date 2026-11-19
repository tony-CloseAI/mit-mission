// Проверки глубокого уровня темы «Многочлены».
const { near, round6 } = require('./_lib');
const L = require('./_polylib');
const { Q, P, mul, pow, add, sub, divmod, evalq, qstr, fromRoots, lagrange, roots, powerSum, compose } = L;
const onlyOne = list => { const u = [...new Set(list.map(String))]; if (u.length !== 1) throw new Error('неоднозначно: ' + u); return u[0]; };
const isZero = p => p.every(c => c[0] === 0n);
const binom = (n, k) => { let r = 1n; for (let i = 0n; i < BigInt(k); i++) r = r * (BigInt(n) - i) / (i + 1n); return r; };
const intCoeffs = p => p.every(c => c[1] === 1n);

module.exports = {
  expected: {
    'poly-41': qstr(evalq(lagrange([0, 1, 2, 3, 4].map(k => [k, Q(2 ** k)])), 5)),
    'poly-42': qstr(evalq(lagrange([0, 1, 2, 3, 4, 5].map(k => [k, Q(k, k + 1)])), 6)),
    'poly-44': round6(powerSum([3, -1, -3, 1], 4)),
    // x, y, z — корни t³ − e1 t² + e2 t − e3; e2, e3 находим перебором рациональных значений по p2 и p3
    // e2, e3 перебираем по p2 и p3 (рекуррентно), найденную тройку проверяем численными корнями
    'poly-46': onlyOne((() => { const out = []; for (let n2 = -40; n2 <= 40; n2++) for (let n3 = -40; n3 <= 40; n3++) { const e1 = 1, e2 = n2 / 4, e3 = n3 / 4, p2 = e1 * e1 - 2 * e2, p3 = e1 * p2 - e2 * e1 + 3 * e3; if (!near(p2, 3) || !near(p3, 7)) continue;
        const c = [-e3, e2, -e1, 1]; if (!near(powerSum(c, 2), 3, 1e-6) || !near(powerSum(c, 3), 7, 1e-6)) throw new Error('poly-46'); out.push(round6(powerSum(c, 4))); } return out; })()),
    // перебор приведённых многочленов 4-й степени с малыми целыми коэффициентами: минимум max |P(k)|
    'poly-47': (() => { let best = Infinity; for (let a = -12; a <= 12; a++) for (let b = -30; b <= 30; b++) for (let c = -30; c <= 30; c++) for (let d = -6; d <= 6; d++) { let m = 0; for (let k = 0; k <= 4 && m < best; k++) m = Math.max(m, Math.abs(k ** 4 + a * k ** 3 + b * k * k + c * k + d)); if (m < best) best = m; } return best; })(),
    // наименьший положительный старший коэффициент кубического целозначного многочлена: перебор a/6, … и проверка целозначности
    // наименьший положительный старший коэффициент кубического целозначного многочлена: кандидаты по возрастанию
    'poly-49': (() => { const cand = []; for (let den = 1; den <= 24; den++) for (let num = 1; num <= den; num++) cand.push([num, den]); cand.sort((u, w) => u[0] / u[1] - w[0] / w[1]);
      for (const [num, den] of cand) { const a3 = Q(num, den); for (let b = -12; b <= 12; b++) for (let c = -12; c <= 12; c++) { const p = P([0, Q(c, 6), Q(b, 6), a3]); if ([0, 1, 2, 3, -1, -2, 7, 10].every(x => evalq(p, x)[1] === 1n)) return qstr(a3); } }
      return 'нет'; })(),
    // число представлений 100 = Σ a_i 2^i с a_i ∈ {0,1,2,3}: динамика по разрядам
    'poly-50': (() => { const memo = new Map(); const f = n => { if (n < 0) return 0; if (n === 0) return 1; if (memo.has(n)) return memo.get(n); let s = 0; for (let a = n % 2; a <= 3; a += 2) if (n - a >= 0) s += f((n - a) / 2); memo.set(n, s); return s; }; return f(100); })(),
    // многочлены с целыми коэффициентами степени ≤ 3 со значениями 0/1 в точках 0..3: интерполяция и проверка целости коэффициентов
    'poly-52': (() => { let cnt = 0; for (let m = 0; m < 16; m++) { const pts = [0, 1, 2, 3].map(k => [k, Q(m >> k & 1)]); if (intCoeffs(lagrange(pts))) cnt++; } return cnt; })()
  },
  claims: {
    'poly-43': () => { // P = x² + c подходит; Q(x + 1) = Q(x) для многочлена степени ≤ 4 возможно только у константы
      if (![0, 3, -7].every(c => { const p = P([c, 0, 1]); return isZero(sub(sub(compose(p, P([1, 1])), p), P([1, 2]))); })) return false;
      for (let a = -3; a <= 3; a++) for (let b = -3; b <= 3; b++) for (let c = -3; c <= 3; c++) { const q = P([0, c, b, a]); if (isZero(sub(compose(q, P([1, 1])), q)) && !isZero(q)) return false; } return true; },
    // целые в n + 1 последовательных точках ⇒ целые везде: случайные целочисленные значения, интерполяция, проверка в далёких точках
    'poly-45': () => { let seed = 45; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 200; t++) { const n = 1 + Math.floor(rnd() * 5), a = Math.floor(rnd() * 20) - 10, pts = []; for (let i = 0; i <= n; i++) pts.push([a + i, Q(Math.floor(rnd() * 41) - 20)]); const p = lagrange(pts); for (let x = -30; x <= 30; x++) if (evalq(p, x)[1] !== 1n) return false; }
      return [...Array(8).keys()].every(k => [-7, -3, -1].every(x => { const num = Array.from({ length: k }, (_, i) => BigInt(x - i)).reduce((s, y) => s * y, 1n), den = Array.from({ length: k }, (_, i) => BigInt(i + 1)).reduce((s, y) => s * y, 1n); return num % den === 0n; })); },
    // Φ_p(y + 1): коэффициенты C(p, k), Эйзенштейн для p = 2, 3, 5, 7, 11, 13
    'poly-48': () => [2, 3, 5, 7, 11, 13].every(p => { const phi = P(Array(p).fill(1)), sh = compose(phi, P([1, 1])); if (sh.length !== p) return false;
      return sh.every((c, i) => c[0] === binom(p, i + 1) && c[1] === 1n) && sh.slice(0, p - 1).every(c => c[0] % BigInt(p) === 0n) && sh[0][0] % BigInt(p * p) !== 0n; }),
    'poly-51': () => { let seed = 51; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 3000; t++) { const n = 1 + Math.floor(rnd() * 7), c = Array.from({ length: n }, () => (rnd() - 0.5) * 20); c.push(1); let fact = 1; for (let i = 2; i <= n; i++) fact *= i;
        const m = Math.max(...Array.from({ length: n + 1 }, (_, k) => Math.abs(c.reduce((s, ci, i) => s + ci * k ** i, 0)))); if (m < fact / 2 ** n - 1e-9) return false; }
      return true; },
    // (x − a1)…(x − an) − 1: нет разложения на множители с целыми коэффициентами (малые случаи: нет целых корней и нет квадратичных множителей)
    'poly-53': () => { for (const A of [[0, 1, 2, 3], [-1, 2, 4, 7], [0, 1, 2, 3, 5]]) { const p = sub(fromRoots(A), P([1]));
        for (let n = -60; n <= 60; n++) if (evalq(p, n)[0] === 0n) return false;
        for (let b = -6; b <= 6; b++) for (let c = -6; c <= 6; c++) { if (c === 0) continue; if (isZero(divmod(p, P([c, b, 1]))[1])) return false; } }
      return true; },
    'poly-54': () => { for (const A of [[0, 1], [0, 2], [-1, 3], [0, 1, 2]]) { const a = fromRoots(A), p = add(mul(a, a), P([1]));
        for (let b = -8; b <= 8; b++) for (let c = 1; c <= 12; c++) if (isZero(divmod(p, P([c, b, 1]))[1])) return false; }
      return true; },
    // IMO 2006: перебор многочленов степени 2–3 с малыми коэффициентами — решений Q(x) = x (k = 1..4) не больше степени
    'poly-55': () => { for (let a0 = -4; a0 <= 4; a0++) for (let a1 = -4; a1 <= 4; a1++) for (let a2 = -2; a2 <= 2; a2++) for (let a3 = -1; a3 <= 1; a3++) {
        const n = a3 ? 3 : a2 ? 2 : 0; if (n < 2) continue; const f = x => a0 + a1 * x + a2 * x * x + a3 * x ** 3;
        for (let k = 1; k <= 4; k++) { let cnt = 0; for (let x = -40; x <= 40; x++) { let y = x, ok = true; for (let i = 0; i < k; i++) { y = f(y); if (Math.abs(y) > 1e9) { ok = false; break; } } if (ok && y === x) cnt++; } if (cnt > n) return false; } }
      return true; }
  },
  lessons: {
    'poly-l7 examples': () => { const p = lagrange([[0, Q(1)], [1, Q(3)], [2, Q(7)]]); const cubes = [0, 1, 8, 27, 64]; const d1 = cubes.slice(1).map((x, i) => x - cubes[i]), d2 = d1.slice(1).map((x, i) => x - d1[i]), d3 = d2.slice(1).map((x, i) => x - d2[i]);
      return p.map(qstr).join() === '1,1,1' && d3.join() === '6,6'; },
    'poly-l8 examples': () => { const sh = compose(P([1, 0, 0, 0, 1]), P([1, 1])); return sh.map(qstr).join() === '2,4,6,4,1'; },
    'poly-l9 examples': () => { let seed = 9; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 200; t++) { const x = rnd() * 4 - 2, y = rnd() * 4 - 2, z = rnd() * 4 - 2, e1 = x + y + z, e2 = x * y + y * z + z * x, e3 = x * y * z;
        if (!near(x ** 3 + y ** 3 + z ** 3, e1 ** 3 - 3 * e1 * e2 + 3 * e3, 1e-9)) return false;
        const p = k => x ** k + y ** k + z ** k; if (!near(p(4), e1 * p(3) - e2 * p(2) + e3 * p(1), 1e-9)) return false; }
      return fromRoots([1, 2, 3]).map(qstr).join() === '-6,11,-6,1'; }
  }
};

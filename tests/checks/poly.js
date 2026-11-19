// Проверки темы «Многочлены».
// Коэффициенты, остатки и значения считаются точной арифметикой; суммы по корням — через численные корни.
const { near, round6 } = require('./_lib');
const L = require('./_polylib');
const { Q, P, mul, pow, add, sub, divmod, evalq, qstr, deg, fromRoots, realRoots, powerSum, toNum, roots, lagrange } = L;
const X = P([0, 1]);
const v = (p, x) => qstr(evalq(p, x));
const onlyOne = list => { const u = [...new Set(list.map(String))]; if (u.length !== 1) throw new Error('неоднозначно: ' + u); return u[0]; };
const sumCoeffParity = (p, odd) => p.reduce((s, c, i) => (i % 2 === (odd ? 1 : 0) ? L.qadd(s, c) : s), Q(0));
const isRoot = (pnum, x) => Math.abs(pnum.reduce((s, c, i) => s + c * x ** i, 0)) < 1e-9;
// остаток от деления x^k на D быстрым возведением в степень
const xPowMod = (k, D) => { let r = P([1]), b = divmod(X, D)[1]; while (k > 0) { if (k & 1) r = divmod(mul(r, b), D)[1]; b = divmod(mul(b, b), D)[1]; k >>= 1; } return r; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

module.exports = {
  expected: {
    'poly-01': qstr(pow(P([-1, 3]), 4).reduce((s, c) => L.qadd(s, c), Q(0))),
    'poly-02': qstr(mul(mul(P([2, 1]), P([-3, 1])), P([1, 2]))[0]),
    'poly-03': deg(sub(mul(P([1, 0, 0, 1]), P([5, -1, 1])), P([0, 0, 0, 0, 0, 1]))),
    'poly-05': qstr(divmod(P([-5, 2, 0, 1]), P([-2, 1]))[1][0]),
    'poly-06': qstr(divmod(P([-6, 11, -6, 1]), P([-1, 1]))[0][1]),
    'poly-07': onlyOne(range(-20, 20).filter(a => evalq(P([6, a, 0, 1]), -2)[0] === 0n)),
    'poly-08': qstr(sumCoeffParity(pow(P([1, 1]), 6), false)),
    // остаток от деления на x² − 1 по точному делению многочлена, у которого остатки 3 и 5
    'poly-09': (() => { const Pp = add(mul(P([-1, 0, 1]), P([2, -7, 1, 4])), P([4, -1])); if (v(Pp, 1) !== '3' || v(Pp, -1) !== '5') throw new Error('poly-09'); return qstr(divmod(Pp, P([-1, 0, 1]))[1][0]); })(),
    'poly-10': round6(powerSum([-8, 14, -7, 1], 2)),
    'poly-11': (() => { const p = [6, 11, -9, -1, 1]; return range(-6, 6).filter(x => isRoot(p, x)).reduce((s, x) => s + x, 0); })(),
    'poly-12': qstr(add(add(xPowMod(2026, P([1, 1])), xPowMod(2025, P([1, 1]))), P([1]))[0]),
    'poly-13': onlyOne((() => { const out = []; for (let p = -10; p <= 10; p++) for (let q = -10; q <= 10; q++) { const r = divmod(P([q, p, 0, 1]), P([1, -2, 1]))[1]; if (r.every(c => c[0] === 0n)) out.push(q); } return out; })()),
    'poly-15': onlyOne(range(-20, 20).filter(a => qstr(divmod(P([1, 0, a, 0, 1]), P([-2, 1]))[1][0]) === '1')),
    'poly-16': (() => { const r = roots([-6, 11, -6, 1]); const s = r.reduce((t, z) => t + z[0] / (z[0] ** 2 + z[1] ** 2), 0); return round6(s) === round6(11 / 6) ? '11/6' : String(s); })(),
    'poly-17': qstr(sumCoeffParity(pow(P([1, 1, -1]), 10), true)),
    'poly-18': (() => { const base = fromRoots([1, 2, 3]); const a = 12 / Number(evalq(base, 0)[0]); return Number(evalq(base, 4)[0]) * a; })(),
    'poly-19': v(add(xPowMod(2026, P([-1, 0, 1])), xPowMod(2025, P([-1, 0, 1]))), 10),
    'poly-20': (() => { const rr = realRoots([2, -3, -3, 2]).filter(x => Math.abs(x - Math.round(x)) > 1e-6); if (rr.length !== 1) throw new Error('poly-20'); return round6(rr[0]); })(),
    'poly-21': (() => { // перебор линейных и квадратичных многочленов с целыми коэффициентами
      let best = Infinity; for (let a = -30; a <= 30; a++) for (let b = -60; b <= 60; b++) for (let c = -200; c <= 200; c++) { if (a * 9 + b * 3 + c !== 5) continue; const val = a * 100 + b * 10 + c; if (val > 100 && val < best) best = val; } return best; })(),
    // квадрат (x² + px + q)² должен иметь коэффициенты 4 и −8 при x⁰ и x¹ — перебираем p, q
    'poly-22': onlyOne((() => { const out = []; for (let p = -10; p <= 10; p++) for (let q = -10; q <= 10; q++) { const sq = pow(P([q, p, 1]), 2).map(qstr); if (sq[0] === '4' && sq[1] === '-8') out.push(Number(sq[3]) + Number(sq[2])); } return out; })()),
    'poly-23': (() => { const r = lagrange([[1, Q(2)], [2, Q(3)], [3, Q(6)]]); const big = add(mul(fromRoots([1, 2, 3]), P([7, -2, 1])), r); if (v(divmod(big, P([-1, 1]))[1], 0) !== '2') throw new Error('poly-23'); return v(divmod(big, fromRoots([1, 2, 3]))[1], 4); })(),
    'poly-24': onlyOne(range(-30, 30).filter(a => { const r = realRoots([-6, a, -6, 1]); return r.length === 3 && near(r[1] - r[0], r[2] - r[1], 1e-6); })),
    'poly-25': round6(realRoots([1, -5, 6, -5, 1]).reduce((s, x) => s + x, 0)),
    'poly-26': v(divmod(P([...Array(50).fill(0), 1]), P([1, -2, 1]))[1], 2),
    'poly-27': v(add(fromRoots([1, 2, 3]), P([7])), 4),
    'poly-28': onlyOne((() => { const out = []; for (let q = -200; q <= 200; q++) { const pn = [q, -13, 0, 1]; const ints = range(-30, 30).filter(x => isRoot(pn, x)); if (ints.length === 3 && ints.includes(3)) out.push(q); } return out; })()),
    'poly-29': onlyOne(range(-5, 5).map(r => { const p = add(mul(fromRoots([1, 2, 3, r]), P([1])), P([0, 10])); if (v(p, 1) !== '10' || v(p, 2) !== '20' || v(p, 3) !== '30') throw new Error('poly-29'); return v(add(P([evalq(p, 12)]), P([evalq(p, -8)])), 0); })),
    'poly-31': v(divmod(pow(P([1, 1]), 10), P([1, 0, 1]))[1], 1),
    'poly-33': round6(powerSum([-1, -1, 0, 1], 5)),
    'poly-36': onlyOne([0, 1, -1.5, 2.2].map(q => { const r = realRoots([q, -3, 0, 1]); if (r.length !== 3) return null; if (!near(r.reduce((s, x) => s + x * x, 0), 6, 1e-6)) throw new Error('poly-36'); return round6(r.reduce((s, x) => s + x ** 4, 0)); }).filter(x => x !== null)),
    'poly-37': (() => { const r = roots([-5, 3, -2, 1]); let re = 0; r.forEach(z => { const w = [1 - z[0], -z[1]], m = w[0] ** 2 + w[1] ** 2; re += w[0] / m; }); return near(re, -2 / 3, 1e-9) ? '-2/3' : String(re); })()
  },
  choice: {
    'poly-04': p => { const roots0 = p.opts.map(o => Number(o.replace('−', '-'))).map(x => x ** 3 - 2 * x * x - x + 2 === 0); if (roots0.filter(Boolean).length !== 1) throw new Error('poly-04'); return roots0.indexOf(true); },
    'poly-14': p => { // проверяем утверждения на примерах многочленов пятой степени
      const examples = [[0, 0, 0, 0, 0, 1], [0, 4, 0, -5, 0, 1], [1, 0, 0, 0, 0, 1], [0, 0, 0, 0, 1, 1]];
      const cnt = examples.map(e => range(-10, 10).filter(x => isRoot(e, x)).length); // у примеров все действительные корни целые: 1, 5, 1, 2
      const tests = [n => n === 5, n => n <= 5, n => n >= 5, () => false]; const always = tests.map((t, i) => i === 3 ? false : cnt.every(t));
      if (always.filter(Boolean).length !== 1) throw new Error('poly-14 ' + cnt); return always.indexOf(true);
    }
  },
  claims: {
    // три точки со значением 1 — нет целых корней (перебор многочленов вида 1 + (x−a)(x−b)(x−c)Q с малыми Q)
    'poly-30': () => { for (const [a, b, c] of [[0, 1, 2], [-1, 2, 5], [3, 4, 7]]) for (let q0 = -3; q0 <= 3; q0++) for (let q1 = -3; q1 <= 3; q1++) { const p = add(mul(fromRoots([a, b, c]), P([q0, q1])), P([1])); for (let n = -30; n <= 30; n++) if (evalq(p, n)[0] === 0n) return false; } return true; },
    'poly-32': () => { let seed = 32; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 3000; t++) { const c = Array.from({ length: 5 }, () => Math.floor(rnd() * 21) - 10); const p = P(c); if (Number(evalq(p, 0)[0]) % 2 === 0 || Number(evalq(p, 1)[0]) % 2 === 0) continue; for (let n = -40; n <= 40; n++) if (evalq(p, n)[0] === 0n) return false; } return true; },
    // нет 3-цикла: перебор многочленов степени ≤ 2 с малыми коэффициентами и троек
    'poly-34': () => { for (let a0 = -6; a0 <= 6; a0++) for (let a1 = -6; a1 <= 6; a1++) for (let a2 = -3; a2 <= 3; a2++) { const f = x => a0 + a1 * x + a2 * x * x; for (let a = -8; a <= 8; a++) { const b = f(a), c = f(b); if (a !== b && b !== c && a !== c && f(c) === a) return false; } } return true; },
    // x⁴ + 1: нет разложения (x² + ax + b)(x² + cx + d) с целыми и нет целых корней
    'poly-35': () => { for (let a = -5; a <= 5; a++) for (let b = -5; b <= 5; b++) for (let c = -5; c <= 5; c++) for (let d = -5; d <= 5; d++) if (sub(mul(P([b, a, 1]), P([d, c, 1])), P([1, 0, 0, 0, 1])).every(z => z[0] === 0n)) return false; return ![-1, 1].some(x => x ** 4 + 1 === 0); },
    'poly-38': () => { for (const [a, b, c] of [[0, 1, 2], [-3, 1, 4], [2, 5, -7]]) { const p = sub(fromRoots([a, b, c]), P([1])); for (let n = -50; n <= 50; n++) if (evalq(p, n)[0] === 0n) return false; } return true; },
    // многочлен с целыми коэффициентами: P(a + kp) делится на p
    'poly-39': () => { for (const c of [[1, 1, 1], [41, 1, 1], [3, 0, 2], [5, 2, 0, 1]]) { const f = x => c.reduce((s, ci, i) => s + ci * x ** i, 0); for (let a = 1; a <= 5; a++) { const p = f(a); if (p < 2) continue; for (let k = 1; k <= 20; k++) if (f(a + k * p) % p !== 0) return false; } } return true; },
    'poly-40': () => { const ok = p => sub(L.compose(p, P([0, 0, 1])), mul(p, p)).every(z => z[0] === 0n);
      if (![0, 1, 2, 3, 5].every(n => ok(P([...Array(n).fill(0), 1])))) return false;
      for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) for (let c = -2; c <= 2; c++) { const p = P([c, b, a]); if (ok(p) && !(p.length === 1 && (qstr(p[0]) === '0' || qstr(p[0]) === '1')) && !(p.length === 2 && qstr(p[1]) === '1' && qstr(p[0]) === '0') && !(p.length === 3 && qstr(p[2]) === '1' && qstr(p[1]) === '0' && qstr(p[0]) === '0')) return false; }
      return true; }
  },
  lessons: {
    'poly-l1 examples': () => { const p = pow(P([2, -1, 1]), 3); return qstr(sumCoeffParity(p, false)) === '36' && qstr(sumCoeffParity(p, true)) === '-28' && sub(mul(P([2, 1]), P([3, 1])), P([6, 5, 1])).every(z => z[0] === 0n); },
    'poly-l2 examples': () => { const [q, r] = divmod(P([-5, 4, -3, 2]), P([1, 0, 1])), [q2, r2] = divmod(P([-2, 5, 0, -3, 1]), P([-2, 1]));
      return q.map(qstr).join() === '-3,2' && r.map(qstr).join() === '-2,2' && q2.map(qstr).join() === '1,-2,-1,1' && qstr(r2[0]) === '0' && divmod(P([0, 0, 0, 0, 0, 1]), P([1, 0, 1]))[1].map(qstr).join() === '0,1'; },
    'poly-l3 examples': () => { const r = divmod(P([...Array(10).fill(0), 1]), fromRoots([1, 2]))[1]; return r.map(qstr).join() === '-1022,1023' && sub(P([2, -3, 0, 1]), mul(pow(P([-1, 1]), 2), P([2, 1]))).every(z => z[0] === 0n); },
    'poly-l4 examples': () => { const a = [6, 1, -4, 1], b = [1, -3, -1, 3]; return [2, 3, -1].every(x => isRoot(a, x)) && [1, -1, 1 / 3].every(x => isRoot(b, x)) && (7 - 3) % (5 - 2) !== 0; },
    'poly-l5 examples': () => { const p = fromRoots([1, -2, 3]); return p.map(qstr).join() === '6,-5,-2,1' && 1 + 4 + 9 === 14 && 4 + 10 === 14; },
    'poly-l6 examples': () => { const p = add(P([0, 1]), fromRoots([1, 2, 3])); const rev = [1, -2, -5, 6]; // разворот коэффициентов x³ − 2x² − 5x + 6
      const r1 = roots([6, -5, -2, 1]).map(z => 1 / z[0]).sort((a, b) => a - b), r2 = roots(rev).map(z => z[0]).sort((a, b) => a - b);
      const phi = (1 + Math.sqrt(5)) / 2; return v(p, 4) === '10' && r1.every((x, i) => near(x, r2[i], 1e-9)) && near(phi ** 3, 2 * phi + 1) && near(phi ** 4, 3 * phi + 2); }
  }
};

// Проверки глубокого уровня темы «Сравнения по модулю».
const { B, powmod, gcd, isPrime, fact } = require('./_lib');

const sols = (m, f) => { let c = 0; for (let x = 0; x < m; x++) if (f(x)) c++; return c; };
const reps = n => { const r = []; for (let a = 1; a * a <= n; a++) for (let b = a; a * a + b * b <= n; b++) if (a * a + b * b === n) r.push([a, b]); return r; };
const isSumTwoSq = n => { for (let a = 0; a * a <= n; a++) { const b = Math.round(Math.sqrt(n - a * a)); if (b * b === n - a * a) return true; } return false; };

module.exports = {
  expected: {
    'cong-41': sols(1000, x => (x * x) % 1000 === 1),
    'cong-42': sols(105, x => (x ** 3 - x) % 105 === 0),
    'cong-43': (() => { let c = 0; for (let x = 1; x <= 100; x++) if (powmod(x, 4, 101) === 1n) c++; return c; })(),
    'cong-44': (() => { let c = 0; for (let n = 1; n <= 100; n++) if (isSumTwoSq(n)) c++; return c; })(),
    'cong-47': (() => { let best = null; for (let n = 100000; n <= 999999; n++) if (B(n) * B(n) % 1000000n === B(n)) best = n; return best; })(),
    'cong-49': reps(5525).length,
    'cong-51': (() => { let c = 0; for (let x = 0; x < 101; x++) for (let y = 0; y < 101; y++) if ((x * x + y * y) % 101 === 1) c++; return c; })()
  },
  claims: {
    // конструкция: для небольших длин находим n по китайской теореме и проверяем делимость на квадраты
    'cong-45': () => {
      const primes = []; for (let p = 2; primes.length < 8; p++) if (isPrime(p)) primes.push(p);
      for (let L = 1; L <= 6; L++) {
        const ms = primes.slice(0, L).map(p => B(p * p));
        let n = 0n, M = 1n;
        for (let i = 0; i < L; i++) { // n ≡ −(i+1) (mod p_i²), подбираем шагом M
          const m = ms[i], want = ((-(B(i + 1))) % m + m) % m;
          while (n % m !== want) n += M;
          M *= m;
        }
        if (n <= 0n) n += M;
        for (let i = 1; i <= L; i++) { const v = n + B(i); let ok = false; for (let d = 2n; d * d <= v && d < 100n; d++) if (v % (d * d) === 0n) { ok = true; break; } if (!ok) return false; }
      }
      return true;
    },
    // числитель Σ 1/k² делится на p при p > 3 и не делится при p = 3
    'cong-46': () => {
      const num = p => { const P = B(p); let N = 0n, D = 1n; for (let k = 1n; k < P; k++) { N = N * k * k + D; D = D * k * k; } const g = (() => { let a = N, b = D; while (b) [a, b] = [b, a % b]; return a; })(); return N / g; };
      for (let p = 5; p < 60; p++) if (isPrime(p) && num(p) % B(p) !== 0n) return false;
      return num(3) % 3n !== 0n;
    },
    // простые 4k + 1: каждый простой делитель (2∏p)² + 1 имеет вид 4k + 1 — проверка на произведениях первых таких простых
    'cong-48': () => {
      const ps = []; for (let p = 2; ps.length < 6; p++) if (isPrime(p) && p % 4 === 1) ps.push(p);
      for (let s = 1; s <= 4; s++) {
        let x = 2n; ps.slice(0, s).forEach(p => { x *= B(p); });
        let N = x * x + 1n;
        for (let q = 2n; q * q <= N; q++) while (N % q === 0n) { if (q % 4n !== 1n) return false; N /= q; }
        if (N > 1n && N % 4n !== 1n) return false;
      }
      for (let n = 1; n < 3000; n++) { let N = n * n + 1; for (let q = 3; q * q <= N; q++) while (N % q === 0) { if (q % 4 === 3) return false; N /= q; } if (N > 2 && N % 4 === 3) return false; }
      return true;
    },
    // 4mn − m − n не бывает квадратом
    'cong-50': () => {
      for (let m = 1; m <= 300; m++) for (let n = 1; n <= 300; n++) { const v = 4 * m * n - m - n, r = Math.round(Math.sqrt(v)); if (r * r === v) return false; }
      return true;
    },
    // суммы степеней по модулю p
    'cong-52': () => {
      for (let p = 2; p < 60; p++) {
        if (!isPrime(p)) continue;
        for (let k = 1; k <= 3 * p; k++) {
          let s = 0n; for (let j = 1; j < p; j++) s += powmod(j, k, p);
          const want = k % (p - 1) === 0 ? B(p - 1) : 0n;
          if (s % B(p) !== want) return false;
        }
      }
      return true;
    },
    // IMO 1989: строим n чисел, у каждого два различных простых делителя
    'cong-53': () => {
      const primes = []; for (let p = 2; primes.length < 12; p++) if (isPrime(p)) primes.push(p);
      const isPrimePower = v => { let q = 2n; while (q * q <= v) { if (v % q === 0n) { while (v % q === 0n) v /= q; return v === 1n; } q++; } return true; };
      for (let L = 1; L <= 5; L++) {
        let n = 0n, M = 1n;
        for (let i = 0; i < L; i++) { const m = B(primes[2 * i] * primes[2 * i + 1]), want = ((-(B(i + 1))) % m + m) % m; while (n % m !== want) n += M; M *= m; }
        if (n <= 0n) n += M;
        for (let i = 1; i <= L; i++) if (isPrimePower(n + B(i))) return false;
      }
      return true;
    },
    // единственность представления простого числа суммой двух квадратов
    'cong-54': () => {
      for (let p = 2; p < 20000; p++) if (isPrime(p) && reps(p).length > 1) return false;
      return reps(13).length === 1 && reps(65).length === 2;
    },
    // (p − 1)! + 1 — степень p только при p = 2, 3, 5
    'cong-55': () => {
      const good = [];
      for (let p = 2; p < 120; p++) {
        if (!isPrime(p)) continue;
        let v = fact(p - 1) + 1n; const P = B(p);
        while (v % P === 0n) v /= P;
        if (v === 1n) good.push(p);
      }
      return good.join() === '2,3,5';
    }
  },
  lessons: {
    'cong-l7 examples': () => {
      const r = []; for (let x = 0; x < 65; x++) if ((x * x + 1) % 65 === 0) r.push(x);
      const ok8 = sols(8, x => x * x % 8 === 1) === 4 && sols(4, x => x * x % 4 === 1) === 2 && sols(2, x => x * x % 2 === 1) === 1;
      for (const m of [9, 25, 27, 49, 121, 125, 243]) if (sols(m, x => x * x % m === 1) !== 2) return false;
      return r.join() === '8,18,47,57' && ok8;
    },
    'cong-l8 examples': () => {
      for (let p = 3; p < 200; p++) { if (!isPrime(p)) continue; let s = 0; for (let k = 1; k < p; k++) s += Number(powmod(k, p - 2, p)); if (s % p !== 0) return false; }
      const qr11 = [...new Set([...Array(10).keys()].map(x => ((x + 1) ** 2) % 11))].sort((a, b) => a - b).join();
      const cube7 = []; for (let x = 1; x < 7; x++) if (x ** 3 % 7 === 1) cube7.push(x);
      // (x−1)(x−2)(x−3)(x−4) ≡ x⁴ − 1 (mod 5): сравниваем коэффициенты
      let poly = [1]; for (const r of [1, 2, 3, 4]) { const np = Array(poly.length + 1).fill(0); poly.forEach((c, i) => { np[i] += c; np[i + 1] -= r * c; }); poly = np; }
      const mod5 = poly.map(c => ((c % 5) + 5) % 5).join();
      // теорема Лагранжа на случайных многочленах по простым модулям
      let seed = 7; const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
      for (let t = 0; t < 300; t++) {
        const p = [5, 7, 11, 13, 17][t % 5], d = 1 + (t % 4), c = Array.from({ length: d + 1 }, () => Math.floor(rnd() * p));
        if (c[0] % p === 0) c[0] = 1;
        const roots = sols(p, x => c.reduce((s, ci) => (s * x + ci) % p, 0) === 0);
        if (roots > d) return false;
      }
      return qr11 === '1,3,4,5,9' && cube7.join() === '1,2,4' && poly.join() === '1,-10,35,-50,24' && mod5 === '1,0,0,0,4';
    },
    'cong-l9 examples': () => {
      // простые p ≡ 1 (mod 4) — суммы двух квадратов, p ≡ 3 — нет; ((p−1)/2)!² ≡ −1 при p ≡ 1 (mod 4)
      for (let p = 3; p < 3000; p++) {
        if (!isPrime(p)) continue;
        if ((reps(p).length > 0) !== (p % 4 === 1)) return false;
        if (p % 4 === 1 && p < 400) { const h = fact((p - 1) / 2) % B(p); if (h * h % B(p) !== B(p - 1)) return false; }
      }
      // критерий и формула 4(d₁ − d₃) для числа представлений в целых числах
      for (let n = 1; n <= 600; n++) {
        let r2 = 0; for (let a = -25; a <= 25; a++) for (let b = -25; b <= 25; b++) if (a * a + b * b === n) r2++;
        let d1 = 0, d3 = 0; for (let d = 1; d <= n; d++) if (n % d === 0) { if (d % 4 === 1) d1++; if (d % 4 === 3) d3++; }
        if (r2 !== 4 * (d1 - d3)) return false;
        let m = n, crit = true; for (let q = 3; q <= m; q++) { let e = 0; while (m % q === 0) { m /= q; e++; } if (q % 4 === 3 && e % 2) crit = false; }
        if (crit !== isSumTwoSq(n)) return false;
      }
      // пример Туэ для p = 13 и тождество для 65
      return (5 * 5) % 13 === 12 && (5 * 2 - (-3)) % 13 === 0 && 9 + 4 === 13 && 1 + 64 === 65 && 16 + 49 === 65 && gcd(5, 13) === 1;
    }
  }
};

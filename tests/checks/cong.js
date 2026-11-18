// Проверки темы «Сравнения по модулю». Степени — точной арифметикой BigInt, количества — перебором остатков.
const { B, powmod, gcd, isPrime, fact } = require('./_lib');

const phi = n => { let c = 0; for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) c++; return c; };
const sols = (m, f) => { let c = 0; for (let x = 0; x < m; x++) if (f(x)) c++; return c; };
const firstNat = (f, lim = 1e6) => { for (let x = 1; x <= lim; x++) if (f(x)) return x; throw new Error('not found'); };
const factMod = (n, m) => { let r = 1n; for (let k = 2n; k <= B(n); k++) r = r * k % B(m); return Number(r); };

module.exports = {
  expected: {
    'cong-01': firstNat(x => (3 * x) % 7 === 1),
    'cong-02': phi(12),
    'cong-03': (() => { if (!isPrime(2027)) throw new Error('2027'); return Number(powmod(2, 2026, 2027)); })(),
    'cong-05': firstNat(x => x % 3 === 2 && x % 5 === 3),
    'cong-06': phi(100),
    'cong-07': factMod(10, 11),
    'cong-08': Number(powmod(3, 40, 100)),
    'cong-09': firstNat(x => (7 * x) % 11 === 3),
    'cong-10': sols(15, x => (6 * x) % 15 === 9),
    'cong-11': Number(powmod(2026, 2026, 7)),
    'cong-12': (() => { if (!isPrime(1013)) throw new Error('1013'); return phi(2026); })(),
    'cong-13': (() => { let s = 0n; for (let k = 1n; k <= 100n; k++) s += k ** 6n; return Number(s % 7n); })(),
    'cong-14': (() => { const r = new Set(); for (let n = 1; n <= 2000; n++) if (n % 4 === 1 && n % 5 === 3) r.add(n % 20); if (r.size !== 1) throw new Error('cong-14'); return [...r][0]; })(),
    'cong-16': Number((B(2) ** 100n + B(3) ** 100n + B(4) ** 100n) % 5n),
    'cong-17': firstNat(x => (5 * x) % 17 === 1),
    'cong-18': firstNat(x => (2026 * x - 1) % 11 === 0),
    'cong-19': Number(powmod(13, 2026, 100)),
    'cong-20': factMod(14, 17),
    'cong-21': Number(powmod(7, B(7) ** 7n, 10)),
    'cong-22': firstNat(x => x % 3 === 2 && x % 5 === 3 && x % 7 === 2),
    'cong-23': (() => { let c = 0; for (let x = 1; x <= 1000; x++) if (x % 4 === 3 && x % 6 === 5) c++; return c; })(),
    'cong-24': sols(24, x => (x * x) % 24 === 1),
    'cong-25': (() => { let c = 0; for (let x = 1; x <= 210; x++) if ((x * x - x) % 210 === 0) c++; return c; })(),
    'cong-26': Number((B(2) ** 2026n) % 100n),
    'cong-28': (() => { const f = fact(50); return Number(f * f % 101n); })(),
    'cong-29': firstNat(x => [2, 3, 4, 5, 6].every(d => x % d === d - 1) && x % 7 === 0),
    'cong-31': Number(powmod(3, B(3) ** 27n, 100)),
    'cong-33': Number(powmod(2, 1000, 1001)),
    'cong-35': firstNat(n => n % 9 === 0 && (n + 1) % 25 === 0 && (n + 2) % 4 === 0),
    // башня считается напрямую: 2026^(2026^2026) по модулю 1000 через деление показателя невозможно (НОД ≠ 1),
    // поэтому берём показатель по модулю 100·k с запасом: 2026^E mod 1000 при E ≥ 3 зависит от E mod 100
    'cong-39': (() => {
      const E = B(2026) ** 2026n; // сам показатель — большое, но точное число
      const e100 = E % 100n;
      // проверяем период: 2026^(e+100) ≡ 2026^e (mod 1000) при e ≥ 3
      for (let e = 3n; e < 60n; e++) if (powmod(2026, e, 1000) !== powmod(2026, e + 100n, 1000)) throw new Error('period');
      return Number(powmod(2026, e100 + 100n, 1000));
    })()
  },
  choice: {
    'cong-04': () => { const ok = [1, 2, 3, 4].map(a => sols(9, x => (6 * x) % 9 === a) > 0); if (ok.filter(Boolean).length !== 1) throw new Error('cong-04'); return ok.indexOf(true); },
    'cong-15': () => {
      const fs = [n => n ** 7n - n, n => n ** 6n - n, n => n ** 7n + n, n => n ** 6n + 1n];
      const ok = fs.map(f => { for (let n = -30n; n <= 30n; n++) if (f(n) % 7n !== 0n) return false; return true; });
      if (ok.filter(Boolean).length !== 1) throw new Error('cong-15'); return ok.indexOf(true);
    },
    // по какому модулю у x³ + y³ = 2026 нет решений: проверяем все пары остатков
    'cong-27': () => {
      const bad = m => { for (let x = 0; x < m; x++) for (let y = 0; y < m; y++) if ((x ** 3 + y ** 3 - 2026) % m === 0) return false; return true; };
      const ok = [4, 9, 7, 5].map(bad);
      if (ok.filter(Boolean).length !== 1) throw new Error('cong-27'); return ok.indexOf(true);
    }
  },
  claims: {
    // 1²·3²·…·(p−2)² ≡ (−1)^((p+1)/2) (mod p)
    'cong-30': () => {
      for (let p = 3; p < 400; p++) {
        if (!isPrime(p)) continue;
        let A = 1n; for (let k = 1n; k <= B(p - 2); k += 2n) A = A * k % B(p);
        const want = ((p + 1) / 2) % 2 === 0 ? 1n : B(p - 1);
        if (A * A % B(p) !== want) return false;
      }
      return true;
    },
    'cong-32': () => (2n ** 70n + 3n ** 70n) % 13n === 0n,
    // p = 4k + 3 делит a² + b² ⇒ p | a и p | b: перебор всех пар остатков
    'cong-34': () => {
      for (let p = 3; p < 200; p++) {
        if (!isPrime(p) || p % 4 !== 3) continue;
        for (let a = 0; a < p; a++) for (let b = 0; b < p; b++) if ((a * a + b * b) % p === 0 && (a || b)) return false;
      }
      // и контрпример для p = 4k + 1, чтобы условие было существенным
      return (2 * 2 + 1 * 1) % 5 === 0;
    },
    'cong-36': () => { for (let n = -300n; n <= 300n; n++) if ((n ** 13n - n) % 2730n !== 0n) return false; return 2730 === 2 * 3 * 5 * 7 * 13; },
    'cong-37': () => {
      for (let a = 0; a < 210; a++) for (let b = 0; b < 210; b++) { const s = a * a + b * b; if (s % 21 === 0 && s % 441 !== 0) return false; }
      return true;
    },
    // для n, взаимно простых с 10, находится число из единиц, делящееся на n (и k = φ(9n) годится)
    'cong-38': () => {
      for (let n = 1; n < 400; n++) {
        if (gcd(n, 10) !== 1) continue;
        const k = phi(9 * n);
        let r = 0; for (let i = 0; i < k; i++) r = (r * 10 + 1) % n;
        if (r !== 0) return false;
      }
      return true;
    },
    'cong-40': () => {
      for (let p = 3; p < 120; p++) {
        if (!isPrime(p)) continue;
        let s = 0n; const P = B(p);
        for (let k = 1n; k < P; k++) s += k ** P;
        if (s % (P * P) !== 0n) return false;
      }
      return true;
    }
  },
  lessons: {
    'cong-l1 examples': () => sols(9, x => (4 * x) % 9 === 7) === 1 && (4 * 4) % 9 === 7 && (3 * 7) % 10 === 1
      && sols(10, x => (4 * x) % 10 === 6) === 2 && (4 * 4) % 10 === 6 && (4 * 9) % 10 === 6,
    'cong-l2 examples': () => {
      const r = [1, 2, 3, 4, 5, 6].map(k => (3 * k) % 7).join();
      for (let n = -100n; n <= 100n; n++) if ((n ** 5n - n) % 30n !== 0n) return false;
      return r === '3,6,2,5,1,4' && Number(powmod(3, 1000, 13)) === 3;
    },
    'cong-l3 examples': () => phi(10) === 4 && phi(36) === 12 && Number(powmod(11, 123, 100)) === 31 && Number(powmod(3, 27, 10)) === 7,
    'cong-l4 examples': () => {
      const a = []; for (let x = 0; x < 12; x++) if (x % 3 === 2 && x % 4 === 3) a.push(x);
      const b = []; for (let x = 0; x < 12; x++) if (x % 6 === 1 && x % 4 === 3) b.push(x);
      const c = sols(12, x => x % 6 === 1 && x % 4 === 2);
      return a.join() === '11' && b.join() === '7' && c === 0 && Number(powmod(2, 30, 24)) === 16;
    },
    'cong-l5 examples': () => {
      for (let p = 2; p < 300; p++) {
        const w = (factMod(p - 1, p) + 1) % p === 0;
        if (w !== isPrime(p)) return false;
        if (isPrime(p) && p > 2 && factMod(p - 2, p) !== 1) return false;
      }
      return 720 + 1 === 7 * 103 && (12 * 11 * 10 + 6) % 13 === 0;
    },
    'cong-l6 examples': () => {
      const cubes = m => new Set([...Array(m).keys()].map(x => x ** 3 % m));
      const fourth16 = new Set([...Array(16).keys()].map(x => x ** 4 % 16));
      const sum3 = new Set(); const c9 = [...cubes(9)];
      c9.forEach(a => c9.forEach(b => c9.forEach(c => sum3.add((a + b + c) % 9))));
      // −1 не квадрат по модулю простых 4k + 3
      for (let p = 3; p < 300; p++) if (isPrime(p) && p % 4 === 3 && sols(p, x => (x * x + 1) % p === 0) > 0) return false;
      return [...cubes(7)].sort((a, b) => a - b).join() === '0,1,6' && [...cubes(9)].sort((a, b) => a - b).join() === '0,1,8'
        && [...fourth16].sort((a, b) => a - b).join() === '0,1' && !sum3.has(4) && !sum3.has(5) && 2030 % 9 === 5 && 2026 % 16 === 10;
    }
  }
};

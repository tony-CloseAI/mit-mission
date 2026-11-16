// Проверка содержания всех тем.
// Загружает файлы content/ в том же порядке, что и build.py, и прогоняет проверки из tests/checks/*.js:
//   expected — правильные ответы, посчитанные независимо (перебором, BigInt, численно);
//   choice   — для тестов с вариантами: строка/список правильных значений или функция, возвращающая индекс;
//   claims   — утверждения задач на доказательство, проверенные перебором или подстановкой;
//   lessons  — примеры из уроков.
// Запуск: node app/tests/verify-content.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const MM = { topics: [], diag: null, roadmap: [],
  addTopic(t) { this.topics.push(t); }, setDiagnostic(d) { this.diag = d; }, setRoadmap(r) { this.roadmap = r; } };

const build = fs.readFileSync(path.join(root, 'build.py'), 'utf8');
const files = JSON.parse(build.match(/CONTENT_FILES\s*=\s*(\[[^\]]*\])/)[1].replace(/'/g, '"'));
for (const f of files) vm.runInNewContext(fs.readFileSync(path.join(root, 'content', f), 'utf8'), { MM }, { filename: f });

const checksDir = path.join(__dirname, 'checks');
const K = { expected: {}, choice: {}, claims: {}, lessons: {} };
for (const f of fs.readdirSync(checksDir).filter(f => f.endsWith('.js') && !f.startsWith('_'))) {
  const m = require(path.join(checksDir, f));
  for (const k of Object.keys(K)) Object.assign(K[k], m[k] || {});
}

let fail = 0, ok = 0;
const bad = (...a) => { console.log(...a); fail++; };
const all = [...MM.diag.problems, ...MM.topics.flatMap(t => t.problems)];
const ids = new Set();
for (const p of all) {
  if (ids.has(p.id)) bad('DUPLICATE ID', p.id);
  ids.add(p.id);
  if (!p.q || typeof p.r !== 'number') { bad('MISSING FIELDS', p.id); continue; }
  try {
    if (p.type === 'num') {
      if (!(p.id in K.expected)) { bad('NO CHECK', p.id); continue; }
      const want = String(K.expected[p.id]);
      if (!p.a.includes(want)) bad('WRONG', p.id, 'content:', p.a, 'computed:', want); else ok++;
    } else if (p.type === 'choice') {
      const c = K.choice[p.id];
      if (c === undefined) { bad('NO CHECK', p.id); continue; }
      let idx;
      if (typeof c === 'function') idx = c(p);
      else {
        const wants = Array.isArray(c) ? c : [c];
        if (wants.length !== 1) { bad('AMBIGUOUS', p.id, wants); continue; }
        idx = p.opts.indexOf(wants[0]);
      }
      if (idx !== p.a) bad('WRONG', p.id, 'content option:', p.a, 'computed:', idx); else ok++;
      if (new Set(p.opts).size !== p.opts.length) bad('DUP OPTIONS', p.id);
    } else if (p.type === 'proof') {
      const f = K.claims[p.id];
      if (!f) { bad('NO CLAIM CHECK', p.id); continue; }
      if (!f()) bad('CLAIM FALSE', p.id); else ok++;
      const pts = (p.rubric || []).reduce((s, r) => s + r[0], 0);
      if (pts !== 7) bad('RUBRIC != 7', p.id, pts);
    } else bad('UNKNOWN TYPE', p.id, p.type);
  } catch (e) { bad('CHECK ERROR', p.id, e.message); }
  if (!p.diag && !MM.diag.problems.includes(p) && (!p.hints || !p.hints.length || !p.sol)) bad('NO HINTS/SOL', p.id);
}
for (const [k, f] of Object.entries(K.lessons)) {
  try { if (!f()) bad('LESSON CHECK FAILED', k); else ok++; } catch (e) { bad('LESSON CHECK ERROR', k, e.message); }
}

// рейтинги растут с уровнем; у каждой темы есть уроки и задачи всех заявленных уровней
for (const t of MM.topics) {
  if (!t.lessons.length) bad('NO LESSONS', t.id);
  for (let L = 1; L < 5; L++) {
    const a = t.problems.filter(p => p.lvl === L).map(p => p.r), b = t.problems.filter(p => p.lvl === L + 1).map(p => p.r);
    if (a.length && b.length && Math.max(...a) > Math.min(...b)) bad('RATING ORDER', t.id, 'level', L);
  }
  const roadmapIds = MM.roadmap.flatMap(s => s.items.map(i => i.id));
  if (!roadmapIds.includes(t.id)) bad('TOPIC NOT ON MAP', t.id);
}
console.log(`\ntopics: ${MM.topics.map(t => t.id + ' (' + t.problems.length + ')').join(', ')}`);
console.log(`checked ${ok} items, ${fail} problem(s)`);
process.exit(fail ? 1 : 0);

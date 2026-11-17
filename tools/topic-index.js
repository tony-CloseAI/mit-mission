// Оглавление тем для сайта (F3: темы подгружаются по мере надобности).
// Выполняет файлы content/ в заданном порядке и печатает JSON: по одной записи на тему.
// В записи всё, кроме тяжёлых частей (текст урока, подсказки, решение, критерии),
// и список файлов, из которых тема собрана. Эти файлы build.py склеивает в docs/t/<тема>.<хеш>.js.
// Запуск: node app/tools/topic-index.js roadmap.js _fig.js … (имена файлов из app/content)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const HEAVY_LESSON = ['html'];
const HEAVY_PROBLEM = ['hints', 'sol', 'rubric'];
// так же, как build.py: знак «делит» ставим прямо
const fixDiv = s => s.replace(/∣/g, '<span class="dv">∣</span>');

const dir = path.join(__dirname, '..', 'content');
const files = process.argv.slice(2);
let current = null;
const topics = [];
const MM = {
  topics,
  addTopic(t) { t.files = [current]; topics.push(t); },
  addDeep(id, d) {
    const t = topics.find(x => x.id === id);
    if (!t) throw new Error('addDeep: нет темы ' + id + ' (' + current + ')');
    if (!t.files.includes(current)) t.files.push(current);
    (d.lessons || []).forEach(l => { l.deep = true; t.lessons.push(l); });
    (d.problems || []).forEach(p => { p.deep = true; t.problems.push(p); });
  },
  setDiagnostic() {}, setRoadmap() {}
};
const ctx = vm.createContext({ MM, Math });
for (const f of files) { current = f; vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }); }

const strip = (o, heavy) => {
  const r = {};
  for (const [k, v] of Object.entries(o)) if (!heavy.includes(k)) r[k] = typeof v === 'string' ? fixDiv(v) : v;
  return r;
};
const out = topics.map(t => {
  const s = strip(t, ['lessons', 'problems']);
  s.lessons = t.lessons.map(l => strip(l, HEAVY_LESSON));
  s.problems = t.problems.map(p => {
    const q = strip(p, HEAVY_PROBLEM);
    if (Array.isArray(q.opts)) q.opts = q.opts.map(x => typeof x === 'string' ? fixDiv(x) : x);
    return q;
  });
  return s;
});
process.stdout.write(JSON.stringify(out));

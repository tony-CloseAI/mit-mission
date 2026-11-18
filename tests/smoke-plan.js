// План на день и маршрут: проходим день как ученик — «Начать», пункт за пунктом, «Дальше по плану».
// Запуск: node app/tests/smoke-plan.js app/docs/index.html   (нужен пакет jsdom)
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom');
const util = require('util');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const errors = [], checks = [];
const expect = (n, c) => checks.push([n, !!c]);
const sleep = ms => new Promise(r => setTimeout(r, ms));
class LocalFiles extends ResourceLoader {
  constructor(htmlFile) { super(); this.dir = path.dirname(path.resolve(htmlFile)); }
  fetch(url, options) {
    const base = 'https://app.test/';
    if (url.startsWith(base)) { const pr = fs.promises.readFile(path.join(this.dir, decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]))); pr.abort = () => {}; return pr; }
    return super.fetch(url, options);
  }
}
function open(hash, storage) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message)) errors.push(e.message); });
  const isDoc = /^\s*<!doctype/i.test(html);
  const dom = new JSDOM(isDoc ? html : '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', {
    url: 'https://app.test/' + hash, runScripts: 'dangerously', resources: new LocalFiles(file), pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.TextEncoder = util.TextEncoder; w.TextDecoder = util.TextDecoder; w.scrollTo = () => {};
      if (storage) w.localStorage.setItem('mit-mission-v1', storage);
      w.addEventListener('error', ev => errors.push(ev.message));
    }
  });
  return dom.window;
}

(async () => {
  let w = open('#start-1250');
  await sleep(80);
  let d = w.document;
  const $ = s => d.querySelector(s);
  const S = () => JSON.parse(w.localStorage.getItem('mit-mission-v1'));
  const text = () => d.getElementById('root').textContent;
  const waitLoad = async () => { for (let i = 0; i < 300 && d.querySelector('[data-loading]'); i++) await sleep(10); };
  const nav = async h => { w.location.hash = h; await sleep(30); await waitLoad(); };
  const click = sel => { const el = typeof sel === 'string' ? $(sel) : sel; if (!el) throw new Error('missing ' + sel); el.click(); };
  const submit = (form, id, v) => { d.getElementById(id).value = v; $(form).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); };
  const findP = id => w.MM.topics.flatMap(t => t.problems).find(p => p.id === id);

  // 1. первый вход: план наверху, подсказка «Как заниматься», маршрут
  const planEl = $('[data-plan="day"]'), hero = $('.hero');
  expect('today starts with the daily plan', !!planEl && !!hero && (planEl.compareDocumentPosition(hero) & w.Node.DOCUMENT_POSITION_FOLLOWING));
  const st0 = S().plan;
  expect('plan for today has daily problem, lessons and practice of the first route topic', st0 && st0.items.some(x => x.k === 'daily') && st0.items.some(x => x.k === 'lesson' && x.t === 'div') && st0.items.length >= 3);
  const total = st0.items.reduce((s, x) => s + x.min, 0);
  expect('plan fits the 10 h/week budget (75 min on a normal day, 3 h 45 on the long day)', st0.kind === 'long' ? total <= 225 : st0.kind === 'normal' ? total <= 75 : true);
  expect('start button opens the first item', $('[data-plan="day"] .actions a.btn').getAttribute('href') === $('.plan .pi').getAttribute('href'));
  expect('howto shown on first visit', !!$('.howto'));
  click('[data-act="howto-ok"]'); await sleep(20);
  expect('howto dismissed and remembered', !$('.howto') && S().howto === true);
  expect('route panel marks the first topic as current', [...d.querySelectorAll('.route .ri.cur')].length === 1 && $('.route .ri.cur').textContent.includes('Делимость'));
  const dTopic = findP(st0.items.find(x => x.k === 'daily').id).topic;
  expect('daily problem comes from a reached topic', dTopic === 'div');

  // 2. проходим план по кнопкам
  let steps = 0, okFlow = true, sawLesson = false, sawProblem = false, sawZachet = false;
  while (steps < 14) {
    await nav('#today');
    const btn = $('[data-plan="day"] .actions a.btn');
    if (!btn) break;
    const href = btn.getAttribute('href');
    await nav(href);
    if (href.startsWith('#l-')) {
      sawLesson = true;
      const rb = $('[data-act="read"][data-plan]');
      if (!rb || !rb.textContent.includes('дальше по плану')) okFlow = false;
      click(rb); await sleep(30); await waitLoad();
    } else if (href.startsWith('#p-')) {
      sawProblem = true;
      const p = findP(href.slice(3));
      if (p.type === 'choice') click(d.querySelectorAll('[data-act="opt"]')[p.a]);
      else if (p.type === 'num') submit('[data-form="ans"]', 'ans', p.a[0]);
      else { click('[data-act="proof-check"]'); await sleep(10); d.querySelectorAll('[data-rub]').forEach(cb => { cb.checked = true; cb.dispatchEvent(new w.Event('change', { bubbles: true })); }); click('[data-act="proof-grade"]'); }
      await sleep(20);
      if (!$('.planbar')) okFlow = false;
    } else if (href.startsWith('#z-')) {
      sawZachet = true;
      click('[data-act="zstart"]');
      for (const id of S().zrun.ids) { const p = findP(id); if (p.type === 'choice') click(d.querySelectorAll('[data-act="zopt"]')[p.a]); else submit('[data-form="zans"]', 'zans', p.a[0]); }
      await sleep(20);
      if (!$('.planbar') || !text().includes('Зачёт сдан')) okFlow = false;
    } else if (href === '#mix') {
      click('[data-act="mstart"]');
      for (const id of S().mrun.ids) { const p = findP(id); if (p.type === 'choice') click(d.querySelectorAll('[data-act="mopt"]')[p.a]); else submit('[data-form="mans"]', 'mans', p.a[0]); await sleep(10); click('[data-act="mnext"]'); }
      if (!$('.planbar')) okFlow = false;
    } else { okFlow = false; break; }
    // «Дальше по плану» ведёт туда же, куда главная кнопка плана
    const nextBar = $('.planbar a.btn');
    const expected = nextBar ? nextBar.getAttribute('href') : null;
    await nav('#today');
    const now = $('[data-plan="day"] .actions a.btn');
    if (expected && expected !== '#today' && (!now || now.getAttribute('href') !== expected)) okFlow = false;
    steps++;
  }
  expect('plan walked through with «Дальше по плану» after every step', okFlow && steps >= 3);
  expect('plan had a lesson, a problem and a credit test', sawLesson && sawProblem && sawZachet);
  expect('plan completed', text().includes('План выполнен') && S().plan.items.every(x => {
    const s = S(); if (x.k === 'lesson') return s.read[x.id]; if (x.k === 'daily' || x.k === 'weekly') return !!s.att[x.id];
    if (x.k === 'practice' || x.k === 'review') return x.ids.every(id => s.att[id]); return true; }));
  const before = S().plan.items.length;
  click('[data-act="plan-more"]'); await sleep(20);
  expect('«Ещё задачи» adds items', S().plan.items.length > before && !!$('[data-plan="day"] .actions a.btn'));
  expect('map marks the current topic', (await (async () => { await nav('#map'); return [...d.querySelectorAll('.mitem .pill.gold')].some(x => x.textContent === 'сейчас по плану'); })()));

  // 3. выходной сегодня: панель отдыха и «Всё равно позаниматься»
  const wdToday = new Date().getDay();
  let st = S(); st.restDay = wdToday; st.plan = null;
  w = open('#today', JSON.stringify(st)); await sleep(80); d = w.document;
  expect('rest day shows a rest panel', !!d.querySelector('[data-plan="rest"]') && !d.querySelector('[data-plan="day"]'));
  d.querySelector('[data-act="plan-force"]').click(); await sleep(20);
  expect('«Всё равно позаниматься» makes a normal plan', !!d.querySelector('[data-plan="day"]') && JSON.parse(w.localStorage.getItem('mit-mission-v1')).plan.kind === 'normal');

  // 4. длинный день (накануне выходного): задача недели в плане
  st = JSON.parse(w.localStorage.getItem('mit-mission-v1')); st.restDay = (wdToday + 1) % 7; st.plan = null;
  w = open('#today', JSON.stringify(st)); await sleep(80); d = w.document;
  const lp = JSON.parse(w.localStorage.getItem('mit-mission-v1')).plan;
  expect('long day plan includes the weekly proof and is longer', lp.kind === 'long' && lp.items.some(x => x.k === 'weekly') && d.querySelector('[data-plan="day"] .lab').textContent.includes('длинный день'));

  // 5. профиль: выбор выходного
  w.location.hash = '#me'; await sleep(30);
  d.querySelector('[data-act="restday"][data-d="6"]').click(); await sleep(20);
  expect('rest day can be changed in profile', JSON.parse(w.localStorage.getItem('mit-mission-v1')).restDay === 6 && d.querySelector('[data-act="restday"][aria-pressed="true"]').textContent === 'Сб');

  const failed = checks.filter(c => !c[1]);
  checks.forEach(c => console.log((c[1] ? 'PASS ' : 'FAIL ') + c[0]));
  console.log(`${checks.length - failed.length}/${checks.length} checks passed; runtime errors: ${errors.length}`);
  errors.slice(0, 5).forEach(e => console.log('  ' + e));
  process.exit(failed.length || errors.length ? 1 : 0);
})();

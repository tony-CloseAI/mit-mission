// Smoke test: drives the built app like a user and fails on any runtime error.
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole, ResourceLoader } = require('jsdom');
const util = require('util');
// Сайт подгружает темы отдельными файлами (docs/t/…). Отдаём их с диска, как будто из сети.
class LocalFiles extends ResourceLoader {
  constructor(htmlFile) { super(); this.dir = path.dirname(path.resolve(htmlFile)); }
  fetch(url, options) {
    const base = 'https://app.test/';
    if (url.startsWith(base)) {
      const rel = decodeURIComponent(url.slice(base.length).split(/[?#]/)[0]).replace(/^mit-mission\//, '');
      const pr = fs.promises.readFile(path.join(this.dir, rel));
      pr.abort = () => {};
      return pr;
    }
    return super.fetch(url, options);
  }
}

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Not implemented|t\/missing\.js/.test(e.message + (e.detail || ''))) errors.push('jsdomError: ' + e.message + (e.detail ? ' ' + e.detail : '')); });
vc.on('error', e => errors.push('console.error: ' + e));

const isDoc = /^\s*<!doctype/i.test(html);
const dom = new JSDOM(isDoc ? html : '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', {
  url: 'https://app.test/', runScripts: 'dangerously', resources: new LocalFiles(file), pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) {
    w.TextEncoder = util.TextEncoder; w.TextDecoder = util.TextDecoder;
    w.scrollTo = () => {};
    w.addEventListener('error', ev => errors.push('window error: ' + ev.message));
  }
});
const w = dom.window, d = w.document;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const $ = s => d.querySelector(s);
const text = () => d.getElementById('root').textContent;
const state = () => JSON.parse(w.localStorage.getItem('mit-mission-v1') || '{}');
// после перехода ждём, пока подгрузится файл темы (если он нужен)
async function nav(h) { w.location.hash = h; await sleep(30); for (let i = 0; i < 300 && d.querySelector('[data-loading]'); i++) await sleep(10); }
function click(sel) { const el = typeof sel === 'string' ? $(sel) : sel; if (!el) throw new Error('missing ' + sel); el.click(); }
function submit(formSel, inputId, value) { d.getElementById(inputId).value = value; $(formSel).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); }
const checks = [];
function expect(name, cond) { checks.push([name, !!cond]); }

(async () => {
  await sleep(50);
  expect('welcome screen', text().includes('Путь к золоту RFO'));
  expect('ladder rendered', d.querySelectorAll('.tick').length === 6);

  // diagnostic: answer everything correctly except the last two
  await nav('#diag');
  expect('diag intro', text().includes('Диагностика'));
  click('[data-act="diag-start"]');
  const D = w.MM.diag.problems;
  for (let i = 0; i < D.length; i++) {
    const p = D[i];
    if (i >= D.length - 2) { click('[data-act="diag-skip"]'); continue; }
    if (p.type === 'choice') click(d.querySelectorAll('[data-act="dopt"]')[p.a]);
    else submit('[data-form="dans"]', 'dans', p.a[0]);
  }
  let s = state();
  expect('diag finished, rating set', s.rating >= 1100 && s.rating <= 1700 && s.diag && s.diag.applied);
  expect('diag result view', text().includes('Результат диагностики'));
  const r0 = s.rating;

  await nav('#today');
  expect('today shows rating', $('.rating-big') && $('.rating-big').textContent.trim() === String(r0));
  expect('today has 4 cards', d.querySelectorAll('.grid4 .card').length === 4);
  expect('mixed training locked before two topics are started', !!d.querySelector('section.mixp') && !d.querySelector('section.mixp a') && d.querySelector('section.mixp').textContent.includes('Откроется'));
  expect('chart area present', !!$('[data-chart]'));

  await nav('#map');
  expect('map lists soon topics', d.querySelectorAll('.mitem.soon').length >= 15);

  // F3: on the site topics arrive as a table of contents; lesson texts and solutions load per topic
  const isSite = /^\s*<!doctype/i.test(html);
  if (isSite) {
    expect('site starts with table of contents only', w.MM.topics.every(t => t.loaded === false && t.src && t.lessons.every(l => !l.html) && t.problems.every(p => p.q && !p.sol)));
    const cnt = w.MM.byId('count'), src0 = cnt.src;
    cnt.src = 't/missing.js';
    await nav('#l-cnt-l1');
    expect('failed topic load shows retry screen', !!d.querySelector('[data-loadfail]') && !!d.querySelector('[data-act="reload-topic"]'));
    cnt.src = src0;
    click('[data-act="reload-topic"]');
    await sleep(30); for (let i = 0; i < 300 && d.querySelector('[data-loading]'); i++) await sleep(10);
    expect('retry loads the topic', cnt.loaded === true && d.querySelector('.lessonbody') && d.querySelector('.lessonbody').textContent.length > 300);
  } else expect('preview has everything inline', w.MM.topics.every(t => t.loaded === true && t.lessons.every(l => l.html)));

  await nav('#t-div');
  expect('topic levels', d.querySelectorAll('.lvl').length === 5);
  expect('topic 57 problem chips', d.querySelectorAll('.pchip').length === 57);
  expect('topic 9 lessons (6 + 3 deep)', d.querySelectorAll('.lesson').length === 9);
  expect('deep block heading', !!$('.deephead') && $('.deephead').textContent.includes('Глубокий уровень'));
  expect('deep lessons listed after heading', d.querySelectorAll('.deephead + .lessons .lesson').length === 3);
  expect('15 deep problem marks', d.querySelectorAll('.pchip .dp').length === 15);
  expect('fresh topic suggests first base lesson', $('.actions .btn').textContent.includes('Делимость и её свойства'));

  await nav('#l-div-l5');
  expect('lesson table wrapped', !!$('.tblwrap table'));
  click('[data-act="read"]'); await sleep(30);
  expect('read advances to next lesson', w.location.hash === '#l-div-l6' && state().read['div-l5']);
  click('[data-act="read"]'); await sleep(30);
  expect('last base lesson leads to problems, not to deep lessons', w.location.hash === '#t-div' && state().read['div-l6']);
  await nav('#l-div-l7');
  expect('deep lesson tagged', $('.pg-sub').textContent.includes('глубокий уровень'));
  expect('deep lesson renders fractions', d.querySelectorAll('.lessonbody .fr').length >= 5);
  click('[data-act="read"]'); await sleep(30);
  expect('deep lesson leads to next deep lesson', w.location.hash === '#l-div-l8');
  await nav('#l-div-l9');
  expect('last deep lesson button goes to problems', $('[data-act="read"]').textContent.includes('к задачам'));
  // все основные уроки прочитаны, глубокие l8 и l9 — нет: пока он не дошёл до глубоких задач, предлагается задача, а не глубокий урок
  for (const k of ['div-l1', 'div-l2', 'div-l3', 'div-l4']) { await nav('#l-' + k); click('[data-act="read"]'); await sleep(30); }
  await nav('#t-div');
  expect('deep lessons wait for deep problems', $('.actions .btn').textContent.startsWith('Задача'));

  // correct choice answer
  await nav('#p-div-01');
  expect('timer shown', !!$('#timer'));
  click(d.querySelectorAll('[data-act="opt"]')[1]);
  s = state();
  expect('correct answer raises rating', s.rating > r0 && s.att['div-01'].st === 'clean');
  expect('feedback Верно', $('.fb.ok') && $('.fb.ok').textContent.includes('Верно'));
  expect('solution shown after correct', !!$('.sol'));
  const r1 = s.rating;

  // wrong numeric answer, then give up
  await nav('#p-div-02');
  submit('[data-form="ans"]', 'ans', '5');
  s = state();
  expect('wrong answer lowers rating', s.rating < r1 && s.att['div-02'].st === 'bad' && s.rev['div-02']);
  expect('feedback Неверно', !!$('.fb.no'));
  submit('[data-form="ans"]', 'ans', '2');
  s = state();
  expect('retry correct is unrated but marks ok', s.att['div-02'].st === 'ok' && s.n === 2);

  // hint penalty
  await nav('#p-div-04');
  click('[data-act="hint"]');
  expect('hint shown', d.querySelectorAll('.hint').length === 1);
  const before = state().rating;
  submit('[data-form="ans"]', 'ans', ' 36 ');
  s = state();
  expect('answer with hint counts as ok with reduced score', s.att['div-04'].st === 'ok' && Math.abs(s.att['div-04'].s - 0.8) < 1e-9 && s.n === 3);
  console.log('  (easy problem with a hint at rating ' + before + ': ' + (s.rating - before) + ')');

  // give up before answering
  await nav('#p-div-05');
  click('[data-act="giveup"]');
  s = state();
  expect('give up records bad + review', s.att['div-05'].st === 'bad' && s.att['div-05'].seen && s.rev['div-05']);
  expect('give up shows solution', !!$('.sol'));

  // keyboard answer for choice
  await nav('#p-div-03');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: '4', bubbles: true }));
  expect('keyboard 4 picks option 4 (correct)', state().att['div-03'] && state().att['div-03'].st === 'clean');

  // proof flow
  await nav('#p-div-31');
  const ta = d.getElementById('draft');
  ta.value = 'n^3 - n = (n-1)n(n+1), x <= y'; ta.setSelectionRange(ta.value.length, ta.value.length);
  ta.dispatchEvent(new w.Event('input', { bubbles: true }));
  expect('math auto-replace', ta.value.includes('ⁿ') === false && ta.value.includes('≤') && ta.value.includes('³'));
  click('[data-act="mk"][data-k="√"]');
  expect('math key inserts', d.getElementById('draft').value.includes('√'));
  await sleep(700);
  expect('draft saved', (state().drafts['div-31'] || '').includes('√'));
  click('[data-act="proof-check"]');
  expect('rubric shown', d.querySelectorAll('[data-rub]').length === 4);
  [0, 1, 2].forEach(i => { const cb = d.querySelector('[data-rub="' + i + '"]'); cb.checked = true; cb.dispatchEvent(new w.Event('change', { bubbles: true })); });
  expect('rubric total 6', $('#gtotal').textContent.startsWith('6'));
  click('[data-act="proof-grade"]');
  s = state();
  expect('proof graded 6/7 -> ok', s.att['div-31'].pts === 6 && s.att['div-31'].st === 'ok');
  expect('proof feedback', $('.fb') && $('.fb').textContent.includes('6 из 7'));
  click('[data-act="teacher"]');
  expect('teacher flag', state().teacher['div-31'] === true);

  // proof "none"
  await nav('#p-div-32');
  click('[data-act="proof-none"]');
  expect('none preselected', d.querySelector('[data-none]').checked && $('#gtotal').textContent.startsWith('0'));
  click('[data-act="proof-grade"]');
  expect('proof 0 -> bad', state().att['div-32'].st === 'bad');

  // topic «Треугольники»: figures in lessons and statements (F2)
  await nav('#t-tri');
  expect('tri topic 55 problem chips, 15 deep', d.querySelectorAll('.pchip').length === 55 && d.querySelectorAll('.pchip .dp').length === 15);
  expect('tri 3 deep lessons', d.querySelectorAll('.deephead + .lessons .lesson').length === 3);
  await nav('#l-tri-l8');
  expect('trillium figure: two circles and subscript label', d.querySelectorAll('.lessonbody svg.fig circle.s').length === 2 && !!d.querySelector('.lessonbody svg.fig text tspan.fs'));
  await nav('#l-tri-l7');
  const nineFig = d.querySelectorAll('.lessonbody svg.fig')[1];
  expect('nine-point figure: 14 points, 8 labels', nineFig && nineFig.querySelectorAll('circle.p').length === 14 && nineFig.querySelectorAll('text.t').length === 8);
  await nav('#p-tri-45');
  submit('[data-form="ans"]', 'ans', '4,0625');
  expect('tri-45 decimal-comma answer accepted', state().att['tri-45'] && state().att['tri-45'].st === 'clean');
  await nav('#l-tri-l6');
  expect('lesson figure rendered', !!d.querySelector('.lessonbody svg.fig line') && d.querySelector('.lessonbody svg.fig').getAttribute('aria-label').includes('параллелограмм'));
  await nav('#p-tri-24');
  expect('statement figure with filled polygon and labels', !!d.querySelector('.stmt svg.fig polygon.fl') && [...d.querySelectorAll('.stmt svg.fig text')].some(t => t.textContent === 'A1'));
  submit('[data-form="ans"]', 'ans', '20');
  expect('tri-24 answer accepted', state().att['tri-24'] && state().att['tri-24'].st === 'clean');

  // topic «Квадратные уравнения»: graphs with axes (curve, axes, text), fraction and decimal-comma answers
  await nav('#t-alg-quad');
  expect('quad topic 55 problem chips, 15 deep', d.querySelectorAll('.pchip').length === 55 && d.querySelectorAll('.pchip .dp').length === 15);
  expect('quad 6 base + 3 deep lessons', d.querySelectorAll('.lessons .lesson').length === 9 && d.querySelectorAll('.deephead + .lessons .lesson').length === 3);
  await nav('#l-quad-l5');
  const parFig = d.querySelector('.lessonbody svg.fig');
  expect('parabola figure: curve, two axes with arrows, subscript labels', parFig && parFig.querySelectorAll('polyline.s').length === 1 && parFig.querySelectorAll('.ax').length === 4 && !!parFig.querySelector('text tspan.fs'));
  await nav('#l-quad-l9');
  expect('W-graph figure with free text label', [...d.querySelectorAll('.lessonbody svg.fig text')].some(t => t.textContent === 'y = a'));
  await nav('#p-quad-11');
  submit('[data-form="ans"]', 'ans', '−5/3');
  expect('quad-11 fraction answer with unicode minus accepted', state().att['quad-11'] && state().att['quad-11'].st === 'clean');
  await nav('#p-quad-52');
  submit('[data-form="ans"]', 'ans', '0,75');
  expect('quad-52 decimal-comma answer accepted', state().att['quad-52'] && state().att['quad-52'].st === 'clean');

  // topic «Правила подсчёта»: stacked C indices, grid and Catalan figures, choice and number answers
  await nav('#t-count');
  expect('count topic 55 problem chips, 15 deep', d.querySelectorAll('.pchip').length === 55 && d.querySelectorAll('.pchip .dp').length === 15);
  expect('count 6 base + 3 deep lessons', d.querySelectorAll('.lessons .lesson').length === 9 && d.querySelectorAll('.deephead + .lessons .lesson').length === 3);
  await nav('#l-cnt-l4');
  const gridFig = d.querySelector('.lessonbody svg.fig');
  expect('grid figure: dashed grid and gold path', gridFig && gridFig.querySelectorAll('line.d').length === 8 && gridFig.querySelectorAll('line.g').length === 5);
  expect('stacked C indices rendered', d.querySelectorAll('.lessonbody .ix').length > 5 && d.querySelector('.lessonbody .ix').children.length === 2);
  await nav('#l-cnt-l9');
  expect('Catalan figure with reflected path and label', [...d.querySelectorAll('.lessonbody svg.fig text')].some(t => t.textContent === 'y = −1') && d.querySelectorAll('.lessonbody svg.fig polyline').length === 2);
  await nav('#p-cnt-08');
  click(d.querySelectorAll('[data-act="opt"]')[2]);
  expect('cnt-08 choice answer accepted', state().att['cnt-08'] && state().att['cnt-08'].st === 'clean');
  await nav('#p-cnt-53');
  submit('[data-form="ans"]', 'ans', '55 252');
  expect('cnt-53 answer with a space accepted', state().att['cnt-53'] && state().att['cnt-53'].st === 'clean');

  // F1: credit test per level — pass level 1, fail level 2
  await nav('#t-count');
  expect('topic offers a credit test link', !!d.querySelector('a.zlink[href="#z-count-1"]'));
  await nav('#z-count-1');
  expect('credit test intro', text().includes('Зачёт · уровень 1') && !!d.querySelector('[data-act="zstart"]'));
  click('[data-act="zstart"]');
  const zIds = state().zrun.ids, cntT = w.MM.byId('count');
  expect('credit test picks 5 untried level-1 problems', zIds.length === 5 && zIds.every(id => cntT.problems.find(p => p.id === id).lvl === 1) && !zIds.includes('cnt-08'));
  for (const id of zIds) {
    const p = cntT.problems.find(x => x.id === id);
    if (p.type === 'choice') click(d.querySelectorAll('[data-act="zopt"]')[p.a]);
    else submit('[data-form="zans"]', 'zans', p.a[0]);
  }
  s = state();
  expect('credit test passed and level credited', s.credit.count && s.credit.count[1] && s.credit.count[1].k === 5 && !s.zrun && text().includes('Зачёт сдан'));
  expect('credit answers count as clean attempts', zIds.every(id => s.att[id] && s.att[id].st === 'clean' && s.att[id].z));
  expect('credit result offers next level test', !!d.querySelector('a.btn[href="#z-count-2"]') && d.querySelectorAll('.reslist li').length === 5);
  await nav('#z-count-2');
  click('[data-act="zstart"]');
  for (let i = 0; i < 5; i++) click('[data-act="zskip"]');
  s = state();
  expect('failed credit test: no credit, mistakes go to review, retry offered', !(s.credit.count && s.credit.count[2]) && s.zres.k === 0 && s.zres.ids.every(id => s.rev[id]) && !!d.querySelector('[data-act="zstart"]'));
  await nav('#t-count');
  const nsHref = d.querySelector('.actions .btn').getAttribute('href'), nsP = cntT.problems.find(p => '#p-' + p.id === nsHref);
  expect('topic shows credited level; next step is not a level-1 problem', !!d.querySelector('.zpill') && (!nsP || nsP.lvl !== 1));
  await nav('#map');
  expect('map shows credit pill', [...d.querySelectorAll('.mitem .pill.good')].some(x => x.textContent === 'зачёт: уровень 1'));

  // F6: mixed training — untried test problems from several topics, feedback with topic and solution
  await nav('#today');
  expect('today offers mixed training', !!d.querySelector('section.mixp a[href="#mix"]'));
  await nav('#mix');
  const attBefore = Object.keys(state().att);
  click('[data-act="mstart"]');
  const mIds = state().mrun.ids;
  const findP = id => w.MM.topics.flatMap(t => t.problems).find(p => p.id === id);
  expect('mixed: 6 untried test problems from several topics', mIds.length === 6 && new Set(mIds.map(id => findP(id).topic)).size >= 2 && mIds.every(id => findP(id).type !== 'proof' && !attBefore.includes(id)));
  expect('mixed: topic is hidden while solving', !text().includes('Тема:'));
  const solLoading = () => /загружается/.test((d.querySelector('.sol-t') || {}).textContent || '');
  async function mAns(id, mode) {
    const p = findP(id);
    if (mode === 'skip') click('[data-act="mskip"]');
    else if (p.type === 'choice') click(d.querySelectorAll('[data-act="mopt"]')[mode === 'right' ? p.a : (p.a + 1) % p.opts.length]);
    else submit('[data-form="mans"]', 'mans', mode === 'right' ? p.a[0] : '-99999');
    for (let i = 0; i < 300 && solLoading(); i++) await sleep(10);
  }
  await mAns(mIds[0], 'right');
  expect('mixed: right answer reveals topic and loaded solution', !!d.querySelector('.fb.ok') && d.querySelector('.fb-sub').textContent.includes('Тема:') && d.querySelector('.sol-t').textContent.length > 20 && !solLoading());
  click('[data-act="mnext"]');
  await mAns(mIds[1], 'wrong');
  expect('mixed: wrong answer shows the right one', !!d.querySelector('.fb.no') && text().includes('Верный ответ'));
  click('[data-act="mnext"]');
  await mAns(mIds[2], 'skip');
  expect('mixed: skip opens the solution', text().includes('Решение открыто'));
  click('[data-act="mnext"]');
  for (let i = 3; i < 6; i++) { await mAns(mIds[i], 'right'); click('[data-act="mnext"]'); }
  for (let i = 0; i < 300 && /загружается/.test(text()); i++) await sleep(10);
  s = state();
  expect('mixed result: 4 of 6, attempts in rating, mistakes to review', !s.mrun && s.mres && s.mres.k === 4 && mIds.every(id => s.att[id] && s.att[id].m) && !!s.rev[mIds[1]] && !!s.rev[mIds[2]] && text().includes('Итог') && d.querySelectorAll('.reslist li').length === 6);

  // deep problem page
  await nav('#p-div-43');
  expect('deep problem pill', [...d.querySelectorAll('.phead .pill')].some(x => x.textContent === 'глубокий уровень'));
  submit('[data-form="ans"]', 'ans', '3');
  expect('div-43 answer accepted', state().att['div-43'] && state().att['div-43'].st === 'clean');

  // topic «Как доказывать»: lessons, Yes/No choice, number answer, rubric with roots
  await nav('#t-proof');
  expect('proof topic 55 problem chips, 15 deep', d.querySelectorAll('.pchip').length === 55 && d.querySelectorAll('.pchip .dp').length === 15);
  expect('proof topic 9 lessons (6 + 3 deep)', d.querySelectorAll('a.lesson[href^="#l-proof-l"]').length === 9);
  await nav('#l-proof-l4');
  expect('proof lesson renders roots and fractions', d.querySelectorAll('.lessonbody .sq').length >= 2 && d.querySelectorAll('.lessonbody .fr').length >= 2);
  await nav('#p-proof-17');
  d.dispatchEvent(new w.KeyboardEvent('keydown', { key: '2', bubbles: true }));
  expect('proof-17 «Нет» accepted', state().att['proof-17'] && state().att['proof-17'].st === 'clean');
  await nav('#p-proof-10');
  submit('[data-form="ans"]', 'ans', ' 9 ');
  expect('proof-10 answer accepted', state().att['proof-10'] && state().att['proof-10'].st === 'clean');
  await nav('#p-proof-29');
  click('[data-act="proof-check"]');
  expect('proof-29 rubric has 4 items with a root', d.querySelectorAll('[data-rub]').length === 4 && !!d.querySelector('label .sq, .rub .sq, [data-rub] ~ * .sq, .proofbox .sq'));
  [0, 1, 2, 3].forEach(i => { const cb = d.querySelector('[data-rub="' + i + '"]'); cb.checked = true; cb.dispatchEvent(new w.Event('change', { bubbles: true })); });
  click('[data-act="proof-grade"]');
  expect('proof-29 graded 7/7 -> clean', state().att['proof-29'].pts === 7 && state().att['proof-29'].st === 'clean');

  // second topic: two-storey fractions render and answers work
  await nav('#map');
  expect('map shows ready count', text().includes('Готово 6 из 45'));
  expect('map shows grade pills', text().includes('7 класс'));
  await nav('#t-alg-expr');
  expect('alg-expr 55 problem chips, 15 deep', d.querySelectorAll('.pchip').length === 55 && d.querySelectorAll('.pchip .dp').length === 15);
  expect('alg-expr 3 deep lessons', d.querySelectorAll('.deephead + .lessons .lesson').length === 3);
  await nav('#l-expr-l3');
  expect('lesson renders fractions', d.querySelectorAll('.lessonbody .fr').length >= 5);
  await nav('#p-expr-09');
  expect('statement fraction', !!d.querySelector('.stmt .fr'));
  submit('[data-form="ans"]', 'ans', '4');
  expect('expr-09 correct', state().att['expr-09'] && state().att['expr-09'].st === 'clean');
  await nav('#p-expr-15');
  submit('[data-form="ans"]', 'ans', '0,5');
  expect('comma decimal accepted', state().att['expr-15'].st === 'clean');
  await nav('#p-expr-17');
  submit('[data-form="ans"]', 'ans', '−1');
  expect('unicode minus accepted', state().att['expr-17'].st === 'clean');
  expect('last topic remembered', state().lastTopic === 'alg-expr');

  // today after work
  await nav('#today');
  expect('continue card follows last topic', [...d.querySelectorAll('.grid4 .card')].some(c => c.textContent.includes('Продолжить') && c.textContent.includes('Выражения и тождества')));
  expect('backup reminder after 10 rated problems', text().includes('Резервная копия'));
  expect('today streak/day count', text().includes('Решено сегодня'));
  expect('weekly goal 10 h by default', text().includes('Цель — 10 ч за 7 дней'));
  expect('review card shows due 0 today (due tomorrow)', text().includes('На сегодня всё повторено'));
  expect('chart svg drawn', !!$('[data-chart] svg'));

  // every topic: first lesson and last problem render with full content (on the site — after loading)
  for (const t of w.MM.topics) {
    await nav('#l-' + t.lessons[0].id);
    const lb = d.querySelector('.lessonbody');
    await nav('#p-' + t.problems[t.problems.length - 1].id);
    expect('topic ' + t.id + ': lesson and problem render', t.loaded === true && lb && lb.textContent.length > 300 && !!d.querySelector('.stmt') && !!d.querySelector('[data-act="hint"]'));
  }

  // profile + export/import roundtrip
  await nav('#me');
  expect('teacher list has item', d.querySelectorAll('.tlist li').length === 1);
  expect('hours section with 8 weeks', d.querySelectorAll('.weeks li').length === 8 && $('[data-act="wgoal"][aria-pressed="true"]').textContent === '10 ч');
  click('[data-act="wgoal"][data-h="12"]');
  expect('weekly goal changed to 12', state().weekGoal === 12 && $('[data-act="wgoal"][aria-pressed="true"]').textContent === '12 ч');
  await nav('#today');
  expect('today shows new weekly goal', text().includes('Цель — 12 ч за 7 дней'));
  await nav('#me');
  const code = d.getElementById('exp').value;
  expect('export code', code.startsWith('MM1:') && code.length > 100);
  const snapshot = JSON.stringify(state().att);
  click('#resetbtn'); click('#resetbtn'); await sleep(30);
  expect('reset clears', state().rating == null);
  await nav('#me');
  d.getElementById('imp').value = code;
  click('[data-act="import"]');
  expect('import restores', JSON.stringify(state().att) === snapshot && state().rating != null);
  d.getElementById('imp').value = 'garbage';
  click('[data-act="import"]');
  expect('bad import message', d.getElementById('impmsg').textContent.includes('Не получилось'));

  // review becomes due tomorrow: fake date by shifting due
  const st = state(); Object.keys(st.rev).forEach(k => { st.rev[k].due = '2000-01-01'; }); w.localStorage.setItem('mit-mission-v1', JSON.stringify(st));
  console.log('\n' + checks.map(([n, ok]) => (ok ? 'PASS ' : 'FAIL ') + n).join('\n'));
  const failed = checks.filter(c => !c[1]).length;
  console.log('\n' + (checks.length - failed) + '/' + checks.length + ' checks passed; runtime errors: ' + errors.length);
  errors.forEach(e => console.log('  ' + e));
  process.exit(failed || errors.length ? 1 : 0);
})().catch(e => { console.log('TEST CRASH', e); console.log(errors.join('\n')); process.exit(1); });

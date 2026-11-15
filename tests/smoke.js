// Smoke test: drives the built app like a user and fails on any runtime error.
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const util = require('util');

const file = process.argv[2];
const html = fs.readFileSync(file, 'utf8');
const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message)) errors.push('jsdomError: ' + e.message + (e.detail ? ' ' + e.detail : '')); });
vc.on('error', e => errors.push('console.error: ' + e));

const isDoc = /^\s*<!doctype/i.test(html);
const dom = new JSDOM(isDoc ? html : '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', {
  url: 'https://app.test/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
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
async function nav(h) { w.location.hash = h; await sleep(30); }
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
  expect('chart area present', !!$('[data-chart]'));

  await nav('#map');
  expect('map lists soon topics', d.querySelectorAll('.mitem.soon').length >= 15);

  await nav('#t-div');
  expect('topic levels', d.querySelectorAll('.lvl').length === 5);
  expect('topic 42 problem chips', d.querySelectorAll('.pchip').length === 42);
  expect('topic 6 lessons', d.querySelectorAll('.lesson').length === 6);

  await nav('#l-div-l5');
  expect('lesson table wrapped', !!$('.tblwrap table'));
  click('[data-act="read"]'); await sleep(30);
  expect('read advances to next lesson', w.location.hash === '#l-div-l6' && state().read['div-l5']);

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

  // today after work
  await nav('#today');
  expect('today streak/day count', text().includes('Решено сегодня'));
  expect('review card shows due 0 today (due tomorrow)', text().includes('На сегодня всё повторено'));
  expect('chart svg drawn', !!$('[data-chart] svg'));

  // profile + export/import roundtrip
  await nav('#me');
  expect('teacher list has item', d.querySelectorAll('.tlist li').length === 1);
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

// Проверка ссылки переноса (#start-1250) и целей: старт 1250, цель 1350, достижение цели, защита от перезаписи.
// Запуск: node app/tests/smoke-goal.js app/docs/index.html   (нужен пакет jsdom)
const fs = require('fs');
const { JSDOM, VirtualConsole } = require('jsdom');
const util = require('util');

const html = fs.readFileSync(process.argv[2], 'utf8');
const errors = [];
const checks = [];
const expect = (n, c) => checks.push([n, !!c]);
const sleep = ms => new Promise(r => setTimeout(r, ms));

function open(url, storage) {
  const vc = new VirtualConsole();
  vc.on('jsdomError', e => { if (!/Not implemented/.test(e.message)) errors.push(e.message); });
  const isDoc = /^\s*<!doctype/i.test(html);
  const dom = new JSDOM(isDoc ? html : '<!doctype html><html><head><meta charset="utf-8"></head><body>' + html + '</body></html>', {
    url, runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: vc,
    beforeParse(w) {
      w.TextEncoder = util.TextEncoder; w.TextDecoder = util.TextDecoder; w.scrollTo = () => {};
      if (storage) w.localStorage.setItem('mit-mission-v1', storage);
      w.addEventListener('error', ev => errors.push(ev.message));
    }
  });
  return dom.window;
}

(async () => {
  // 1. fresh device + transfer link
  let w = open('https://app.test/mit-mission/#start-1250');
  await sleep(50);
  let d = w.document, S = () => JSON.parse(w.localStorage.getItem('mit-mission-v1'));
  expect('rating set to 1250', S().rating === 1250 && S().diag.imported);
  expect('hash replaced with #today', w.location.hash === '#today');
  expect('notice banner shown', d.querySelector('.flash') && d.querySelector('.flash').textContent.includes('Стартовый рейтинг 1250'));
  expect('goal is district stage 1350', d.querySelector('.goal') && d.querySelector('.goal').textContent.includes('1350') && d.querySelector('.goal').textContent.includes('осталось 100'));
  expect('goal start stored', S().goals.from['1350'] === 1250);
  d.querySelector('[data-act="notice-ok"]').click(); await sleep(20);
  expect('notice dismissed', !d.querySelector('.flash') && S().notice === null);

  // diag result view for imported result
  w.location.hash = '#diag'; await sleep(30);
  expect('imported diag view', d.getElementById('root').textContent.includes('Результат перенесён'));

  // profile goals
  w.location.hash = '#me'; await sleep(30);
  expect('profile goals list', d.querySelectorAll('.goals li').length === 6 && d.querySelector('.goals li.now').textContent.includes('Районный этап'));

  // 2. solve level-3 problems until the goal is reached
  const ids = ['div-21', 'div-22', 'div-23', 'div-24', 'div-25'];
  for (const id of ids) {
    if (S().rating >= 1350) break;
    w.location.hash = '#p-' + id; await sleep(30);
    const p = w.MM.topics[0].problems.find(x => x.id === id);
    d.getElementById('ans').value = p.a[0];
    d.querySelector('[data-form="ans"]').dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
    await sleep(10);
  }
  expect('rating crossed 1350', S().rating >= 1350);
  expect('goal marked done', !!S().goals.done['1350'] && S().flash === 1350);
  expect('feedback shows goal pill', d.querySelector('.fb .pill.gold') && d.querySelector('.fb .pill.gold').textContent.includes('Районный этап'));
  w.location.hash = '#today'; await sleep(30);
  expect('celebration banner', d.querySelector('.flash') && d.querySelector('.flash').textContent.includes('Цель достигнута'));
  expect('next goal semifinal 1650', d.querySelector('.goal').textContent.includes('1650'));
  d.querySelector('[data-act="flash-ok"]').click(); await sleep(20);
  expect('celebration dismissed', S().flash === null);

  // 3. link never overwrites existing progress
  const saved = w.localStorage.getItem('mit-mission-v1');
  const r = JSON.parse(saved).rating;
  const w2 = open('https://app.test/mit-mission/#start-900', saved);
  await sleep(50);
  expect('existing progress kept', JSON.parse(w2.localStorage.getItem('mit-mission-v1')).rating === r);

  console.log(checks.map(([n, ok]) => (ok ? 'PASS ' : 'FAIL ') + n).join('\n'));
  const failed = checks.filter(c => !c[1]).length;
  console.log('\n' + (checks.length - failed) + '/' + checks.length + ' checks passed; runtime errors: ' + errors.length);
  errors.forEach(e => console.log('  ' + e));
  process.exit(failed || errors.length ? 1 : 0);
})().catch(e => { console.log('CRASH', e); process.exit(1); });

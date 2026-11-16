// Тема «Выражения и тождества» (7 класс + олимпиадный уровень).
// Формулы сокращённого умножения, разложение на множители, алгебраические дроби,
// симметрические выражения, олимпиадные тождества.
(function () {
  // дробь и корень «в два этажа»
  function fr(a, b) { return '<span class="fr"><span>' + a + '</span><span>' + b + '</span></span>'; }
  function sq(x) { return '<span class="sq">√<span>' + x + '</span></span>'; }

  MM.addTopic({
    id: 'alg-expr',
    sec: 'alg',
    title: 'Выражения и тождества',
    blurb: `Формулы сокращённого умножения, разложение на множители, алгебраические дроби и олимпиадные тождества. Без этого не решается ни одна алгебраическая задача.`,

    lessons: [
      { id: 'expr-l1', title: 'Формулы сокращённого умножения', mins: 12, html: `
<p>Эти формулы нужно знать так же твёрдо, как таблицу умножения. Их читают в обе стороны: слева направо — раскрываем скобки, справа налево — раскладываем на множители.</p>
<div class="box"><div class="box-h">Запомни</div><ul>
<li><span class="m">(a + b)<sup>2</sup> = a<sup>2</sup> + 2ab + b<sup>2</sup></span></li>
<li><span class="m">(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup></span></li>
<li><span class="m">a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b)</span></li>
<li><span class="m">(a + b)<sup>3</sup> = a<sup>3</sup> + 3a<sup>2</sup>b + 3ab<sup>2</sup> + b<sup>3</sup></span>, а <span class="m">(a − b)<sup>3</sup> = a<sup>3</sup> − 3a<sup>2</sup>b + 3ab<sup>2</sup> − b<sup>3</sup></span></li>
<li><span class="m">a<sup>3</sup> + b<sup>3</sup> = (a + b)(a<sup>2</sup> − ab + b<sup>2</sup>)</span></li>
<li><span class="m">a<sup>3</sup> − b<sup>3</sup> = (a − b)(a<sup>2</sup> + ab + b<sup>2</sup>)</span></li>
</ul></div>
<h3>Откуда берётся квадрат суммы</h3>
<p>Квадрат со стороной <span class="m">a + b</span> состоит из квадрата <span class="m">a × a</span>, квадрата <span class="m">b × b</span> и двух прямоугольников <span class="m">a × b</span>. Отсюда <span class="m">a<sup>2</sup> + 2ab + b<sup>2</sup></span>. Частая ошибка — забыть удвоенное произведение: <span class="m">(a + b)<sup>2</sup> ≠ a<sup>2</sup> + b<sup>2</sup></span>.</p>
<h3>Быстрый счёт</h3>
<p class="calc"><span class="m">101<sup>2</sup> = (100 + 1)<sup>2</sup> = 10000 + 200 + 1 = 10201</span><br>
<span class="m">47 · 53 = (50 − 3)(50 + 3) = 2500 − 9 = 2491</span><br>
<span class="m">73<sup>2</sup> − 27<sup>2</sup> = (73 − 27)(73 + 27) = 46 · 100 = 4600</span></p>
<div class="trick"><div class="trick-h">Олимпиадный приём</div>
<p>Если в задаче огромные числа, ищи в них формулу. Произведение двух чисел, симметричных относительно круглого числа, — это разность квадратов. Соседние числа <span class="m">n − 1</span>, <span class="m">n</span>, <span class="m">n + 1</span> удобно обозначать через одну букву <span class="m">n</span>.</p></div>` },

      { id: 'expr-l2', title: 'Разложение на множители', mins: 12, html: `
<p>Разложить на множители — значит записать выражение в виде произведения. Это главный инструмент: произведение равно нулю, когда один из множителей равен нулю, а делимость и знак произведения легко исследовать.</p>
<div class="box"><div class="box-h">Пять способов</div><ol>
<li><b>Вынесение общего множителя:</b> <span class="m">6x<sup>2</sup>y − 9xy<sup>2</sup> = 3xy(2x − 3y)</span>.</li>
<li><b>Группировка:</b> <span class="m">ab + 2a + 3b + 6 = a(b + 2) + 3(b + 2) = (a + 3)(b + 2)</span>.</li>
<li><b>Формулы:</b> <span class="m">9x<sup>2</sup> − 25 = (3x − 5)(3x + 5)</span>.</li>
<li><b>Выделение полного квадрата:</b> <span class="m">x<sup>2</sup> − 6x + 10 = (x − 3)<sup>2</sup> + 1</span>. Отсюда сразу видно, что наименьшее значение равно 1.</li>
<li><b>«Добавить и вычесть»:</b> <span class="m">x<sup>4</sup> + 64 = (x<sup>4</sup> + 16x<sup>2</sup> + 64) − 16x<sup>2</sup> = (x<sup>2</sup> + 8)<sup>2</sup> − (4x)<sup>2</sup> = (x<sup>2</sup> − 4x + 8)(x<sup>2</sup> + 4x + 8)</span>.</li>
</ol></div>
<div class="ex"><div class="ex-h">Пример</div>
<p>Найдите все пары натуральных чисел, для которых <span class="m">xy + x + y = 5</span>.</p>
<p><b>Решение.</b> Добавим 1 к обеим частям: <span class="m">xy + x + y + 1 = 6</span>, то есть <span class="m">(x + 1)(y + 1) = 6</span>. Оба множителя не меньше 2, поэтому это <span class="m">2 · 3</span> или <span class="m">3 · 2</span>. Ответ: <span class="m">(1, 2)</span> и <span class="m">(2, 1)</span>.</p></div>
<div class="trick"><div class="trick-h">Олимпиадный приём</div>
<p>Уравнения в целых числах часто решаются так: собрать всё в произведение, а справа оставить число. Потом остаётся перебрать делители этого числа.</p></div>` },

      { id: 'expr-l3', title: 'Алгебраические дроби', mins: 10, html: `
<p>С алгебраическими дробями работают так же, как с обыкновенными, но с одним важным условием: знаменатель не может быть равен нулю. Допустимые значения букв нужно помнить на каждом шаге.</p>
<div class="box"><div class="box-h">Запомни</div><ul>
<li>Сокращать можно только <b>множители</b>, а не слагаемые. Поэтому сначала раскладываем числитель и знаменатель на множители.</li>
<li><span class="m">${fr('a<sup>2</sup> − ab', 'a<sup>2</sup> − b<sup>2</sup>')} = ${fr('a(a − b)', '(a − b)(a + b)')} = ${fr('a', 'a + b')}</span> при <span class="m">a ≠ b</span> и <span class="m">a ≠ −b</span>.</li>
<li>Складываем через общий знаменатель: <span class="m">${fr('1', 'x − 1')} − ${fr('1', 'x + 1')} = ${fr('(x + 1) − (x − 1)', 'x<sup>2</sup> − 1')} = ${fr('2', 'x<sup>2</sup> − 1')}</span>.</li>
</ul></div>
<h3>Типичная ошибка</h3>
<p><span class="m">${fr('a + b', 'a')}</span> — это не <span class="m">b</span> и не <span class="m">1 + b</span>, а <span class="m">1 + ${fr('b', 'a')}</span>. Букву <span class="m">a</span> нельзя «зачеркнуть», потому что в числителе она не множитель, а слагаемое.</p>
<div class="ex"><div class="ex-h">Пример</div>
<p>Упростите <span class="m">${fr('x<sup>3</sup> − 1', 'x<sup>2</sup> + x + 1')}</span>.</p>
<p><b>Решение.</b> По формуле разности кубов <span class="m">x<sup>3</sup> − 1 = (x − 1)(x<sup>2</sup> + x + 1)</span>. Знаменатель <span class="m">x<sup>2</sup> + x + 1</span> никогда не равен нулю, так что дробь равна <span class="m">x − 1</span> при любом <span class="m">x</span>.</p></div>` },

      { id: 'expr-l4', title: 'Симметрические выражения', mins: 12, html: `
<p>Выражение называют <b>симметрическим</b>, если оно не меняется, когда <span class="m">x</span> и <span class="m">y</span> меняют местами. Любое такое выражение можно записать через две величины: <span class="m">s = x + y</span> и <span class="m">p = xy</span>. Часто сами <span class="m">x</span> и <span class="m">y</span> найти трудно, а <span class="m">s</span> и <span class="m">p</span> известны.</p>
<div class="box"><div class="box-h">Таблица</div><ul>
<li><span class="m">x<sup>2</sup> + y<sup>2</sup> = s<sup>2</sup> − 2p</span></li>
<li><span class="m">(x − y)<sup>2</sup> = s<sup>2</sup> − 4p</span></li>
<li><span class="m">x<sup>3</sup> + y<sup>3</sup> = s<sup>3</sup> − 3sp</span></li>
<li><span class="m">${fr('1', 'x')} + ${fr('1', 'y')} = ${fr('s', 'p')}</span></li>
<li><span class="m">x<sup>4</sup> + y<sup>4</sup> = (x<sup>2</sup> + y<sup>2</sup>)<sup>2</sup> − 2p<sup>2</sup></span></li>
</ul></div>
<div class="ex"><div class="ex-h">Пример</div>
<p><span class="m">x + y = 5</span>, <span class="m">xy = 3</span>. Тогда <span class="m">x<sup>2</sup> + y<sup>2</sup> = 25 − 6 = 19</span>, <span class="m">x<sup>3</sup> + y<sup>3</sup> = 125 − 45 = 80</span>, <span class="m">${fr('1', 'x')} + ${fr('1', 'y')} = ${fr('5', '3')}</span>. Сами числа <span class="m">x</span> и <span class="m">y</span> здесь иррациональные, но они и не понадобились.</p></div>
<h3>Приём «x плюс обратное»</h3>
<p>Если известно <span class="m">t = x + ${fr('1', 'x')}</span>, то <span class="m">x<sup>2</sup> + ${fr('1', 'x<sup>2</sup>')} = t<sup>2</sup> − 2</span> и <span class="m">x<sup>3</sup> + ${fr('1', 'x<sup>3</sup>')} = t<sup>3</sup> − 3t</span>. Например, при <span class="m">t = 4</span> получаем <span class="m">x<sup>2</sup> + ${fr('1', 'x<sup>2</sup>')} = 14</span>.</p>
<h3>Три переменные</h3>
<p><span class="m">a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> = (a + b + c)<sup>2</sup> − 2(ab + bc + ca)</span>. Если <span class="m">a + b + c = 6</span> и <span class="m">ab + bc + ca = 11</span>, то <span class="m">a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> = 36 − 22 = 14</span>.</p>` },

      { id: 'expr-l5', title: 'Олимпиадные тождества', mins: 14, html: `
<p>Несколько тождеств встречаются в олимпиадных задачах снова и снова. Их полезно узнавать с первого взгляда.</p>
<div class="box"><div class="box-h">Сумма трёх кубов</div>
<p><span class="m">a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> − 3abc = (a + b + c)(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca)</span>,</p>
<p>а второй множитель равен <span class="m">${fr('1', '2')}((a − b)<sup>2</sup> + (b − c)<sup>2</sup> + (c − a)<sup>2</sup>)</span>.</p>
<p><b>Следствие:</b> если <span class="m">a + b + c = 0</span>, то <span class="m">a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> = 3abc</span>. Проверка: <span class="m">1<sup>3</sup> + 2<sup>3</sup> + (−3)<sup>3</sup> = −18 = 3 · 1 · 2 · (−3)</span>.</p></div>
<div class="box"><div class="box-h">Тождество Софи Жермен</div>
<p><span class="m">a<sup>4</sup> + 4b<sup>4</sup> = (a<sup>2</sup> + 2b<sup>2</sup> + 2ab)(a<sup>2</sup> + 2b<sup>2</sup> − 2ab)</span>.</p>
<p>Получается приёмом «добавить и вычесть»: добавляем и вычитаем <span class="m">4a<sup>2</sup>b<sup>2</sup></span>. Пример: <span class="m">629 = 5<sup>4</sup> + 4 · 1<sup>4</sup> = (25 + 2 + 10)(25 + 2 − 10) = 37 · 17</span>.</p></div>
<div class="box"><div class="box-h">Разность степеней</div>
<p><span class="m">a<sup>n</sup> − b<sup>n</sup> = (a − b)(a<sup>n−1</sup> + a<sup>n−2</sup>b + … + b<sup>n−1</sup>)</span>. При нечётном <span class="m">n</span> также <span class="m">a<sup>n</sup> + b<sup>n</sup> = (a + b)(a<sup>n−1</sup> − a<sup>n−2</sup>b + … + b<sup>n−1</sup>)</span>.</p></div>
<div class="trick"><div class="trick-h">Олимпиадный приём: подставь «корень»</div>
<p>Если выражение обращается в ноль при <span class="m">a = −b</span>, то оно делится на <span class="m">a + b</span>. Например, <span class="m">a<sup>3</sup> + b<sup>3</sup></span> при <span class="m">a = −b</span> равно нулю — и действительно делится на <span class="m">a + b</span>. Для симметрических выражений от трёх переменных это сразу даёт множители <span class="m">(a + b)(b + c)(c + a)</span>, а оставшийся числовой множитель находят, подставив удобные числа.</p></div>` }
    ],

    problems: [
      // ── Уровень 1 · База ──
      { id: 'expr-01', lvl: 1, r: 800, type: 'num', q: `Вычислите 51<sup>2</sup> − 49<sup>2</sup>.`, a: ['200'],
        hints: [`Разность квадратов: a<sup>2</sup> − b<sup>2</sup> = (a − b)(a + b).`],
        sol: `(51 − 49)(51 + 49) = 2 · 100 = 200.` },
      { id: 'expr-02', lvl: 1, r: 830, type: 'choice', q: `Раскройте скобки: (2x − 3)<sup>2</sup>.`, opts: ['4x<sup>2</sup> − 9', '4x<sup>2</sup> − 6x + 9', '4x<sup>2</sup> − 12x + 9', '2x<sup>2</sup> − 12x + 9'], a: 2,
        hints: [`(a − b)<sup>2</sup> = a<sup>2</sup> − 2ab + b<sup>2</sup>.`, `Здесь a = 2x, b = 3. Чему равно 2ab?`],
        sol: `(2x)<sup>2</sup> − 2 · 2x · 3 + 3<sup>2</sup> = 4x<sup>2</sup> − 12x + 9.` },
      { id: 'expr-03', lvl: 1, r: 860, type: 'num', q: `Вычислите 99<sup>2</sup> без калькулятора.`, a: ['9801'],
        hints: [`99 = 100 − 1.`],
        sol: `(100 − 1)<sup>2</sup> = 10000 − 200 + 1 = 9801.` },
      { id: 'expr-04', lvl: 1, r: 890, type: 'choice', q: `Разложите на множители x<sup>2</sup> − 16.`, opts: ['(x − 4)<sup>2</sup>', '(x − 4)(x + 4)', '(x − 8)(x + 2)', '(x − 16)(x + 1)'], a: 1,
        hints: [`16 = 4<sup>2</sup>. Это разность квадратов.`],
        sol: `x<sup>2</sup> − 4<sup>2</sup> = (x − 4)(x + 4).` },
      { id: 'expr-05', lvl: 1, r: 920, type: 'num', q: `Вычислите 2026<sup>2</sup> − 2025<sup>2</sup>.`, a: ['4051'],
        hints: [`Разность квадратов.`],
        sol: `(2026 − 2025)(2026 + 2025) = 1 · 4051 = 4051.` },
      { id: 'expr-06', lvl: 1, r: 960, type: 'choice', q: `Упростите выражение (a + 2)(a − 2) − a(a − 4).`, opts: ['4a − 4', '4a + 4', '−4', '2a<sup>2</sup> − 4a − 4'], a: 0,
        hints: [`(a + 2)(a − 2) = a<sup>2</sup> − 4.`],
        sol: `a<sup>2</sup> − 4 − a<sup>2</sup> + 4a = 4a − 4.` },
      { id: 'expr-07', lvl: 1, r: 1000, type: 'num', q: `Известно, что x + y = 7 и xy = 10. Найдите x<sup>2</sup> + y<sup>2</sup>.`, a: ['29'],
        hints: [`(x + y)<sup>2</sup> = x<sup>2</sup> + 2xy + y<sup>2</sup>.`],
        sol: `x<sup>2</sup> + y<sup>2</sup> = (x + y)<sup>2</sup> − 2xy = 49 − 20 = 29.` },
      { id: 'expr-08', lvl: 1, r: 1040, type: 'choice', q: `Разложите на множители a<sup>3</sup> − 8.`, opts: ['(a − 2)<sup>3</sup>', '(a − 2)(a<sup>2</sup> + 2a + 4)', '(a − 2)(a<sup>2</sup> − 2a + 4)', '(a − 2)(a + 2)(a + 4)'], a: 1,
        hints: [`8 = 2<sup>3</sup>. Формула разности кубов: a<sup>3</sup> − b<sup>3</sup> = (a − b)(a<sup>2</sup> + ab + b<sup>2</sup>).`],
        sol: `a<sup>3</sup> − 2<sup>3</sup> = (a − 2)(a<sup>2</sup> + 2a + 4).` },

      // ── Уровень 2 · Районный этап ──
      { id: 'expr-09', lvl: 2, r: 1070, type: 'num', q: `Вычислите ${fr('1001<sup>2</sup> − 999<sup>2</sup>', '1000')}.`, a: ['4'],
        hints: [`Числитель — разность квадратов.`],
        sol: `(1001 − 999)(1001 + 999) = 2 · 2000 = 4000, и 4000 : 1000 = 4.` },
      { id: 'expr-10', lvl: 2, r: 1100, type: 'num', q: `Известно, что x − ${fr('1', 'x')} = 3. Найдите x<sup>2</sup> + ${fr('1', 'x<sup>2</sup>')}.`, a: ['11'],
        hints: [`Возведи равенство в квадрат.`, `(x − 1/x)<sup>2</sup> = x<sup>2</sup> − 2 + 1/x<sup>2</sup>.`],
        sol: `Возводим в квадрат: x<sup>2</sup> − 2 + ${fr('1', 'x<sup>2</sup>')} = 9, значит x<sup>2</sup> + ${fr('1', 'x<sup>2</sup>')} = 11.` },
      { id: 'expr-11', lvl: 2, r: 1130, type: 'num', q: `Известно, что a + b = 5 и ab = 6. Найдите a<sup>3</sup> + b<sup>3</sup>.`, a: ['35'],
        hints: [`a<sup>3</sup> + b<sup>3</sup> = (a + b)<sup>3</sup> − 3ab(a + b).`],
        sol: `5<sup>3</sup> − 3 · 6 · 5 = 125 − 90 = 35. Проверка: это числа 2 и 3, и 8 + 27 = 35.` },
      { id: 'expr-12', lvl: 2, r: 1160, type: 'choice', q: `Разложите x<sup>4</sup> + 4 на множители с целыми коэффициентами.`, opts: ['(x<sup>2</sup> + 2)<sup>2</sup>', '(x<sup>2</sup> − 2x + 2)(x<sup>2</sup> + 2x + 2)', '(x<sup>2</sup> + 2)(x<sup>2</sup> − 2)', 'не раскладывается'], a: 1,
        hints: [`Дополни до полного квадрата: x<sup>4</sup> + 4 = (x<sup>2</sup> + 2)<sup>2</sup> − …`, `(x<sup>2</sup> + 2)<sup>2</sup> − 4x<sup>2</sup> — это разность квадратов.`],
        sol: `x<sup>4</sup> + 4 = x<sup>4</sup> + 4x<sup>2</sup> + 4 − 4x<sup>2</sup> = (x<sup>2</sup> + 2)<sup>2</sup> − (2x)<sup>2</sup> = (x<sup>2</sup> − 2x + 2)(x<sup>2</sup> + 2x + 2).` },
      { id: 'expr-13', lvl: 2, r: 1190, type: 'num', q: `Найдите наименьшее значение выражения x<sup>2</sup> − 10x + 31.`, a: ['6'],
        hints: [`Выдели полный квадрат.`],
        sol: `x<sup>2</sup> − 10x + 31 = (x − 5)<sup>2</sup> + 6 ≥ 6, и значение 6 достигается при x = 5.` },
      { id: 'expr-14', lvl: 2, r: 1220, type: 'num', q: `Вычислите 37<sup>2</sup> + 2 · 37 · 63 + 63<sup>2</sup>.`, a: ['10000'],
        hints: [`Это квадрат суммы.`],
        sol: `(37 + 63)<sup>2</sup> = 100<sup>2</sup> = 10000.` },
      { id: 'expr-15', lvl: 2, r: 1250, type: 'num', q: `Найдите значение выражения ${fr('x<sup>2</sup> − 9', 'x<sup>2</sup> + 3x')} при x = 6.`, a: ['0.5', '1/2'],
        hints: [`Сократи дробь: разложи числитель и знаменатель на множители.`],
        sol: `${fr('(x − 3)(x + 3)', 'x(x + 3)')} = ${fr('x − 3', 'x')} = ${fr('3', '6')} = 0,5.` },
      { id: 'expr-16', lvl: 2, r: 1280, type: 'choice', q: `Чему равно (a − b)<sup>2</sup> + (b − c)<sup>2</sup> + (c − a)<sup>2</sup>?`, opts: ['0', '2(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup>)', '2(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca)', 'a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca'], a: 2,
        hints: [`Раскрой каждую скобку. Каждый квадрат буквы встретится дважды.`],
        sol: `a<sup>2</sup> − 2ab + b<sup>2</sup> + b<sup>2</sup> − 2bc + c<sup>2</sup> + c<sup>2</sup> − 2ca + a<sup>2</sup> = 2(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca).` },
      { id: 'expr-17', lvl: 2, r: 1310, type: 'num', q: `Вычислите 2026 · 2028 − 2027<sup>2</sup>.`, a: ['-1'],
        hints: [`2026 = 2027 − 1, 2028 = 2027 + 1.`],
        sol: `(2027 − 1)(2027 + 1) − 2027<sup>2</sup> = 2027<sup>2</sup> − 1 − 2027<sup>2</sup> = −1.` },
      { id: 'expr-18', lvl: 2, r: 1340, type: 'num', q: `Числа x и y таковы, что x + y = 3 и x<sup>2</sup> + y<sup>2</sup> = 5. Найдите xy.`, a: ['2'],
        hints: [`(x + y)<sup>2</sup> = x<sup>2</sup> + y<sup>2</sup> + 2xy.`],
        sol: `9 = 5 + 2xy, откуда xy = 2.` },

      // ── Уровень 3 · Полуфинал ──
      { id: 'expr-19', lvl: 3, r: 1370, type: 'num', q: `Вычислите (2 + 1)(2<sup>2</sup> + 1)(2<sup>4</sup> + 1)(2<sup>8</sup> + 1).`, a: ['65535'],
        hints: [`Умножь всё произведение на (2 − 1) = 1 — от этого оно не изменится.`, `(2 − 1)(2 + 1) = 2<sup>2</sup> − 1, затем (2<sup>2</sup> − 1)(2<sup>2</sup> + 1) = 2<sup>4</sup> − 1, …`],
        sol: `Умножим на 2 − 1 = 1 и будем раз за разом применять разность квадратов: (2 − 1)(2 + 1) = 2<sup>2</sup> − 1, (2<sup>2</sup> − 1)(2<sup>2</sup> + 1) = 2<sup>4</sup> − 1, (2<sup>4</sup> − 1)(2<sup>4</sup> + 1) = 2<sup>8</sup> − 1, (2<sup>8</sup> − 1)(2<sup>8</sup> + 1) = 2<sup>16</sup> − 1 = 65535.` },
      { id: 'expr-20', lvl: 3, r: 1400, type: 'num', q: `Числа a, b, c таковы, что a + b + c = 0 и abc = 4. Найдите a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup>.`, a: ['12'],
        hints: [`Вспомни следствие тождества для суммы трёх кубов.`],
        sol: `Если a + b + c = 0, то a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> = 3abc = 12.` },
      { id: 'expr-21', lvl: 3, r: 1430, type: 'num', q: `Известно, что x + ${fr('1', 'x')} = 3. Найдите x<sup>3</sup> + ${fr('1', 'x<sup>3</sup>')}.`, a: ['18'],
        hints: [`Возведи x + 1/x в куб.`, `(x + 1/x)<sup>3</sup> = x<sup>3</sup> + 1/x<sup>3</sup> + 3(x + 1/x).`],
        sol: `27 = x<sup>3</sup> + ${fr('1', 'x<sup>3</sup>')} + 3 · 3, откуда x<sup>3</sup> + ${fr('1', 'x<sup>3</sup>')} = 18.` },
      { id: 'expr-22', lvl: 3, r: 1460, type: 'num', q: `Вычислите ${sq('2026 · 2024 + 1')}.`, a: ['2025'],
        hints: [`2026 = 2025 + 1, 2024 = 2025 − 1.`],
        sol: `(2025 + 1)(2025 − 1) + 1 = 2025<sup>2</sup> − 1 + 1 = 2025<sup>2</sup>, корень равен 2025.` },
      { id: 'expr-23', lvl: 3, r: 1490, type: 'num', q: `Найдите наименьшее значение выражения x<sup>2</sup> + y<sup>2</sup> − 4x + 6y + 20.`, a: ['7'],
        hints: [`Выдели полные квадраты отдельно по x и по y.`],
        sol: `(x<sup>2</sup> − 4x + 4) + (y<sup>2</sup> + 6y + 9) + 7 = (x − 2)<sup>2</sup> + (y + 3)<sup>2</sup> + 7 ≥ 7, значение 7 — при x = 2, y = −3.` },
      { id: 'expr-24', lvl: 3, r: 1520, type: 'num', q: `Сколько существует пар целых чисел (x, y), для которых x<sup>2</sup> − y<sup>2</sup> = 15?`, a: ['8'],
        hints: [`x<sup>2</sup> − y<sup>2</sup> = (x − y)(x + y).`, `Перебери разложения 15 = d · e в целых числах, не забудь отрицательные.`],
        sol: `(x − y)(x + y) = 15. Возможные пары (x − y, x + y): (1, 15), (3, 5), (5, 3), (15, 1) и те же со знаком минус — всего 8. Оба множителя нечётные, поэтому x = (d + e)/2 и y = (e − d)/2 — целые. Ответ: 8 пар.` },
      { id: 'expr-25', lvl: 3, r: 1550, type: 'num', q: `Числа x и y таковы, что x + y = 1. Найдите наибольшее значение произведения xy.`, a: ['0.25', '1/4'],
        hints: [`Вырази y = 1 − x.`, `x(1 − x) = ${fr('1', '4')} − (x − ${fr('1', '2')})<sup>2</sup>.`],
        sol: `xy = x(1 − x) = ${fr('1', '4')} − (x − ${fr('1', '2')})<sup>2</sup> ≤ ${fr('1', '4')}, равенство при x = y = ${fr('1', '2')}.` },
      { id: 'expr-26', lvl: 3, r: 1580, type: 'num', q: `Известно, что a − b = 3 и a<sup>2</sup> + b<sup>2</sup> = 29. Найдите a<sup>3</sup> − b<sup>3</sup>.`, a: ['117'],
        hints: [`Сначала найди ab: (a − b)<sup>2</sup> = a<sup>2</sup> + b<sup>2</sup> − 2ab.`, `a<sup>3</sup> − b<sup>3</sup> = (a − b)(a<sup>2</sup> + ab + b<sup>2</sup>).`],
        sol: `9 = 29 − 2ab, значит ab = 10. Тогда a<sup>3</sup> − b<sup>3</sup> = 3 · (29 + 10) = 117.` },
      { id: 'expr-27', lvl: 3, r: 1610, type: 'num', q: `Найдите значение выражения ${fr('x<sup>4</sup> + x<sup>2</sup> + 1', 'x<sup>2</sup> + x + 1')} при x = 10.`, a: ['91'],
        hints: [`Числитель раскладывается на множители, и один из них — знаменатель.`, `x<sup>4</sup> + x<sup>2</sup> + 1 = (x<sup>2</sup> + 1)<sup>2</sup> − x<sup>2</sup>.`],
        sol: `x<sup>4</sup> + x<sup>2</sup> + 1 = (x<sup>2</sup> + 1)<sup>2</sup> − x<sup>2</sup> = (x<sup>2</sup> − x + 1)(x<sup>2</sup> + x + 1), поэтому дробь равна x<sup>2</sup> − x + 1 = 100 − 10 + 1 = 91.` },
      { id: 'expr-28', lvl: 3, r: 1640, type: 'num', q: `Вычислите ${fr('2026<sup>3</sup> − 2025<sup>3</sup> − 1', '2026 · 2025')}.`, a: ['3'],
        hints: [`Обозначь a = 2025, тогда 2026 = a + 1.`, `(a + 1)<sup>3</sup> − a<sup>3</sup> − 1 = 3a<sup>2</sup> + 3a.`],
        sol: `При a = 2025: (a + 1)<sup>3</sup> − a<sup>3</sup> − 1 = 3a<sup>2</sup> + 3a = 3a(a + 1), а знаменатель равен a(a + 1). Ответ 3.` },

      // ── Уровень 4 · Финал ──
      { id: 'expr-29', lvl: 4, r: 1680, type: 'proof', q: `Докажите тождество (a<sup>2</sup> + b<sup>2</sup>)(c<sup>2</sup> + d<sup>2</sup>) = (ac − bd)<sup>2</sup> + (ad + bc)<sup>2</sup>.`,
        note: `Следствие: произведение двух сумм двух квадратов — снова сумма двух квадратов.`,
        hints: [`Раскрой скобки в обеих частях.`, `Справа удвоенные произведения −2abcd и +2abcd сокращаются.`],
        sol: `Левая часть: a<sup>2</sup>c<sup>2</sup> + a<sup>2</sup>d<sup>2</sup> + b<sup>2</sup>c<sup>2</sup> + b<sup>2</sup>d<sup>2</sup>. Правая: a<sup>2</sup>c<sup>2</sup> − 2abcd + b<sup>2</sup>d<sup>2</sup> + a<sup>2</sup>d<sup>2</sup> + 2abcd + b<sup>2</sup>c<sup>2</sup> = a<sup>2</sup>c<sup>2</sup> + a<sup>2</sup>d<sup>2</sup> + b<sup>2</sup>c<sup>2</sup> + b<sup>2</sup>d<sup>2</sup>. Части равны.`,
        rubric: [[2, `Верно раскрыта левая часть`], [3, `Верно раскрыта правая часть, удвоенные произведения сокращаются`], [2, `Части сравнены, вывод`]] },
      { id: 'expr-30', lvl: 4, r: 1710, type: 'proof', q: `Докажите, что при любых действительных a и b выполняется a<sup>2</sup> + b<sup>2</sup> ≥ 2ab. Выведите отсюда, что x + ${fr('1', 'x')} ≥ 2 при x > 0.`,
        hints: [`Перенеси всё в одну сторону.`, `a<sup>2</sup> − 2ab + b<sup>2</sup> = (a − b)<sup>2</sup>.`, `Во второй части умножь неравенство на x > 0 или приведи к общему знаменателю.`],
        sol: `a<sup>2</sup> + b<sup>2</sup> − 2ab = (a − b)<sup>2</sup> ≥ 0. При x > 0: x + ${fr('1', 'x')} − 2 = ${fr('x<sup>2</sup> − 2x + 1', 'x')} = ${fr('(x − 1)<sup>2</sup>', 'x')} ≥ 0, потому что числитель неотрицателен, а знаменатель положителен. Равенство только при x = 1.`,
        rubric: [[3, `a<sup>2</sup> + b<sup>2</sup> − 2ab = (a − b)<sup>2</sup> ≥ 0`], [3, `Обоснован переход к x + 1/x ≥ 2, использовано x > 0`], [1, `Вывод или случай равенства`]] },
      { id: 'expr-31', lvl: 4, r: 1750, type: 'proof', q: `Докажите, что произведение четырёх последовательных натуральных чисел, увеличенное на 1, является точным квадратом.`,
        hints: [`Обозначь числа n, n + 1, n + 2, n + 3.`, `Перемножь крайние и средние: n(n + 3) и (n + 1)(n + 2).`, `Обозначь t = n<sup>2</sup> + 3n.`],
        sol: `n(n + 3) = n<sup>2</sup> + 3n = t и (n + 1)(n + 2) = n<sup>2</sup> + 3n + 2 = t + 2. Тогда произведение плюс 1 равно t(t + 2) + 1 = t<sup>2</sup> + 2t + 1 = (t + 1)<sup>2</sup> = (n<sup>2</sup> + 3n + 1)<sup>2</sup>.`,
        rubric: [[2, `Удачная группировка: n(n + 3) и (n + 1)(n + 2)`], [3, `Замена и преобразование к (t + 1)<sup>2</sup>`], [2, `Ответ в виде (n<sup>2</sup> + 3n + 1)<sup>2</sup> и вывод`]] },
      { id: 'expr-32', lvl: 4, r: 1790, type: 'proof', q: `Докажите, что если a + b + c = 0, то a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> = 3abc.`,
        hints: [`Вырази c = −(a + b).`, `Посчитай a<sup>3</sup> + b<sup>3</sup> − (a + b)<sup>3</sup>.`],
        sol: `c = −(a + b), поэтому a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> = a<sup>3</sup> + b<sup>3</sup> − (a + b)<sup>3</sup> = −3a<sup>2</sup>b − 3ab<sup>2</sup> = −3ab(a + b) = 3abc.`,
        rubric: [[2, `Выражено c = −(a + b) или использовано тождество для a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> − 3abc`], [4, `Верное преобразование`], [1, `Вывод`]] },
      { id: 'expr-33', lvl: 4, r: 1840, type: 'proof', q: `Докажите, что число 2<sup>10</sup> + 5<sup>12</sup> составное.`,
        hints: [`Попробуй записать число в виде a<sup>4</sup> + 4b<sup>4</sup>.`, `5<sup>12</sup> = (5<sup>3</sup>)<sup>4</sup>, а 2<sup>10</sup> = 4 · 2<sup>8</sup> = 4 · 4<sup>4</sup>.`, `Тождество Софи Жермен.`],
        sol: `5<sup>12</sup> = 125<sup>4</sup>, 2<sup>10</sup> = 4 · 4<sup>4</sup>. По тождеству Софи Жермен с a = 125, b = 4 число равно (125<sup>2</sup> + 32 + 1000)(125<sup>2</sup> + 32 − 1000) = 16657 · 14657. Оба множителя больше 1, значит число составное.`,
        rubric: [[3, `Число записано в виде a<sup>4</sup> + 4b<sup>4</sup>`], [2, `Применено тождество Софи Жермен`], [2, `Показано, что оба множителя больше 1`]] },
      { id: 'expr-34', lvl: 4, r: 1890, type: 'proof', q: `Разложите выражение a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> − 3abc на множители и докажите, что при неотрицательных a, b, c оно неотрицательно.`,
        hints: [`Используй a<sup>3</sup> + b<sup>3</sup> = (a + b)<sup>3</sup> − 3ab(a + b) и обозначь s = a + b.`, `Должно получиться (a + b + c)(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca).`, `a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca = ½((a − b)<sup>2</sup> + (b − c)<sup>2</sup> + (c − a)<sup>2</sup>).`],
        sol: `Пусть s = a + b. Тогда a<sup>3</sup> + b<sup>3</sup> + c<sup>3</sup> − 3abc = s<sup>3</sup> − 3abs + c<sup>3</sup> − 3abc = (s<sup>3</sup> + c<sup>3</sup>) − 3ab(s + c) = (s + c)(s<sup>2</sup> − sc + c<sup>2</sup> − 3ab). Подставляя s = a + b, получаем (a + b + c)(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca). Второй множитель равен ½((a − b)<sup>2</sup> + (b − c)<sup>2</sup> + (c − a)<sup>2</sup>) ≥ 0, первый неотрицателен при неотрицательных a, b, c. Значит, произведение неотрицательно.`,
        rubric: [[3, `Получено разложение (a + b + c)(a<sup>2</sup> + b<sup>2</sup> + c<sup>2</sup> − ab − bc − ca)`], [3, `Второй множитель записан как полусумма квадратов`], [1, `Вывод о знаке`]] },
      { id: 'expr-35', lvl: 4, r: 1940, type: 'proof', q: `Докажите тождество (a + b + c)<sup>3</sup> − a<sup>3</sup> − b<sup>3</sup> − c<sup>3</sup> = 3(a + b)(b + c)(c + a).`,
        hints: [`Сгруппируй: ((a + b + c)<sup>3</sup> − a<sup>3</sup>) − (b<sup>3</sup> + c<sup>3</sup>). Обе скобки делятся на b + c.`, `Другой путь: левая часть обращается в ноль при a = −b, значит делится на a + b, а по симметрии — на b + c и c + a.`, `Числовой множитель найди, подставив a = b = c = 1.`],
        sol: `(a + b + c)<sup>3</sup> − a<sup>3</sup> = (b + c)((a + b + c)<sup>2</sup> + (a + b + c)a + a<sup>2</sup>), а b<sup>3</sup> + c<sup>3</sup> = (b + c)(b<sup>2</sup> − bc + c<sup>2</sup>). Вынесем b + c: во второй скобке останется (a + b + c)<sup>2</sup> + (a + b + c)a + a<sup>2</sup> − b<sup>2</sup> + bc − c<sup>2</sup> = 3a<sup>2</sup> + 3ab + 3ac + 3bc = 3(a + b)(a + c). Итого 3(a + b)(b + c)(c + a).`,
        rubric: [[2, `Начата группировка через разность или сумму кубов, или замечена делимость на (a + b)(b + c)(c + a)`], [3, `Основное преобразование выполнено верно`], [2, `Найден коэффициент 3, вывод`]] },
      { id: 'expr-36', lvl: 4, r: 1980, type: 'proof', q: `Докажите, что при любом натуральном n число n<sup>5</sup> − 5n<sup>3</sup> + 4n делится на 120.`,
        hints: [`Вынеси n и разложи n<sup>4</sup> − 5n<sup>2</sup> + 4 на множители.`, `n<sup>4</sup> − 5n<sup>2</sup> + 4 = (n<sup>2</sup> − 1)(n<sup>2</sup> − 4).`, `Получится произведение пяти последовательных чисел.`],
        sol: `n<sup>5</sup> − 5n<sup>3</sup> + 4n = n(n<sup>2</sup> − 1)(n<sup>2</sup> − 4) = (n − 2)(n − 1)n(n + 1)(n + 2) — произведение пяти последовательных целых чисел. Среди них есть число, кратное 5, число, кратное 3, и хотя бы два чётных, причём одно из двух соседних чётных делится на 4, — значит, произведение делится на 8. Числа 8, 3 и 5 взаимно просты, поэтому произведение делится на 120.`,
        rubric: [[3, `Разложение в произведение пяти последовательных чисел`], [3, `Обоснована делимость на 8, 3 и 5`], [1, `Вывод: 8, 3, 5 взаимно просты`]] },

      // ── Уровень 5 · Международный ──
      { id: 'expr-37', lvl: 5, r: 2050, type: 'proof', q: `Найдите все пары действительных чисел (x, y), для которых x<sup>2</sup> + y<sup>2</sup> + 1 = xy + x + y, и докажите, что других нет.`,
        hints: [`Перенеси всё в одну сторону и умножь на 2.`, `Сгруппируй в сумму трёх квадратов.`],
        sol: `Умножим на 2 и перенесём: 2x<sup>2</sup> + 2y<sup>2</sup> + 2 − 2xy − 2x − 2y = 0, то есть (x − y)<sup>2</sup> + (x − 1)<sup>2</sup> + (y − 1)<sup>2</sup> = 0. Сумма квадратов равна нулю, только если каждый равен нулю: x = y = 1. Проверка: 1 + 1 + 1 = 1 + 1 + 1. Ответ: (1, 1).`,
        rubric: [[2, `Умножение на 2 и перенос в одну сторону`], [3, `Запись в виде суммы трёх квадратов`], [2, `Вывод x = y = 1 и проверка`]] },
      { id: 'expr-38', lvl: 5, r: 2150, type: 'proof', q: `Действительные числа a, b, c таковы, что abc = 1 и a + b + c = ${fr('1', 'a')} + ${fr('1', 'b')} + ${fr('1', 'c')}. Докажите, что хотя бы одно из чисел a, b, c равно 1.`,
        hints: [`При abc = 1 имеем 1/a = bc, 1/b = ca, 1/c = ab.`, `Раскрой (a − 1)(b − 1)(c − 1).`],
        sol: `Так как abc = 1, то ${fr('1', 'a')} + ${fr('1', 'b')} + ${fr('1', 'c')} = bc + ca + ab, и условие даёт a + b + c = ab + bc + ca. Тогда (a − 1)(b − 1)(c − 1) = abc − (ab + bc + ca) + (a + b + c) − 1 = 1 − 1 = 0. Значит, один из множителей равен нулю, то есть одно из чисел равно 1.`,
        rubric: [[2, `Замечено 1/a + 1/b + 1/c = ab + bc + ca`], [3, `Раскрыто (a − 1)(b − 1)(c − 1) и показано, что оно равно 0`], [2, `Вывод`]] },
      { id: 'expr-39', lvl: 5, r: 2250, type: 'proof', q: `Докажите, что (x + y + z)<sup>5</sup> − x<sup>5</sup> − y<sup>5</sup> − z<sup>5</sup> = 5(x + y)(y + z)(z + x)(x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup> + xy + yz + zx).`,
        hints: [`Левая часть обращается в ноль при x = −y. Значит, она делится на x + y, а по симметрии — на (y + z)(z + x).`, `Частное — симметрический многочлен второй степени: A(x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>) + B(xy + yz + zx).`, `Найди A и B, подставив, например, x = y = 1, z = 0 и x = y = z = 1.`],
        sol: `Обозначим левую часть через P. Она симметрична, а при x = −y равна z<sup>5</sup> − z<sup>5</sup> = 0, поэтому делится на x + y, а по симметрии — на y + z и z + x. Частное имеет степень 2 и симметрично: A(x<sup>2</sup> + y<sup>2</sup> + z<sup>2</sup>) + B(xy + yz + zx). При x = y = 1, z = 0: P = 32 − 2 = 30, (x + y)(y + z)(z + x) = 2, значит 2A + B = 15. При x = y = z = 1: P = 243 − 3 = 240, произведение равно 8, значит 3A + 3B = 30. Отсюда A = B = 5, что и даёт нужное тождество.`,
        rubric: [[2, `Обоснована делимость на (x + y)(y + z)(z + x)`], [2, `Вид частного: симметрический многочлен второй степени`], [2, `Найдены коэффициенты`], [1, `Итоговое тождество`]] },
      { id: 'expr-40', lvl: 5, r: 2350, type: 'proof', q: `Докажите, что число ${fr('5<sup>125</sup> − 1', '5<sup>25</sup> − 1')} составное.`,
        hints: [`Обозначь x = 5<sup>25</sup>. Тогда дробь равна x<sup>4</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1.`, `Проверь, что x<sup>4</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1 = (x<sup>2</sup> + 3x + 1)<sup>2</sup> − 5x(x + 1)<sup>2</sup>.`, `5x = 5<sup>26</sup> = (5<sup>13</sup>)<sup>2</sup> — полный квадрат, значит получилась разность квадратов.`],
        sol: `Пусть x = 5<sup>25</sup>, тогда дробь равна x<sup>4</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1. Раскрывая, проверяем: (x<sup>2</sup> + 3x + 1)<sup>2</sup> − 5x(x + 1)<sup>2</sup> = x<sup>4</sup> + 6x<sup>3</sup> + 11x<sup>2</sup> + 6x + 1 − 5x<sup>3</sup> − 10x<sup>2</sup> − 5x = x<sup>4</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1. Так как 5x = (5<sup>13</sup>)<sup>2</sup>, число равно (x<sup>2</sup> + 3x + 1 − 5<sup>13</sup>(x + 1))(x<sup>2</sup> + 3x + 1 + 5<sup>13</sup>(x + 1)). Меньший множитель больше 1: x<sup>2</sup> + 3x + 1 − 5<sup>13</sup>(x + 1) > x<sup>2</sup> − 2 · 5<sup>13</sup> · x = x(x − 2 · 5<sup>13</sup>) > 1, ведь x = 5<sup>25</sup> гораздо больше 2 · 5<sup>13</sup>. Значит, число составное.`,
        rubric: [[2, `Замена x = 5<sup>25</sup> и вид x<sup>4</sup> + x<sup>3</sup> + x<sup>2</sup> + x + 1`], [3, `Представление в виде разности квадратов`], [2, `Доказано, что оба множителя больше 1`]] }
    ]
  });
})();

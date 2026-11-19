"""Сборка MIT mission.

Берёт app/src/app.html и вставляет на место метки <!--@CONTENT@--> файлы с уроками и задачами
из app/content в порядке CONTENT_FILES. Делает две версии:

  docs/index.html        — сайт для GitHub Pages. В странице только ядро (CORE_FILES) и оглавление тем;
                           каждая тема лежит в docs/t/<тема>.<хеш>.js и подгружается, когда нужна (F3).
                           Оглавление собирает tools/topic-index.js, поэтому для сборки нужен Node.js.
  dist/mit-mission.html  — предпросмотр одним файлом (фрагмент страницы, без <html> и <head>), всё внутри.

Запуск:  python app/build.py
"""
import hashlib
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT_FILES = ["roadmap.js", "_fig.js", "diagnostic.js", "b-arith.js", "b-frac.js", "b-dec.js", "b-neg.js", "b-ratio.js", "b-word.js", "b-geo.js", "alg-lin.js", "alg-lin-deep.js", "divisibility.js", "div-deep.js", "alg-expr.js", "alg-expr-deep.js", "proof.js", "proof-deep.js", "tri.js", "tri-deep.js", "alg-quad.js", "alg-quad-deep.js", "count.js", "count-deep.js", "cong.js", "cong-deep.js", "circ.js", "circ-deep.js", "pigeon.js", "pigeon-deep.js"]
CORE_FILES = ["roadmap.js", "_fig.js", "diagnostic.js"]  # всегда в странице; остальные файлы — темы
KEEP_OLD = 2  # сколько прежних версий файла темы оставлять в docs/t
MARK = "<!--@CONTENT@-->"
ROOT_DIV = '<div id="root"></div>'

FAVICON = (
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Ccircle cx='16' cy='16' r='11' fill='%23D7A42B'/%3E%3C/svg%3E"
)
HEAD_EXTRA = f"""<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="description" content="Тренажёр олимпиадной математики для подготовки к Республиканской олимпиаде (RFO).">
<meta name="theme-color" content="#F1F2F4" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0D1015" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{FAVICON}">
<style>:root{{color-scheme:light;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}}body{{margin:0}}img{{max-width:100%}}[hidden]{{display:none!important}}</style>
"""


def shell() -> str:
    text = (ROOT / "src" / "app.html").read_text(encoding="utf-8")
    if text.count(MARK) != 1:
        raise SystemExit("В app.html должна быть ровно одна метка " + MARK)
    return text


def content_js(name: str) -> str:
    js = (ROOT / "content" / name).read_text(encoding="utf-8")
    if "</script" in js.lower():
        raise SystemExit(f"{name}: в тексте не должно быть </script>")
    # знак «делит» в наклонных формулах похож на косую черту — ставим его прямо
    return js.replace("∣", '<span class="dv">∣</span>')


def script(name: str) -> str:
    return f"<script>\n// ---- content/{name} ----\n{content_js(name)}\n</script>"


def assemble() -> str:
    """Всё содержание внутри страницы — для предпросмотра."""
    return shell().replace(MARK, "\n".join(script(n) for n in CONTENT_FILES))


def topic_index() -> list:
    """Оглавление тем: всё, кроме текстов уроков, подсказок, решений и критериев."""
    run = subprocess.run(["node", str(ROOT / "tools" / "topic-index.js"), *CONTENT_FILES],
                         capture_output=True, text=True, encoding="utf-8")
    if run.returncode != 0:
        raise SystemExit("topic-index.js: " + run.stderr)
    stubs = json.loads(run.stdout)
    used = [f for t in stubs for f in t["files"]]
    for f in CORE_FILES:
        if f in used:
            raise SystemExit(f"{f} в CORE_FILES, но добавляет тему")
    for f in CONTENT_FILES:
        if f not in CORE_FILES and f not in used:
            raise SystemExit(f"{f} не относится ни к одной теме и не входит в CORE_FILES")
    return stubs


def assemble_site(out: Path) -> str:
    """Ядро и оглавление в странице, темы — отдельными файлами в out/t.

    Браузер может держать в кэше старую страницу (GitHub Pages — до 10 минут), а она ссылается
    на старые файлы тем. Поэтому для каждой темы храним текущий файл и KEEP_OLD предыдущих.
    """
    tdir = out / "t"
    tdir.mkdir(parents=True, exist_ok=True)
    stubs = topic_index()
    for t in stubs:
        files = t.pop("files")
        bundle = "\n".join(f"// ---- content/{f} ----\n{content_js(f)}" for f in files) + "\n"
        digest = hashlib.sha256(bundle.encode("utf-8")).hexdigest()[:10]
        name = f"t/{t['id']}.{digest}.js"
        (out / name).write_text(bundle, encoding="utf-8", newline="\n")
        t["src"] = name
        old = sorted((p for p in tdir.glob(f"{t['id']}.*.js") if p.name != Path(name).name and p.name.count(".") == 2),
                     key=lambda p: p.stat().st_mtime, reverse=True)
        for p in old[KEEP_OLD:]:
            p.unlink()
    data = json.dumps(stubs, ensure_ascii=False, separators=(",", ":")).replace("</", "<\\/")
    blocks = [script(n) for n in CORE_FILES]
    blocks.append("<script>\n// ---- оглавление тем (tools/topic-index.js) ----\nMM.addStubs(" + data + ");\n</script>")
    size = sum((out / t["src"]).stat().st_size for t in stubs) // 1024
    print(f"topics: {len(stubs)} files in {tdir.relative_to(ROOT.parent)} ({size} KB)")
    return shell().replace(MARK, "\n".join(blocks))


def standalone(fragment: str) -> str:
    i = fragment.index(ROOT_DIV)
    head, body = fragment[:i], fragment[i:]
    head = head.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', "")
    return ("<!doctype html>\n<html lang=\"ru\">\n<head>\n" + HEAD_EXTRA + head.strip() +
            "\n</head>\n<body>\n" + body.strip() + "\n</body>\n</html>\n")


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")
    print(f"built {path.relative_to(ROOT.parent)} ({len(text.encode('utf-8')) // 1024} KB)")


def main() -> None:
    write(ROOT / "dist" / "mit-mission.html", assemble())
    docs = ROOT / "docs"
    write(docs / "index.html", standalone(assemble_site(docs)))
    (docs / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()

"""Сборка MIT mission.

Берёт app/src/app.html и вставляет на место метки <!--@CONTENT@--> файлы с уроками и задачами
из app/content в порядке CONTENT_FILES. Делает две версии:

  docs/index.html        — самостоятельный сайт для GitHub Pages (полный HTML-документ);
  dist/mit-mission.html  — предпросмотр (фрагмент страницы, без <html> и <head>).

Запуск:  python app/build.py
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT_FILES = ["roadmap.js", "_fig.js", "diagnostic.js", "divisibility.js", "div-deep.js", "alg-expr.js", "alg-expr-deep.js", "proof.js", "proof-deep.js", "tri.js"]
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


def assemble() -> str:
    shell = (ROOT / "src" / "app.html").read_text(encoding="utf-8")
    if shell.count(MARK) != 1:
        raise SystemExit("В app.html должна быть ровно одна метка " + MARK)
    blocks = []
    for name in CONTENT_FILES:
        js = (ROOT / "content" / name).read_text(encoding="utf-8")
        if "</script" in js.lower():
            raise SystemExit(f"{name}: в тексте не должно быть </script>")
        # знак «делит» в наклонных формулах похож на косую черту — ставим его прямо
        js = js.replace("∣", '<span class="dv">∣</span>')
        blocks.append(f"<script>\n// ---- content/{name} ----\n{js}\n</script>")
    return shell.replace(MARK, "\n".join(blocks))


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
    fragment = assemble()
    write(ROOT / "dist" / "mit-mission.html", fragment)
    write(ROOT / "docs" / "index.html", standalone(fragment))
    (ROOT / "docs" / ".nojekyll").write_text("", encoding="utf-8")


if __name__ == "__main__":
    main()

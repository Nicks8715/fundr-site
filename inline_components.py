#!/usr/bin/env python3
"""Bakes _components/header.html and _components/footer.html into every page,
so search engines and AI crawlers (which often don't run JavaScript) can see
your navigation and footer links.

Run from the site root, then commit as normal:
    python3 inline_components.py

Safe to re-run. Re-run it whenever you edit header.html or footer.html.
Pages without a header/footer placeholder are left untouched.
shared.js keeps working: it still loads the components and wires up the
menus, it just replaces identical HTML.
"""
import re, sys, pathlib

root = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else '.').resolve()
comp = root / '_components'
parts = {n: (comp / f'{n}.html').read_text(encoding='utf-8').strip() for n in ('header', 'footer')}

changed = unchanged = skipped = 0
for path in sorted(root.rglob('*.html')):
    rel = path.relative_to(root)
    if rel.parts[0].startswith(('_', '.')) or 'node_modules' in rel.parts:
        continue
    s = orig = path.read_text(encoding='utf-8')
    for name, html in parts.items():
        pid, start, end = f'{name}-placeholder', f'<!--ssr:{name}-->', f'<!--/ssr:{name}-->'
        pat = re.compile(rf'<div id="{pid}">(?:{re.escape(start)}.*?{re.escape(end)})?</div>', re.S)
        block = f'<div id="{pid}">{start}\n{html}\n{end}</div>'
        s = pat.sub(lambda m: block, s)
    if '<!--ssr:header-->' not in s and '<!--ssr:footer-->' not in s:
        skipped += 1
    elif s != orig:
        path.write_text(s, encoding='utf-8'); changed += 1
    else:
        unchanged += 1
print(f'updated {changed} page(s), {unchanged} already current, {skipped} without placeholders')

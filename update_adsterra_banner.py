from pathlib import Path

BANNER = '<a href="https://beta.publishers.adsterra.com/referral/9WUsAGQ1Jm" rel="nofollow" class="btn primary" style="text-align: center;"><b><u>ADSTERRA</u></b>: start monetizing to Your website easy & reliable</a>'

root = Path('.').resolve()
updated = []
for path in sorted(root.glob('*.html')):
    text = path.read_text(encoding='utf-8')
    if BANNER in text:
        continue
    idx = text.find('<section class="ads-wall">')
    if idx == -1:
        continue
    text = text[:idx] + BANNER + '\n\n' + text[idx:]
    path.write_text(text, encoding='utf-8')
    updated.append(path.name)
    print(f'Updated {path.name}')
print(f'Done. Total updated: {len(updated)}')

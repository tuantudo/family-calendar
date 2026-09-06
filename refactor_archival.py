import re

with open('src/css/main.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Update Core Color Variables for a True Archival Look
css = css.replace('--bg: #F7F5F0;', '--bg: #FAF9F5;')
css = css.replace('--surface: #FFFFFF;', '--surface: #FFFFFF;')
css = css.replace('--surface-subtle: #F9F8F5;', '--surface-subtle: #F2F0E9;')
css = css.replace('--text-main: #241E19;', '--text-main: #1A1A1A;')
css = css.replace('--text-muted: #665E55;', '--text-muted: #5C5B5A;')
css = css.replace('--border: #E5E0D6;', '--border: #E8E6DF;')
css = css.replace('--border-subtle: #EFECE6;', '--border-subtle: #F0EFE9;')
css = css.replace('--primary: #881337;', '--primary: #8A2D23;')

# 2. Flatten Navbar
css = css.replace('background: rgba(255, 255, 255, 0.94);', 'background: var(--bg);')
css = css.replace('backdrop-filter: blur(10px);', '/* backdrop-filter removed */')
css = css.replace('-webkit-backdrop-filter: blur(10px);', '/* webkit-filter removed */')

# 3. Ensure no pill shapes for buttons (nav items, buttons)
css = re.sub(r'border-radius: .*?;', 'border-radius: 0;', css)

with open('src/css/main.css', 'w', encoding='utf-8') as f:
    f.write(css)

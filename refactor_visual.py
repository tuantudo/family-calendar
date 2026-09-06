import re

with open('src/css/main.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Refactor Typography
css = re.sub(r'--font-serif: "Source Serif 4".*?;', '--font-serif: "EB Garamond", "Source Serif 4", serif;', css)
css = re.sub(r'--font-sans: "Be Vietnam Pro".*?;', '--font-sans: "Inter", "Noto Sans", sans-serif;', css)

# Refactor Radiuses to Flat Design (0px)
css = re.sub(r'--radius-xs: .*?;', '--radius-xs: 0px;', css)
css = re.sub(r'--radius-sm: .*?;', '--radius-sm: 0px;', css)
css = re.sub(r'--radius-md: .*?;', '--radius-md: 0px;', css)
css = re.sub(r'--radius-lg: .*?;', '--radius-lg: 0px;', css)
css = re.sub(r'--radius-xl: .*?;', '--radius-xl: 0px;', css)
css = re.sub(r'--radius-pill: .*?;', '--radius-pill: 0px;', css)
# Wait, some specific elements like tree nodes might break if border-radius is entirely 0, but since this is "Archival Design System", sharp nodes are great!

# Refactor Shadows to none
css = re.sub(r'--shadow-xs: .*?;', '--shadow-xs: none;', css)
css = re.sub(r'--shadow-sm: .*?;', '--shadow-sm: none;', css)
css = re.sub(r'--shadow-md: .*?;', '--shadow-md: none;', css)
css = re.sub(r'--shadow-lg: .*?;', '--shadow-lg: none;', css)
css = re.sub(r'--shadow-xl: .*?;', '--shadow-xl: none;', css)

# Make background more archival (already done mostly, but let's ensure body uses it)
# The current body is var(--bg) which is #F7F5F0. This is perfect.

with open('src/css/main.css', 'w', encoding='utf-8') as f:
    f.write(css)

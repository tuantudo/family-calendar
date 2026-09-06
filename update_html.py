with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for i, line in enumerate(lines):
    # Remove the old font-size-controls (from the story view)
    if 'div class="font-size-controls"' in line and i > 400:
        skip = True
        continue
    if skip:
        if '</div>' in line:
            # We assume it takes 5 lines total for the buttons. Let's just do a simple line count check
            pass
        if i >= 454: # The buttons are around 450-455
            skip = False
        continue

    new_lines.append(line)

# Now find where to insert the new global controls
insert_idx = -1
for i, line in enumerate(new_lines):
    if '</ul>' in line and i < 60:
        insert_idx = i + 1
        break

controls_html = """                <div class="font-size-controls" style="margin-left: 8px;" aria-label="Điều chỉnh kích thước chữ">
                    <button class="font-btn" onclick="changeArticleFontSize(-1)" aria-label="Thu nhỏ chữ" title="Thu nhỏ chữ">A−</button>
                    <button class="font-btn" onclick="resetArticleFontSize()" aria-label="Cỡ chữ mặc định" title="Cỡ chữ mặc định">A</button>
                    <button class="font-btn" onclick="changeArticleFontSize(1)" aria-label="Phóng to chữ" title="Phóng to chữ">A+</button>
                </div>
"""
new_lines.insert(insert_idx, controls_html)
# We also need to fix the <nav> style if needed to make it flex row
nav_idx = -1
for i, line in enumerate(new_lines):
    if '<nav>' in line and i < 40:
        new_lines[i] = '            <nav style="display: flex; align-items: center;">\n'
        break

# Also, there's a div wrapper I added earlier in story-header-nav: `<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">` that wrapped the breadcrumb and font controls. Let's remove it if it's there.
# Let's just do it manually with sed after.

with open('index.html.new', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

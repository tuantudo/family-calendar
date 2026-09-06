with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace the <nav> element to have flex styling
html = html.replace('<nav>', '<nav style="display: flex; align-items: center;">')

# 2. Insert the global font controls right after </ul>
controls = """</ul>
                <div class="font-size-controls global-font-controls" style="margin-left: 8px;" aria-label="Điều chỉnh kích thước chữ">
                    <button class="font-btn" onclick="changeArticleFontSize(-1)" aria-label="Thu nhỏ chữ" title="Thu nhỏ chữ">A−</button>
                    <button class="font-btn" onclick="resetArticleFontSize()" aria-label="Cỡ chữ mặc định" title="Cỡ chữ mặc định">A</button>
                    <button class="font-btn" onclick="changeArticleFontSize(1)" aria-label="Phóng to chữ" title="Phóng to chữ">A+</button>
                </div>"""
html = html.replace('</ul>', controls, 1)

# 3. Remove the local font controls block
local_controls = """<div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
                        <div id="storySeriesBreadcrumb" class="story-breadcrumb-badge"></div>
                        <div class="font-size-controls">
                            <button class="font-btn" onclick="changeArticleFontSize(-1)" title="Thu nhỏ chữ">A−</button>
                            <button class="font-btn" onclick="resetArticleFontSize()" title="Cỡ chữ mặc định">A</button>
                            <button class="font-btn" onclick="changeArticleFontSize(1)" title="Phóng to chữ">A+</button>
                        </div>
                    </div>"""
new_local = """<div id="storySeriesBreadcrumb" class="story-breadcrumb-badge"></div>"""

html = html.replace(local_controls, new_local)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

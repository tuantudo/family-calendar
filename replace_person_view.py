import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# New Archival Hub HTML structure
new_view_person = """        <section id="view_person" class="view-section">
            <div class="archival-container">
                <a href="#/gia-pha" class="archival-back" onclick="navigateRoute('/gia-pha')">← Trở về Gia Phả</a>
                
                <header class="entity-hero">
                    <div class="entity-avatar-box">
                        <div class="entity-avatar" id="p_avatar_container">
                            <span class="avatar-placeholder">?</span>
                        </div>
                        <div class="entity-provenance" id="p_provenance_badge"></div>
                    </div>
                    
                    <div class="entity-info">
                        <h1 class="entity-name" id="p_name">Họ Tên</h1>
                        <div class="entity-badges" id="p_badges_container">
                            <!-- JS will inject badges here -->
                        </div>
                        
                        <div class="entity-meta-grid" id="p_meta_grid">
                            <!-- JS will inject birth/death/FSID here -->
                        </div>
                    </div>
                </header>

                <div class="entity-body-grid">
                    <main class="entity-main">
                        <h2>Sự Kiện Trọng Đại</h2>
                        <ul class="timeline-list" id="p_timeline">
                            <!-- Timeline injected by JS -->
                        </ul>
                        
                        <div id="p_memory_box" style="display: none; margin-top: 3rem;">
                            <h2 id="p_memory_title">Ký Ức</h2>
                            <div class="timeline-content" id="p_memory_text" style="white-space: pre-line; line-height: 1.8;"></div>
                        </div>
                    </main>
                    
                    <aside class="entity-sidebar">
                        <div id="p_relatives">
                            <!-- Relationship cards injected by JS -->
                        </div>
                    </aside>
                </div>
            </div>
        </section>"""

# Replace the content of view_person
pattern = r'<section id="view_person" class="view-section">.*?(?=<!-- \d+\. )'
html = re.sub(pattern, new_view_person + '\n\n        ', html, flags=re.DOTALL)

# Handle CSS inclusions
if 'tufte.css' in html:
    html = html.replace('<link rel="stylesheet" href="src/css/tufte.css">\n    ', '')
if 'archival.css' not in html:
    html = html.replace('<link rel="stylesheet" href="src/css/main.css?v=20260906_0100">', 
                        '<link rel="stylesheet" href="src/css/main.css?v=20260906_0100">\n    <link rel="stylesheet" href="src/css/archival.css">')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

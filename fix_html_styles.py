import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# I will replace some inline styles in view_person with classes.
# But actually, writing a Python regex might be fragile. Let's just create a completely new view_person HTML string, as the current one is very short.

new_view_person = """
        <section id="view_person" class="view-section">
            <div class="profile-header-nav">
                <button class="back-link-btn" onclick="navigateRoute('/tree')">← Cây Phả Hệ</button>
                <button class="back-link-btn" onclick="navigateRoute('/people')">← Danh bạ</button>
            </div>
            
            <div class="archival-container" id="personProfileContainer">
                <header class="entity-hero">
                    <div class="entity-avatar-box">
                        <div class="entity-avatar" id="p_avatar_container">
                            <span class="profile-avatar-fallback" id="p_avatar_fallback"></span>
                        </div>
                        <div class="entity-provenance" id="p_provenance_badge"></div>
                    </div>
                    
                    <div class="entity-info">
                        <h1 class="entity-name" id="p_name"></h1>
                        <div class="entity-badges" id="p_gender_status"></div>
                        <div class="entity-meta-grid">
                            <div class="meta-item">
                                <span class="meta-label">FSID</span>
                                <span class="meta-value" id="p_fsid"></span>
                            </div>
                        </div>
                    </div>
                </header>

                <div class="entity-body-grid">
                    <main class="entity-main">
                        <h2 class="section-heading">Tiểu Sử & Sự Kiện</h2>
                        <div class="timeline-content" id="p_facts"></div>
                        
                        <div id="p_memory_box" style="display: none; margin-top: 2rem;">
                            <h2 class="section-heading" id="p_memory_title">Ký Ức</h2>
                            <div class="timeline-content" id="p_memory_text" style="white-space: pre-line;"></div>
                        </div>
                    </main>
                    
                    <aside class="entity-sidebar">
                        <h2 class="section-heading">Gia Đình</h2>
                        <div id="p_relatives"></div>
                    </aside>
                </div>
            </div>
        </section>
"""

html = re.sub(r'<section id="view_person".*?</section>', new_view_person.strip(), html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

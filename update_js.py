with open('src/js/app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace factsHtml generation
old_facts = '''    let factsHtml = `<div>• <strong>Ngày sinh:</strong> ${p.birth && p.birth.date ? p.birth.date : 'Chưa có dữ kiện'} ${p.birth && p.birth.place ? `(${p.birth.place})` : ''}</div>`;
    factsHtml += `<div>• <strong>Ngày qua đời:</strong> ${p.death && p.death.date ? p.death.date : 'Chưa có dữ kiện'} ${p.death && p.death.place ? `(${p.death.place})` : ''}</div>`;
    if (p.baptism && p.baptism.date) factsHtml += `<div>• <strong>Bí tích Rửa Tội:</strong> ${p.baptism.date}</div>`;'''

new_facts = '''    let factsHtml = `<ul><li><strong>Ngày sinh:</strong> ${p.birth && p.birth.date ? p.birth.date : 'Chưa có dữ kiện'} ${p.birth && p.birth.place ? `(${p.birth.place})` : ''}</li>`;
    factsHtml += `<li><strong>Ngày qua đời:</strong> ${p.death && p.death.date ? p.death.date : 'Chưa có dữ kiện'} ${p.death && p.death.place ? `(${p.death.place})` : ''}</li>`;
    if (p.baptism && p.baptism.date) factsHtml += `<li><strong>Bí tích Rửa Tội:</strong> ${p.baptism.date}</li>`;
    factsHtml += `</ul>`;'''

js = js.replace(old_facts, new_facts)

# Remove the inline styles from relatives headers
js = js.replace('''<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-bottom:6px;">Thân Phụ / Thân Mẫu:</div>''', '''<h3>Thân Phụ / Thân Mẫu:</h3><p>''')
js = js.replace('''<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Hôn Phối:</div>''', '''</p><h3>Hôn Phối:</h3><p>''')
js = js.replace('''<div style="font-weight:700; font-size:13px; color:var(--text-muted); margin-top:10px; margin-bottom:6px;">Con cái:</div>''', '''</p><h3>Con cái:</h3><p>''')

# Close the trailing <p> in relsHtml
js = js.replace('''if (p.children.length > 0) {
        p.children.sort((a, b) => {''', '''if (p.children.length > 0) {
        p.children.sort((a, b) => {''') # finding where to close is tricky. I'll just append </p> before assigning to pRels.innerHTML

js = js.replace('if (pRels) pRels.innerHTML = relsHtml;', 'if (pRels) pRels.innerHTML = relsHtml + "</p>";')

with open('src/js/app.js', 'w', encoding='utf-8') as f:
    f.write(js)

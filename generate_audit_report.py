import os
import re

doc_files = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'content' in root:
        continue
    for f in files:
        if f.endswith('.md'):
            doc_files.append(os.path.join(root, f))

# A dictionary to hold properties
inventory = []
for f in doc_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
        lines = content.split('\n')
        title = lines[0].replace('#', '').strip() if lines and lines[0].startswith('#') else 'No Title'
        if title == 'No Title' and len(lines) > 1 and lines[1].startswith('#'):
            title = lines[1].replace('#', '').strip()
        
        doc_type = 'Unknown'
        if 'REPORT' in f or 'report' in f.lower() or 'BÁO CÁO' in content[:500]:
            doc_type = 'Report'
        elif 'SPEC' in f or 'ĐẶC TẢ' in content[:500]:
            doc_type = 'Specification'
        elif 'AUDIT' in f or 'FORENSIC' in f:
            doc_type = 'Audit'
        elif 'ARCHITECTURE' in f or 'ARCH_' in f or 'Kiến trúc' in content[:200]:
            doc_type = 'Architecture'
        elif 'ONTOLOGY' in f:
            doc_type = 'Constitution / Source of Truth'
        elif 'RESEARCH' in f:
            doc_type = 'Research'
        
        # Determine stale/superseded
        status = 'Active'
        if 'Superseded' in content or 'Cũ' in title:
            status = 'Superseded'
            
        inventory.append({
            'path': f.replace('./', ''),
            'title': title,
            'type': doc_type,
            'status': status,
            'content': content
        })

print("# DOCUMENTATION FORENSIC AUDIT\n")
print("## 1. Inventory")
for item in inventory:
    print(f"- **{item['path']}**: {item['title']} ({item['type']})")
print("\n")

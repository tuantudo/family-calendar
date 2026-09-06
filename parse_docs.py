import os
import glob

docs = []
for root, dirs, files in os.walk('.'):
    if '.git' in root or 'node_modules' in root or 'content' in root:
        continue
    for f in files:
        if f.endswith('.md'):
            docs.append(os.path.join(root, f))

for doc in sorted(docs):
    print(f"=== FILE: {doc} ===")
    with open(doc, 'r', encoding='utf-8') as file:
        content = file.readlines()
        print(''.join(content[:10]).strip())
    print("-" * 50)

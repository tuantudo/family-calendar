import subprocess
import json
import os
import re

def safari_eval(js_code):
    script = f'''tell application "Safari"
        do JavaScript "{js_code.replace('\\', '\\\\').replace('\"', '\\\"')}" in front document
    end tell'''
    res = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    if res.returncode != 0:
        return None, res.stderr
    return res.stdout.strip(), None

def main():
    js = """
    (() => {
        const root = {
            url: window.location.href,
            title: document.title,
            persons: []
        };

        const allLinks = Array.from(document.querySelectorAll('a[href*="/tree/person/"]'));
        const seen = new Set();
        
        for (const a of allLinks) {
            const href = a.href;
            const match = href.match(/\\/tree\\/person(?:\\/details|\\/about|\\/memories)?\\/([A-Z0-9]{4}-[A-Z0-9]{3,4})/);
            if (!match) continue;
            
            const fsId = match[1];
            if (seen.has(fsId)) continue;
            seen.add(fsId);
            
            let container = a.closest('[role="treeitem"]') || a.closest('li') || a.closest('tr') || a.parentElement;
            for (let i = 0; i < 5 && container; i++) {
                if (container.querySelector('img') || container.querySelector('svg')) {
                    break;
                }
                container = container.parentElement;
            }
            
            let name = a.innerText.trim();
            if (!name && container) {
                name = container.innerText.split('\\n')[0].trim();
            }
            
            let imgElements = container ? Array.from(container.querySelectorAll('img')) : [];
            let imgUrls = imgElements.map(img => img.src).filter(src => !src.includes('FSLogo') && !src.includes('familysearch-tree'));
            
            let bgUrls = [];
            if (container) {
                const elsWithStyle = Array.from(container.querySelectorAll('*'));
                for (const el of elsWithStyle) {
                    const style = el.getAttribute('style') || '';
                    const m = style.match(/url\\(['"]?(.*?)['"]?\\)/);
                    if (m && !m[1].includes('FSLogo')) {
                        bgUrls.push(m[1]);
                    }
                }
            }

            let portraitUrl = null;
            let imageSource = "NONE";

            const allCandidateUrls = [...imgUrls, ...bgUrls];
            for (const u of allCandidateUrls) {
                if (u.includes('tree-portraits-pgp.familysearchcdn.org') || u.includes('dascloud/patron')) {
                    portraitUrl = u;
                    imageSource = "FAMILYSEARCH_PORTRAIT";
                    break;
                } else if (u.includes('user-portrait') || u.includes('default-avatar') || u.includes('silhouette') || u.includes('.svg')) {
                    portraitUrl = u;
                    imageSource = "FAMILYSEARCH_GENERATED_AVATAR";
                }
            }

            root.persons.push({
                fsId: fsId,
                name: name,
                personUrl: href,
                imageUrl: portraitUrl,
                imageSource: imageSource,
                domSnippet: container ? container.innerText.substring(0, 150).replace(/\\s+/g, ' ') : ''
            });
        }

        return JSON.stringify(root);
    })()
    """

    out, err = safari_eval(js)
    if err:
        print("Error evaluating JS:", err)
        return
    try:
        data = json.loads(out)
        print(json.dumps(data, ensure_ascii=False, indent=2))
        
        with open("scripts/archive/descendancy_pilot_report.json", "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            
    except Exception as e:
        print("Parse error:", e)
        print("Raw output:", out)

if __name__ == "__main__":
    main()

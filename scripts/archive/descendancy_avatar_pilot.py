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
        const url = window.location.href;
        const isBlocked = document.body && (document.body.innerText.includes('Error 15') || document.body.innerText.includes('Access Denied'));
        if (isBlocked) {
            return JSON.stringify({ status: "BLOCKED", url: url });
        }

        const cards = Array.from(document.querySelectorAll('[data-testid="person"]'));
        const result = {
            source: "FamilySearch Descendancy View",
            url: url,
            persons: []
        };

        const seenFsids = new Set();

        for (const card of cards) {
            const title = card.getAttribute('title') || '';
            const text = card.innerText ? card.innerText.replace(/\\s+/g, ' ').trim() : '';

            // 1. Extract FS Person ID
            let fsId = null;
            const titleMatch = title.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})/);
            if (titleMatch) {
                fsId = titleMatch[1];
            } else {
                const textMatch = text.match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})/);
                if (textMatch) {
                    fsId = textMatch[1];
                }
            }

            if (!fsId || fsId === 'UNKNOWN') {
                continue;
            }

            if (seenFsids.has(fsId)) {
                continue;
            }
            seenFsids.add(fsId);

            // 2. Extract Person Name
            let name = "";
            if (title) {
                name = title.split('\\n')[0].trim();
            } else {
                const link = card.querySelector('a[href*="/tree/person/"]');
                if (link && link.innerText.trim()) {
                    name = link.innerText.trim();
                } else {
                    name = text.split('•')[0].trim();
                }
            }

            // 3. Extract Person URL
            let personUrl = `https://www.familysearch.org/en/tree/person/${fsId}`;
            const link = card.querySelector('a[href*="/tree/person/"]');
            if (link && link.href) {
                personUrl = link.href;
            }

            // 4. Extract Avatar
            const avatarContainer = card.querySelector('[data-testid="normal"], .avatarCss_a9t6mc5, [class*="avatar"]');
            const img = avatarContainer ? avatarContainer.querySelector('img') : card.querySelector('img');
            const svg = avatarContainer ? avatarContainer.querySelector('svg') : card.querySelector('svg');

            let avatarVisible = false;
            let avatarUrl = null;
            let imageType = null;
            let status = "NO_AVATAR";

            if (img && img.src && !img.src.includes('FSLogo') && !img.src.includes('familysearch-tree')) {
                avatarVisible = true;
                avatarUrl = img.src;
                imageType = "PORTRAIT";
                status = "AVATAR_URL_FOUND";
            } else if (svg) {
                avatarVisible = true;
                avatarUrl = null;
                imageType = "GENERATED_AVATAR";
                status = "VISIBLE_BUT_NOT_EXPOSED";
            }

            result.persons.push({
                fsId: fsId,
                name: name,
                personUrl: personUrl,
                avatarVisible: avatarVisible,
                avatarUrl: avatarUrl,
                imageType: imageType,
                status: status
            });
        }

        return JSON.stringify(result);
    })()
    """

    out, err = safari_eval(js)
    if err:
        print("Error evaluating JS:", err)
        return

    try:
        data = json.loads(out)
        if data.get("status") == "BLOCKED":
            print("BLOCKED: FamilySearch Security Error 15 detected.")
            return

        report_path = "scripts/archive/descendancy_avatar_pilot_report.json"
        os.makedirs("scripts/archive", exist_ok=True)
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

        print("==================================================")
        print("DESCENDANCY AVATAR PILOT RESULT")
        print("==================================================")
        print(f"URL: {data.get('url')}")
        print(f"Persons inspected: {len(data.get('persons', []))}")
        
        portraits = [p for p in data.get('persons', []) if p.get('imageType') == 'PORTRAIT']
        generated = [p for p in data.get('persons', []) if p.get('imageType') == 'GENERATED_AVATAR']
        
        print(f"Portraits found (imageType = PORTRAIT): {len(portraits)}")
        print(f"Generated avatars (imageType = GENERATED_AVATAR): {len(generated)}")
        print("==================================================")
        print("Person Avatar Mappings:")
        for p in data.get('persons', []):
            print(f"- [{p['fsId']}] {p['name']}")
            print(f"  Type: {p['imageType']} | Visible: {p['avatarVisible']} | Status: {p['status']}")
            if p['avatarUrl']:
                print(f"  Avatar URL: {p['avatarUrl']}")
        print("==================================================")
        print(f"Report JSON written to: {report_path}")

    except Exception as e:
        print("Error parsing JSON output:", e)
        print("Raw:", out)

if __name__ == "__main__":
    main()

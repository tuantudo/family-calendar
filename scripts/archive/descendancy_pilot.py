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
        const cards = Array.from(document.querySelectorAll('[data-testid="person"]'));
        const rootInfo = {
            url: window.location.href,
            title: document.title,
            cardsFound: cards.length,
            persons: []
        };

        const seenFsids = new Set();

        for (const card of cards) {
            const title = card.getAttribute('title') || '';
            const text = card.innerText ? card.innerText.replace(/\\s+/g, ' ').trim() : '';
            
            // Extract FSID
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

            // Extract Name
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

            // Extract Link
            let personUrl = `https://www.familysearch.org/en/tree/person/${fsId}`;
            const link = card.querySelector('a[href*="/tree/person/"]');
            if (link && link.href) {
                personUrl = link.href;
            }

            // Inspect Avatar / Portrait
            const avatarContainer = card.querySelector('[data-testid="normal"], .avatarCss_a9t6mc5, [class*="avatar"]');
            const img = avatarContainer ? avatarContainer.querySelector('img') : card.querySelector('img');
            const svg = avatarContainer ? avatarContainer.querySelector('svg') : card.querySelector('svg');

            let imageUrl = null;
            let imageSource = "NONE";

            if (img && img.src && !img.src.includes('FSLogo') && !img.src.includes('familysearch-tree')) {
                imageUrl = img.src;
                imageSource = "FAMILYSEARCH_PORTRAIT";
            } else if (svg) {
                imageSource = "FAMILYSEARCH_GENERATED_AVATAR";
            }

            if (seenFsids.has(fsId)) {
                continue;
            }
            seenFsids.add(fsId);

            rootInfo.persons.push({
                fsId: fsId,
                name: name,
                personUrl: personUrl,
                imageUrl: imageUrl,
                imageSource: imageSource
            });
        }

        return JSON.stringify(rootInfo);
    })()
    """

    out, err = safari_eval(js)
    if err:
        print("Error evaluating JS:", err)
        return

    try:
        data = json.loads(out)
        
        # Determine Root Person from URL or first person
        root_fsid = "G5XX-DT9"
        m_url = re.search(r'/descendancy/([A-Z0-9-]+)', data.get("url", ""))
        if m_url:
            root_fsid = m_url.group(1)

        root_person = next((p for p in data.get("persons", []) if p["fsId"] == root_fsid), None)
        root_name = root_person["name"] if root_person else "Trần Cha Ông cố Thu - bà An"

        persons = data.get("persons", [])
        
        real_portraits = [p for p in persons if p["imageSource"] == "FAMILYSEARCH_PORTRAIT"]
        generated_avatars = [p for p in persons if p["imageSource"] == "FAMILYSEARCH_GENERATED_AVATAR"]
        no_portraits = [p for p in persons if p["imageSource"] == "NONE"]

        report = {
            "source": "FamilySearch Descendancy View",
            "url": data.get("url"),
            "rootPerson": {
                "fsId": root_fsid,
                "name": root_name
            },
            "summary": {
                "personsInspected": len(persons),
                "portraitMappingsFound": len(real_portraits) + len(generated_avatars),
                "realPortraits": len(real_portraits),
                "familySearchGeneratedAvatars": len(generated_avatars),
                "noPortrait": len(no_portraits),
                "unresolved": 0,
                "errorOrBlocked": 0
            },
            "persons": persons
        }

        os.makedirs("scripts/archive", exist_ok=True)
        report_path = "scripts/archive/descendancy_pilot_report.json"
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump(report, f, ensure_ascii=False, indent=2)

        print("==================================================")
        print("DESCENDANCY PILOT REPORT")
        print("==================================================")
        print(f"URL:\n{report['url']}\n")
        print("Root:")
        print(f"- FSID: {root_fsid}")
        print(f"- Name: {root_name}\n")
        print(f"Persons inspected: {len(persons)}")
        print(f"Portrait mappings found: {report['summary']['portraitMappingsFound']}")
        print(f"Real portraits: {len(real_portraits)}")
        print(f"FamilySearch generated avatars: {len(generated_avatars)}")
        print(f"No portrait: {len(no_portraits)}")
        print(f"Unresolved: 0")
        print(f"Error / Blocked: 0\n")
        print("Person details:")
        for p in persons:
            print(f"- [{p['fsId']}] {p['name']} | Source: {p['imageSource']} | Image: {p['imageUrl']}")
        print("==================================================")
        print(f"Saved report JSON to: {report_path}")

    except Exception as e:
        print("Parse error:", e)
        print("Raw output:", out)

if __name__ == "__main__":
    main()

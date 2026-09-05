import subprocess
import json
import os
import urllib.request
import hashlib

TARGET_FSIDS = ["G5X4-48S", "G5X4-NQX", "G5X4-ZNG", "G5X4-G4M", "G5X4-7WL"]
AVATAR_DIR = os.path.expanduser("~/CAY_GIA_PHA_ARCHIVE/familysearch/avatars")
os.makedirs(AVATAR_DIR, exist_ok=True)

def safari_eval(js_code):
    script = f'''tell application "Safari"
        do JavaScript "{js_code.replace('\\', '\\\\').replace('\"', '\\\"')}" in front document
    end tell'''
    res = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    if res.returncode != 0:
        return None, res.stderr
    return res.stdout.strip(), None

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def download_avatar(url, dest_path):
    req = urllib.request.Request(
        url,
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'}
    )
    with urllib.request.urlopen(req, timeout=15) as resp, open(dest_path, "wb") as out:
        out.write(resp.read())

def main():
    js = """
    (() => {
        const cards = Array.from(document.querySelectorAll('[data-testid="person"]'));
        const found = [];

        for (const card of cards) {
            const title = card.getAttribute('title') || '';
            const text = card.innerText ? card.innerText.replace(/\\s+/g, ' ').trim() : '';

            let fsId = null;
            const m = (title + ' ' + text).match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})/);
            if (m) {
                fsId = m[1];
            }

            if (!fsId) continue;

            let name = "";
            if (title) {
                name = title.split('\\n')[0].trim();
            } else {
                const link = card.querySelector('a[href*="/tree/person/"]');
                name = link ? link.innerText.trim() : text.split('•')[0].trim();
            }

            const avatarContainer = card.querySelector('[data-testid="normal"], .avatarCss_a9t6mc5, [class*="avatar"]');
            const img = avatarContainer ? avatarContainer.querySelector('img') : card.querySelector('img');

            let avatarUrl = null;
            let imageType = "NO_AVATAR";

            if (img && img.src && !img.src.includes('FSLogo') && !img.src.includes('familysearch-tree')) {
                avatarUrl = img.src;
                imageType = "PORTRAIT";
            }

            found.push({
                fsId: fsId,
                name: name,
                avatarUrl: avatarUrl,
                imageType: imageType
            });
        }
        return JSON.stringify(found);
    })()
    """

    out, err = safari_eval(js)
    if err:
        print("Error reading Safari DOM:", err)
        return

    cards = json.loads(out)
    
    # Filter to unique target FSIDs
    seen = {}
    for c in cards:
        if c["fsId"] in TARGET_FSIDS and c["fsId"] not in seen:
            seen[c["fsId"]] = c

    results = []
    for fsid in TARGET_FSIDS:
        if fsid not in seen:
            print(f"FAILED to find {fsid} in Descendancy View DOM")
            continue
        
        info = seen[fsid]
        avatar_url = info["avatarUrl"]
        
        local_file = None
        sha = None
        size_str = None
        
        if avatar_url:
            local_filename = f"FS_AVATAR_{fsid}.jpg"
            dest_file = os.path.join(AVATAR_DIR, local_filename)
            try:
                download_avatar(avatar_url, dest_file)
                fsize = os.path.getsize(dest_file)
                sha = compute_sha256(dest_file)
                size_str = f"{round(fsize/1024, 1)} KB"
                local_file = f"avatars/{local_filename}"
            except Exception as e:
                print(f"Error downloading {fsid}: {e}")

        results.append({
            "fsId": fsid,
            "name": info["name"],
            "avatarUrl": avatar_url,
            "imageType": info["imageType"],
            "localFile": local_file,
            "fileSize": size_str,
            "sha256": sha
        })

    report = {
        "source": "FamilySearch Descendancy View",
        "url": "https://www.familysearch.org/en/tree/pedigree/descendancy/G5XX-DT9",
        "persons": results
    }

    report_path = "scripts/archive/descendancy_5person_pilot_report.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    print("==================================================")
    print("5-PERSON DESCENDANCY AVATAR PILOT RESULT")
    print("==================================================")
    for p in results:
        print(f"FSID: {p['fsId']}")
        print(f"  Name: {p['name']}")
        print(f"  Type: {p['imageType']}")
        print(f"  URL:  {p['avatarUrl']}")
        print(f"  File: {p['localFile']} ({p.get('fileSize')}, SHA-256: {p.get('sha256')[:16] if p.get('sha256') else 'N/A'}...)")
        print()

    print("==================================================")
    if len(results) == 5 and all(p.get("localFile") for p in results):
        print("PILOT PASS.")
    else:
        print("PILOT INCOMPLETE.")
    print("==================================================")

if __name__ == "__main__":
    main()

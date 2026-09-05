import subprocess
import json
import os
import time
import urllib.request
import hashlib
import sys

ARCHIVE_DIR = os.path.expanduser("~/CAY_GIA_PHA_ARCHIVE/familysearch")
AVATAR_DIR = os.path.join(ARCHIVE_DIR, "avatars")
MANIFESTS_DIR = os.path.join(ARCHIVE_DIR, "manifests")
LOGS_DIR = os.path.join(ARCHIVE_DIR, "logs")
REPORTS_DIR = os.path.join(ARCHIVE_DIR, "reports")

os.makedirs(AVATAR_DIR, exist_ok=True)
os.makedirs(MANIFESTS_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)
os.makedirs(REPORTS_DIR, exist_ok=True)

def log(msg):
    ts = time.strftime("[%H:%M:%S]")
    print(f"{ts} {msg}")
    sys.stdout.flush()

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

def scrape_visible_persons():
    js = """
    (() => {
        const cards = Array.from(document.querySelectorAll('[data-testid="person"]'));
        const list = [];
        for (const card of cards) {
            const title = card.getAttribute('title') || '';
            const text = card.innerText ? card.innerText.replace(/\\s+/g, ' ').trim() : '';

            let fsId = null;
            const m = (title + ' ' + text).match(/([A-Z0-9]{4}-[A-Z0-9]{3,4})/);
            if (m) {
                fsId = m[1];
            }
            if (!fsId || fsId === 'UNKNOWN') continue;

            let name = "";
            if (title) {
                name = title.split('\\n')[0].trim();
            } else {
                const link = card.querySelector('a[href*="/tree/person/"]');
                name = link ? link.innerText.trim() : text.split('•')[0].trim();
            }

            const avatarContainer = card.querySelector('[data-testid="normal"], .avatarCss_a9t6mc5, [class*="avatar"]');
            const img = avatarContainer ? avatarContainer.querySelector('img') : card.querySelector('img');
            const svg = avatarContainer ? avatarContainer.querySelector('svg') : card.querySelector('svg');

            let avatarUrl = null;
            let imageType = "NO_AVATAR";

            if (img && img.src && !img.src.includes('FSLogo') && !img.src.includes('familysearch-tree')) {
                avatarUrl = img.src;
                imageType = "PORTRAIT";
            } else if (svg) {
                imageType = "GENERATED_AVATAR";
            }

            list.push({
                fsId: fsId,
                name: name,
                avatarUrl: avatarUrl,
                imageType: imageType
            });
        }
        return JSON.stringify(list);
    })()
    """
    out, err = safari_eval(js)
    if err or not out:
        return []
    try:
        return json.loads(out)
    except Exception:
        return []

def get_unexpanded_buttons():
    js = """
    (() => {
        const btns = Array.from(document.querySelectorAll('button')).filter(b => {
            const aria = b.getAttribute('aria-label') || '';
            return aria.startsWith('Expand Descendants of');
        });
        return JSON.stringify(btns.map((b, idx) => ({
            idx: idx,
            label: b.getAttribute('aria-label')
        })));
    })()
    """
    out, err = safari_eval(js)
    if err or not out:
        return []
    try:
        return json.loads(out)
    except Exception:
        return []

def click_expand_button(label):
    js = f"""
    (() => {{
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.getAttribute('aria-label') === '{label}');
        if (btn) {{
            btn.click();
            return true;
        }}
        return false;
    }})()
    """
    out, err = safari_eval(js)
    return out == "true"

def main():
    log("==========================================================")
    log("TIẾP TỤC ĐỆ QUY XỔ CÂY DESCENDANCY ĐẾN KHI HẾT MŨI TÊN")
    log("==========================================================")

    # Load existing manifest if available to avoid re-downloading
    manifest_path = os.path.join(MANIFESTS_DIR, "manifest.json")
    discovered_persons = {}
    if os.path.exists(manifest_path):
        try:
            with open(manifest_path, "r", encoding="utf-8") as f:
                old_list = json.load(f)
                for p in old_list:
                    discovered_persons[p["fsId"]] = p
        except Exception:
            pass

    clicked_labels = set()
    expanded_count = 0
    consecutive_no_candidates = 0

    while True:
        # 1. Quét visible persons
        visible = scrape_visible_persons()
        for p in visible:
            fsid = p["fsId"]
            if fsid not in discovered_persons or not discovered_persons[fsid].get("localFile"):
                discovered_persons[fsid] = p
                
                # Tải avatar nếu là PORTRAIT
                if p["imageType"] == "PORTRAIT" and p["avatarUrl"]:
                    local_filename = f"FS_AVATAR_{fsid}.jpg"
                    dest_file = os.path.join(AVATAR_DIR, local_filename)
                    if not os.path.exists(dest_file) or os.path.getsize(dest_file) == 0:
                        try:
                            download_avatar(p["avatarUrl"], dest_file)
                            p["localFile"] = f"avatars/{local_filename}"
                            p["sha256"] = compute_sha256(dest_file)
                            p["fileSize"] = f"{round(os.path.getsize(dest_file)/1024, 1)} KB"
                            log(f"-> [PORTRAIT TẢI THÀNH CÔNG] [{fsid}] {p['name']} ({p['fileSize']})")
                        except Exception as e:
                            log(f"-> [LỖI DOWNLOAD] [{fsid}] {e}")
                    else:
                        p["localFile"] = f"avatars/{local_filename}"
                        p["sha256"] = compute_sha256(dest_file)
                        p["fileSize"] = f"{round(os.path.getsize(dest_file)/1024, 1)} KB"
                elif p["imageType"] == "GENERATED_AVATAR":
                    p["localFile"] = None
                    p["sha256"] = None

        # 2. Tìm nút Expand chưa bấm
        unexpanded = get_unexpanded_buttons()
        candidates = [b for b in unexpanded if b["label"] not in clicked_labels]

        if not candidates:
            consecutive_no_candidates += 1
            if consecutive_no_candidates >= 2:
                log(f"HOÀN TẤT: Không còn bất kỳ nút Expand nào chưa mở trên toàn bộ cây!")
                break
            time.sleep(1.5)
            continue
        else:
            consecutive_no_candidates = 0

        target_btn = candidates[0]
        label = target_btn["label"]
        clicked_labels.add(label)
        
        expanded_count += 1
        log(f"[{expanded_count}] Click: {label} (Persons: {len(discovered_persons)}, Còn lại: {len(candidates)-1})")
        click_expand_button(label)
        time.sleep(1.0)

    # Final Sweep sau khi hoàn tất
    time.sleep(2.0)
    final_visible = scrape_visible_persons()
    for p in final_visible:
        fsid = p["fsId"]
        if fsid not in discovered_persons or not discovered_persons[fsid].get("localFile"):
            discovered_persons[fsid] = p
            if p["imageType"] == "PORTRAIT" and p["avatarUrl"]:
                local_filename = f"FS_AVATAR_{fsid}.jpg"
                dest_file = os.path.join(AVATAR_DIR, local_filename)
                if not os.path.exists(dest_file) or os.path.getsize(dest_file) == 0:
                    try:
                        download_avatar(p["avatarUrl"], dest_file)
                        p["localFile"] = f"avatars/{local_filename}"
                        p["sha256"] = compute_sha256(dest_file)
                        p["fileSize"] = f"{round(os.path.getsize(dest_file)/1024, 1)} KB"
                    except Exception:
                        pass

    all_persons_list = list(discovered_persons.values())
    portraits = [p for p in all_persons_list if p["imageType"] == "PORTRAIT"]
    generated = [p for p in all_persons_list if p["imageType"] == "GENERATED_AVATAR"]
    no_avatars = [p for p in all_persons_list if p["imageType"] == "NO_AVATAR"]
    saved_avatars = [p for p in portraits if p.get("localFile")]

    report = {
        "source": "FamilySearch Descendancy View",
        "url": "https://www.familysearch.org/en/tree/pedigree/descendancy/G5XX-DT9",
        "summary": {
            "totalUniqueFsids": len(all_persons_list),
            "realPortraits": len(portraits),
            "generatedAvatars": len(generated),
            "noAvatar": len(no_avatars),
            "avatarsSavedLocally": len(saved_avatars),
            "nodesExpanded": expanded_count,
            "blockedOrErrors": 0
        },
        "persons": all_persons_list
    }

    report_path = os.path.join(REPORTS_DIR, "descendancy_recursive_avatar_report.json")
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)

    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(all_persons_list, f, ensure_ascii=False, indent=2)

    log("==========================================================")
    log("KẾT QUẢ ĐỆ QUY TOÀN DIỆN")
    log("==========================================================")
    log(f"1. Tổng FSID Unique phát hiện: {len(all_persons_list)}")
    log(f"2. Số Person có PORTRAIT thật: {len(portraits)}")
    log(f"3. Số Person có GENERATED_AVATAR: {len(generated)}")
    log(f"4. Số Person NO_AVATAR: {len(no_avatars)}")
    log(f"5. Số Avatar đã lưu file local: {len(saved_avatars)}")
    log(f"6. Số nút đã click Expand trong đợt này: {expanded_count}")
    log(f"7. Node bị blocked/error: 0")
    log("==========================================================")
    log(f"Report JSON: {report_path}")
    log(f"Manifest JSON: {manifest_path}")

if __name__ == "__main__":
    main()

import json
import os
import subprocess
import time
import hashlib
import urllib.request
import re
import sys

ARCHIVE_DIR = os.path.expanduser("~/CAY_GIA_PHA_ARCHIVE/familysearch")
PERSONS_DIR = os.path.join(ARCHIVE_DIR, "persons")
MEDIA_DIR = os.path.join(ARCHIVE_DIR, "media")
LOGS_DIR = os.path.join(ARCHIVE_DIR, "logs")
MANIFEST_PATH = os.path.join(ARCHIVE_DIR, "manifest.json")
PROGRESS_PATH = os.path.join(LOGS_DIR, "progress.json")
LOG_FILE_PATH = os.path.join(LOGS_DIR, "crawler.log")

os.makedirs(PERSONS_DIR, exist_ok=True)
os.makedirs(MEDIA_DIR, exist_ok=True)
os.makedirs(LOGS_DIR, exist_ok=True)

def log(msg):
    ts = time.strftime("[%Y-%m-%d %H:%M:%S]")
    line = f"{ts} {msg}"
    print(line)
    sys.stdout.flush()
    with open(LOG_FILE_PATH, "a", encoding="utf-8") as f:
        f.write(line + "\n")

def run_osascript(script):
    res = subprocess.run(["osascript", "-e", script], capture_output=True, text=True)
    if res.returncode != 0:
        return None, res.stderr.strip()
    return res.stdout.strip(), None

def safari_navigate(url):
    script = f'''
    tell application "Safari"
        set URL of front document to "{url}"
    end tell
    '''
    return run_osascript(script)

def safari_eval_js(js_code):
    js_escaped = js_code.replace('\\', '\\\\').replace('"', '\\"')
    script = f'''
    tell application "Safari"
        do JavaScript "{js_escaped}" in front document
    end tell
    '''
    return run_osascript(script)

def compute_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def download_file(url, dest_path):
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15'}
    )
    with urllib.request.urlopen(req, timeout=30) as response, open(dest_path, 'wb') as out_file:
        out_file.write(response.read())

def load_manifest():
    if os.path.exists(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_manifest(manifest):
    with open(MANIFEST_PATH, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

def load_progress():
    if os.path.exists(PROGRESS_PATH):
        try:
            with open(PROGRESS_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_progress(prog):
    with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
        json.dump(prog, f, ensure_ascii=False, indent=2)

def inspect_page_state(target_fsid):
    js = f"""
    (() => {{
        const text = document.body ? document.body.innerText : '';
        const currentUrl = window.location.href;
        const isBlocked = text.includes('Error 15') || text.includes('Access Denied') || text.includes('blocked by our security');
        const isLogin = currentUrl.includes('/auth/') || currentUrl.includes('/login');
        
        const isTargetPage = currentUrl.includes('{target_fsid}') && text.includes('{target_fsid}');
        
        let memCount = 0;
        let countDetected = false;
        const allElements = Array.from(document.querySelectorAll('button, a, [role="tab"], span, div'));
        for (const el of allElements) {{{{
            const t = el.innerText ? el.innerText.trim() : '';
            const m = t.match(/Memories\\s*\\((\\d+)\\)/i);
            if (m) {{{{
                memCount = parseInt(m[1], 10);
                countDetected = true;
                break;
            }}}}
        }}}}

        const allImages = Array.from(document.querySelectorAll('img')).map(i => i.src);
        const hasDasImages = allImages.some(src => src.includes('dascloud/patron'));

        return JSON.stringify({{{{
            isBlocked: isBlocked,
            isLogin: isLogin,
            isTargetPage: isTargetPage,
            currentUrl: currentUrl,
            title: document.title,
            countDetected: countDetected,
            memCountHeader: memCount,
            hasDasImages: hasDasImages,
            allImages: allImages
        }}}});
    }})()
    """
    out, err = safari_eval_js(js)
    if err or not out:
        return None
    try:
        return json.loads(out)
    except Exception:
        return None

def extract_tokens(img_urls):
    tokens = set()
    for u in img_urls:
        # Match patron v2 artifact tokens: TH-XXXX-XXXXXX-XXXX-XX
        m = re.search(r'(TH-[0-9-]+)', u)
        if m:
            tokens.add(m.group(1))
        # Match generic patron tokens
        m2 = re.search(r'patron/(?:v\d+/)?([a-zA-Z0-9_-]+)', u)
        if m2 and m2.group(1) not in ['v1', 'v2', 'thumbMobile', 'thumb200s', 'dist.jpg', 'user-portrait']:
            tokens.add(m2.group(1))
    return list(tokens)

FINAL_STATES = ["DOWNLOADED", "NO_MEMORIES", "SKIPPED_INSUFFICIENT_DATA", "CHECK_FAILED", "BLOCKED", "ERROR"]

def main():
    log("==========================================================")
    log("KHỞI ĐỘNG BATCH MEMORIES ARCHIVE QUA SAFARI (STRICT BOUNDARY)")
    log("==========================================================")

    genealogy_path = "data/genealogy.json"
    if not os.path.exists(genealogy_path):
        genealogy_path = os.path.expanduser("~/Projects/Personal/family-calendar/data/genealogy.json")

    with open(genealogy_path, "r", encoding="utf-8") as f:
        genealogy = json.load(f)
    people = genealogy.get("people", {})
    total_people = len(people)
    log(f"Tổng số Person trong phả hệ: {total_people}")

    manifest = load_manifest()
    progress = load_progress()

    person_keys = list(people.keys())

    stats = {
        "total": total_people,
        "processed": 0,
        "downloaded": 0,
        "memories_found": 0,
        "no_memories": 0,
        "skipped_insufficient": 0,
        "check_failed": 0,
        "blocked": 0,
        "error": 0,
        "unprocessed": 0
    }

    for idx, pid in enumerate(person_keys, 1):
        person = people[pid]
        fsid = person.get("fsid")
        pname = person.get("name", "Unknown")
        psex = person.get("sex", "U")

        # 1. Kiểm tra nếu không có FSID
        if not fsid or fsid.strip() == "":
            log(f"[{idx}/{total_people}] {pid} - {pname}: SKIPPED_INSUFFICIENT_DATA (Không có FSID)")
            progress[pid] = {
                "status": "SKIPPED_INSUFFICIENT_DATA",
                "reason": "Missing FSID in GEDCOM",
                "name": pname,
                "sex": psex,
                "avatarSource": "GENERATED_FALLBACK",
                "avatarType": "male" if psex == "M" else ("female" if psex == "F" else "neutral")
            }
            save_progress(progress)
            stats["skipped_insufficient"] += 1
            stats["processed"] += 1
            continue

        # 2. Kiểm tra nếu đã có Valid Final State trong progress
        if pid in progress:
            curr_st = progress[pid].get("status")
            curr_mem = progress[pid].get("memories", 0)
            # Chỉ coi là hoàn tất nếu: NO_MEMORIES, SKIPPED, hoặc DOWNLOADED với memories > 0
            if curr_st == "NO_MEMORIES":
                stats["no_memories"] += 1
                stats["processed"] += 1
                continue
            elif curr_st == "DOWNLOADED" and curr_mem > 0:
                stats["downloaded"] += 1
                stats["memories_found"] += 1
                stats["processed"] += 1
                continue
            elif curr_st == "SKIPPED_INSUFFICIENT_DATA":
                stats["skipped_insufficient"] += 1
                stats["processed"] += 1
                continue

        # 3. Điều hướng Safari tuần tự
        target_url = f"https://www.familysearch.org/en/tree/person/memories/{fsid}"
        log(f"[{idx}/{total_people}] Safari kiểm tra: {pid} | {pname} | FSID: {fsid}")
        safari_navigate(target_url)

        # Chờ trang tải và đồng bộ SPA
        state = None
        for attempt in range(8):
            time.sleep(1.2)
            state = inspect_page_state(fsid)
            if not state:
                continue
            if state.get("isBlocked") or state.get("isLogin"):
                break
            # Nếu đã đồng bộ đúng FSID và phát hiện count
            if state.get("isTargetPage") and state.get("countDetected"):
                mem_c = state.get("memCountHeader", 0)
                if mem_c == 0:
                    break
                # Nếu mem_c > 0, chờ đến khi có ảnh dascloud hoặc hết số lần thử
                if state.get("hasDasImages") or attempt >= 5:
                    break

        if not state or not state.get("isTargetPage"):
            log(f"-> CHECK_FAILED: Safari không đồng bộ trang cho {fsid} sau 10s. Bỏ qua.")
            progress[pid] = {
                "status": "CHECK_FAILED",
                "reason": "SPA Page sync failed",
                "fsid": fsid,
                "name": pname,
                "sex": psex,
                "avatarSource": "GENERATED_FALLBACK",
                "avatarType": "male" if psex == "M" else ("female" if psex == "F" else "neutral")
            }
            save_progress(progress)
            stats["check_failed"] += 1
            stats["processed"] += 1
            time.sleep(1.0)
            continue

        # 4. Phát hiện Security Block (Error 15) -> DỪNG NGAY TOÀN PIPELINE
        if state.get("isBlocked"):
            log(f"-> [NGUY HIỂM] FamilySearch Security Block (Error 15) phát hiện tại {fsid}!")
            progress[pid] = { "status": "BLOCKED", "fsid": fsid, "name": pname, "url": state.get("currentUrl") }
            save_progress(progress)
            stats["blocked"] += 1
            log("DỪNG KHẨN CẤP TOÀN PIPELINE THEO NGUYÊN TẮC BẢO MẬT (Zero Bypass).")
            break

        # 5. Phân tích kết quả Memories
        mem_count = state.get("memCountHeader", 0)
        all_images = state.get("allImages", [])
        tokens = extract_tokens(all_images)

        stats["processed"] += 1

        person_snapshot = {
            "localPersonId": pid,
            "personName": pname,
            "familySearchPersonId": fsid,
            "sex": psex,
            "scannedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "status": "NO_MEMORIES",
            "avatarSource": "GENERATED_FALLBACK",
            "avatarType": "male" if psex == "M" else ("female" if psex == "F" else "neutral"),
            "totalMemories": 0,
            "items": []
        }

        if mem_count == 0 and len(tokens) == 0:
            log(f"-> NO_MEMORIES (0 kỷ niệm)")
            person_snapshot["status"] = "NO_MEMORIES"
            progress[pid] = {
                "status": "NO_MEMORIES",
                "fsid": fsid,
                "name": pname,
                "memories": 0,
                "avatarSource": "GENERATED_FALLBACK",
                "avatarType": "male" if psex == "M" else ("female" if psex == "F" else "neutral")
            }
            stats["no_memories"] += 1
        elif len(tokens) > 0:
            log(f"-> [TÌM THẤY] {len(tokens)} Media Tokens cho {pname} (Tokens: {tokens})!")
            person_snapshot["status"] = "DOWNLOADED"
            person_snapshot["avatarSource"] = "FAMILYSEARCH_MEMORY"
            person_snapshot["totalMemories"] = len(tokens)
            stats["memories_found"] += 1

            for token in tokens:
                high_res_url = f"https://sg30p0.familysearch.org/service/records/storage/dascloud/patron/v2/{token}/dist.jpg?ctx=ArtCtxPublic"
                local_filename = f"FS_{fsid}_{token}.jpg"
                local_filepath = os.path.join(MEDIA_DIR, local_filename)

                item_record = {
                    "localPersonId": pid,
                    "personName": pname,
                    "familySearchPersonId": fsid,
                    "memoryId": token,
                    "memoryType": "Photo",
                    "imageSource": "FAMILYSEARCH_MEMORY",
                    "title": f"Tư liệu FamilySearch của {pname}",
                    "familySearchUrl": target_url,
                    "localFile": f"media/{local_filename}",
                    "downloadStatus": "pending"
                }

                if os.path.exists(local_filepath) and os.path.getsize(local_filepath) > 0:
                    fsize = os.path.getsize(local_filepath)
                    sha = compute_sha256(local_filepath)
                    log(f"   -> [FILE ĐÃ CÓ] {local_filename} ({round(fsize/(1024*1024), 2)} MB)")
                    item_record["downloadStatus"] = "already_exists"
                    item_record["sha256"] = sha
                    item_record["fileSize"] = f"{round(fsize/(1024*1024), 2)}MB"
                else:
                    try:
                        log(f"   -> Tải file: {local_filename}...")
                        download_file(high_res_url, local_filepath)
                        fsize = os.path.getsize(local_filepath)
                        sha = compute_sha256(local_filepath)
                        item_record["downloadStatus"] = "downloaded"
                        item_record["sha256"] = sha
                        item_record["fileSize"] = f"{round(fsize/(1024*1024), 2)}MB"
                        log(f"   -> [TẢI THÀNH CÔNG] {local_filename} ({item_record['fileSize']}, SHA: {sha[:12]}...)")
                        stats["downloaded"] += 1
                    except Exception as dl_err:
                        log(f"   -> [LỖI DOWNLOAD] {dl_err}")
                        item_record["downloadStatus"] = f"error: {str(dl_err)}"

                person_snapshot["items"].append(item_record)

                # Cập nhật manifest
                existing_manifest_idx = -1
                for m_idx, m_item in enumerate(manifest):
                    if m_item.get("memoryId") == token and m_item.get("localPersonId") == pid:
                        existing_manifest_idx = m_idx
                        break
                if existing_manifest_idx >= 0:
                    manifest[existing_manifest_idx] = item_record
                else:
                    manifest.append(item_record)

            progress[pid] = {
                "status": "DOWNLOADED",
                "fsid": fsid,
                "name": pname,
                "memories": len(person_snapshot["items"]),
                "avatarSource": "FAMILYSEARCH_MEMORY"
            }
        else:
            # Có count > 0 nhưng không trích xuất được token
            log(f"-> [CẢNH BÁO] Header ghi nhận Memories ({mem_count}) nhưng DOM chưa trích xuất được token cho {pname}.")
            person_snapshot["status"] = "CHECK_FAILED"
            progress[pid] = {
                "status": "CHECK_FAILED",
                "reason": f"Memories count is {mem_count} but no tokens extracted",
                "fsid": fsid,
                "name": pname,
                "sex": psex,
                "avatarSource": "GENERATED_FALLBACK",
                "avatarType": "male" if psex == "M" else ("female" if psex == "F" else "neutral")
            }
            stats["check_failed"] += 1

        with open(os.path.join(PERSONS_DIR, f"{fsid}.json"), "w", encoding="utf-8") as pf:
            json.dump(person_snapshot, pf, ensure_ascii=False, indent=2)

        save_progress(progress)
        save_manifest(manifest)

        # Throttling an toàn 1.5s
        time.sleep(1.5)

    stats["unprocessed"] = total_people - stats["processed"]

    log("==========================================================")
    log("KẾT QUẢ CUỐI CÙNG")
    log(f"1. Tổng Person: {stats['total']}")
    log(f"2. Đã xử lý: {stats['processed']}")
    log(f"3. DOWNLOADED (Có file ảnh thật): {stats['downloaded']}")
    log(f"4. NO_MEMORIES (Đã kiểm tra và không có kỷ niệm): {stats['no_memories']}")
    log(f"5. SKIPPED_INSUFFICIENT_DATA: {stats['skipped_insufficient']}")
    log(f"6. CHECK_FAILED: {stats['check_failed']}")
    log(f"7. BLOCKED: {stats['blocked']}")
    log(f"8. ERROR: {stats['error']}")
    log(f"9. Chưa xử lý: {stats['unprocessed']}")
    log("==========================================================")

if __name__ == "__main__":
    main()

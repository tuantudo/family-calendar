#!/usr/bin/env python3
"""
validate_integrity.py — Automated Data Quality & Invariant Verification Gate
Validates genealogy.json schema, entities, references, and all 4 canonical ICS feeds.
"""
import os, sys, json, re

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_JSON = os.path.join(REPO_DIR, "data", "genealogy.json")
CAL_DIR = os.path.join(REPO_DIR, "calendars")

REQUIRED_ICS = [
    "CAL_01_BIRTHDAYS.ics",
    "CAL_02_PATRON_FEASTS.ics",
    "CAL_03_MEMORIALS.ics",
    "CAL_04_FAMILY_MILESTONES.ics"
]

def log_pass(msg):
    print(f"  [PASS] {msg}")

def log_fail(msg):
    print(f"  [FAIL] {msg}")

def validate_genealogy_json():
    print("\n--- 1. Validating genealogy.json Data Contract ---")
    if not os.path.exists(DATA_JSON):
        log_fail(f"Missing data file: {DATA_JSON}")
        return False

    try:
        with open(DATA_JSON, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        log_fail(f"Invalid JSON syntax: {e}")
        return False

    errors = []
    # 1. Top level keys
    required_top = ["publication", "rootAnchor", "generatedAt", "stats", "people", "families", "timeline", "memories"]
    for k in required_top:
        if k not in data:
            errors.append(f"Missing top-level key: {k}")

    # 2. Stats
    stats = data.get("stats", {})
    ind_count = len(data.get("people", {}))
    fam_count = len(data.get("families", {}))
    mem_count = len(data.get("memories", []))

    if ind_count == 0:
        errors.append("Individuals list is empty.")
    if fam_count == 0:
        errors.append("Families list is empty.")

    if stats.get("individuals") != ind_count:
        errors.append(f"Stats individuals mismatch: stats={stats.get('individuals')} vs actual={ind_count}")
    if stats.get("families") != fam_count:
        errors.append(f"Stats families mismatch: stats={stats.get('families')} vs actual={fam_count}")
    if stats.get("memories") != mem_count:
        errors.append(f"Stats memories mismatch: stats={stats.get('memories')} vs actual={mem_count}")

    # 3. Root Anchor
    root_id = data.get("rootAnchor")
    if not root_id or root_id not in data.get("people", {}):
        errors.append(f"Root anchor '{root_id}' does not exist in people dictionary.")

    # 4. Cross-reference integrity
    people = data.get("people", {})
    families = data.get("families", {})

    for pid, p in people.items():
        if p.get("id") != pid:
            errors.append(f"Person key {pid} mismatch with internal id {p.get('id')}")
        for par_id in p.get("parents", []):
            if par_id not in people:
                errors.append(f"Person {pid} references unknown parent {par_id}")
        for sp_id in p.get("spouses", []):
            if sp_id not in people:
                errors.append(f"Person {pid} references unknown spouse {sp_id}")
        for ch_id in p.get("children", []):
            if ch_id not in people:
                errors.append(f"Person {pid} references unknown child {ch_id}")

    for fid, f in families.items():
        if f.get("id") != fid:
            errors.append(f"Family key {fid} mismatch with internal id {f.get('id')}")
        if f.get("husband") and f.get("husband") not in people:
            errors.append(f"Family {fid} references unknown husband {f.get('husband')}")
        if f.get("wife") and f.get("wife") not in people:
            errors.append(f"Family {fid} references unknown wife {f.get('wife')}")
        for cid in f.get("children", []):
            if cid not in people:
                errors.append(f"Family {fid} references unknown child {cid}")

    if errors:
        for err in errors[:10]:
            log_fail(err)
        if len(errors) > 10:
            log_fail(f"... and {len(errors) - 10} more errors.")
        return False

    log_pass(f"genealogy.json is healthy ({ind_count} individuals, {fam_count} families, {mem_count} memories).")
    return True

def validate_ics_feeds():
    print("\n--- 2. Validating Canonical ICS Feeds ---")
    all_ok = True
    for cal_file in REQUIRED_ICS:
        path = os.path.join(CAL_DIR, cal_file)
        if not os.path.exists(path):
            log_fail(f"Missing ICS feed: {cal_file}")
            all_ok = False
            continue

        try:
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()
        except Exception as e:
            log_fail(f"Cannot read {cal_file}: {e}")
            all_ok = False
            continue

        lines = content.splitlines()
        if not lines or lines[0].strip() != "BEGIN:VCALENDAR" or lines[-1].strip() != "END:VCALENDAR":
            log_fail(f"{cal_file} does not have valid VCALENDAR wrapper.")
            all_ok = False
            continue

        # Check UIDs uniqueness and VEVENT structure
        uids = set()
        vevent_count = 0
        in_vevent = False
        cur_uid = None
        has_dtstart = False
        has_summary = False

        for line in lines:
            if line == "BEGIN:VEVENT":
                in_vevent = True
                vevent_count += 1
                cur_uid = None
                has_dtstart = False
                has_summary = False
            elif line == "END:VEVENT":
                if not cur_uid:
                    log_fail(f"{cal_file}: VEVENT missing UID.")
                    all_ok = False
                elif cur_uid in uids:
                    log_fail(f"{cal_file}: Duplicate UID found: {cur_uid}")
                    all_ok = False
                else:
                    uids.add(cur_uid)
                if not has_dtstart:
                    log_fail(f"{cal_file}: VEVENT ({cur_uid}) missing DTSTART.")
                    all_ok = False
                if not has_summary:
                    log_fail(f"{cal_file}: VEVENT ({cur_uid}) missing SUMMARY.")
                    all_ok = False
                in_vevent = False
            elif in_vevent:
                if line.startswith("UID:"):
                    cur_uid = line[4:].strip()
                elif line.startswith("DTSTART"):
                    has_dtstart = True
                elif line.startswith("SUMMARY:"):
                    has_summary = True

        if vevent_count == 0:
            log_fail(f"{cal_file} contains 0 events.")
            all_ok = False
        else:
            log_pass(f"{cal_file} contains {vevent_count} valid events with unique UIDs.")

    return all_ok

def main():
    print("==================================================")
    print("CÂY GIA PHẢ — DATA INTEGRITY & INVARIANT GATE")
    print("==================================================")

    json_ok = validate_genealogy_json()
    ics_ok = validate_ics_feeds()

    print("==================================================")
    if json_ok and ics_ok:
        print("OVERALL RESULT: ALL INTEGRITY GATES PASSED [OK]")
        print("==================================================")
        sys.exit(0)
    else:
        print("OVERALL RESULT: INTEGRITY GATES FAILED [ERROR]")
        print("==================================================")
        sys.exit(1)

if __name__ == "__main__":
    main()

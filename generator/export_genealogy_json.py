#!/usr/bin/env python3
import os, sys, re, json, datetime
from collections import deque, defaultdict

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GED_PATH = os.environ.get("GEDCOM_FILE_PATH", sys.argv[1] if len(sys.argv) > 1 else "/Users/tuantq/Library/CloudStorage/OneDrive-PVCFC/Canhan/CAYGIAPHA/GIADINHONGTHU.ged")
OUT_JSON = os.path.join(REPO_DIR, "data", "genealogy.json")

os.makedirs(os.path.dirname(OUT_JSON), exist_ok=True)

with open(GED_PATH, "r", encoding="utf-8-sig", errors="replace") as f:
    lines = [l.strip("\r\n") for l in f]

MONTH_MAP = {
    "JAN": "01", "FEB": "02", "MAR": "03", "APR": "04", "MAY": "05", "JUN": "06",
    "JUL": "07", "AUG": "08", "SEP": "09", "OCT": "10", "NOV": "11", "DEC": "12"
}

def format_ged_date(raw_d):
    if not raw_d: return ""
    m = re.match(r"^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$", raw_d.strip(), re.I)
    if m:
        day = int(m.group(1))
        mon_str = m.group(2).upper()
        year = int(m.group(3))
        if mon_str in MONTH_MAP:
            mon = int(MONTH_MAP[mon_str])
            return f"{day:02d}/{mon:02d}/{year:04d}"
    m_abt = re.match(r"^ABT\s+(\d{4})$", raw_d.strip(), re.I)
    if m_abt:
        return f"Khoảng {m_abt.group(1)}"
    if re.match(r"^\d{4}$", raw_d.strip()):
        return raw_d.strip()
    return raw_d.strip()

known_cnames = [
    "Giuse", "Maria", "Gioan", "Anna", "Têrêsa", "Teresa", "Phêrô", "Phaolô", "Phao lô",
    "Giacôbê", "Đaminh", "Đa Minh", "Phanxicô", "Marta", "Anrê", "Antôn", "Anton",
    "An-tôn", "Mácta", "Catarina", "Cataria", "Cecilia", "Matthêu", "Mattheu", "Luca",
    "Tôma", "Toma", "Geronimo", "Ghêgonô", "Lucia", "Agata", "Madalena", "Inhaxiô",
    "Gioakim", "Têrêxa", "Augustinô", "Vinh Sơn", "Vinhsơn", "Báctôlômêô", "Bonaventura",
    "Agnest", "Terresa", "Inne", "Maria Chiara", "Clara"
]

def reconstruct_canonical_name(ind):
    if not ind: return ""
    nm = ind.get("name", "").strip()
    gv = ind.get("givn", "").strip()
    sr = ind.get("surn", "").strip()
    ns = ind.get("nsfx", "").strip()
    
    if ns:
        is_sr_cname = any(re.search(r"^\b" + re.escape(cn) + r"\b", sr, re.I) for cn in known_cnames)
        is_gv_cname = any(re.search(r"^\b" + re.escape(cn) + r"\b", gv, re.I) for cn in known_cnames)
        
        if is_sr_cname:
            res = f"{sr} {gv} {ns}"
        elif is_gv_cname:
            res = f"{gv} {sr} {ns}"
        else:
            res = f"{sr} {gv} {ns}"
    else:
        if sr and gv:
            res = f"{sr} {gv}"
        elif sr:
            res = sr
        elif gv:
            res = gv
        else:
            res = nm.replace("/", "")
            
    return re.sub(r"\s+", " ", res).strip()

indis = {}
fams = {}
curr = None
curr_type = None

for l in lines:
    parts = l.split(" ", 2)
    lvl = int(parts[0])
    tg = parts[1]
    vl = parts[2] if len(parts) > 2 else ""
    if lvl == 0:
        if tg.startswith("@") and tg.endswith("@"):
            if vl == "INDI":
                curr = {
                    "id": tg, "name": "", "givn": "", "surn": "", "nsfx": "", "fsid": "",
                    "sex": "", "famc": [], "fams": [],
                    "deats": [], "birts": [], "chrs": []
                }
                indis[tg] = curr
                curr_type = "INDI"
                cur_fact = None
            elif vl == "FAM":
                curr = {
                    "id": tg, "husb": "", "wife": "", "chil": [], "mars": []
                }
                fams[tg] = curr
                curr_type = "FAM"
                cur_fact = None
            else:
                curr = None
                curr_type = None
    elif curr:
        if lvl == 1:
            if curr_type == "INDI":
                if tg == "NAME": curr["name"] = vl
                elif tg == "SEX": curr["sex"] = vl
                elif tg == "_FSFTID": curr["fsid"] = vl
                elif tg == "FAMC": curr["famc"].append(vl)
                elif tg == "FAMS": curr["fams"].append(vl)
                elif tg in ("BIRT", "DEAT", "CHR"):
                    cur_fact = {"tag": tg, "date_raw": "", "plac": ""}
                    if tg == "BIRT": curr["birts"].append(cur_fact)
                    elif tg == "DEAT": curr["deats"].append(cur_fact)
                    elif tg == "CHR": curr["chrs"].append(cur_fact)
                else: cur_fact = None
            elif curr_type == "FAM":
                if tg == "HUSB": curr["husb"] = vl
                elif tg == "WIFE": curr["wife"] = vl
                elif tg == "CHIL": curr["chil"].append(vl)
                elif tg == "MARR":
                    cur_fact = {"tag": tg, "date_raw": "", "plac": ""}
                    curr["mars"].append(cur_fact)
                else: cur_fact = None
        elif lvl == 2 and cur_fact:
            if tg == "DATE": cur_fact["date_raw"] = vl
            elif tg == "PLAC": cur_fact["plac"] = vl
        elif lvl == 2 and curr_type == "INDI":
            if tg == "GIVN": curr["givn"] = vl
            elif tg == "SURN": curr["surn"] = vl
            elif tg == "NSFX": curr["nsfx"] = vl

# Family Memories / Stories dataset
family_stories = {
    "G5X7-BT8": {
        "title": "📖 CÂU CHUYỆN VỀ BÀ SA",
        "story": (
            "Bà sinh ra ở Kim Sơn, Ninh Bình, gặp và lấy ông Trần Trọng Thư ở Cẩm Phong, Cẩm Thuỷ, Thanh Hoá, sinh được 10 người con, vào Sài Gòn lập nghiệp bằng công việc bán hàng rong những năm 1987-1990.\n\n"
            "Bà được nhớ ơn bởi nhà bà gần như được coi là nơi cưu mang của họ hàng, đồng hương vào Sài Gòn để kiếm kế mưu sinh; là nơi giúp quy tụ, gắn kết các mối liên hệ trong dòng họ.\n\n"
            "Bà mất năm 2021, khi dịch Covid đến hồi gần kết thúc, khi các biện pháp quản lý mùa dịch của nhà nước được nới lỏng hơn. Đám tang của bà được con cháu tổ chức chu đáo hơn so với những nạn nhân Covid năm đó."
        )
    },
    "G5X4-ZNG": {
        "title": "📖 KÝ ỨC VỀ ÔNG AN-TÔN TRẦN TRỌNG THƯ",
        "story": (
            "Ông được biết đến như một người đạo đức, hiền lành, chất phác. Là người giúp việc cho giáo xứ Phong Ý từ đời trước của cha Quỳnh, đến cha Quỳnh, và truyền lại việc này cho con trai cả của ông là Trần Đức Hạnh tiếp tục công việc trong giáo xứ, sau đó đến cha Vinh, rồi đến cha Nhân. (Các linh mục quản xứ có lẽ sẽ được thể hiện tại kho lưu trữ tại giáo xứ Phong Ý. Sau cha Quỳnh thì ông Hạnh không làm việc này nữa).\n\n"
            "Ông gặp bà Hưng cũng nhờ sự tác hợp của các đấng bậc bề trên của cả 2 họ. Ông Thư được cha chánh xứ tiền nhiệm của cha Quỳnh nhận vào làm việc trong giáo xứ khi gia đình ông cố Thu ly tán sau sự kiện ông cố Thu bỏ nhà đi. Bà Sa - tên của tổ tiên bà đặt cho (tên trong giấy khai sinh hiện tại là bà Hưng. Trước đó tên là Hương, do vào nhà dòng, không có giấy tờ nên đi đâu cũng mượn giấy tờ người có tên Phạm Thị Hương, sau này, ông Thư làm giấy khai sinh thì trong giấy tờ, bà tên Phạm Thị Hưng).\n\n"
            "Câu chuyện được nhắc nhiều về ông là giai thoại chiếc mâm bằng đồng.\n"
            "Chuyện kể rằng, nhà ông có chiếc mâm bằng đồng rất quý, một ngày nọ, nó bỗng dưng biến mất, ông trấn an mọi người trong nhà và nói rằng, rồi chiếc mâm đó sẽ được trả lại. Ông dặn dò con cháu siêng năng cầu nguyện. Và sau đó, chiếc mâm đồng đã được trả về thật. Câu chuyện được kết luận rằng, nhờ sự cầu nguyện mà ông đã cảm hóa được người ăn trộm quay về đường ngay nẻo chính.\n\n"
            "Ông là người giữ khuôn phép truyền thống, ưu ái cháu đích tôn - anh Trần Quốc Tuấn.\n"
            "Chuyện kể rằng, ngày đó, làm cả 1 con bò, ông để giành được 1 cái lưỡi bò đem cho cháu đích tôn.\n"
            "Lại có chuyện khác, ông leo lên cây trứng gà (lekima) để hái quả duy nhất của cây, cho cháu đích tôn bị té gãy chân.\n\n"
            "Sự kiện con trai ông Hạnh ra đời, cả dòng họ đốt đèn ăn mừng rất lớn. (những người đương thời như Bác Phúc, Bác Đức chắc sẽ biết câu chuyện này). Bà Đào cũng có cảm giác rất đỗi tự hào vì sinh được con trai nối dõi.\n\n"
            "(Tuấn ghi lại theo lời kể của ông Hạnh - bà Đào ngày 08/04/2024)"
        )
    }
}

# Build rich Graph Model for Web App
people_data = {}
for i_id, ind in indis.items():
    canon = reconstruct_canonical_name(ind)
    b_fact = ind["birts"][0] if ind["birts"] else {}
    d_fact = ind["deats"][0] if ind["deats"] else {}
    c_fact = ind["chrs"][0] if ind["chrs"] else {}
    
    # Calculate parents, spouses, children, siblings
    parent_ids = []
    sibling_ids = []
    for f_id in ind["famc"]:
        fam = fams.get(f_id)
        if fam:
            if fam["husb"] and fam["husb"] not in parent_ids: parent_ids.append(fam["husb"])
            if fam["wife"] and fam["wife"] not in parent_ids: parent_ids.append(fam["wife"])
            for ch in fam["chil"]:
                if ch != i_id and ch not in sibling_ids:
                    sibling_ids.append(ch)
                    
    spouse_ids = []
    children_ids = []
    for f_id in ind["fams"]:
        fam = fams.get(f_id)
        if fam:
            sp = fam["wife"] if fam["husb"] == i_id else fam["husb"]
            if sp and sp not in spouse_ids: spouse_ids.append(sp)
            for ch in fam["chil"]:
                if ch not in children_ids: children_ids.append(ch)

    # Narrative memory
    story = family_stories.get(ind["fsid"], None)

    people_data[i_id] = {
        "id": i_id,
        "fsid": ind["fsid"],
        "name": canon,
        "raw_name": ind["name"],
        "sex": ind["sex"],
        "birth": {
            "date": format_ged_date(b_fact.get("date_raw", "")),
            "place": b_fact.get("plac", "")
        } if b_fact else None,
        "death": {
            "date": format_ged_date(d_fact.get("date_raw", "")),
            "place": d_fact.get("plac", "")
        } if d_fact else None,
        "baptism": {
            "date": format_ged_date(c_fact.get("date_raw", "")),
            "place": c_fact.get("plac", "")
        } if c_fact else None,
        "parents": parent_ids,
        "spouses": spouse_ids,
        "children": children_ids,
        "siblings": sibling_ids,
        "fams": ind["fams"],
        "famc": ind["famc"],
        "memory": story
    }

families_data = {}
for f_id, fam in fams.items():
    m_fact = fam["mars"][0] if fam["mars"] else {}
    families_data[f_id] = {
        "id": f_id,
        "husband": fam["husb"],
        "wife": fam["wife"],
        "children": fam["chil"],
        "marriage": {
            "date": format_ged_date(m_fact.get("date_raw", "")),
            "place": m_fact.get("plac", "")
        } if m_fact else None
    }

timeline_events = []
for p in people_data.values():
    if p["birth"] and p["birth"]["date"]:
        timeline_events.append({
            "type": "BIRTH",
            "year": int(re.search(r"\d{4}", p["birth"]["date"]).group(0)) if re.search(r"\d{4}", p["birth"]["date"]) else 9999,
            "date": p["birth"]["date"],
            "personId": p["id"],
            "personName": p["name"],
            "title": f"Sinh nhật: {p['name']}"
        })
    if p["death"] and p["death"]["date"]:
        timeline_events.append({
            "type": "DEATH",
            "year": int(re.search(r"\d{4}", p["death"]["date"]).group(0)) if re.search(r"\d{4}", p["death"]["date"]) else 9999,
            "date": p["death"]["date"],
            "personId": p["id"],
            "personName": p["name"],
            "title": f"Qua đời: {p['name']}"
        })

timeline_events.sort(key=lambda x: (x["year"], x["date"]))

export_obj = {
    "publication": "Trích lục Gia phả nhà ông Trần Trọng Thu",
    "rootAnchor": "@I1@",
    "generatedAt": datetime.datetime.now().isoformat(),
    "stats": {
        "individuals": len(people_data),
        "families": len(families_data),
        "memories": len(family_stories)
    },
    "people": people_data,
    "families": families_data,
    "timeline": timeline_events,
    "memories": [
        {
            "id": k,
            "personId": next((pid for pid, p in people_data.items() if p["fsid"] == k), None),
            "personName": next((p["name"] for pid, p in people_data.items() if p["fsid"] == k), ""),
            "title": v["title"],
            "story": v["story"]
        }
        for k, v in family_stories.items()
    ]
}

with open(OUT_JSON, "w", encoding="utf-8") as f:
    json.dump(export_obj, f, ensure_ascii=False, indent=2)

print(f"Exported genealogy dataset to {OUT_JSON} ({len(people_data)} people, {len(families_data)} families)")

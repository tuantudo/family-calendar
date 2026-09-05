import os, sys, re, datetime
from collections import deque, defaultdict

REPO_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GED_PATH = os.environ.get("GEDCOM_FILE_PATH", sys.argv[1] if len(sys.argv) > 1 else "/Users/tuantq/Library/CloudStorage/OneDrive-PVCFC/Canhan/CAYGIAPHA/GIADINHONGTHU.ged")
OUT_DIR = os.path.join(REPO_DIR, "calendars")

os.makedirs(OUT_DIR, exist_ok=True)

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

def escape_text(text):
    text = text.replace("\\", "\\\\")
    text = text.replace(";", "\\;")
    text = text.replace(",", "\\,")
    text = text.replace("\r\n", "\\n").replace("\n", "\\n").replace("\r", "\\n")
    return text

def fold_line(line_str):
    line_bytes = line_str.encode("utf-8")
    if len(line_bytes) <= 75:
        return line_str

    chunks = []
    curr_chunk_bytes = bytearray()
    max_len = 75
    for ch in line_str:
        ch_bytes = ch.encode("utf-8")
        if len(curr_chunk_bytes) + len(ch_bytes) > max_len:
            chunks.append(curr_chunk_bytes.decode("utf-8"))
            curr_chunk_bytes = bytearray(b" ")
            max_len = 75
        curr_chunk_bytes.extend(ch_bytes)
        
    if curr_chunk_bytes:
        chunks.append(curr_chunk_bytes.decode("utf-8"))

    return "\r\n".join(chunks)

# Parse GEDCOM
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
                curr = {"id": tg, "husb": "", "wife": "", "chils": [], "marrs": []}
                fams[tg] = curr
                curr_type = "FAM"
                cur_fact = None
    elif curr:
        if curr_type == "INDI":
            if lvl == 1:
                if tg == "NAME": curr["name"] = vl
                elif tg == "_FSFTID": curr["fsid"] = vl
                elif tg == "SEX": curr["sex"] = vl
                elif tg == "FAMC": curr["famc"].append(vl)
                elif tg == "FAMS": curr["fams"].append(vl)
                elif tg in ("DEAT", "BIRT", "CHR"):
                    cur_fact = tg
                    fact_obj = {"date_raw": "", "plac": "", "val": vl}
                    if tg == "DEAT": curr["deats"].append(fact_obj)
                    elif tg == "BIRT": curr["birts"].append(fact_obj)
                    elif tg == "CHR": curr["chrs"].append(fact_obj)
                else:
                    cur_fact = None
            elif lvl == 2:
                if tg == "GIVN": curr["givn"] = vl
                elif tg == "SURN": curr["surn"] = vl
                elif tg == "NSFX": curr["nsfx"] = vl
                elif tg == "DATE":
                    for f_list in (curr["deats"], curr["birts"], curr["chrs"]):
                        if f_list and not f_list[-1]["date_raw"]:
                            f_list[-1]["date_raw"] = vl
                            break
                elif tg == "PLAC":
                    for f_list in (curr["deats"], curr["birts"], curr["chrs"]):
                        if f_list and not f_list[-1]["plac"]:
                            f_list[-1]["plac"] = vl
                            break
        elif curr_type == "FAM":
            if lvl == 1:
                if tg == "HUSB": curr["husb"] = vl
                elif tg == "WIFE": curr["wife"] = vl
                elif tg == "CHIL": curr["chils"].append(vl)
                elif tg == "MARR":
                    cur_fact = "MARR"
                    curr["marrs"].append({"date_raw": "", "plac": "", "val": vl})
                else:
                    cur_fact = None
            elif lvl == 2:
                if tg == "DATE" and cur_fact == "MARR" and curr["marrs"]:
                    curr["marrs"][-1]["date_raw"] = vl
                elif tg == "PLAC" and cur_fact == "MARR" and curr["marrs"]:
                    curr["marrs"][-1]["plac"] = vl

ROOT_ID = "@I1@"

# 1. Direct descendants from Root @I1@
descendants = {} # ind_id -> gen_depth
descendant_paths = {ROOT_ID: [ROOT_ID]}
q = deque([(ROOT_ID, 0, [ROOT_ID])])
descendants[ROOT_ID] = 0

while q:
    cid, gen, path = q.popleft()
    ind = indis[cid]
    for fam_id in ind["fams"]:
        fam = fams.get(fam_id)
        if not fam: continue
        for child_id in fam["chils"]:
            if child_id not in descendants:
                descendants[child_id] = gen + 1
                descendant_paths[child_id] = path + [child_id]
                q.append((child_id, gen + 1, path + [child_id]))

# 2. Spouses of Direct Descendants
desc_spouses = {}
for did in descendants:
    for fam_id in indis[did]["fams"]:
        fam = fams.get(fam_id)
        if not fam: continue
        sp = fam["wife"] if fam["husb"] == did else fam["husb"]
        if sp and sp not in descendants and sp not in desc_spouses:
            desc_spouses[sp] = (did, descendants[did])

# 3. Ancestors of Root
ancestors = set()
root_famc = indis[ROOT_ID]["famc"]
collaterals = {}
if root_famc:
    rfam = fams.get(root_famc[0])
    if rfam:
        if rfam["husb"]: ancestors.add(rfam["husb"])
        if rfam["wife"]: ancestors.add(rfam["wife"])
        for ch in rfam["chils"]:
            if ch != ROOT_ID and ch not in collaterals:
                collaterals[ch] = "Sibling of Root"

# 4. Spouses of Collaterals & Descendants of Collaterals
collateral_desc = {}
for col_id in list(collaterals.keys()):
    q_col = deque([(col_id, 1, [col_id])])
    while q_col:
        cid, gen, path = q_col.popleft()
        for fam_id in indis[cid]["fams"]:
            fam = fams.get(fam_id)
            if not fam: continue
            for ch in fam["chils"]:
                if ch not in descendants and ch not in collaterals and ch not in collateral_desc:
                    collateral_desc[ch] = (col_id, gen)
                    q_col.append((ch, gen + 1, path + [ch]))

collateral_spouses = {}
for cid in list(collaterals.keys()) + list(collateral_desc.keys()):
    for fam_id in indis[cid]["fams"]:
        fam = fams.get(fam_id)
        if not fam: continue
        sp = fam["wife"] if fam["husb"] == cid else fam["husb"]
        if sp and sp not in descendants and sp not in desc_spouses and sp not in collaterals and sp not in collateral_desc and sp not in collateral_spouses:
            collateral_spouses[sp] = cid

# Branch Name Derivation
branch_map = {
    "@I18@": "Nhánh Cụ Thư (Trần Trọng Thư)",
    "@I7@": "Nhánh Bà Vị (Trần Thị Vị)",
    "@I21@": "Nhánh Cụ Thả (Trần Trọng Thả)",
    "@I6@": "Nhánh Bà Thi (Trần Thị Thi)",
    "@I2@": "Nhánh Bà Cử (Bà Cử - hai)",
    "@I3@": "Nhánh Bà Định (Bà Định - thứ tư)"
}

def get_branch_name(ind_id):
    if ind_id == ROOT_ID:
        return "Gốc Cụ Tổ (Root)"
    if ind_id in branch_map:
        return branch_map[ind_id]
    if ind_id in descendants:
        p = descendant_paths[ind_id]
        if len(p) > 1 and p[1] in branch_map:
            return branch_map[p[1]]
    if ind_id in desc_spouses:
        did, _ = desc_spouses[ind_id]
        p = descendant_paths[did]
        if len(p) > 1 and p[1] in branch_map:
            return branch_map[p[1]]
    if ind_id in collaterals or ind_id in collateral_desc or ind_id in collateral_spouses:
        return "Nhánh Bàng Hệ (Cố An / Trương Công Trạng)"
    if ind_id in ancestors:
        return "Tiền Phương (Thân sinh Cụ Thu)"
    return "Chưa xác định nhánh"

def get_root_relationship(ind_id):
    if ind_id == ROOT_ID:
        return "Trục Gốc Gia Tộc (Root Anchor)"
    if ind_id in ancestors:
        sex = indis[ind_id].get("sex", "")
        return "Thân phụ Cụ Thu" if sex == "M" else "Thân mẫu Cụ Thu"
    if ind_id in collaterals:
        return "Chị/Em ruột Cụ Thu"
    if ind_id in collateral_spouses:
        return "Dâu/Rể nhánh Bàng Hệ (Chị/Em Cụ Thu)"
    if ind_id in descendants:
        gen = descendants[ind_id]
        gen_labels = {
            1: "Con trực hệ (F1)",
            2: "Cháu trực hệ (F2)",
            3: "Chắt trực hệ (F3)",
            4: "Chút trực hệ (F4)",
            5: "Chít trực hệ (F5)"
        }
        sex = indis[ind_id].get("sex", "")
        if gen == 1:
            return "Con trai trực hệ (F1)" if sex == "M" else "Con gái trực hệ (F1)"
        return gen_labels.get(gen, f"Hậu duệ trực hệ (F{gen})")
    if ind_id in desc_spouses:
        did, gen = desc_spouses[ind_id]
        fam_obj = None
        for f_id in indis[ind_id]["fams"]:
            if f_id in indis[did]["fams"]:
                fam_obj = fams[f_id]
                break
        is_wife = fam_obj and fam_obj.get("wife") == ind_id
        role = "Dâu" if is_wife else "Rể"
        if gen == 0:
            return "Phối ngẫu Cụ Thu (Cụ Bà)"
        return f"{role} nhánh trực hệ (F{gen})"
    return "Chưa xác định liên kết trong gia phả"

def get_family_graph_path(ind_id):
    canon = reconstruct_canonical_name(indis[ind_id])
    if ind_id == ROOT_ID:
        return [canon, "Trần Cha Ông cố Thu - bà An (thân phụ)"]
    if ind_id in ancestors:
        return [canon, "Giuse Trần Trọng Thu (con trai)"]
    if ind_id in collaterals:
        return [canon, "Trần Cha Ông cố Thu - bà An (thân phụ chung)", "Giuse Trần Trọng Thu (em/anh trai)"]
    if ind_id in collateral_spouses:
        sp_id = collateral_spouses[ind_id]
        sp_canon = reconstruct_canonical_name(indis[sp_id])
        return [canon, f"{sp_canon} (phối ngẫu)", "Trần Cha Ông cố Thu - bà An (thân phụ chung)", "Giuse Trần Trọng Thu"]
    if ind_id in descendants:
        p_ids = descendant_paths[ind_id] # [ROOT_ID, ..., ind_id]
        names = [reconstruct_canonical_name(indis[i]) for i in reversed(p_ids)]
        return names
    if ind_id in desc_spouses:
        did, _ = desc_spouses[ind_id]
        sp_canon = reconstruct_canonical_name(indis[did])
        fam_obj = None
        for f_id in indis[ind_id]["fams"]:
            if f_id in indis[did]["fams"]:
                fam_obj = fams[f_id]
                break
        is_wife = fam_obj and fam_obj.get("wife") == ind_id
        sp_role = "chồng" if is_wife else "vợ"
        p_ids = descendant_paths[did]
        p_names = [reconstruct_canonical_name(indis[i]) for i in reversed(p_ids)]
        return [canon, f"{sp_canon} ({sp_role})"] + p_names[1:]
    return [canon]

def build_common_graph_context_lines(ind_id):
    ind = indis[ind_id]
    lines_ctx = []
    
    # Nuclear family
    father_name = ""
    mother_name = ""
    if ind.get("famc"):
        fam_obj = fams.get(ind["famc"][0])
        if fam_obj:
            if fam_obj.get("husb") and fam_obj.get("husb") in indis:
                father_name = reconstruct_canonical_name(indis[fam_obj["husb"]])
            if fam_obj.get("wife") and fam_obj.get("wife") in indis:
                mother_name = reconstruct_canonical_name(indis[fam_obj["wife"]])
                
    spouses = []
    for f_id in ind.get("fams", []):
        fam_obj = fams.get(f_id)
        if not fam_obj: continue
        sp_id = fam_obj.get("wife") if fam_obj.get("husb") == ind_id else fam_obj.get("husb")
        if sp_id and sp_id in indis:
            sp_name = reconstruct_canonical_name(indis[sp_id])
            sp_role = "vợ" if fam_obj.get("wife") == sp_id else "chồng"
            spouses.append(f"{sp_name} ({sp_role})")
            
    if father_name: lines_ctx.append(f"Cha: {father_name}")
    if mother_name: lines_ctx.append(f"Mẹ: {mother_name}")
    if spouses: lines_ctx.append(f"Vợ/Chồng: {', '.join(spouses)}")
    if father_name or mother_name or spouses: lines_ctx.append("")
    
    # Relationship & Branch
    rel_str = get_root_relationship(ind_id)
    br_str = get_branch_name(ind_id)
    lines_ctx.append(f"Quan hệ với Cụ Thu: {rel_str}")
    lines_ctx.append(f"Nhánh gia đình: {br_str}")
    lines_ctx.append("")
    
    # Lineage path
    path = get_family_graph_path(ind_id)
    lines_ctx.append("Dòng gia đình:")
    for idx, step in enumerate(path):
        if idx == 0:
            lines_ctx.append(step)
        else:
            lines_ctx.append(f"→ {step}")
            
    lines_ctx.append("")
    lines_ctx.append(f"FSID: {ind['fsid']}")
    return lines_ctx


# FAMILY MEMORY / NARRATIVE STORIES (PILOT)
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

# LUNAR VERIFIED DATA
lunar_verified = {
    "G5XW-XBH": "28/10 Âm Lịch (Quý Mão 2023)",
    "G5XX-NKK": "10/01 Âm Lịch (Quý Mão 2023)",
    "G5XX-YR6": "25/01 Âm Lịch (Ất Mùi 2015)",
    "G5XX-KTZ": "05/08 Âm Lịch (Canh Thìn 2000)"
}

print("Loaded and initialized graph context engine.")

# ==========================================
# 1. GENERATE CAL_01_BIRTHDAYS.ics
# ==========================================
birt_events = []
for ind in indis.values():
    if not ind["birts"]: continue
    b_fact = ind["birts"][0]
    raw_d = b_fact.get("date_raw", "").strip()
    m_exact = re.match(r"^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$", raw_d, re.I)
    if not m_exact: continue
    
    day = int(m_exact.group(1))
    mon_str = m_exact.group(2).upper()
    year = int(m_exact.group(3))
    if mon_str not in MONTH_MAP: continue
    mon = int(MONTH_MAP[mon_str])
    
    canon = reconstruct_canonical_name(ind)
    summary = f"🎂 Sinh nhật — {canon}"
    
    dt_start = datetime.date(year, mon, day)
    dt_end = dt_start + datetime.timedelta(days=1)
    
    desc = ["🎂 Sinh nhật", "", f"Tên: {canon}", "", f"Ngày sinh: {day:02d}/{mon:02d}/{year:04d}"]
    if b_fact.get("plac"):
        desc.append(f"Nơi sinh: {b_fact['plac']}")
        
    # Check if person is deceased
    if ind["deats"]:
        d_fact = ind["deats"][0]
        d_raw = d_fact.get("date_raw", "").strip()
        d_fmt = format_ged_date(d_raw) if d_raw else "Đã qua đời"
        desc.append(f"Ngày mất: {d_fmt}")
        
    desc.append("")
    desc.extend(build_common_graph_context_lines(ind["id"]))
    
    birt_events.append({
        "uid": f"birthday-{ind['fsid']}@giadinhongthu.vn",
        "summary": summary,
        "dtstart": f"{year:04d}{mon:02d}{day:02d}",
        "dtend": f"{dt_end.year:04d}{dt_end.month:02d}{dt_end.day:02d}",
        "description": "\n".join(desc)
    })

print(f"CAL_01_BIRTHDAYS events generated: {len(birt_events)}")

# ==========================================
# 2. GENERATE CAL_02_PATRON_FEASTS.ics
# ==========================================
# Load Patron Feasts mapping from existing patron feast catalog
feast_catalog = {
    "Giuse": ("19", "03", "Thánh Giuse (Bạn Trăm Năm Đức Maria)"),
    "Maria": ("01", "01", "Đức Mẹ là Mẹ Thiên Chúa"),
    "Maria Chiara": ("11", "08", "Thánh Nữ Clara (Maria Chiara)"),
    "Clara": ("11", "08", "Thánh Nữ Clara"),
    "Gioan": ("27", "12", "Thánh Gioan Tông Đồ"),
    "Gioan Baotixita": ("24", "06", "Sinh Nhật Thánh Gioan Tẩy Giả"),
    "Anna": ("26", "07", "Thánh Gioakim và Thánh Anna"),
    "Gioakim": ("26", "07", "Thánh Gioakim và Thánh Anna"),
    "Têrêsa": ("01", "10", "Thánh Têrêsa Hài Đồng Giêsu"),
    "Teresa": ("01", "10", "Thánh Têrêsa Hài Đồng Giêsu"),
    "Têrêxa": ("01", "10", "Thánh Têrêsa Hài Đồng Giêsu"),
    "Terresa": ("01", "10", "Thánh Têrêsa Hài Đồng Giêsu"),
    "Phêrô": ("29", "06", "Thánh Phêrô và Thánh Phaolô"),
    "Phaolô": ("29", "06", "Thánh Phêrô và Thánh Phaolô"),
    "Phao lô": ("29", "06", "Thánh Phêrô và Thánh Phaolô"),
    "Phaolo": ("29", "06", "Thánh Phêrô và Thánh Phaolô"),
    "Giacôbê": ("25", "07", "Thánh Giacôbê Tông Đồ"),
    "Đaminh": ("08", "08", "Thánh Đaminh"),
    "Đa Minh": ("08", "08", "Thánh Đaminh"),
    "Phanxicô": ("04", "10", "Thánh Phanxicô Assisi"),
    "Marta": ("29", "07", "Thánh Marta"),
    "Mácta": ("29", "07", "Thánh Marta"),
    "Anrê": ("30", "11", "Thánh Anrê Tông Đồ"),
    "Antôn": ("13", "06", "Thánh Antôn Padua"),
    "Anton": ("13", "06", "Thánh Antôn Padua"),
    "An-tôn": ("13", "06", "Thánh Antôn Padua"),
    "Catarina": ("29", "04", "Thánh Catarina Siena"),
    "Cataria": ("29", "04", "Thánh Catarina Siena"),
    "Cecilia": ("22", "11", "Thánh Cecilia"),
    "Matthêu": ("21", "09", "Thánh Matthêu"),
    "Mattheu": ("21", "09", "Thánh Matthêu"),
    "Luca": ("18", "10", "Thánh Luca"),
    "Tôma": ("03", "07", "Thánh Tôma Tông Đồ"),
    "Toma": ("03", "07", "Thánh Tôma Tông Đồ"),
    "Geronimo": ("30", "09", "Thánh Giêrônimô"),
    "Ghêgonô": ("03", "09", "Thánh Grêgôriô"),
    "Lucia": ("13", "12", "Thánh Lucia"),
    "Agata": ("05", "02", "Thánh Agata"),
    "Madalena": ("22", "07", "Thánh Maria Mađalêna"),
    "Inhaxiô": ("31", "07", "Thánh Inhaxiô Loyola"),
    "Augustinô": ("28", "08", "Thánh Augustinô"),
    "Vinh Sơn": ("05", "04", "Thánh Vinh Sơn Phaolô"),
    "Vinhsơn": ("05", "04", "Thánh Vinh Sơn Phaolô"),
    "Báctôlômêô": ("24", "08", "Thánh Batôlômêô"),
    "Bonaventura": ("15", "07", "Thánh Bônavêntura"),
    "Agnest": ("21", "01", "Thánh Anê"),
    "Inne": ("21", "01", "Thánh Anê")
}

def extract_patron_name(ind):
    canon = reconstruct_canonical_name(ind)
    # Check compound first
    for cn in sorted(feast_catalog.keys(), key=lambda x: -len(x)):
        if re.search(r"^\b" + re.escape(cn) + r"\b", canon, re.I):
            return cn
    return None

patron_events = []
for ind in indis.values():
    cname = extract_patron_name(ind)
    if not cname: continue
    
    day_str, mon_str, saint_title = feast_catalog[cname]
    day = int(day_str)
    mon = int(mon_str)
    year = 2026 # Standard recurring baseline year
    
    canon = reconstruct_canonical_name(ind)
    summary = f"✝️ Bổn mạng {cname} — {canon}"
    
    dt_start = datetime.date(year, mon, day)
    dt_end = dt_start + datetime.timedelta(days=1)
    
    desc = [
        "✝️ Lễ Bổn Mạng",
        "",
        f"Tên: {canon}",
        f"Tên Thánh: {cname}",
        f"Ngày lễ kính: {day:02d}/{mon:02d} hàng năm ({saint_title})"
    ]
    
    b_fact = ind["birts"][0] if ind["birts"] else {}
    b_raw = b_fact.get("date_raw", "").strip()
    b_plac = b_fact.get("plac", "").strip()
    if b_raw: desc.append(f"Ngày sinh: {format_ged_date(b_raw)}")
    if b_plac: desc.append(f"Nơi sinh: {b_plac}")
    
    if ind["deats"]:
        d_fact = ind["deats"][0]
        d_raw = d_fact.get("date_raw", "").strip()
        d_fmt = format_ged_date(d_raw) if d_raw else "Đã qua đời"
        desc.append(f"Ngày mất: {d_fmt}")
        
    desc.append("")
    desc.extend(build_common_graph_context_lines(ind["id"]))
    
    patron_events.append({
        "uid": f"patron-{ind['fsid']}@giadinhongthu.vn",
        "summary": summary,
        "dtstart": f"{year:04d}{mon:02d}{day:02d}",
        "dtend": f"{dt_end.year:04d}{dt_end.month:02d}{dt_end.day:02d}",
        "description": "\n".join(desc)
    })

print(f"CAL_02_PATRON_FEASTS events generated: {len(patron_events)}")

# ==========================================
# 3. GENERATE CAL_03_MEMORIALS.ics
# ==========================================
memorial_events = []
deat_indis = [ind for ind in indis.values() if ind["deats"]]

for ind in deat_indis:
    canon = reconstruct_canonical_name(ind)
    summary = f"🕯️ Ngày giỗ — {canon}"
    
    deat_fact = ind["deats"][0]
    d_raw = deat_fact.get("date_raw", "").strip()
    d_plac = deat_fact.get("plac", "").strip()
    
    b_fact = ind["birts"][0] if ind["birts"] else {}
    b_raw = b_fact.get("date_raw", "").strip()
    b_plac = b_fact.get("plac", "").strip()
    
    m_exact = re.match(r"^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$", d_raw, re.I)
    
    if m_exact:
        is_exact = True
        day = int(m_exact.group(1))
        mon_str = m_exact.group(2).upper()
        year = int(m_exact.group(3))
        mon = int(MONTH_MAP[mon_str])
        dt_start = datetime.date(year, mon, day)
        dt_end = dt_start + datetime.timedelta(days=1)
        start_str = f"{year:04d}{mon:02d}{day:02d}"
        end_str = f"{dt_end.year:04d}{dt_end.month:02d}{dt_end.day:02d}"
        formatted_deat = f"{day:02d}/{mon:02d}/{year:04d}"
    else:
        is_exact = False
        prov_year = int(d_raw) if re.match(r"^\d{4}$", d_raw) else 2026
        dt_start = datetime.date(prov_year, 1, 1)
        dt_end = datetime.date(prov_year, 1, 2)
        start_str = f"{prov_year:04d}0101"
        end_str = f"{prov_year:04d}0102"
        formatted_deat = format_ged_date(d_raw) if d_raw else "Chưa xác định chính xác"

    desc = ["🕯️ Tưởng niệm", "", f"Tên: {canon}", ""]
    
    b_fmt = format_ged_date(b_raw)
    if b_fmt: desc.append(f"Ngày sinh: {b_fmt}")
    if b_plac: desc.append(f"Nơi sinh: {b_plac}")
    if b_fmt or b_plac: desc.append("")
    
    desc.append(f"Ngày mất: {formatted_deat}")
    if d_plac: desc.append(f"Nơi qua đời: {d_plac}")
    desc.append("")
    
    if is_exact:
        desc.append("Trạng thái ngày giỗ: CHÍNH XÁC")
    else:
        desc.append("Trạng thái ngày giỗ: TẠM THỜI")
        desc.append("Ngày tưởng niệm tạm thời: 01/01 hàng năm")
        
    if ind["fsid"] in lunar_verified:
        desc.append(f"Âm lịch: {lunar_verified[ind['fsid']]}")
    desc.append("")
    
    desc.extend(build_common_graph_context_lines(ind["id"]))
    
    if ind["fsid"] in family_stories:
        story_info = family_stories[ind["fsid"]]
        desc.append("")
        desc.append("────────────────────")
        desc.append(story_info["title"])
        desc.append("────────────────────")
        desc.append(story_info["story"])
        
    memorial_events.append({
        "uid": f"memorial-{ind['fsid']}@giadinhongthu.vn",
        "summary": summary,
        "dtstart": start_str,
        "dtend": end_str,
        "description": "\n".join(desc)
    })

print(f"CAL_03_MEMORIALS events generated: {len(memorial_events)}")

# ==========================================
# 4. GENERATE CAL_04_FAMILY_MILESTONES.ics
# ==========================================
milestone_events = []

# Marriages
for f_id, fam in fams.items():
    if not fam["marrs"]: continue
    m_fact = fam["marrs"][0]
    raw_d = m_fact.get("date_raw", "").strip()
    m_exact = re.match(r"^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$", raw_d, re.I)
    if not m_exact: continue
    
    day = int(m_exact.group(1))
    mon_str = m_exact.group(2).upper()
    year = int(m_exact.group(3))
    if mon_str not in MONTH_MAP: continue
    mon = int(MONTH_MAP[mon_str])
    
    h_ind = indis.get(fam["husb"], {})
    w_ind = indis.get(fam["wife"], {})
    h_name = reconstruct_canonical_name(h_ind) if h_ind else "Chồng"
    w_name = reconstruct_canonical_name(w_ind) if w_ind else "Vợ"
    
    summary = f"💍 Kỷ niệm hôn phối — {h_name} & {w_name}"
    dt_start = datetime.date(year, mon, day)
    dt_end = dt_start + datetime.timedelta(days=1)
    
    desc = [
        "💍 Kỷ niệm hôn phối",
        "",
        f"Chồng: {h_name}",
        f"Vợ: {w_name}",
        f"Ngày thành hôn: {day:02d}/{mon:02d}/{year:04d}"
    ]
    if m_fact.get("plac"):
        desc.append(f"Nơi kết hôn: {m_fact['plac']}")
    desc.append("")
    
    desc.append("Định vị gia phả:")
    if h_ind:
        h_rel = get_root_relationship(h_ind["id"])
        desc.append(f"- Phía Chồng ({h_name}): {h_rel}")
    if w_ind:
        w_rel = get_root_relationship(w_ind["id"])
        desc.append(f"- Phía Vợ ({w_name}): {w_rel}")
    desc.append("")
    
    # Lineage for couple
    if h_ind and h_ind["id"] in descendants:
        p_path = get_family_graph_path(h_ind["id"])
        desc.append(f"Dòng gia đình (Phía Chồng):")
        for idx, step in enumerate(p_path):
            if idx == 0: desc.append(step)
            else: desc.append(f"→ {step}")
    elif w_ind and w_ind["id"] in descendants:
        p_path = get_family_graph_path(w_ind["id"])
        desc.append(f"Dòng gia đình (Phía Vợ):")
        for idx, step in enumerate(p_path):
            if idx == 0: desc.append(step)
            else: desc.append(f"→ {step}")
            
    desc.append("")
    desc.append(f"FSID: {h_ind.get('fsid', '')} / {w_ind.get('fsid', '')}")
    
    milestone_events.append({
        "uid": f"milestone-marr-{f_id.replace('@', '')}@giadinhongthu.vn",
        "summary": summary,
        "dtstart": f"{year:04d}{mon:02d}{day:02d}",
        "dtend": f"{dt_end.year:04d}{dt_end.month:02d}{dt_end.day:02d}",
        "description": "\n".join(desc)
    })

# Baptisms / CHR
for ind in indis.values():
    if not ind["chrs"]: continue
    c_fact = ind["chrs"][0]
    raw_d = c_fact.get("date_raw", "").strip()
    m_exact = re.match(r"^(\d{1,2})\s+([A-Z]{3})\s+(\d{4})$", raw_d, re.I)
    if not m_exact: continue
    
    day = int(m_exact.group(1))
    mon_str = m_exact.group(2).upper()
    year = int(m_exact.group(3))
    if mon_str not in MONTH_MAP: continue
    mon = int(MONTH_MAP[mon_str])
    
    canon = reconstruct_canonical_name(ind)
    summary = f"🕊️ Kỷ niệm Rửa Tội — {canon}"
    dt_start = datetime.date(year, mon, day)
    dt_end = dt_start + datetime.timedelta(days=1)
    
    desc = [
        "🕊️ Kỷ niệm Bí Tích Rửa Tội",
        "",
        f"Tên: {canon}",
        f"Ngày Rửa Tội: {day:02d}/{mon:02d}/{year:04d}"
    ]
    if c_fact.get("plac"):
        desc.append(f"Nơi Rửa Tội: {c_fact['plac']}")
    desc.append("")
    desc.extend(build_common_graph_context_lines(ind["id"]))
    
    milestone_events.append({
        "uid": f"milestone-chr-{ind['fsid']}@giadinhongthu.vn",
        "summary": summary,
        "dtstart": f"{year:04d}{mon:02d}{day:02d}",
        "dtend": f"{dt_end.year:04d}{dt_end.month:02d}{dt_end.day:02d}",
        "description": "\n".join(desc)
    })

print(f"CAL_04_FAMILY_MILESTONES events generated: {len(milestone_events)}")

# ==========================================
# WRITE ALL 4 ICS FILES
# ==========================================
cal_configs = [
    ("CAL_01_BIRTHDAYS.ics", "Sinh Nhật Gia Đình", birt_events),
    ("CAL_02_PATRON_FEASTS.ics", "Lễ Bổn Mạng Gia Đình", patron_events),
    ("CAL_03_MEMORIALS.ics", "Ngày Giỗ & Tưởng Niệm", memorial_events),
    ("CAL_04_FAMILY_MILESTONES.ics", "Kỷ Niệm Gia Đình & Bí Tích", milestone_events)
]

for filename, cal_title, ev_list in cal_configs:
    lines_out = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CAY GIA PHA//Calendar Projection//VI",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        f"X-WR-CALNAME:{cal_title}",
        "X-WR-TIMEZONE:Asia/Ho_Chi_Minh"
    ]
    for ev in ev_list:
        lines_out.append("BEGIN:VEVENT")
        lines_out.append(fold_line(f"UID:{ev['uid']}"))
        lines_out.append("DTSTAMP:20260903T000000Z")
        lines_out.append(fold_line(f"SUMMARY:{escape_text(ev['summary'])}"))
        lines_out.append(f"DTSTART;VALUE=DATE:{ev['dtstart']}")
        lines_out.append(f"DTEND;VALUE=DATE:{ev['dtend']}")
        lines_out.append("RRULE:FREQ=YEARLY")
        lines_out.append("TRANSP:TRANSPARENT")
        lines_out.append(fold_line(f"DESCRIPTION:{escape_text(ev['description'])}"))
        lines_out.append("END:VEVENT")
    lines_out.append("END:VCALENDAR")
    
    content = "\r\n".join(lines_out) + "\r\n"
    raw_bytes = content.encode("utf-8")
    target_path = os.path.join(OUT_DIR, filename)
    with open(target_path, "wb") as f:
        f.write(raw_bytes)
    print(f"Wrote {filename}: {len(ev_list)} events | {len(raw_bytes):,} bytes")

#!/usr/bin/env python3
import os
import re
import json
import shutil

OBSIDIAN_ROOT = "/Users/tuantq/Obsidian/20_PROJECTS/Mach"
OBSIDIAN_PROJECTS = os.path.join(OBSIDIAN_ROOT, "PROJECTS")
ISSUE_01_DIR = os.path.join(OBSIDIAN_PROJECTS, "ISSUE_01", "CANONICAL")
CLARA_DIR = os.path.join(OBSIDIAN_ROOT, "Thư gửi Clara")

REPO_ROOT = "/Users/tuantq/Projects/Personal/family-calendar"
CONTENT_DIR = os.path.join(REPO_ROOT, "content", "mach")
DATA_FILE = os.path.join(REPO_ROOT, "data", "mach.json")

# 1. ISSUE 01 REGISTRY
ISSUE_01_REGISTRY = [
    {
        "file": "01 — GIỚI THIỆU.md",
        "slug": "01-gioi-thieu",
        "order": 1,
        "title": "Giới Thiệu: MẠCH được bắt đầu như thế nào?",
        "shortTitle": "Giới thiệu",
        "subtitle": "Khởi đầu của hành trình tìm lại những mạch nối gia đình.",
        "section": "Lời mở",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["loi-mo", "the-he"]
    },
    {
        "file": "02 — CÂY GIA PHẢ & MẠCH.md",
        "slug": "02-cay-gia-pha-va-mach",
        "order": 2,
        "title": "Cây Gia Phả & Mạch",
        "shortTitle": "Cây gia phả & Mạch",
        "subtitle": "Hai hình thức lưu giữ cấu trúc và ký ức sống gia đình.",
        "section": "Lời mở",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["loi-mo", "ky-uc"]
    },
    {
        "file": "03 — KHI SỰ GẦN GŨI KHÔNG CÒN TỰ NHIÊN.md",
        "slug": "03-khi-su-gan-gui-khong-con-tu-nhien",
        "order": 3,
        "title": "Khi Sự Gần Gũi Không Còn Tự Nhiên",
        "shortTitle": "Khi sự gần gũi không còn tự nhiên",
        "subtitle": "Khi sự tiếp nối không còn tự vận hành như trước nữa.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "the-he"]
    },
    {
        "file": "04 — TỪ HỆ TƯ TƯỞNG ĐẾN ĐẠO LÝ ĐỜI SỐNG.md",
        "slug": "04-tu-he-tu-tuong-den-dao-ly-doi-song",
        "order": 4,
        "title": "Từ Hệ Tư Tưởng Đến Đạo Lý Đời Sống",
        "shortTitle": "Từ hệ tư tưởng đến đạo lý đời sống",
        "subtitle": "Khi những hệ tư tưởng lớn co lại thành vài câu đủ để đời sống tiếp tục vận hành.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "gia-phong"]
    },
    {
        "file": "05 — NHỮNG KHẾ ƯỚC VÔ HÌNH CỦA DÒNG HỌ.md",
        "slug": "05-nhung-khe-uoc-vo-hinh-cua-dong-ho",
        "order": 5,
        "title": "Những Khế Ước Vô Hình Của Dòng Họ",
        "shortTitle": "Những khế ước vô hình của dòng họ",
        "subtitle": "Khi sự hiện diện dần trở thành một dạng nghĩa vụ khó gọi tên.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "nghi-le"]
    },
    {
        "file": "06 — GIỖ VÀ KÝ ỨC GIA ĐÌNH.md",
        "slug": "06-gio-va-ky-uc-gia-dinh",
        "order": 6,
        "title": "Giỗ Và Ký Ức Gia Đình",
        "shortTitle": "Giỗ và ký ức gia đình",
        "subtitle": "Những dịp gặp mặt còn giữ được ký ức gia đình.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "nghi-le", "ky-uc"]
    },
    {
        "file": "07 — MỘ TỔ VÀ CẢM THỨC QUAY VỀ.md",
        "slug": "07-mo-to-va-cam-thuc-quay-ve",
        "order": 7,
        "title": "Mộ Tổ Và Cảm Thức Quay Về",
        "shortTitle": "Mộ tổ và cảm thức quay về",
        "subtitle": "Nơi nhiều người vẫn tiếp tục quay về sau khi người sống đã tách xa nhau.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "ky-uc"]
    },
    {
        "file": "08 — ĐÁM CƯỚI NHƯ MỘT DẤU CHUYỂN THẾ HỆ.md",
        "slug": "08-dam-cuoi-nhu-mot-dau-chuyen-the-he",
        "order": 8,
        "title": "Đám Cưới Như Một Dấu Chuyển Thế Hệ",
        "shortTitle": "Đám cưới như một dấu chuyển thế hệ",
        "subtitle": "Khi một dòng họ tiếp tục chính nó qua những thế hệ mới.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "the-he", "nghi-le"]
    },
    {
        "file": "09 — VÌ SAO CON CHÁU CÒN QUAY VỀ NGÀY TẾT?.md",
        "slug": "09-vi-sao-con-chau-con-quay-ve-ngay-tet",
        "order": 9,
        "title": "Vì Sao Con Cháu Còn Quay Về Ngày Tết?",
        "shortTitle": "Vì sao con cháu còn quay về ngày Tết?",
        "subtitle": "Những dịp quay về hiếm hoi trong năm.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "nghi-le"]
    },
    {
        "file": "10 — GIA ĐÌNH HẠT NHÂN VÀ SỰ CHUYỂN ĐỔI CỦA ĐẠI GIA ĐÌNH.md",
        "slug": "10-gia-dinh-hat-nhan-va-su-chuyen-doi",
        "order": 10,
        "title": "Gia Đình Hạt Nhân Và Sự Chuyển Đổi Của Đại Gia Đình",
        "shortTitle": "Gia đình hạt nhân và sự chuyển đổi của đại gia đình",
        "subtitle": "Khi nhiều thế hệ không còn sống trong cùng một cấu trúc.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "the-he"]
    },
    {
        "file": "11 — NHỮNG NGƯỜI KHÔNG CÒN QUAY VỀ NỮA.md",
        "slug": "11-nhung-nguoi-khong-con-quay-ve-nua",
        "order": 11,
        "title": "Những Người Không Còn Quay Về Nữa",
        "shortTitle": "Những người không còn quay về nữa",
        "subtitle": "Khi một người dần biến mất khỏi mạch gia đình.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "topics": ["luan", "ky-uc"]
    },
    {
        "file": "12 — GHI CHÚ & CHÚ GIẢI.md",
        "slug": "12-ghi-chu-va-chu-giai",
        "order": 12,
        "title": "Ghi Chú & Chú Giải",
        "shortTitle": "Ghi chú & Chú giải",
        "subtitle": "Các ghi chú biên tập và footnotes.",
        "section": "Tư liệu & Ghi chú",
        "authorId": "mach-editorial",
        "articleType": "historical",
        "topics": ["tu-lieu"]
    }
]

# 2. THƯ GỬI CLARA REGISTRY
CLARA_REGISTRY = [
    {
        "file": "Thư gửi Clara - 001.md",
        "slug": "clara-001",
        "order": 1,
        "title": "Thư gửi Clara — Số 01: Điểm Tựa Cuộc Đời",
        "shortTitle": "Thư 01: Điểm tựa cuộc đời",
        "subtitle": "Tên thánh, tên khai sinh và gia đình — những điều đầu tiên con không tự chọn khi đến với thế gian.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "22/07/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/001.png",
        "topics": ["thu-tu", "the-he", "duc-tin"]
    },
    {
        "file": "Thư gửi Clara - 002.md",
        "slug": "clara-002",
        "order": 2,
        "title": "Thư gửi Clara — Số 02: Quyết Định Chuyển Dời",
        "shortTitle": "Thư 02: Quyết định chuyển dời",
        "subtitle": "Con người luôn là con của thời đại mình đang sống và những quyết định định hình nhiều thế hệ.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "30/07/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/002.png",
        "topics": ["thu-tu", "the-he", "ky-uc"]
    },
    {
        "file": "Thư gửi Clara - 003.md",
        "slug": "clara-003",
        "order": 3,
        "title": "Thư gửi Clara — Số 03: Cảm Thức Cộng Đồng",
        "shortTitle": "Thư 03: Cảm thức cộng đồng",
        "subtitle": "Khoảng cách giữa những người cùng một dòng máu và sự suy tàn âm thầm của cảm thức chung.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "16/08/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/003.png",
        "topics": ["thu-tu", "the-he", "ky-uc"]
    },
    {
        "file": "Thư gửi Clara - 004.md",
        "slug": "clara-004",
        "order": 4,
        "title": "Thư gửi Clara — Số 04: Cái Tôi Khái Niệm Hóa",
        "shortTitle": "Thư 04: Cái tôi khái niệm hóa",
        "subtitle": "Những vai trò mà cuộc đời và xã hội gán lên vai mỗi con người.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "22/08/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/004.png",
        "topics": ["thu-tu", "gia-phong"]
    },
    {
        "file": "Thư gửi Clara - 005.md",
        "slug": "clara-005",
        "order": 5,
        "title": "Thư gửi Clara — Số 05: Vai Trò Nội Tâm Hóa",
        "shortTitle": "Thư 05: Vai trò nội tâm hóa",
        "subtitle": "Nhìn thẳng vào những vai trò được gán ghép và quán tính của trật tự cũ trong chính mình.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "27/08/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/005.png",
        "topics": ["thu-tu", "gia-phong", "the-he"]
    },
    {
        "file": "Thư gửi Clara - 006.md",
        "slug": "clara-006",
        "order": 6,
        "title": "Thư gửi Clara — Số 06: Tự Do Trước Quá Khứ",
        "shortTitle": "Thư 06: Tự do trước quá khứ",
        "subtitle": "Viết không phải để tạo nên món nợ tinh thần mà để con tự do xây dựng đời sống của chính mình.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "27/08/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/006.png",
        "topics": ["thu-tu", "the-he"]
    },
    {
        "file": "Thư gửi Clara, Rina, Tina, Tin và Tito - 007.md",
        "slug": "clara-007",
        "order": 7,
        "title": "Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do",
        "shortTitle": "Thư 07: Thể diện, sĩ diện & tự do",
        "subtitle": "Thể diện, sĩ diện, cái nhìn của người đời và sự tự do nội tâm trước cuộc đời rộng lớn.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "date": "03/09/2026",
        "coverImage": "assets/images/mach/thu-gui-clara/007.png",
        "topics": ["thu-tu", "gia-phong", "the-he"]
    }
]

def clean_excerpt(text):
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"!\[.*?\]\(.*?\)", " ", text)
    text = re.sub(r"\[.*?\]\(.*?\)", " ", text)
    text = re.sub(r"#+\s+.*", " ", text)
    text = re.sub(r"\[\[.*?\]\]", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    words = text.split()
    if len(words) > 35:
        return " ".join(words[:35]) + "..."
    return text

def build():
    # 1. Reset content directories
    target_issue01_dir = os.path.join(CONTENT_DIR, "issue-01")
    target_clara_dir = os.path.join(CONTENT_DIR, "thu-gui-clara")
    os.makedirs(target_issue01_dir, exist_ok=True)
    os.makedirs(target_clara_dir, exist_ok=True)

    # 2. Copy 00 — MỤC LỤC.md as reference
    if os.path.exists(os.path.join(ISSUE_01_DIR, "00 — MỤC LỤC.md")):
        shutil.copy2(os.path.join(ISSUE_01_DIR, "00 — MỤC LỤC.md"), os.path.join(target_issue01_dir, "00 — MỤC LỤC.md"))

    all_stories = []

    # Process ISSUE 01
    for item in ISSUE_01_REGISTRY:
        src_file = os.path.join(ISSUE_01_DIR, item["file"])
        if not os.path.exists(src_file):
            print(f"WARNING: Source file {src_file} does not exist!")
            continue
        
        with open(src_file, "r", encoding="utf-8") as fh:
            raw_content = fh.read()
        
        dst_file = os.path.join(target_issue01_dir, item["file"])
        with open(dst_file, "w", encoding="utf-8") as fh:
            fh.write(raw_content)

        excerpt = item.get("subtitle") or clean_excerpt(raw_content)

        story_obj = {
            "slug": item["slug"],
            "title": item["title"],
            "shortTitle": item["shortTitle"],
            "subtitle": item["subtitle"],
            "section": item["section"],
            "seriesSlug": "issue-01",
            "seriesOrder": item["order"],
            "authorId": item["authorId"],
            "articleType": item["articleType"],
            "editorialVoice": "collective-editorial",
            "date": "MẠCH — Số 01 (2026)",
            "created": "2026-06-28T11:59:39+07:00",
            "updated": "2026-07-03T16:38:00+07:00",
            "excerpt": excerpt,
            "coverImage": "",
            "topics": item["topics"],
            "mentions": [],
            "contentMarkdown": raw_content
        }
        all_stories.append(story_obj)

    # Process THƯ GỬI CLARA
    for item in CLARA_REGISTRY:
        src_file = os.path.join(CLARA_DIR, item["file"])
        if not os.path.exists(src_file):
            print(f"WARNING: Source file {src_file} does not exist!")
            continue

        with open(src_file, "r", encoding="utf-8") as fh:
            raw_content = fh.read()

        dst_file = os.path.join(target_clara_dir, item["file"])
        with open(dst_file, "w", encoding="utf-8") as fh:
            fh.write(raw_content)

        # Map internal image links Images/00X.png -> assets/images/mach/thu-gui-clara/00X.png
        formatted_content = re.sub(r"!\[(.*?)\]\(Images/(.*?)\)", r"![\1](assets/images/mach/thu-gui-clara/\2)", raw_content)

        excerpt = item.get("subtitle") or clean_excerpt(raw_content)

        story_obj = {
            "slug": item["slug"],
            "title": item["title"],
            "shortTitle": item["shortTitle"],
            "subtitle": item["subtitle"],
            "section": item["section"],
            "seriesSlug": "thu-gui-clara",
            "seriesOrder": item["order"],
            "authorId": item["authorId"],
            "articleType": item["articleType"],
            "editorialVoice": "personal",
            "date": item["date"],
            "created": "2026-07-22T00:00:00+07:00",
            "updated": "2026-09-04T00:00:00+07:00",
            "excerpt": excerpt,
            "coverImage": item["coverImage"],
            "topics": item["topics"],
            "mentions": [],
            "contentMarkdown": formatted_content
        }
        all_stories.append(story_obj)

    # 3. Database structure
    db = {
        "version": "2.1",
        "generatedAt": "2026-09-05T19:30:00+07:00",
        "description": "MẠCH — Digital Magazine Dòng họ Trần Trọng Thu",
        "authors": {
            "nguoi-giu-mach": {
                "id": "nguoi-giu-mach",
                "name": "Người giữ mạch",
                "role": "Chấp bút & Khảo cứu MẠCH",
                "bio": "Người khởi xướng hành trình ghi chép và khảo cứu những chuyển dịch của dòng họ trong đời sống đương đại.",
                "avatar": "✍️"
            },
            "tuan": {
                "id": "tuan",
                "name": "Tuấn (Người Giữ Mạch)",
                "role": "Tác giả chuỗi 'Thư gửi Clara'",
                "bio": "Trưởng thế hệ F2, chấp bút những lá thư chiêm nghiệm và di chúc tinh thần gửi gắm tới các cháu trong gia đình.",
                "avatar": "✉️"
            },
            "mach-editorial": {
                "id": "mach-editorial",
                "name": "Ban Biên Tập MẠCH",
                "role": "Cơ quan Xuất bản Di sản",
                "bio": "Lưu giữ, bảo tồn và xuất bản các ấn phẩm chuyên đề về văn hóa dòng tộc và ký ức gia đình.",
                "avatar": "🌿"
            }
        },
        "series": {
            "issue-01": {
                "slug": "issue-01",
                "title": "Tập san MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại",
                "shortTitle": "Tập san MẠCH (Số 01)",
                "subtitle": "Giữ mạch hay chấp nhận tan rã?",
                "description": "Ấn phẩm tập san khảo cứu về sự chuyển dịch của dòng họ trong xã hội hiện đại: từ sự gần gũi tự nhiên thuở trước đến những khế ước vô hình, ngày giỗ, mộ tổ, đám cưới, ngày Tết và những người không còn quay về nữa.",
                "authorId": "nguoi-giu-mach",
                "seriesType": "publication",
                "audience": "family",
                "editorialVoice": "collective-editorial",
                "coverImage": "",
                "stories": [s["slug"] for s in all_stories if s["seriesSlug"] == "issue-01"]
            },
            "thu-gui-clara": {
                "slug": "thu-gui-clara",
                "title": "Thư gửi Clara",
                "shortTitle": "Thư gửi Clara",
                "subtitle": "Những lá thư chiêm nghiệm và di chúc tinh thần gửi thế hệ sau",
                "description": "Chuỗi thư từ thân tình của Tuấn gửi tới cháu gái Clara và các cháu trong gia đình (Rina, Tina, Tin, Tito) về căn cước, nếp nhà, tự do nội tâm, đức tin và sự trưởng thành giữa thời đại công nghệ.",
                "authorId": "tuan",
                "seriesType": "epistolary",
                "audience": "descendants",
                "editorialVoice": "personal",
                "coverImage": "assets/images/mach/thu-gui-clara/001.png",
                "stories": [s["slug"] for s in all_stories if s["seriesSlug"] == "thu-gui-clara"]
            }
        },
        "topics": {
            "loi-mo": { "slug": "loi-mo", "title": "Lời Mở & Định Vị", "count": 2 },
            "luan": { "slug": "luan", "title": "Luận Đề & Biến Chuyển", "count": 9 },
            "nghi-le": { "slug": "nghi-le", "title": "Nghi Lễ & Gặp Gỡ", "count": 4 },
            "ky-uc": { "slug": "ky-uc", "title": "Ký Ức & Sự Tiếp Nối", "count": 6 },
            "the-he": { "slug": "the-he", "title": "Thế Hệ & Tiếp Nối", "count": 8 },
            "gia-phong": { "slug": "gia-phong", "title": "Gia Phong & Đạo Lý", "count": 4 },
            "thu-tu": { "slug": "thu-tu", "title": "Thư Từ & Tâm Tình", "count": 7 },
            "duc-tin": { "slug": "duc-tin", "title": "Đức Tin & Tôn Giáo", "count": 1 },
            "tu-lieu": { "slug": "tu-lieu", "title": "Tư Liệu & Ghi Chú", "count": 1 }
        },
        "stories": all_stories
    }

    with open(DATA_FILE, "w", encoding="utf-8") as fh:
        json.dump(db, fh, ensure_ascii=False, indent=2)

    print(f"Successfully generated {DATA_FILE}")
    print(f"Total stories: {len(all_stories)}")
    print(f" - Issue 01: {len([s for s in all_stories if s['seriesSlug'] == 'issue-01'])} stories")
    print(f" - Thư gửi Clara: {len([s for s in all_stories if s['seriesSlug'] == 'thu-gui-clara'])} letters")

if __name__ == "__main__":
    build()

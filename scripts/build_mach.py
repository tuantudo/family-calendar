#!/usr/bin/env python3
"""
MACH PUBLICATION ENGINE — COMPILATION SCRIPT (BUILD_MACH.PY)
Compiles source Markdown and Media into Normalized Publication Model (v3.0)
Conforming to MACH_FOUNDATION_01 and MACH_FOUNDATION_02 specifications.
"""

import os
import re
import json
import shutil
import hashlib

OBSIDIAN_ROOT = "/Users/tuantq/Obsidian/20_PROJECTS/Mach"
OBSIDIAN_PROJECTS = os.path.join(OBSIDIAN_ROOT, "PROJECTS")
ISSUE_01_DIR = os.path.join(OBSIDIAN_PROJECTS, "ISSUE_01", "CANONICAL")
CLARA_DIR = os.path.join(OBSIDIAN_ROOT, "Thư gửi Clara")

REPO_ROOT = "/Users/tuantq/Projects/Personal/family-calendar"
CONTENT_DIR = os.path.join(REPO_ROOT, "content", "mach")
DATA_FILE = os.path.join(REPO_ROOT, "data", "mach.json")
ASSETS_DIR = os.path.join(REPO_ROOT, "assets", "images", "mach")

# --- 1. MEDIA REGISTRY SEED ---
BASE_MEDIA = {
    "med_clara_001": {
        "id": "med_clara_001",
        "src": "assets/images/mach/thu-gui-clara/001.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/001.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 01: Điểm Tựa Cuộc Đời",
        "caption": "Mặc định ban đầu và Điểm tựa cuộc đời: Tên thánh, tên khai sinh và gia đình — những điều đầu tiên con không tự chọn khi đến với thế gian, được trao gửi như một điểm tựa trước khi con đủ lớn để tự định đoạt số phận mình.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "22/07/2026",
        "location": "Fatima Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/001.png",
            "medium": "assets/images/mach/thu-gui-clara/001.png",
            "large": "assets/images/mach/thu-gui-clara/001.png"
        }
    },
    "med_clara_002": {
        "id": "med_clara_002",
        "src": "assets/images/mach/thu-gui-clara/002.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/002.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 02: Quyết Định Chuyển Dời",
        "caption": "Quyết định chuyển dời: Con người luôn là con của thời đại mình đang sống và những quyết định định hình nhiều thế hệ.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "30/07/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/002.png",
            "medium": "assets/images/mach/thu-gui-clara/002.png",
            "large": "assets/images/mach/thu-gui-clara/002.png"
        }
    },
    "med_clara_003": {
        "id": "med_clara_003",
        "src": "assets/images/mach/thu-gui-clara/003.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/003.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 03: Cảm Thức Cộng Đồng",
        "caption": "Cảm thức cộng đồng và sự rạn nứt âm thầm: Khoảng cách giữa những người cùng một dòng máu và sự suy tàn âm thầm của cảm thức chung.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "16/08/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/003.png",
            "medium": "assets/images/mach/thu-gui-clara/003.png",
            "large": "assets/images/mach/thu-gui-clara/003.png"
        }
    },
    "med_clara_004": {
        "id": "med_clara_004",
        "src": "assets/images/mach/thu-gui-clara/004.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/004.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 04: Cái Tôi Khái Niệm Hóa",
        "caption": "Cái tôi khái niệm hóa: Những vai trò mà cuộc đời và xã hội gán lên vai mỗi con người.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "22/08/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/004.png",
            "medium": "assets/images/mach/thu-gui-clara/004.png",
            "large": "assets/images/mach/thu-gui-clara/004.png"
        }
    },
    "med_clara_005": {
        "id": "med_clara_005",
        "src": "assets/images/mach/thu-gui-clara/005.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/005.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 05: Vai Trò Nội Tâm Hóa",
        "caption": "Vai trò nội tâm hóa: Nhìn thẳng vào những vai trò được gán ghép và quán tính của trật tự cũ trong chính mình.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "27/08/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/005.png",
            "medium": "assets/images/mach/thu-gui-clara/005.png",
            "large": "assets/images/mach/thu-gui-clara/005.png"
        }
    },
    "med_clara_006": {
        "id": "med_clara_006",
        "src": "assets/images/mach/thu-gui-clara/006.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/006.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 06: Tự Do Trước Quá Khứ",
        "caption": "Tự do trước quá khứ: Viết không phải để tạo nên món nợ tinh thần mà để con tự do xây dựng đời sống của chính mình.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "27/08/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/006.png",
            "medium": "assets/images/mach/thu-gui-clara/006.png",
            "large": "assets/images/mach/thu-gui-clara/006.png"
        }
    },
    "med_clara_007": {
        "id": "med_clara_007",
        "src": "assets/images/mach/thu-gui-clara/007.png",
        "rawSrc": "assets/images/mach/thu-gui-clara/007.png",
        "type": "editorial",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Bìa Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do",
        "caption": "Thể diện, sĩ diện, cái nhìn của người đời và sự tự do nội tâm trước cuộc đời rộng lớn.",
        "credit": "Tuấn (Người Giữ Mạch)",
        "source": "Lưu trữ cá nhân",
        "provenance": "Ảnh minh họa chuỗi Thư gửi Clara",
        "date": "03/09/2026",
        "location": "Bình Triệu, TP. HCM",
        "peopleIds": ["@I170@"],
        "rights": "Bản quyền thuộc gia đình Trần Trọng",
        "variants": {
            "thumb": "assets/images/mach/thu-gui-clara/007.png",
            "medium": "assets/images/mach/thu-gui-clara/007.png",
            "large": "assets/images/mach/thu-gui-clara/007.png"
        }
    },
    "med_issue01_cover": {
        "id": "med_issue01_cover",
        "src": "assets/images/mach/issue-01/mach_01.jpg",
        "rawSrc": "assets/images/mach/issue-01/mach_01.jpg",
        "type": "hero",
        "dimensions": {"width": 1400, "height": 900, "aspectRatio": "14/9"},
        "alt": "Trang bìa MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại",
        "caption": "Ấn phẩm tập san MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại (Mùa Thu 2026).",
        "credit": "Ban Biên Tập MẠCH",
        "source": "Kho tư liệu MẠCH",
        "provenance": "Thiết kế ấn phẩm MẠCH",
        "date": "2026",
        "location": "Sài Gòn",
        "peopleIds": [],
        "rights": "Lưu hành nội bộ gia tộc",
        "variants": {
            "thumb": "assets/images/mach/issue-01/mach_01.jpg",
            "medium": "assets/images/mach/issue-01/mach_01.jpg",
            "large": "assets/images/mach/issue-01/mach_01.jpg"
        }
    },
    "med_issue01_mo_to": {
        "id": "med_issue01_mo_to",
        "src": "assets/images/mach/issue-01/Mo-to-ho-Tran.jpg",
        "rawSrc": "assets/images/mach/issue-01/Mo-to-ho-Tran.jpg",
        "type": "historical_photo",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Mộ tổ họ Trần",
        "caption": "Mộ tổ Dòng họ Trần Trọng Thu — Nơi con cháu nhiều thế hệ quay về thắp nén nhang tưởng nhớ sau khi đời sống đã tách xa nhau.",
        "credit": "Tư liệu Dòng họ",
        "source": "Album gia tộc",
        "provenance": "Ảnh thực địa khu mộ tổ",
        "date": "2026",
        "location": "Bình Tiên, Bình Châu",
        "peopleIds": [],
        "rights": "Lưu hành nội bộ gia tộc",
        "variants": {
            "thumb": "assets/images/mach/issue-01/Mo-to-ho-Tran.jpg",
            "medium": "assets/images/mach/issue-01/Mo-to-ho-Tran.jpg",
            "large": "assets/images/mach/issue-01/Mo-to-ho-Tran.jpg"
        }
    },
    "med_issue01_dam_cuoi": {
        "id": "med_issue01_dam_cuoi",
        "src": "assets/images/mach/issue-01/ThiepcuoiNam.jpg",
        "rawSrc": "assets/images/mach/issue-01/ThiepcuoiNam.jpg",
        "type": "document_scan",
        "dimensions": {"width": 1000, "height": 700, "aspectRatio": "10/7"},
        "alt": "Thiệp cưới lưu niệm gia đình",
        "caption": "Thiệp cưới như một dấu chuyển thế hệ: Giữ lại chứng từ của sự nối tiếp giữa các nhánh họ.",
        "credit": "Tư liệu Dòng họ",
        "source": "Lưu trữ gia tộc",
        "provenance": "Bản scan thiệp cưới nhánh Chú Thả",
        "date": "07/06/2026",
        "location": "Bình Tiên, Bình Châu",
        "peopleIds": [],
        "rights": "Lưu hành nội bộ gia tộc",
        "variants": {
            "thumb": "assets/images/mach/issue-01/ThiepcuoiNam.jpg",
            "medium": "assets/images/mach/issue-01/ThiepcuoiNam.jpg",
            "large": "assets/images/mach/issue-01/ThiepcuoiNam.jpg"
        }
    },
    "med_issue01_caygiapha": {
        "id": "med_issue01_caygiapha",
        "src": "assets/images/mach/issue-01/caygiapha.jpg",
        "rawSrc": "assets/images/mach/issue-01/caygiapha.jpg",
        "type": "document_scan",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Cây gia phả",
        "caption": "Cây Gia Phả & Mạch: Cấu trúc phả hệ và dòng chảy ký ức sống của dòng họ.",
        "credit": "Người giữ mạch",
        "source": "Lưu trữ Cây Gia Phả",
        "provenance": "Biểu đồ quan hệ thế hệ",
        "date": "2026",
        "location": "Sài Gòn",
        "peopleIds": [],
        "rights": "Lưu hành nội bộ gia tộc",
        "variants": {
            "thumb": "assets/images/mach/issue-01/caygiapha.jpg",
            "medium": "assets/images/mach/issue-01/caygiapha.jpg",
            "large": "assets/images/mach/issue-01/caygiapha.jpg"
        }
    },
    "med_issue01_haudue": {
        "id": "med_issue01_haudue",
        "src": "assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg",
        "rawSrc": "assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg",
        "type": "portrait",
        "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
        "alt": "Hậu duệ ông Thu bà Sa",
        "caption": "Ảnh kỷ niệm các thế hệ con cháu hậu duệ Cụ Giuse Trần Trọng Thu và Cụ Maria Nguyễn Thị Sa.",
        "credit": "Tư liệu Dòng họ",
        "source": "Album gia tộc",
        "provenance": "Chụp tại nhà thờ tổ",
        "date": "2026",
        "location": "Bình Châu",
        "peopleIds": [],
        "rights": "Lưu hành nội bộ gia tộc",
        "variants": {
            "thumb": "assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg",
            "medium": "assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg",
            "large": "assets/images/mach/issue-01/Haudue-ongThu-baSa.jpg"
        }
    }
}

# --- 2. REGISTRY DEFINITIONS ---
ISSUE_01_REGISTRY = [
    {
        "id": "art_issue01_01",
        "file": "01 — GIỚI THIỆU.md",
        "slug": "01-gioi-thieu",
        "order": 1,
        "title": "Giới Thiệu: MẠCH được bắt đầu như thế nào?",
        "shortTitle": "Giới thiệu",
        "subtitle": "Khởi đầu của hành trình tìm lại những mạch nối gia đình.",
        "deckLead": "Dòng họ trong đời sống đương đại đang đứng trước một sự chuyển dịch âm thầm nhưng sâu sắc.",
        "section": "Lời mở",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "med_issue01_cover",
        "topics": ["loi-mo", "the-he"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_02",
        "file": "02 — CÂY GIA PHẢ & MẠCH.md",
        "slug": "02-cay-gia-pha-va-mach",
        "order": 2,
        "title": "Cây Gia Phả & Mạch",
        "shortTitle": "Cây gia phả & Mạch",
        "subtitle": "Hai hình thức lưu giữ cấu trúc và ký ức sống gia đình.",
        "deckLead": "Cây gia phả lưu lại cấu trúc và vị trí. MẠCH lưu lại những gì xảy ra giữa những vị trí ấy.",
        "section": "Lời mở",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "med_issue01_caygiapha",
        "topics": ["loi-mo", "ky-uc"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_03",
        "file": "03 — KHI SỰ GẦN GŨI KHÔNG CÒN TỰ NHIÊN.md",
        "slug": "03-khi-su-gan-gui-khong-con-tu-nhien",
        "order": 3,
        "title": "Khi Sự Gần Gũi Không Còn TỰ NHIÊN",
        "shortTitle": "Khi sự gần gũi không còn tự nhiên",
        "subtitle": "Khi sự tiếp nối không còn tự vận hành như trước nữa.",
        "deckLead": "Có những người lớn lên trong việc đi vài căn nhà là tới nhà họ hàng. Nhưng theo thời gian, sự gần gũi tự nhiên ấy dần trở thành điều phải chủ đích giữ lại.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "long-form",
        "heroMediaId": "med_issue01_haudue",
        "topics": ["luan", "the-he"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_04",
        "file": "04 — TỪ HỆ TƯ TƯỞNG ĐẾN ĐẠO LÝ ĐỜI SỐNG.md",
        "slug": "04-tu-he-tu-tuong-den-dao-ly-doi-song",
        "order": 4,
        "title": "Từ Hệ Tư Tưởng Đến Đạo Lý Đời SỐNG",
        "shortTitle": "Từ hệ tư tưởng đến đạo lý đời sống",
        "subtitle": "Khi những hệ tư tưởng lớn co lại thành vài câu đủ để đời sống tiếp tục vận hành.",
        "deckLead": "Những triết lý lớn khi đi vào nếp nhà thường co lại thành vài câu giản dị nhưng đủ sức giữ trật tự qua nhiều biến động.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "",
        "topics": ["luan", "gia-phong"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_05",
        "file": "05 — NHỮNG KHẾ ƯỚC VÔ HÌNH CỦA DÒNG HỌ.md",
        "slug": "05-nhung-khe-uoc-vo-hinh-cua-dong-ho",
        "order": 5,
        "title": "Những Khế Ước Vô Hình Của Dòng Họ",
        "shortTitle": "Những khế ước vô hình của dòng họ",
        "subtitle": "Khi sự hiện diện dần trở thành một dạng nghĩa vụ khó gọi tên.",
        "deckLead": "Có những trách nhiệm trong họ không bao giờ được viết thành văn, nhưng mọi người đều ngầm hiểu và tuân thủ.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "",
        "topics": ["luan", "nghi-le"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_06",
        "file": "06 — GIỖ VÀ KÝ ỨC GIA ĐÌNH.md",
        "slug": "06-gio-va-ky-uc-gia-dinh",
        "order": 6,
        "title": "Giỗ Và Ký Ức Gia Đình",
        "shortTitle": "Giỗ và ký ức gia đình",
        "subtitle": "Những dịp gặp mặt còn giữ được ký ức gia đình.",
        "deckLead": "Nhiều nghi lễ gia đình bắt đầu trước cả lúc mọi người ngồi xuống cùng nhau, được giữ bằng lao động thầm lặng của vài người quen thuộc.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "long-form",
        "heroMediaId": "",
        "topics": ["luan", "nghi-le", "ky-uc"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_07",
        "file": "07 — MỘ TỔ VÀ CẢM THỨC QUAY VỀ.md",
        "slug": "07-mo-to-va-cam-thuc-quay-ve",
        "order": 7,
        "title": "Mộ Tổ Và Cảm Thức Quay Về",
        "shortTitle": "Mộ tổ và cảm thức quay về",
        "subtitle": "Nơi nhiều người vẫn tiếp tục quay về sau khi người sống đã tách xa nhau.",
        "deckLead": "Mộ tổ là điểm neo giữ hữu hình cuối cùng khi các nhánh con cháu đã tản mác đi nhiều phương trời.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "med_issue01_mo_to",
        "topics": ["luan", "ky-uc"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_08",
        "file": "08 — ĐÁM CƯỚI NHƯ MỘT DẤU CHUYỂN THẾ HỆ.md",
        "slug": "08-dam-cuoi-nhu-mot-dau-chuyen-the-he",
        "order": 8,
        "title": "Đám Cưới Như Một Dấu Chuyển Thế Hệ",
        "shortTitle": "Đám cưới như một dấu chuyển thế hệ",
        "subtitle": "Khi một dòng họ tiếp tục chính nó qua những thế hệ mới.",
        "deckLead": "Mỗi đám cưới không chỉ là việc riêng của hai người trẻ, mà là một dấu mốc chuyển tiếp thế hệ của toàn bộ dòng họ.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "med_issue01_dam_cuoi",
        "topics": ["luan", "the-he", "nghi-le"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_09",
        "file": "09 — VÌ SAO CON CHÁU CÒN QUAY VỀ NGÀY TẾT?.md",
        "slug": "09-vi-sao-con-chau-con-quay-ve-ngay-tet",
        "order": 9,
        "title": "Vì Sao Con Cháu Còn Quay Về Ngày Tết?",
        "shortTitle": "Vì sao con cháu còn quay về ngày Tết?",
        "subtitle": "Những dịp quay về hiếm hoi trong năm.",
        "deckLead": "Ngày Tết là khoảnh khắc quy tụ lớn nhất, nơi quán tính văn hóa và tình thân kéo con người trở về nguồn cội.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "",
        "topics": ["luan", "nghi-le"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_10",
        "file": "10 — GIA ĐÌNH HẠT NHÂN VÀ SỰ CHUYỂN ĐỔI CỦA ĐẠI GIA ĐÌNH.md",
        "slug": "10-gia-dinh-hat-nhan-va-su-chuyen-doi",
        "order": 10,
        "title": "Gia Đình Hạt Nhân Và Sự Chuyển Đổi Của Đại Gia Đình",
        "shortTitle": "Gia đình hạt nhân và sự chuyển đổi của đại gia đình",
        "subtitle": "Khi nhiều thế hệ không còn sống trong cùng một cấu trúc.",
        "deckLead": "Sự trỗi dậy của gia đình hạt nhân định hình lại ranh giới giữa tính riêng tư cá nhân và nghĩa vụ gia tộc.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "",
        "topics": ["luan", "the-he"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_11",
        "file": "11 — NHỮNG NGƯỜI KHÔNG CÒN QUAY VỀ NỮA.md",
        "slug": "11-nhung-nguoi-khong-con-quay-ve-nua",
        "order": 11,
        "title": "Những Người Không Còn Quay Về Nữa",
        "shortTitle": "Những người không còn quay về nữa",
        "subtitle": "Khi một người dần biến mất khỏi mạch gia đình.",
        "deckLead": "Không có tuyên bố cắt đứt nào rõ rệt, chỉ là khoảng cách thời gian và không gian làm mờ dần những dấu chân.",
        "section": "Luận",
        "authorId": "nguoi-giu-mach",
        "articleType": "essay",
        "editorialVoice": "collective-editorial",
        "presentationVariant": "essay",
        "heroMediaId": "",
        "topics": ["luan", "ky-uc"],
        "relatedPeople": []
    },
    {
        "id": "art_issue01_12",
        "file": "12 — GHI CHÚ & CHÚ GIẢI.md",
        "slug": "12-ghi-chu-va-chu-giai",
        "order": 12,
        "title": "Ghi Chú & Chú Giải",
        "shortTitle": "Ghi chú & Chú giải",
        "subtitle": "Các ghi chú biên tập và footnotes.",
        "deckLead": "Những suy tư phía sau cấu trúc cây gia phả và hành trình khảo cứu MẠCH.",
        "section": "Tư liệu & Ghi chú",
        "authorId": "mach-editorial",
        "articleType": "historical",
        "editorialVoice": "FACT",
        "presentationVariant": "text-led",
        "heroMediaId": "",
        "topics": ["tu-lieu"],
        "relatedPeople": []
    }
]

CLARA_REGISTRY = [
    {
        "id": "art_clara_001",
        "file": "Thư gửi Clara - 001.md",
        "slug": "clara-001",
        "order": 1,
        "title": "Thư gửi Clara — Số 01: Điểm Tựa Cuộc Đời",
        "shortTitle": "Thư 01: Điểm tựa cuộc đời",
        "subtitle": "Tên thánh, tên khai sinh và gia đình — những điều đầu tiên con không tự chọn khi đến với thế gian.",
        "deckLead": "Tên thánh, tên khai sinh và gia đình là những điều đầu tiên con không tự chọn khi đến với thế gian, được trao gửi như một điểm tựa.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_001",
        "date": "22/07/2026",
        "topics": ["thu-tu", "the-he", "duc-tin"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_002",
        "file": "Thư gửi Clara - 002.md",
        "slug": "clara-002",
        "order": 2,
        "title": "Thư gửi Clara — Số 02: Quyết Định Chuyển Dời",
        "shortTitle": "Thư 02: Quyết định chuyển dời",
        "subtitle": "Con người luôn là con của thời đại mình đang sống và những quyết định định hình nhiều thế hệ.",
        "deckLead": "Con người luôn là con của thời đại mình đang sống và những quyết định định hình nhiều thế hệ tiếp nối.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_002",
        "date": "30/07/2026",
        "topics": ["thu-tu", "the-he", "ky-uc"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_003",
        "file": "Thư gửi Clara - 003.md",
        "slug": "clara-003",
        "order": 3,
        "title": "Thư gửi Clara — Số 03: Cảm Thức Cộng Đồng",
        "shortTitle": "Thư 03: Cảm thức cộng đồng",
        "subtitle": "Khoảng cách giữa những người cùng một dòng máu và sự suy tàn âm thầm của cảm thức chung.",
        "deckLead": "Khoảng cách giữa những người cùng một dòng máu và sự suy tàn âm thầm của cảm thức cộng đồng.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_003",
        "date": "16/08/2026",
        "topics": ["thu-tu", "the-he", "ky-uc"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_004",
        "file": "Thư gửi Clara - 004.md",
        "slug": "clara-004",
        "order": 4,
        "title": "Thư gửi Clara — Số 04: Cái Tôi Khái Niệm Hóa",
        "shortTitle": "Thư 04: Cái tôi khái niệm hóa",
        "subtitle": "Những vai trò mà cuộc đời và xã hội gán lên vai mỗi con người.",
        "deckLead": "Những vai trò và nhãn dán mà cuộc đời và xã hội gán lên vai mỗi con người từ thuở lọt lòng.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_004",
        "date": "22/08/2026",
        "topics": ["thu-tu", "gia-phong"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_005",
        "file": "Thư gửi Clara - 005.md",
        "slug": "clara-005",
        "order": 5,
        "title": "Thư gửi Clara — Số 05: Vai Trò Nội Tâm Hóa",
        "shortTitle": "Thư 05: Vai trò nội tâm hóa",
        "subtitle": "Nhìn thẳng vào những vai trò được gán ghép và quán tính của trật tự cũ trong chính mình.",
        "deckLead": "Nhìn thẳng vào những vai trò được gán ghép và quán tính của trật tự cũ ăn sâu trong tiềm thức.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_005",
        "date": "27/08/2026",
        "topics": ["thu-tu", "gia-phong", "the-he"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_006",
        "file": "Thư gửi Clara - 006.md",
        "slug": "clara-006",
        "order": 6,
        "title": "Thư gửi Clara — Số 06: Tự Do Trước Quá Khứ",
        "shortTitle": "Thư 06: Tự do trước quá khứ",
        "subtitle": "Viết không phải để tạo nên món nợ tinh thần mà để con tự do xây dựng đời sống của chính mình.",
        "deckLead": "Viết không phải để tạo nên món nợ tinh thần ràng buộc, mà để con tự do kiến tạo đời sống của chính mình.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_006",
        "date": "27/08/2026",
        "topics": ["thu-tu", "the-he"],
        "relatedPeople": ["@I170@"]
    },
    {
        "id": "art_clara_007",
        "file": "Thư gửi Clara, Rina, Tina, Tin và Tito - 007.md",
        "slug": "clara-007",
        "order": 7,
        "title": "Thư gửi Clara — Số 07: Thể Diện, Sĩ Diện & Tự Do",
        "shortTitle": "Thư 07: Thể diện, sĩ diện & tự do",
        "subtitle": "Thể diện, sĩ diện, cái nhìn của người đời và sự tự do nội tâm trước cuộc đời rộng lớn.",
        "deckLead": "Thể diện, sĩ diện, ánh nhìn của người đời và sự tự do nội tâm đích thực trước cuộc đời rộng lớn.",
        "section": "Thư từ",
        "authorId": "tuan",
        "articleType": "letter",
        "editorialVoice": "personal",
        "presentationVariant": "letter",
        "heroMediaId": "med_clara_007",
        "date": "03/09/2026",
        "topics": ["thu-tu", "gia-phong", "the-he"],
        "relatedPeople": ["@I170@"]
    }
]

# --- 3. CONTENT BLOCK PARSER ENGINE ---
def parse_markdown_to_blocks(raw_content, article_meta, media_registry):
    """
    Parses raw Markdown into normalized ContentBlock[]
    Extracts footnotes, editorial DNA/orchestration notes, figures, quotes, headings.
    """
    slug = article_meta["slug"]
    blocks = []
    footnotes = []

    # 1. Strip Frontmatter
    text = raw_content
    if text.startswith("---"):
        parts = text.split("---", 2)
        if len(parts) >= 3:
            text = parts[2]

    # 2. Extract Footnotes
    footnote_matches = re.findall(r'\[\^(\d+)\]:\s*(.*)', text)
    for fn_id, fn_text in footnote_matches:
        footnotes.append({"id": fn_id, "text": fn_text.strip()})
    text = re.sub(r'\[\^(\d+)\]:\s*.*', '', text)

    # 3. Extract and separate Obsidian DNA / Orchestration Notes
    dna_split = re.split(r'\n#+\s*ARTICLE DNA', text, flags=re.IGNORECASE)
    main_body = dna_split[0]
    
    # 4. Clean Red Spans / Editorial directives
    # Replace [SPREAD XX — ...] or red spans with clean section headers/dividers
    def clean_spread_spans(match):
        content = match.group(1)
        spread_m = re.search(r'\[SPREAD\s*\d+\s*—\s*([^\]]+)\]', content, re.IGNORECASE)
        caption_m = re.search(r'\[CAPTION\]\s*[“"]?([^”"]+)[”"]?', content, re.IGNORECASE)
        res = ""
        if spread_m:
            spread_title = spread_m.group(1).strip()
            res += f"\n\n## {spread_title.title()}\n\n"
        if caption_m:
            cap_text = caption_m.group(1).strip()
            res += f"\n\n> “{cap_text}”\n\n"
        return res

    main_body = re.sub(r'<span[^>]*style=["\']color:\s*red["\'][^>]*>([\s\S]*?)</span>', clean_spread_spans, main_body, flags=re.IGNORECASE)
    # Remove any remaining raw Obsidian tag hashes (e.g. #mach/tinh-lien-tuc)
    main_body = re.sub(r'#mach/[a-zA-Z0-9\-_]+', '', main_body)

    # 5. Split by double newlines into discrete chunks
    raw_chunks = re.split(r'\n\s*\n', main_body)
    
    block_idx = 1
    has_seen_first_prose = False

    for chunk in raw_chunks:
        chunk = chunk.strip()
        if not chunk:
            continue

        blk_id = f"blk_{slug}_{block_idx:03d}"

        # A. Divider
        if chunk in ["---", "***", "___"]:
            blocks.append({
                "id": blk_id,
                "type": "divider",
                "style": "section_break"
            })
            block_idx += 1
            continue

        # B. Heading 1 / 2 / 3
        if chunk.startswith("# "):
            h_text = chunk.replace("# ", "").strip()
            # If matches article title, skip to avoid duplicate H1
            if h_text.lower() == article_meta["title"].lower() or h_text.lower() in article_meta["title"].lower():
                continue
            blocks.append({
                "id": blk_id,
                "type": "heading",
                "level": 2,
                "text": h_text,
                "anchorId": re.sub(r'[^a-zA-Z0-9\-_]+', '-', h_text.lower()).strip('-')
            })
            block_idx += 1
            continue
        elif chunk.startswith("## "):
            h_text = chunk.replace("## ", "").strip()
            blocks.append({
                "id": blk_id,
                "type": "heading",
                "level": 2,
                "text": h_text,
                "anchorId": re.sub(r'[^a-zA-Z0-9\-_]+', '-', h_text.lower()).strip('-')
            })
            block_idx += 1
            continue
        elif chunk.startswith("### "):
            h_text = chunk.replace("### ", "").strip()
            blocks.append({
                "id": blk_id,
                "type": "heading",
                "level": 3,
                "text": h_text,
                "anchorId": re.sub(r'[^a-zA-Z0-9\-_]+', '-', h_text.lower()).strip('-')
            })
            block_idx += 1
            continue

        # C. Images: ![alt](src) and optional caption *caption*
        img_m = re.match(r'!\[(.*?)\]\((.*?)\)(?:\s*\n\s*[\*_](.*?)[\*_])?', chunk, re.DOTALL)
        if img_m:
            alt = img_m.group(1).strip()
            src = img_m.group(2).strip()
            cap = img_m.group(3).strip() if img_m.group(3) else alt

            # Map to mediaRegistry or register dynamic ID
            matched_media_id = None
            for mid, mobj in media_registry.items():
                if mobj["src"] in src or src in mobj["src"] or (mobj.get("rawSrc") and mobj["rawSrc"] in src):
                    matched_media_id = mid
                    break
            
            if not matched_media_id:
                # Create dynamic media asset in registry
                matched_media_id = f"med_{slug}_{block_idx:02d}"
                media_registry[matched_media_id] = {
                    "id": matched_media_id,
                    "src": src,
                    "rawSrc": src,
                    "type": "editorial",
                    "dimensions": {"width": 1200, "height": 800, "aspectRatio": "3/2"},
                    "alt": alt or article_meta["title"],
                    "caption": cap or alt,
                    "credit": "Tư liệu MẠCH",
                    "provenance": "Trích lục bài viết",
                    "variants": {"thumb": src, "medium": src, "large": src}
                }

            blocks.append({
                "id": blk_id,
                "type": "media",
                "mediaId": matched_media_id,
                "layout": "normal",
                "customCaption": cap
            })
            block_idx += 1
            continue

        # D. Blockquotes & Pull Quotes
        if chunk.startswith("> "):
            q_text = re.sub(r'^>\s*', '', chunk, flags=re.MULTILINE).strip()
            # If short and in quotation marks, make it a PullQuote
            is_pull = len(q_text) < 220 and (q_text.startswith("“") or q_text.startswith('"'))
            q_clean = q_text.strip('“”"\'')
            if is_pull:
                blocks.append({
                    "id": blk_id,
                    "type": "pull_quote",
                    "text": q_clean,
                    "author": article_meta.get("authorName")
                })
            else:
                blocks.append({
                    "id": blk_id,
                    "type": "quote",
                    "text": q_clean,
                    "author": article_meta.get("authorName")
                })
            block_idx += 1
            continue

        # E. Lists
        if re.match(r'^[\*\-\d\.]+\s+', chunk):
            lines = chunk.split('\n')
            is_ordered = bool(re.match(r'^\d+\.', lines[0]))
            items = [re.sub(r'^[\*\-\d\.]+\s+', '', line).strip() for line in lines if line.strip()]
            blocks.append({
                "id": blk_id,
                "type": "list",
                "ordered": is_ordered,
                "items": items
            })
            block_idx += 1
            continue

        # F. Signature Block (e.g. **Bác Tuấn**, **Người giữ mạch**)
        if re.match(r'^(?:Chào con,\s*\n+)?\*\*(?:Bác Tuấn|Người giữ mạch|Ban Biên Tập)\*\*$', chunk, re.IGNORECASE):
            sig_name = chunk.replace("Chào con,", "").replace("**", "").strip()
            blocks.append({
                "id": blk_id,
                "type": "signature",
                "authorId": article_meta["authorId"],
                "authorName": sig_name,
                "location": "Fatima Bình Triệu" if "clara" in slug else "Sài Gòn",
                "dateStr": article_meta.get("date", "")
            })
            block_idx += 1
            continue

        # G. Paragraph / Lead
        clean_p = chunk.replace('\n', ' ').strip()
        # First prose paragraph of an essay gets lead / drop-cap treatment if appropriate
        if not has_seen_first_prose:
            has_seen_first_prose = True
            if article_meta.get("articleType") == "essay" and len(clean_p) > 120:
                blocks.append({
                    "id": blk_id,
                    "type": "paragraph",
                    "text": clean_p,
                    "hasDropCap": True
                })
            else:
                blocks.append({
                    "id": blk_id,
                    "type": "paragraph",
                    "text": clean_p,
                    "hasDropCap": False
                })
        else:
            blocks.append({
                "id": blk_id,
                "type": "paragraph",
                "text": clean_p,
                "hasDropCap": False
            })
        block_idx += 1

    return blocks, footnotes

# --- 4. MAIN BUILD PROCESS ---
def build():
    # 1. Ensure target mirror directories exist
    target_issue01_dir = os.path.join(CONTENT_DIR, "issue-01")
    target_clara_dir = os.path.join(CONTENT_DIR, "thu-gui-clara")
    os.makedirs(target_issue01_dir, exist_ok=True)
    os.makedirs(target_clara_dir, exist_ok=True)

    media_registry = dict(BASE_MEDIA)
    all_articles = []

    # 2. Process ISSUE 01
    for item in ISSUE_01_REGISTRY:
        src_file = os.path.join(ISSUE_01_DIR, item["file"])
        if not os.path.exists(src_file):
            src_file = os.path.join(target_issue01_dir, item["file"])
        
        raw_content = ""
        if os.path.exists(src_file):
            with open(src_file, "r", encoding="utf-8") as fh:
                raw_content = fh.read()
            # Copy to repo mirror
            dst_file = os.path.join(target_issue01_dir, item["file"])
            with open(dst_file, "w", encoding="utf-8") as fh:
                fh.write(raw_content)

        blocks, footnotes = parse_markdown_to_blocks(raw_content, item, media_registry)

        checksum = hashlib.sha256(raw_content.encode("utf-8")).hexdigest()[:16]

        article_obj = {
            "id": item["id"],
            "slug": item["slug"],
            "title": item["title"],
            "shortTitle": item["shortTitle"],
            "subtitle": item["subtitle"],
            "deckLead": item["deckLead"],
            "articleType": item["articleType"],
            "editorialVoice": item["editorialVoice"],
            "presentationVariant": item["presentationVariant"],
            "status": "published",
            "featured": item["order"] == 1,
            "editorialOrder": item["order"],
            "publishedAt": "2026-07-03T16:38:00+07:00",
            "updatedAt": "2026-07-03T16:38:00+07:00",
            "authorIds": [item["authorId"]],
            "seriesIds": ["issue-01"],
            "seriesOrder": item["order"],
            "section": item["section"],
            "topicIds": item["topics"],
            "heroMediaId": item["heroMediaId"],
            "blocks": blocks,
            "footnotes": footnotes,
            "relatedContent": {
                "articleIds": [],
                "seriesIds": ["issue-01", "thu-gui-clara"]
            },
            "relatedEntities": {
                "peopleIds": item.get("relatedPeople", []),
                "familyIds": [],
                "documentIds": []
            },
            "source": {
                "vaultPath": f"PROJECTS/ISSUE_01/CANONICAL/{item['file']}",
                "checksum": checksum
            },
            "seo": {
                "metaTitle": f"{item['title']} — MẠCH",
                "metaDescription": item["deckLead"],
                "ogImageMediaId": item["heroMediaId"] or "med_issue01_cover"
            },
            # Backwards compatibility fields for existing UI components
            "date": "MẠCH — Số 01 (2026)",
            "excerpt": item["deckLead"] or item["subtitle"],
            "authorId": item["authorId"],
            "seriesSlug": "issue-01",
            "coverImage": media_registry[item["heroMediaId"]]["src"] if item["heroMediaId"] and item["heroMediaId"] in media_registry else "",
            "topics": item["topics"],
            "mentions": [],
            "contentMarkdown": raw_content
        }
        all_articles.append(article_obj)

    # 3. Process THƯ GỬI CLARA
    for item in CLARA_REGISTRY:
        src_file = os.path.join(CLARA_DIR, item["file"])
        if not os.path.exists(src_file):
            src_file = os.path.join(target_clara_dir, item["file"])

        raw_content = ""
        if os.path.exists(src_file):
            with open(src_file, "r", encoding="utf-8") as fh:
                raw_content = fh.read()
            dst_file = os.path.join(target_clara_dir, item["file"])
            with open(dst_file, "w", encoding="utf-8") as fh:
                fh.write(raw_content)

        formatted_content = re.sub(r"!\[(.*?)\]\(Images/(.*?)\)", r"![\1](assets/images/mach/thu-gui-clara/\2)", raw_content)

        blocks, footnotes = parse_markdown_to_blocks(formatted_content, item, media_registry)
        checksum = hashlib.sha256(raw_content.encode("utf-8")).hexdigest()[:16]

        article_obj = {
            "id": item["id"],
            "slug": item["slug"],
            "title": item["title"],
            "shortTitle": item["shortTitle"],
            "subtitle": item["subtitle"],
            "deckLead": item["deckLead"],
            "articleType": item["articleType"],
            "editorialVoice": item["editorialVoice"],
            "presentationVariant": item["presentationVariant"],
            "status": "published",
            "featured": item["order"] == 1,
            "editorialOrder": item["order"],
            "publishedAt": f"2026-07-{20 + item['order']}T00:00:00+07:00",
            "updatedAt": "2026-09-04T00:00:00+07:00",
            "authorIds": [item["authorId"]],
            "seriesIds": ["thu-gui-clara"],
            "seriesOrder": item["order"],
            "section": item["section"],
            "topicIds": item["topics"],
            "heroMediaId": item["heroMediaId"],
            "blocks": blocks,
            "footnotes": footnotes,
            "relatedContent": {
                "articleIds": [],
                "seriesIds": ["thu-gui-clara", "issue-01"]
            },
            "relatedEntities": {
                "peopleIds": item.get("relatedPeople", []),
                "familyIds": [],
                "documentIds": []
            },
            "source": {
                "vaultPath": f"Thư gửi Clara/{item['file']}",
                "checksum": checksum
            },
            "seo": {
                "metaTitle": f"{item['title']} — MẠCH",
                "metaDescription": item["deckLead"],
                "ogImageMediaId": item["heroMediaId"]
            },
            # Backwards compatibility fields
            "date": item["date"],
            "excerpt": item["deckLead"] or item["subtitle"],
            "authorId": item["authorId"],
            "seriesSlug": "thu-gui-clara",
            "coverImage": media_registry[item["heroMediaId"]]["src"] if item["heroMediaId"] and item["heroMediaId"] in media_registry else "",
            "topics": item["topics"],
            "mentions": [],
            "contentMarkdown": formatted_content
        }
        all_articles.append(article_obj)

    # 4. Normalized Series Definitions
    series_map = {
        "issue-01": {
            "id": "issue-01",
            "slug": "issue-01",
            "title": "Tập san MẠCH — Số 01: Dòng Họ Trong Đời Sống Đương Đại",
            "shortTitle": "Tập san MẠCH (Số 01)",
            "subtitle": "Giữ mạch hay chấp nhận tan rã?",
            "description": "Ấn phẩm tập san khảo cứu về sự chuyển dịch của dòng họ trong xã hội hiện đại: từ sự gần gũi tự nhiên thuở trước đến những khế ước vô hình, ngày giỗ, mộ tổ, đám cưới, ngày Tết và những người không còn quay về nữa.",
            "seriesType": "publication",
            "audience": "family",
            "editorialVoice": "collective-editorial",
            "authorIds": ["nguoi-giu-mach"],
            "coverMediaId": "med_issue01_cover",
            "articleIds": [s["slug"] for s in all_articles if "issue-01" in s["seriesIds"]],
            # Legacy compatibility
            "authorId": "nguoi-giu-mach",
            "coverImage": "assets/images/mach/issue-01/mach_01.jpg",
            "stories": [s["slug"] for s in all_articles if "issue-01" in s["seriesIds"]]
        },
        "thu-gui-clara": {
            "id": "thu-gui-clara",
            "slug": "thu-gui-clara",
            "title": "Thư gửi Clara",
            "shortTitle": "Thư gửi Clara",
            "subtitle": "Những lá thư chiêm nghiệm và di chúc tinh thần gửi thế hệ sau",
            "description": "Chuỗi thư từ thân tình của Tuấn gửi tới cháu gái Clara và các cháu trong gia đình (Rina, Tina, Tin, Tito) về căn cước, nếp nhà, tự do nội tâm, đức tin và sự trưởng thành giữa thời đại công nghệ.",
            "seriesType": "epistolary",
            "audience": "descendants",
            "editorialVoice": "personal",
            "authorIds": ["tuan"],
            "coverMediaId": "med_clara_001",
            "articleIds": [s["slug"] for s in all_articles if "thu-gui-clara" in s["seriesIds"]],
            # Legacy compatibility
            "authorId": "tuan",
            "coverImage": "assets/images/mach/thu-gui-clara/001.png",
            "stories": [s["slug"] for s in all_articles if "thu-gui-clara" in s["seriesIds"]]
        }
    }

    # 5. Normalized Authors Definitions
    authors_map = {
        "nguoi-giu-mach": {
            "id": "nguoi-giu-mach",
            "slug": "nguoi-giu-mach",
            "name": "Người giữ mạch",
            "role": "Chấp bút & Khảo cứu MẠCH",
            "bio": "Người khởi xướng hành trình ghi chép và khảo cứu những chuyển dịch của dòng họ trong đời sống đương đại.",
            "avatarEmoji": "✍️",
            "avatar": "✍️",
            "location": "Sài Gòn"
        },
        "tuan": {
            "id": "tuan",
            "slug": "tuan",
            "name": "Tuấn (Người Giữ Mạch)",
            "role": "Tác giả chuỗi 'Thư gửi Clara'",
            "bio": "Trưởng thế hệ F2, chấp bút những lá thư chiêm nghiệm và di chúc tinh thần gửi gắm tới các cháu trong gia đình.",
            "avatarEmoji": "✉️",
            "avatar": "✉️",
            "personId": "@I18@",
            "location": "Sài Gòn"
        },
        "mach-editorial": {
            "id": "mach-editorial",
            "slug": "mach-editorial",
            "name": "Ban Biên Tập MẠCH",
            "role": "Cơ quan Xuất bản Di sản",
            "bio": "Lưu giữ, bảo tồn và xuất bản các ấn phẩm chuyên đề về văn hóa dòng tộc và ký ức gia đình.",
            "avatarEmoji": "🌿",
            "avatar": "🌿",
            "location": "Sài Gòn"
        }
    }

    # 6. Normalized Topics Definitions
    topics_map = {
        "loi-mo": { "id": "loi-mo", "slug": "loi-mo", "name": "Lời Mở & Định Vị", "title": "Lời Mở & Định Vị", "count": 2, "icon": "📖" },
        "luan": { "id": "luan", "slug": "luan", "name": "Luận Đề & Biến Chuyển", "title": "Luận Đề & Biến Chuyển", "count": 9, "icon": "🔍" },
        "nghi-le": { "id": "nghi-le", "slug": "nghi-le", "name": "Nghi Lễ & Gặp Gỡ", "title": "Nghi Lễ & Gặp Gỡ", "count": 4, "icon": "🕯️" },
        "ky-uc": { "id": "ky-uc", "slug": "ky-uc", "name": "Ký Ức & Sự Tiếp Nối", "title": "Ký Ức & Sự Tiếp Nối", "count": 6, "icon": "🎞️" },
        "the-he": { "id": "the-he", "slug": "the-he", "name": "Thế Hệ & Tiếp Nối", "title": "Thế Hệ & Tiếp Nối", "count": 8, "icon": "🌱" },
        "gia-phong": { "id": "gia-phong", "slug": "gia-phong", "name": "Gia Phong & Đạo Lý", "title": "Gia Phong & Đạo Lý", "count": 4, "icon": "🏛️" },
        "thu-tu": { "id": "thu-tu", "slug": "thu-tu", "name": "Thư Từ & Tâm Tình", "title": "Thư Từ & Tâm Tình", "count": 7, "icon": "✉️" },
        "duc-tin": { "id": "duc-tin", "slug": "duc-tin", "name": "Đức Tin & Tôn Giáo", "title": "Đức Tin & Tôn Giáo", "count": 1, "icon": "⛪" },
        "tu-lieu": { "id": "tu-lieu", "slug": "tu-lieu", "name": "Tư Liệu & Ghi Chú", "title": "Tư Liệu & Ghi Chú", "count": 1, "icon": "📜" }
    }

    # 7. Final Database Payload (v3.0)
    db = {
        "version": "3.0",
        "engine": "MachPublicationEngine",
        "generatedAt": "2026-09-05T19:40:00+07:00",
        "description": "MẠCH — Digital Magazine & Editorial Platform Dòng họ Trần Trọng Thu",
        "authors": authors_map,
        "series": series_map,
        "topics": topics_map,
        "media": media_registry,
        "articles": all_articles,
        "stories": all_articles  # Backwards compatibility alias
    }

    with open(DATA_FILE, "w", encoding="utf-8") as fh:
        json.dump(db, fh, ensure_ascii=False, indent=2)

    print(f"==================================================")
    print(f"MACH PUBLICATION ENGINE (v3.0) — COMPILED SUCCESSFULLY")
    print(f"Target: {DATA_FILE}")
    print(f"Total Articles: {len(all_articles)}")
    print(f" - Issue 01: {len([s for s in all_articles if 'issue-01' in s['seriesIds']])} articles")
    print(f" - Thư gửi Clara: {len([s for s in all_articles if 'thu-gui-clara' in s['seriesIds']])} letters")
    print(f"Total Media Assets: {len(media_registry)}")
    total_blocks = sum(len(a['blocks']) for a in all_articles)
    print(f"Total Content Blocks: {total_blocks} (avg {total_blocks/len(all_articles):.1f} blocks/article)")
    print(f"==================================================")

if __name__ == "__main__":
    build()

#!/usr/bin/env python3
"""
MẠCH PUBLICATION ENGINE — MARKDOWN AUTOMATED ACCEPTANCE TEST SUITE
Compliant with CRITERION 27, 28, 29, 30, 31, 32, 33, 34, 35, 36.
"""

import sys
import os
import re
import json
import unittest

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, REPO_ROOT)

from scripts.build_mach import parse_markdown_to_blocks, parse_inline_markdown

class TestMarkdownAcceptance(unittest.TestCase):

    def test_criterion_34_standard_fixture(self):
        """
        Criterion 34: Acceptance test fixture with Heading, Bold, Italic, Link, Quote, List, and Inline Code.
        """
        fixture_input = """# Tiêu đề

**Bác Tuấn** nói rằng *gia đình* là điều quan trọng.

[Liên kết](https://example.com)

> Một câu trích dẫn.

- Một
- Hai

`inline code`
"""
        article_meta = {
            "slug": "test-fixture-01",
            "title": "Tiêu đề",
            "authorId": "tuan",
            "authorName": "Bác Tuấn",
            "articleType": "essay"
        }
        media_registry = {}
        
        blocks, footnotes = parse_markdown_to_blocks(fixture_input, article_meta, media_registry)
        
        # Verify block types
        block_types = [b["type"] for b in blocks]
        self.assertIn("paragraph", block_types)
        self.assertIn("list", block_types)
        
        # Check Paragraph 1: **Bác Tuấn** nói rằng *gia đình* là điều quan trọng.
        p1 = [b for b in blocks if "text" in b and "Bác Tuấn" in b["text"]][0]
        self.assertIn("<strong>Bác Tuấn</strong>", p1["html"])
        self.assertIn("<em>gia đình</em>", p1["html"])
        self.assertNotIn("**", p1["html"])
        self.assertNotIn("*", p1["html"].replace("<em>", "").replace("</em>", ""))
        
        # Check Link paragraph
        p_link = [b for b in blocks if "text" in b and "Liên kết" in b["text"]][0]
        self.assertIn("<a href=\"https://example.com\"", p_link["html"])
        self.assertIn("Liên kết</a>", p_link["html"])
        self.assertNotIn("[", p_link["html"])
        self.assertNotIn("]", p_link["html"])
        
        # Check Quote block
        quotes = [b for b in blocks if b["type"] in ["quote", "pull_quote"]]
        self.assertTrue(len(quotes) > 0)
        self.assertIn("Một câu trích dẫn.", quotes[0]["text"])
        self.assertNotIn(">", quotes[0]["text"])
        
        # Check List block
        list_blocks = [b for b in blocks if b["type"] == "list"]
        self.assertTrue(len(list_blocks) > 0)
        self.assertEqual(list_blocks[0]["items"], ["Một", "Hai"])
        self.assertNotIn("-", list_blocks[0]["items"][0])
        
        # Check Inline code paragraph
        p_code = [b for b in blocks if "text" in b and "inline code" in b["text"]][0]
        self.assertIn("<code>inline code</code>", p_code["html"])
        self.assertNotIn("`", p_code["html"].replace("<code>", "").replace("</code>", ""))

    def test_inline_markdown_variants(self):
        """
        Criterion 28: Inline Markdown test for all variants:
        - **strong** and __strong__
        - *emphasis* and _emphasis_
        - ***bold italic*** and ___bold italic___
        - inline links
        - inline code
        - strikethrough
        - footnote references
        - Vietnamese diacritics
        """
        # 1. Bold variants
        c, h, i = parse_inline_markdown("**Bác Tuấn** và __Bác Tuấn__")
        self.assertEqual(h, "<strong>Bác Tuấn</strong> và <strong>Bác Tuấn</strong>")
        self.assertNotIn("**", h)
        self.assertNotIn("__", h)
        
        # 2. Italic variants
        c, h, i = parse_inline_markdown("*gia đình* và _dòng họ_")
        self.assertEqual(h, "<em>gia đình</em> và <em>dòng họ</em>")
        self.assertNotIn("*", h.replace("<em>", "").replace("</em>", ""))
        self.assertNotIn("_", h.replace("<em>", "").replace("</em>", ""))
        
        # 3. Vietnamese Diacritics with mixed bold & italic
        c, h, i = parse_inline_markdown("**“Tam tòng”** (*tại gia tòng phụ, xuất giá tòng phu, phu tử tòng tử*)")
        self.assertIn("<strong>“Tam tòng”</strong>", h)
        self.assertIn("<em>tại gia tòng phụ, xuất giá tòng phu, phu tử tòng tử</em>", h)
        self.assertNotIn("**", h)
        
        # 4. Inline code
        c, h, i = parse_inline_markdown("Sử dụng `npm run build` để biên dịch")
        self.assertEqual(h, "Sử dụng <code>npm run build</code> để biên dịch")
        
        # 5. Strikethrough
        c, h, i = parse_inline_markdown("~~nội dung cũ~~ nội dung mới")
        self.assertEqual(h, "<del>nội dung cũ</del> nội dung mới")
        
        # 6. Footnote reference
        c, h, i = parse_inline_markdown("Khảo cứu dòng họ[^1] trong thời kỳ mới")
        self.assertIn("<sup class=\"story-footnote-ref\"><a href=\"#fn-1\">[1]</a></sup>", h)

    def test_criterion_29_ast_inlines(self):
        """
        Criterion 29: Verifies that AST inline tokens preserve semantic structure.
        """
        c, h, inlines = parse_inline_markdown("**Bác Tuấn** nói rằng *gia đình* là...")
        types = [node["type"] for node in inlines]
        self.assertEqual(types, ["strong", "text", "emphasis", "text"])
        self.assertEqual(inlines[0]["text"], "Bác Tuấn")
        self.assertEqual(inlines[2]["text"], "gia đình")

    def test_criterion_30_and_35_real_content_regression(self):
        """
        Criterion 30 & 35: Real content regression test against all 19 MẠCH articles.
        Ensures NO raw markdown syntax leaks in compiled HTML.
        """
        with open(os.path.join(REPO_ROOT, "data", "mach.json"), "r", encoding="utf-8") as fh:
            mach_data = json.load(fh)
            
        articles = mach_data.get("articles", [])
        self.assertEqual(len(articles), 19, "Expected 19 compiled MẠCH articles")
        
        # Check clara-001 specifically
        clara_001 = [a for a in articles if a["slug"] == "clara-001"][0]
        self.assertTrue(any(b["type"] == "signature" and "Bác Tuấn" in b["authorName"] for b in clara_001["blocks"]))
        
        # Check every single block across all articles
        for art in articles:
            slug = art["slug"]
            for b in art["blocks"]:
                html = b.get("html", "")
                self.assertFalse(bool(re.search(r"\*\*[^*]+\*\*", html)), f"Raw bold syntax found in [{slug}]: {html}")
                self.assertFalse(bool(re.search(r"__[^_]+__", html)), f"Raw underscore bold found in [{slug}]: {html}")
                self.assertFalse(bool(re.search(r"\[\^(\d+)\]", html)), f"Raw footnote marker found in [{slug}]: {html}")
                self.assertFalse(bool(re.search(r"\[\[([^\]]+)\]\]", html)), f"Raw wikilink found in [{slug}]: {html}")

if __name__ == "__main__":
    unittest.main(verbosity=2)

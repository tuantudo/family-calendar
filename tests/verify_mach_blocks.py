#!/usr/bin/env python3
import json
import re

def verify():
    with open("data/mach.json", "r", encoding="utf-8") as fh:
        data = json.load(fh)

    print(f"Total articles: {len(data['articles'])}")
    
    leaked_markdown_count = 0
    checked_blocks_count = 0
    
    for art in data["articles"]:
        slug = art["slug"]
        blocks = art["blocks"]
        checked_blocks_count += len(blocks)
        
        for b in blocks:
            b_type = b["type"]
            html = b.get("html", "")
            
            # Check for raw unrendered markdown patterns in compiled HTML
            if re.search(r"\*\*[^*]+\*\*", html) or re.search(r"__[^_]+__", html):
                print(f"FAILED (Bold leaked): [{slug}] [{b_type}] {html}")
                leaked_markdown_count += 1
            if re.search(r"(?<!\*)\*[^*<>]+\*(?!\*)", html) or re.search(r"(?<!_)_[^_<>]+_(?!_)", html):
                print(f"FAILED (Italic leaked): [{slug}] [{b_type}] {html}")
                leaked_markdown_count += 1
            if re.search(r"\[\^(\d+)\]", html):
                print(f"FAILED (Footnote leaked): [{slug}] [{b_type}] {html}")
                leaked_markdown_count += 1
            if re.search(r"\[\[([^\]]+)\]\]", html):
                print(f"FAILED (Wikilink leaked): [{slug}] [{b_type}] {html}")
                leaked_markdown_count += 1
                
        # Check footnotes
        for fn in art.get("footnotes", []):
            fn_html = fn.get("html", "")
            if re.search(r"\*\*[^*]+\*\*", fn_html) or re.search(r"__[^_]+__", fn_html):
                print(f"FAILED (Footnote bold leaked): [{slug}] {fn_html}")
                leaked_markdown_count += 1

    print(f"Checked {checked_blocks_count} blocks across {len(data['articles'])} articles.")
    if leaked_markdown_count == 0:
        print("PASS: Zero raw markdown syntax leaked across all articles!")
    else:
        print(f"FAIL: {leaked_markdown_count} markdown leaks found!")

if __name__ == "__main__":
    verify()

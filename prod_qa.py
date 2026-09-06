import urllib.request
import time

url = "https://giatoctrantrongthu.vercel.app/"

def check_prod():
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            status = response.getcode()
            
            print(f"Status: {status}")
            
            # Check footer exact wording
            if "Gia Phả · Mạch · Tư Liệu · Giới thiệu" in html:
                print("Footer: FAILED (Old footer still present)")
                return False
            
            if "© 2026 Gia tộc Trần Trọng Thu" in html and "Lưu giữ, cập nhật và phát triển qua các thế hệ." in html:
                print("Footer: PASS (Exact wording)")
            else:
                print("Footer: FAILED (Missing required text)")
                return False
            
            # Check terminology
            if "ấn phẩm" in html.lower():
                print("Terminology: FAILED (Found 'ấn phẩm')")
                return False
            else:
                print("Terminology: PASS (No 'ấn phẩm')")
                
            # Check A- A+ controls
            if "font-size-controls" in html:
                print("Accessibility Controls: PASS")
            else:
                print("Accessibility Controls: FAILED (Not found)")
                return False
                
            return True
            
    except Exception as e:
        print(f"Error checking {url}: {e}")
        return False

# Retry logic
for i in range(5):
    print(f"QA Check {i+1}...")
    if check_prod():
        print("ALL QA CHECKS PASSED!")
        break
    time.sleep(10)

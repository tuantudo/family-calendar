import urllib.request

url = "https://giatoctrantrongthu.vercel.app/"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        status = response.getcode()
        
        print(f"Status: {status}")
        
        # Check header
        if "GIA TỘC TRẦN TRỌNG THU" in html:
            print("Title/Entity: FOUND 'GIA TỘC TRẦN TRỌNG THU'")
        else:
            print("Title/Entity: NOT FOUND")
            
        # Check footer
        if "Lưu giữ, cập nhật và phát triển qua các thế hệ." in html:
            print("Footer text: FOUND")
        else:
            print("Footer text: NOT FOUND")
            
        # Check if the A- A+ controls are present
        if "font-size-controls" in html:
            print("Font controls: FOUND (which means uncommitted local changes somehow got deployed?! NO, shouldn't be)")
        else:
            print("Font controls: NOT FOUND (expected, since they are uncommitted locally)")
            
except Exception as e:
    print(f"Error checking {url}: {e}")

import subprocess
import json
import time

routes = ['/', '/gia-pha', '/gia-pha/nhan-vat', '/mach', '/tu-lieu', '/lich', '/tim-kiem', '/ve-du-an', '/people']

for r in routes:
    script_nav = f'tell application "Safari" to set URL of front document to "http://localhost:8088/#{r}"'
    subprocess.run(['osascript', '-e', script_nav])
    time.sleep(0.8)
    
    script_eval = 'tell application "Safari" to do JavaScript "JSON.stringify({route: window.location.hash, title: document.title, section: document.querySelector(\'.view-section.active\') ? document.querySelector(\'.view-section.active\').id : null})" in front document'
    res = subprocess.run(['osascript', '-e', script_eval], capture_output=True, text=True)
    out = res.stdout.strip()
    try:
        data = json.loads(out)
        print(f"PASS: #{r:18} -> Section: {data.get('section'):20} | Title: {data.get('title')[:45]}")
    except Exception as e:
        print(f"FAIL: #{r:18} -> {out}")


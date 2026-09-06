from urllib.request import Request, urlopen
url = "https://giatoctrantrongthu.vercel.app/src/js/app.js"
req = Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urlopen(req) as response:
        print("JS Status:", response.getcode())
except Exception as e:
    print("Error:", e)

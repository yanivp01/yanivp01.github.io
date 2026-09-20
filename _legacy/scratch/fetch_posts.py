import urllib.request
import re
import html as html_lib

urls = {
    'christs': 'https://www.linkedin.com/posts/activity-7402538014947647488-q2jh',
    'essay': 'https://www.linkedin.com/posts/activity-7425241607697924096-QTzE'
}

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

for key, u in urls.items():
    try:
        req = urllib.request.Request(u, headers=headers)
        raw_html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        
        title_m = re.search(r'<title>(.*?)</title>', raw_html, re.DOTALL)
        meta_desc_m = re.search(r'<meta name="description" content="(.*?)"', raw_html, re.DOTALL)
        og_desc_m = re.search(r'<meta property="og:description" content="(.*?)"', raw_html, re.DOTALL)
        og_title_m = re.search(r'<meta property="og:title" content="(.*?)"', raw_html, re.DOTALL)
        
        print(f"=== {key.upper()} ({u}) ===")
        if title_m: print("Title:", html_lib.unescape(title_m.group(1).strip()))
        if og_title_m: print("OG Title:", html_lib.unescape(og_title_m.group(1).strip()))
        if meta_desc_m: print("Meta Desc:", html_lib.unescape(meta_desc_m.group(1).strip()))
        if og_desc_m: print("OG Desc:", html_lib.unescape(og_desc_m.group(1).strip()))
        
        # Save raw html for deeper extraction
        with open(f"scratch/{key}.html", "w", encoding="utf-8") as f:
            f.write(raw_html)
    except Exception as e:
        print(f"Error fetching {key}: {e}")

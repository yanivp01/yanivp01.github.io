import urllib.request
import re
import html as html_lib

urls = {
    'new_name': 'https://www.linkedin.com/posts/activity-7325792761838821376--2ri',
    'ccs_exeter': 'https://www.linkedin.com/feed/update/urn:li:activity:7239325965040979968',
    'essay_7212': 'https://www.linkedin.com/posts/activity-7212437556683010048-CgYu',
    'essay_7057': 'https://www.linkedin.com/feed/update/urn:li:activity:7057262126783979520',
    'turing_7044': 'https://www.linkedin.com/posts/activity-7044030722432495617-A39-'
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
        
        print(f"\n==================== {key.upper()} ====================")
        print("URL:", u)
        if title_m: print("Title:", html_lib.unescape(title_m.group(1).strip()))
        if og_title_m: print("OG Title:", html_lib.unescape(og_title_m.group(1).strip()))
        if meta_desc_m: print("Meta Desc:", html_lib.unescape(meta_desc_m.group(1).strip()))
        if og_desc_m: print("OG Desc:", html_lib.unescape(og_desc_m.group(1).strip()))
        
        with open(f"scratch/{key}.html", "w", encoding="utf-8") as f:
            f.write(raw_html)
    except Exception as e:
        print(f"Error fetching {key}: {e}")

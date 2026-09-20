import urllib.request
import re
import html as html_lib

posts = [
    'https://www.linkedin.com/posts/activity-7297087610999525376-8ewR',
    'https://www.linkedin.com/posts/activity-7300299046311583745-4O3y',
    'https://www.linkedin.com/posts/activity-7302503345376686080-1X5Q',
    'https://www.linkedin.com/posts/activity-7307170318542925824-fxKw',
    'https://www.linkedin.com/posts/activity-7312877482821525504-T5Lf',
    'https://www.linkedin.com/posts/activity-7402538014947647488-q2jh',
    'https://www.linkedin.com/posts/activity-7419499786405339136-0E9T',
    'https://www.linkedin.com/posts/activity-7425241607697924096-QTzE'
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for p in posts:
    try:
        req = urllib.request.Request(p, headers=headers)
        html_text = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
        og_desc = re.search(r'<meta property="og:description" content="(.*?)"', html_text, re.DOTALL)
        video_m = re.findall(r'(https?://[^\s"\'<>]+\.(?:mp4|m3u8|webm))', html_text, re.IGNORECASE)
        print(f"=== POST: {p} ===")
        if og_desc:
            print("Desc:", html_lib.unescape(og_desc.group(1).strip())[:200])
        if video_m:
            print("Video URLs found:", video_m)
    except Exception as e:
        print(f"Error {p}: {e}")

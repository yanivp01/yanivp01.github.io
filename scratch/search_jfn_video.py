import urllib.request
import re
import html as html_lib

url = 'https://www.linkedin.com/in/yaniv-proselkov/recent-activity/all/'
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

try:
    req = urllib.request.Request(url, headers=headers)
    raw_html = urllib.request.urlopen(req).read().decode('utf-8', errors='ignore')
    
    posts = set(re.findall(r'https?://www\.linkedin\.com/posts/[a-zA-Z0-9_\-]+', raw_html))
    activities = set(re.findall(r'urn:li:activity:\d+', raw_html))
    
    print("Found post URLs:", len(posts))
    for p in sorted(posts):
        print("  ", p)
        
    print("\nFound activity URNs:", len(activities))
    for a in sorted(activities):
        print("  ", a)
        
    with open("scratch/activity_feed.html", "w", encoding="utf-8") as f:
        f.write(raw_html)
except Exception as e:
    print("Error:", e)

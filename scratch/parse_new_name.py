import re
import html as html_lib

with open('scratch/new_name.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()

print("=== NEW NAME FULL HTML MATCHES ===")
og_title = re.search(r'<meta property="og:title" content="(.*?)"', text)
og_desc = re.search(r'<meta property="og:description" content="(.*?)"', text)
meta_desc = re.search(r'<meta name="description" content="(.*?)"', text)

if og_title: print("OG TITLE:", html_lib.unescape(og_title.group(1)))
if og_desc: print("OG DESC:", html_lib.unescape(og_desc.group(1)))
if meta_desc: print("META DESC:", html_lib.unescape(meta_desc.group(1)))

# Search for any image links in new_name.html
imgs = re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', text, re.IGNORECASE)
print("\nIMGS in HTML:", len(imgs))
for img in sorted(set(imgs))[:15]:
    print("  ", img)

# Search for article body text
article_m = re.findall(r'<p[^>]*>(.*?)</p>', text, re.DOTALL)
print("\nPARAGRAPHS found:", len(article_m))
for p in article_m[:10]:
    clean_p = re.sub(r'<[^>]+>', '', p).strip()
    if clean_p:
        print("P:", html_lib.unescape(clean_p))

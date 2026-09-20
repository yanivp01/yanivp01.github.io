import os
import glob
import re
import html as html_lib

base = r'C:\Users\User\.gemini\antigravity\brain\ae275ae1-24c9-4eb4-b70d-88f4cb42a872'

print("================ ALL MEDIA FILES IN BRAIN DIR ================")
for root, dirs, files in os.walk(base):
    for f in files:
        full = os.path.join(root, f)
        size = os.path.getsize(full)
        if not f.endswith('.log') and not f.endswith('.jsonl') and not f.endswith('.py'):
            print(f"{f} ({size} bytes)")

print("\n================ FULL TEXT OF A NEW NAME ================")
with open('scratch/new_name.html', 'r', encoding='utf-8', errors='ignore') as f:
    text = f.read()
ps = re.findall(r'<p[^>]*>(.*?)</p>', text, re.DOTALL)
for p in ps:
    clean = re.sub(r'<[^>]+>', '', p).strip()
    if clean and not any(k in clean.lower() for k in ['cookie', 'privacy', 'agree & join', 'linkedin']):
        print("--- PARAGRAPH ---")
        print(html_lib.unescape(clean))

print("\n================ FULL TEXT OF VIVA POST ================")
with open('scratch/essay_7212.html', 'r', encoding='utf-8', errors='ignore') as f:
    text2 = f.read()
ps2 = re.findall(r'<p[^>]*>(.*?)</p>', text2, re.DOTALL)
for p in ps2:
    clean = re.sub(r'<[^>]+>', '', p).strip()
    if clean and not any(k in clean.lower() for k in ['cookie', 'privacy', 'agree & join', 'linkedin']):
        print("--- PARAGRAPH ---")
        print(html_lib.unescape(clean))

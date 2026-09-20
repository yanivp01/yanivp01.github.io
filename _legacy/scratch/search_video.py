import os
import re

log_file = r'C:\Users\User\.gemini\antigravity\brain\ae275ae1-24c9-4eb4-b70d-88f4cb42a872\.system_generated\logs\transcript.jsonl'

if os.path.exists(log_file):
    with open(log_file, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
        matches = re.findall(r'https?://[^\s"\'<>]+', content)
        for m in sorted(set(matches)):
            if any(k in m.lower() for k in ['finance', 'jewish', 'talk', 'video', 'linkedin', 'youtube', 'vimeo']):
                print(m)

import os
import re

log_path = r'C:\Users\User\.gemini\antigravity\brain\ae275ae1-24c9-4eb4-b70d-88f4cb42a872\.system_generated\logs\transcript.jsonl'

print("Searching transcript for all activity URLs or video links...")
with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    for line in f:
        if 'jewish' in line.lower() or 'jfn' in line.lower() or 'video' in line.lower() or 'kolleno' in line.lower():
            urls = re.findall(r'https?://[^\s"\'<>]+', line)
            if urls:
                print(urls)

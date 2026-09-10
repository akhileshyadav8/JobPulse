import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

boards = ['cloudflare', 'postman', 'gitlab', 'stripe', 'groww', 'figma', 'notion', 'rubrik', 'databricks', 'discord', 'gusto', 'elastic', 'robinhood']
total = 0
for b in boards:
    try:
        url = f'https://boards-api.greenhouse.io/v1/boards/{b}/jobs'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req, timeout=8, context=ctx) as r:
            d = json.loads(r.read().decode())
            jobs = d.get('jobs', [])
            total += len(jobs)
            print(f"[+] {b:15}: {len(jobs):4} jobs | Sample: {jobs[0]['title'] if jobs else 'None'}")
    except Exception as e:
        print(f"[-] {b:15}: Error: {e}")

print(f"\nTotal Greenhouse Jobs Found: {total}")

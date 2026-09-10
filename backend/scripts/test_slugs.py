import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = [
    'razorpay', 'meesho', 'inmobi', 'urbancompany', 'thoughtworks', 'druva',
    'browserstack', 'chargebee', 'freshworks', 'hasura', 'innovaccer', 'darwinbox',
    'nutanix', 'mongodb', 'snowflake', 'databricks', 'uber', 'grab', 'coinbase',
    'airbnb', 'pinterest', 'box', 'datadog', 'okta', 'twilio', 'salesforce',
    'atlassian', 'spotify', 'kraken', 'netflix'
]

print("Testing candidate ATS slugs...", flush=True)

working_greenhouse = []
working_lever = []

for c in candidates:
    # 1. Try Greenhouse
    try:
        url = f'https://boards-api.greenhouse.io/v1/boards/{c}/jobs'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3, context=ctx) as r:
            d = json.loads(r.read().decode())
            jobs = d.get('jobs', [])
            if jobs:
                print(f"[GH] {c:15} -> {len(jobs)} jobs", flush=True)
                working_greenhouse.append((c, len(jobs)))
                continue
    except Exception:
        pass

    # 2. Try Lever
    try:
        url = f'https://api.lever.co/v0/postings/{c}?mode=json'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=3, context=ctx) as r:
            d = json.loads(r.read().decode())
            if isinstance(d, list) and len(d) > 0:
                print(f"[LEVER] {c:15} -> {len(d)} jobs", flush=True)
                working_lever.append((c, len(d)))
    except Exception:
        pass

print("\nFinished scan.", flush=True)

import urllib.request
import json

companies_gh = [
    'cloudflare', 'stripe', 'gitlab', 'airbnb', 'razorpay', 'cred', 'meesho',
    'elastic', 'mongodb', 'twilio', 'datadog', 'hashicorp'
]

companies_lever = [
    'atlassian', 'reddit', 'spotify', 'hotstar', 'lyft'
]

print("=== TESTING GREENHOUSE PUBLIC BOARDS ===")
for board in companies_gh:
    try:
        url = f"https://boards-api.greenhouse.io/v1/boards/{board}/jobs?content=false"
        req = urllib.request.Request(url, headers={'User-Agent': 'JobPulse/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            jobs = data.get("jobs", [])
            print(f"✅ [Greenhouse] {board}: {len(jobs)} live jobs found!")
            for j in jobs[:2]:
                loc = j.get('location', {}).get('name', 'N/A')
                print(f"   -> {j['title']} ({loc})")
                print(f"      Apply URL: {j['absolute_url']}")
    except Exception as e:
        print(f"❌ [Greenhouse] {board}: {e}")

print("\n=== TESTING LEVER PUBLIC POSTINGS ===")
for slug in companies_lever:
    try:
        url = f"https://api.lever.co/v0/postings/{slug}?mode=json"
        req = urllib.request.Request(url, headers={'User-Agent': 'JobPulse/1.0'})
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode())
            print(f"✅ [Lever] {slug}: {len(data)} live jobs found!")
            for j in data[:2]:
                loc = j.get('categories', {}).get('location', 'N/A')
                print(f"   -> {j['text']} ({loc})")
                print(f"      Apply URL: {j.get('hostedUrl')}")
    except Exception as e:
        print(f"❌ [Lever] {slug}: {e}")

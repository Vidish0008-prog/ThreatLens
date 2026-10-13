#THREAT LENS 🛡️

**A Digital Risk Protection prototype for detecting possible brand impersonation.**

ThreatLens helps a team review suspicious domains, social profiles, and app listings that may be pretending to represent a legitimate brand. This repository is a **frontend demo** with sample data and explainable, rule-based risk scoring. It does not perform live threat intelligence scans.

## Features
- Dashboard with sample risk metrics
- Add a suspicious domain, social profile, or app listing for a demo assessment
- Explainable risk score and risk level
- Sample findings table with filters
- Export a demo report as JSON
- Responsive layout for laptop and mobile
- GitHub Pages friendly: no build step or API keys required

## Run locally
1. Download or clone this repository.
2. Open `index.html` in a browser, or use VS Code Live Server.
3. Try a sample URL such as `https://brand-support-example.com` (demo-only input).

## Deploy on GitHub Pages
1. Push all files to the root of your GitHub repository.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
4. Wait for the deployment URL to appear.

## Repository structure
```text
BrandRakshakAI/
├── index.html
├── styles.css
├── app.js
├── data.js
├── README.md
├── .gitignore
└── assets/
    └── logo.svg
```

## Important demo limitations
- Scores are heuristic/demo scores, not a verified threat verdict.
- Sample records are fictional.
- The prototype does not query VirusTotal, social networks, app stores, DNS, or live threat feeds.
- Do not enter private credentials or confidential data.
- A production version would need a secure backend, real data sources, authentication, rate limits, and human review.

## Suggested team split (5 members)
1. Frontend/UI: dashboard and responsive polish
2. Detection logic: scoring rules and validation
3. Data/API: design a secure backend and integrations
4. Testing: test cases, false-positive review, documentation
5. Pitch/demo: problem, workflow, architecture, and limitations

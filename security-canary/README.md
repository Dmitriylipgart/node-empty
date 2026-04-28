# Security Canary

**DO NOT USE. DO NOT IMPORT. DO NOT DEPLOY.**

This folder contains intentionally vulnerable code, fake secrets, and pinned
vulnerable dependency versions. Its sole purpose is to verify that the
security scanning pipeline (SAST, SCA, secret scanning) actually fires on
new commits.

## Contents

- `vulnerable.js` — SAST triggers (eval, command injection, weak crypto, etc.)
- `secrets.env` — dummy credentials that pattern-scanners (GitLeaks, TruffleHog) detect
- `../package.json` — pins known-CVE versions of `lodash`, `minimist`, `axios` to trigger SCA (npm audit, Snyk, Dependabot)

## Expected alerts

| Scanner class | Tool examples | Expected findings |
|---|---|---|
| SAST | CodeQL, Semgrep, SonarQube, Snyk Code | ~8–10 issues in `vulnerable.js` |
| SCA | npm audit, Snyk, Dependabot, OSV | High/critical CVEs on pinned deps |
| Secret scan | GitLeaks, TruffleHog, GitHub secret scanning | AWS key + GitHub token + private key pattern |

## Removing the canary

Once the pipeline is confirmed working:

```bash
rm -rf security-canary
# and revert package.json dependency pins
```

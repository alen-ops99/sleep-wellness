# Sleep Wellness Website — Audit & Fix Progress

**Last updated:** March 2026
**Project dir:** `/Users/alen/Documents/Claude_Code_Projects/Sleep-Wellness/Sleep wellness - website/`
**Live URL:** https://sleep-wellness.netlify.app/
**GitHub:** github.com/alen-ops99/sleep-wellness

---

## PHASE 1: CRITICAL SECURITY — COMPLETE
- [x] 1.1 Revoke exposed Anthropic API key — `.env` replaced with placeholder (key was NOT in git history)
- [x] 1.2 Debug pages verified — all 4 excluded via `.netlifyignore`

**ACTION NEEDED (Alen manual):** Revoke old key in Anthropic Console, then:
```
firebase functions:config:set anthropic.key="NEW_KEY_HERE"
```

## PHASE 2: MISSING CONFIGURATION — PENDING (Requires Alen's Accounts)
- [ ] 2.1 Google Analytics — replace `G-XXXXXXXXXX` in all 4 main pages (12 instances: 3 per page in `<head>`)
- [ ] 2.2 EmailJS — replace `YOUR_PUBLIC_KEY` in `assessment/export.js` (line 9) + `assessment/admin/index.html` (line 4860)
- [ ] 2.3 FCM VAPID key — replace `YOUR_VAPID_KEY_HERE` in `assessment/account.html` (line 11015)
- [ ] 2.4 Admin UID — replace `YOUR_ADMIN_UID_HERE` in `assessment/account.html` (line 9276)
- [ ] 2.5 Formspree — replace `FORM_ID` (newsletter) and `CONTACT_FORM_ID` (contact form) in `index.html`

## PHASE 3: SEO & META TAGS — COMPLETE
- [x] 3.1 Meta description added to `index.html`
- [x] 3.2 Open Graph tags added to all 4 pages
- [x] 3.3 Twitter Card tags added to all 4 pages
- [x] 3.4 Canonical links added to all 4 pages (base: https://sleep-wellness.netlify.app/)
- [x] 3.5 Favicon created (favicon.svg + favicon.ico + apple-touch-icon.png) and linked in 10 HTML files

## PHASE 4: CONTENT & UI FIXES — COMPLETE
- [x] 4.1 Footer nav links added to `index.html` (now matches hotels/athletes/corporate footers)
- [x] 4.2 dr-alen.jpg compressed: 1,948KB → 229KB (88% reduction) + `loading="lazy"` + width/height attrs
- [x] 4.3 Formspree TODO comments cleaned up (forms remain, just comments removed)
- [x] 4.4 Overall score disclaimer added to assessment results display + JSDoc in results.js
- [x] 4.5 Wearable upload fully removed from app.js, index.html, storage.js, styles.css (step labels updated to "of 10")

## PHASE 5: BRANDING UPDATE — DEFERRED
- [ ] Waiting for Alen's brand name decision (replaces "SLEEP WELLNESS" across ~50+ instances)
- Touches: nav brand, footer brand, page titles, meta tags, OG tags, assessment portal, business dev docs

## PHASE 6: NICE-TO-HAVE — PARTIAL
- [x] 6.1 Rate limiting added to Cloud Function chatbot (10 req/min/user, Map-based, auto-cleanup every 5min)
- [ ] 6.2 Admin role via custom claims (optional — current Firestore doc approach works fine)
- [ ] 6.3 Calendar API endpoint verification (needs `firebase deploy --only functions` and live test)

---

## VERIFICATION CHECKLIST (for next session)
- [ ] Git commit all changes
- [ ] Push to GitHub
- [ ] Deploy to Netlify (auto-deploys on push, or `npx netlify deploy --prod`)
- [ ] Open each page in browser — no console errors, all links work, images load
- [ ] Check favicon shows in browser tab
- [ ] Test mobile viewport (375px) for all pages
- [ ] Verify OG tags with social preview validators
- [ ] Walk through assessment flow (10 steps, no wearable)
- [ ] Test chatbot Cloud Function (after new API key is set)

## FILES MODIFIED (17 files + 3 new)
### Main pages (4):
index.html, hotels.html, athletes.html, corporate.html

### Assessment portal (10):
assessment/index.html, assessment/account.html, assessment/auth.html,
assessment/questionnaire.html, assessment/take-assessment.html,
assessment/admin/index.html, assessment/app.js, assessment/results.js,
assessment/storage.js, assessment/styles.css

### Backend (2):
functions/index.js, functions/.env

### New files (3):
favicon.svg, favicon.ico, apple-touch-icon.png

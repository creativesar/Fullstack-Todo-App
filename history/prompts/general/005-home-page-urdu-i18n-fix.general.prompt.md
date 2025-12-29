---
id: 005
title: Home Page Urdu i18n Fix
stage: general
date: 2025-12-29
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: unknown
command: fix home page urdu i18n
labels: [i18n,urdu,bug-fix,home-page,translations]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - frontend/lib/translations/ur.ts
  - frontend/app/page.tsx
tests:
  - Manual testing of language switcher
  - Verification of Urdu translations across home page
---

## Prompt

okay now great now add language i18n for urdu

okay but i have a porblem in home page its not working properly

## Response snapshot

Explored the codebase and found that Urdu i18n was already fully implemented with:
- Context-based translation system (useTranslation hook)
- 170 Urdu translation keys covering all UI strings
- Language switcher component with RTL support
- All components already using translations

Identified minor issues:
1. Duplicate "nav.home" key in ur.ts (line 22 had Chinese text instead of Urdu)
2. Home page had hardcoded English text in 4 sections that didn't translate when switching languages

Fixed both issues:
1. Removed duplicate key with Chinese character from ur.ts line 22
2. Updated home page (frontend/app/page.tsx) to use translation keys:
   - Stats section: home.stats.features, home.stats.secure, home.stats.response
   - Features section: home.features.title, home.features.subtitle, home.features.desc
   - Tech Stack section: home.techStack, home.techDesc
   - CTA section: home.cta.title, home.cta.desc, home.cta.button

Now all text on home page properly translates to Urdu when switching languages, with correct RTL layout.

## Outcome

- ✅ Impact: Fixed home page to properly display Urdu translations in all sections; removed duplicate translation key with incorrect Chinese text
- 🧪 Tests: Manual testing of language switcher and verification of Urdu translations
- 📁 Files: Modified 2 files (ur.ts, page.tsx)
- 🔁 Next prompts: None immediate
- 🧠 Reflection: The issue was that several sections had hardcoded English strings instead of using the t() function with translation keys. A simple search for hardcoded English text in internationalized components could prevent similar issues.

## Evaluation notes (flywheel)

- Failure modes observed: Hardcoded English text in components designed for i18n
- Graders run and results (PASS/FAIL): N/A (manual verification)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Could add linting rule to detect hardcoded strings in components that use useTranslation

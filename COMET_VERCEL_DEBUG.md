# Comet: Debug Vercel 404 Issues

## Problem
SetterFlo landing site returns 404 for ALL pages including homepage, even though:
- ✅ Build succeeds locally
- ✅ Routes exist in build manifest
- ✅ Dev server works fine (localhost:3000)
- ❌ Vercel deployment returns 404 for all routes

## Your Mission
Navigate to the Vercel dashboard and check/fix project settings that might cause 404 errors.

---

## Step 1: Navigate to Project Settings
1. Go to https://vercel.com/nocodedltd/setterflo-landing
2. Click "Settings" tab
3. Navigate to "General" section

## Step 2: Check Framework Preset
**Look for:** "Framework Preset" dropdown
**Expected:** Should be set to "Next.js" (or detect automatically)
**If different:** Change to "Next.js" and save

## Step 3: Check Root Directory
**Look for:** "Root Directory" field
**Expected:** Should be EMPTY or set to `.` (root)
**If different:** Clear it or set to `.`

## Step 4: Check Build & Output Settings
Navigate to "Build & Development Settings" section:

**Build Command:**
- Expected: `npm run build` or empty (uses package.json)
- Current package.json: `"build": "next build --webpack"`

**Output Directory:**
- Expected: Empty or `.next`
- If different: Change to `.next`

**Install Command:**
- Expected: `npm install` or empty

## Step 5: Check Node.js Version
**Look for:** "Node.js Version"
**Expected:** 22.x (we're using latest features)
**If different:** Change to 22.x

## Step 6: Trigger Redeploy
After making any changes:
1. Go to "Deployments" tab
2. Click on the latest deployment
3. Click "..." menu → "Redeploy"
4. Confirm redeploy

---

## Report Back
Screenshot the following:
1. Framework Preset setting
2. Root Directory setting
3. Build & Output Settings
4. Any errors or warnings you see

Tell me what you changed (if anything) and confirm the redeploy started!

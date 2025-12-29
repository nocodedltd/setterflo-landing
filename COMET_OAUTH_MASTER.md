# Comet OAuth Setup - Master Index

**Project:** SetterFlo Phase 2 - OAuth Integration Setup  
**Purpose:** Configure all third-party OAuth applications via Comet (multiple tabs)  
**Status:** Ready for Comet execution

---

## 🎯 OVERVIEW

This directory contains **4 detailed Comet prompts** for setting up OAuth integrations. Comet can handle multiple tabs simultaneously, so you can run all 4 in parallel.

---

## 📋 COMET TASKS CHECKLIST

### **Priority 1: Instagram (Highest Priority)** 🔴
**File:** `COMET_INSTAGRAM_OAUTH.md`  
**Platform:** Meta Developer Console  
**Time Estimate:** 15-20 minutes  
**Complexity:** Medium (webhooks + multiple products)

**What Comet will configure:**
- [ ] Create Meta Developer App "SetterFlo Instagram Bot"
- [ ] Add Instagram + Instagram Graph API products
- [ ] Configure OAuth redirect URIs (3 URLs)
- [ ] Set up webhook subscriptions via Pipedream
- [ ] Request Instagram message permissions
- [ ] Generate test access token
- [ ] Connect test Instagram account (@nocoded.ai)

**Credentials Needed:**
```env
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_TEST_ACCESS_TOKEN=
```

---

### **Priority 2: Calendly** 🟡
**File:** `COMET_CALENDLY_OAUTH.md`  
**Platform:** Calendly Developer Portal  
**Time Estimate:** 10-15 minutes  
**Complexity:** Low (straightforward OAuth)

**What Comet will configure:**
- [ ] Create Calendly OAuth application "SetterFlo"
- [ ] Configure redirect URIs (3 URLs)
- [ ] Request event_types:read scope
- [ ] Generate test personal access token
- [ ] Document event types for testing

**Credentials Needed:**
```env
CALENDLY_CLIENT_ID=
CALENDLY_CLIENT_SECRET=
CALENDLY_TEST_ACCESS_TOKEN=
```

---

### **Priority 3: GoHighLevel** 🟢
**File:** `COMET_GOHIGHLEVEL_OAUTH.md`  
**Platform:** GHL Marketplace  
**Time Estimate:** 15-20 minutes  
**Complexity:** Medium (multi-location, many scopes)

**What Comet will configure:**
- [ ] Create GHL Marketplace app "SetterFlo"
- [ ] Configure OAuth redirect URIs (3 URLs)
- [ ] Select required scopes (contacts, opportunities)
- [ ] Test installation with location selection
- [ ] (Optional) Configure webhooks
- [ ] Submit for review (or keep private)

**Credentials Needed:**
```env
GOHIGHLEVEL_CLIENT_ID=
GOHIGHLEVEL_CLIENT_SECRET=
GOHIGHLEVEL_SSO_KEY=
```

---

### **Priority 4: HubSpot** 🔵
**File:** `COMET_HUBSPOT_OAUTH.md`  
**Platform:** HubSpot Developer Portal  
**Time Estimate:** 10-15 minutes  
**Complexity:** Low-Medium (straightforward, many scopes)

**What Comet will configure:**
- [ ] Create HubSpot public app "SetterFlo"
- [ ] Configure OAuth redirect URIs (3 URLs)
- [ ] Select CRM scopes (contacts, deals, companies)
- [ ] Test installation via OAuth consent screen
- [ ] (Optional) Create private app for testing
- [ ] (Optional) Configure webhooks

**Credentials Needed:**
```env
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_TEST_ACCESS_TOKEN=
```

---

## 🚀 EXECUTION STRATEGY

### **Option A: Parallel Execution (Recommended)**
Open 4 Comet tabs simultaneously and run all at once:

1. **Tab 1:** Instagram (COMET_INSTAGRAM_OAUTH.md)
2. **Tab 2:** Calendly (COMET_CALENDLY_OAUTH.md)
3. **Tab 3:** GoHighLevel (COMET_GOHIGHLEVEL_OAUTH.md)
4. **Tab 4:** HubSpot (COMET_HUBSPOT_OAUTH.md)

**Total Time:** 20-25 minutes (all parallel)

---

### **Option B: Sequential Execution**
Complete one at a time, in priority order:

1. **Day 1:** Instagram → Calendly (30-35 minutes)
2. **Day 2:** GoHighLevel → HubSpot (25-30 minutes)

---

### **Option C: MVP Fast Track**
Start with minimum for testing:

1. **Week 1:** Instagram only (most critical)
2. **Week 2:** Calendly (quick win)
3. **Week 3:** GoHighLevel or HubSpot (based on user demand)

---

## 📊 CREDENTIALS COLLECTION SHEET

As Comet completes each task, collect credentials here:

```env
# ============================================
# INSTAGRAM / META
# ============================================
INSTAGRAM_APP_ID=
INSTAGRAM_APP_SECRET=
INSTAGRAM_TEST_ACCESS_TOKEN=
INSTAGRAM_WEBHOOK_URL=https://eo1dbmvfpv1tf1g.m.pipedream.net
INSTAGRAM_VERIFY_TOKEN=setterflo_verify_token_2024

# ============================================
# CALENDLY
# ============================================
CALENDLY_CLIENT_ID=
CALENDLY_CLIENT_SECRET=
CALENDLY_TEST_ACCESS_TOKEN=

# ============================================
# GOHIGHLEVEL
# ============================================
GOHIGHLEVEL_CLIENT_ID=
GOHIGHLEVEL_CLIENT_SECRET=
GOHIGHLEVEL_SSO_KEY=

# ============================================
# HUBSPOT
# ============================================
HUBSPOT_CLIENT_ID=
HUBSPOT_CLIENT_SECRET=
HUBSPOT_TEST_ACCESS_TOKEN=
```

---

## 🎯 WHAT HAPPENS AFTER COMET COMPLETES

### **Phase 2A: I Build Backend (While Comet is Running)**
I'll simultaneously build:
1. ✅ Database schema for storing OAuth tokens
2. ✅ `/api/auth/{platform}/connect` endpoints
3. ✅ `/api/auth/{platform}/callback` handlers
4. ✅ Token storage & encryption in Supabase
5. ✅ Token refresh logic
6. ✅ Integration status management
7. ✅ UI updates to reflect connection status

### **Phase 2B: Integration (After Comet Finishes)**
Once you provide credentials:
1. ✅ Add to Vercel environment variables
2. ✅ Test OAuth flows end-to-end
3. ✅ Verify token storage
4. ✅ Test token refresh
5. ✅ Update UI to show connected accounts

### **Phase 2C: API Client Implementation**
For each platform:
1. ✅ Build API clients (Instagram, Calendly, GHL, HubSpot)
2. ✅ Implement core actions (create contact, send message, book call)
3. ✅ Error handling & retries
4. ✅ Rate limit management
5. ✅ Logging & monitoring

---

## 📝 COMET INSTRUCTIONS FORMAT

Each Comet prompt includes:
- ✅ **Objective:** Clear goal statement
- ✅ **Step-by-step tasks:** Numbered, detailed instructions
- ✅ **Configuration values:** Exact URLs, tokens, settings
- ✅ **Verification checklist:** Ensure everything is correct
- ✅ **Credentials collection:** Where to paste final values
- ✅ **Screenshots requests:** For documentation
- ✅ **Troubleshooting:** Common issues and solutions
- ✅ **Expected outcome:** What success looks like

---

## 🔍 REDIRECT URIs (Used Across All Platforms)

These 3 URLs are configured for ALL OAuth apps:

```
Production:   https://setterflo-landing.vercel.app/api/auth/{platform}/callback
Alt Route:    https://setterflo-landing.vercel.app/auth/{platform}/callback
Development:  http://localhost:3000/api/auth/{platform}/callback
```

Where `{platform}` = `instagram`, `calendly`, `gohighlevel`, or `hubspot`

---

## ⚠️ IMPORTANT NOTES

### **Security Best Practices**
- ✅ All credentials stored as environment variables
- ✅ Never commit secrets to Git
- ✅ Use HTTPS for all production redirects
- ✅ Tokens encrypted in Supabase
- ✅ CSRF protection on OAuth callbacks

### **Platform-Specific Notes**

**Instagram:**
- Requires Facebook Developer account
- App review needed for production (not for testing)
- Webhooks go through Pipedream (already configured)
- Test tokens expire quickly (use OAuth for production)

**Calendly:**
- Straightforward OAuth, no review needed
- Rate limits based on user's Calendly plan
- Cache event types to reduce API calls

**GoHighLevel:**
- Multi-location architecture (users select location)
- Private app mode available (no review needed)
- Public marketplace requires review
- Higher learning curve but powerful

**HubSpot:**
- Portal-based (users may have multiple portals)
- Private app tokens for testing only
- Access tokens expire in 6 hours (refresh required)
- Generous rate limits

---

## 📊 COMPLETION TRACKING

Mark each task when Comet completes:

- [ ] **Instagram:** Comet completed, credentials collected
- [ ] **Calendly:** Comet completed, credentials collected
- [ ] **GoHighLevel:** Comet completed, credentials collected
- [ ] **HubSpot:** Comet completed, credentials collected
- [ ] **Vercel Env Vars:** All credentials added to Vercel
- [ ] **Backend Built:** OAuth handlers implemented
- [ ] **Testing Complete:** End-to-end OAuth tested
- [ ] **UI Updated:** Connection status showing correctly

---

## 🚀 NEXT STEPS AFTER COMPLETION

### **Immediate (Within 1 hour):**
1. Collect all credentials from Comet
2. Add to Vercel environment variables
3. Test OAuth flows with test accounts

### **Short-term (Within 1 week):**
4. Build API clients for each platform
5. Implement core actions (create contact, send message, etc.)
6. Test end-to-end user journey
7. Deploy to production

### **Medium-term (Within 2 weeks):**
8. Add remaining integrations (Pipedrive, ActiveCampaign, etc.)
9. Implement webhook handlers
10. Add analytics and monitoring
11. Beta test with real users

---

## 📚 REFERENCE FILES

- `COMET_INSTAGRAM_OAUTH.md` - Meta Developer Console setup
- `COMET_CALENDLY_OAUTH.md` - Calendly OAuth setup
- `COMET_GOHIGHLEVEL_OAUTH.md` - GHL Marketplace setup
- `COMET_HUBSPOT_OAUTH.md` - HubSpot Developer Portal setup
- `INTEGRATIONS_READY.md` - UI infrastructure documentation
- `UI_ENHANCEMENT_COMPLETE.md` - Phase 1 summary

---

## 💡 PRO TIPS

### **For Comet:**
- Take screenshots of every configuration page
- Copy credentials immediately (don't close tabs)
- Double-check redirect URIs for typos
- Test OAuth flow before closing Comet tabs

### **For Testing:**
- Use personal/test accounts first
- Verify webhooks before production
- Test token refresh logic early
- Monitor rate limits during testing

### **For Production:**
- Add privacy policy and terms pages
- Submit for app reviews if needed
- Monitor error rates
- Have fallback for API failures

---

## ✅ SUCCESS CRITERIA

You'll know Phase 2A (OAuth Setup) is complete when:
- ✅ All 4 Comet tasks marked complete
- ✅ All credentials collected and documented
- ✅ All credentials added to Vercel
- ✅ Backend OAuth handlers tested
- ✅ Users can connect accounts via UI
- ✅ Tokens stored securely in Supabase
- ✅ Connection status shows in settings page

---

## 🎊 ESTIMATED TIMELINE

**Comet Setup:** 1 hour (all parallel)  
**Backend Implementation:** 6-8 hours (I'll do this)  
**Testing & Integration:** 2-4 hours  
**Total Phase 2A:** 1-2 days for full OAuth infrastructure

---

**Ready to start? Open Comet with all 4 prompts and let's go! 🚀**

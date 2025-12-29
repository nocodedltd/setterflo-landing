# 🚨 URGENT FIX: Meta Developer App Domains Error

## 🎯 ISSUE

Getting this error when testing Instagram OAuth:
```
Can't load URL

The domain of this URL isn't included in the app's domains. 
To be able to load this URL, add all domains and sub-domains of 
your app to the App Domains field in your app settings.
```

**This is a critical configuration issue in Meta Developer Console.**

---

## ✅ QUICK FIX (5 minutes)

### **Step 1: Go to Meta Developer Console**

1. Open: https://developers.facebook.com/apps
2. Click on **SetterFlo** app (App ID: 25769682339323790)

---

### **Step 2: Navigate to Basic Settings**

1. In the left sidebar, click **"Settings"**
2. Click **"Basic"** (should be selected by default)

---

### **Step 3: Add App Domain**

1. Scroll down to find the **"App Domains"** field
2. Click in the "App Domains" text box
3. Type EXACTLY: `setterflo-landing.vercel.app`
   - ⚠️ **No `https://`**
   - ⚠️ **No trailing slash**
   - ⚠️ **Just the domain**

**Correct:** `setterflo-landing.vercel.app`
**Wrong:** `https://setterflo-landing.vercel.app`
**Wrong:** `setterflo-landing.vercel.app/`

4. Press **Enter** or **Tab** (the domain should appear as a "chip" or tag)

---

### **Step 4: Save Changes**

1. Scroll to the **bottom** of the Basic Settings page
2. Click the **"Save Changes"** button
3. Wait for confirmation message ("Changes saved successfully")

---

### **Step 5: Verify It Was Added**

1. Refresh the page
2. Scroll back to "App Domains"
3. You should see: `setterflo-landing.vercel.app` listed

---

## ✅ COMPLETION CONFIRMATION

After completing, verify:
- [ ] App Domains field shows: `setterflo-landing.vercel.app`
- [ ] Changes were saved successfully
- [ ] No error message when saving

---

## 🧪 TEST AGAIN

After fixing this:

1. Go back to: https://setterflo-landing.vercel.app/dashboard/settings
2. Click **"Connect Instagram"** button
3. You should now be redirected to Meta OAuth (no error)
4. The error should be gone!

---

## 📸 SCREENSHOT REQUEST

**After fixing, please provide a screenshot of:**
- The Basic Settings page showing `setterflo-landing.vercel.app` in App Domains field

This confirms the fix was applied correctly.

---

## 🎯 WHY THIS HAPPENED

Meta requires ALL domains that will redirect users back to your app to be listed in "App Domains". This is a security measure to prevent unauthorized redirects.

Without this setting:
- ❌ OAuth redirects fail
- ❌ Facebook Login doesn't work
- ❌ "Can't load URL" error appears

With this setting:
- ✅ OAuth redirects work
- ✅ Facebook Login works
- ✅ No errors

---

**This should take 2-3 minutes to fix!**

**After fixing, test Instagram OAuth again - it should work!** 🚀

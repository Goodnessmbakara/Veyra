# Debug: Web API Not Showing Markets

## The Problem

The indexer API (`https://veyra-indexer-production.up.railway.app/markets`) returns markets, but the web frontend shows mock data instead.

## Diagnosis Steps

### Step 1: Test Web API Endpoint

Open in browser:
```
https://veyra-web-production.up.railway.app/api/markets
```

**Expected:** Should return the same market data as the indexer
**If empty `[]`:** Web API can't reach the indexer
**If error:** Connection issue

### Step 2: Check Web Service Environment Variables

In Railway → **veyra-web** service → **Variables**:

**Critical variables:**
- `NEXT_PUBLIC_INDEXER_URL` = `https://veyra-indexer-production.up.railway.app` (with `https://`)
- `INDEXER_URL` = `https://veyra-indexer-production.up.railway.app` (with `https://`)

**Common issues:**
- Missing `https://` prefix
- Wrong URL
- Variable not set

### Step 3: Check Browser Console

1. Open your web app
2. Press F12 → Console tab
3. Look for errors when loading markets
4. Check Network tab → Look for `/api/markets` request
   - What status code? (200 = success, 404/500 = error)
   - What does the response contain?

### Step 4: Check Web Service Logs

In Railway → **veyra-web** service → **Logs**:
- Look for errors about fetching from indexer
- Check if `INDEXER_URL` is being used correctly

## Common Issues & Fixes

### Issue 1: Wrong Indexer URL

**Symptom:** Web API returns `[]` or error

**Fix:**
1. Verify `NEXT_PUBLIC_INDEXER_URL` in Railway
2. Make sure it's: `https://veyra-indexer-production.up.railway.app`
3. Not: `http://indexer:4001` or `http://localhost:4001`

### Issue 2: Missing https:// Prefix

**Symptom:** CORS errors or connection failures

**Fix:**
- Ensure URL starts with `https://`
- Not just `veyra-indexer-production.up.railway.app`

### Issue 3: API Returns Empty Array

**Symptom:** Web API returns `[]` but indexer has markets

**Possible causes:**
- Web service can't reach indexer (network issue)
- Indexer URL is wrong
- Indexer is down

**Fix:**
- Test indexer directly: `https://veyra-indexer-production.up.railway.app/markets`
- If indexer works but web API doesn't, it's a connection issue
- Check Railway service networking

### Issue 4: Frontend Shows Mock Data

**Symptom:** You see mock markets instead of real ones

**Cause:** The API call is failing, so it falls back to mock data

**Fix:**
- Check browser console for API errors
- Verify web API endpoint works
- Check that `MarketsManager.listRecent()` is getting data

## Quick Test

Run these in order:

1. **Test indexer directly:**
   ```
   https://veyra-indexer-production.up.railway.app/markets
   ```
   ✅ Should return market data

2. **Test web API:**
   ```
   https://veyra-web-production.up.railway.app/api/markets
   ```
   ✅ Should return same market data

3. **If web API returns `[]`:**
   - Check `INDEXER_URL` in Railway
   - Check web service logs for errors
   - Verify indexer URL is correct

## Solution

Most likely, the web service's `INDEXER_URL` or `NEXT_PUBLIC_INDEXER_URL` is not set correctly in Railway.

**Fix:**
1. Go to Railway → **veyra-web** → **Variables**
2. Set `NEXT_PUBLIC_INDEXER_URL` = `https://veyra-indexer-production.up.railway.app`
3. Set `INDEXER_URL` = `https://veyra-indexer-production.up.railway.app`
4. Save and wait for redeploy
5. Test `/api/markets` endpoint again


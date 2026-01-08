# Diagnose: Markets Not Showing

## Quick Diagnosis Steps

### Step 1: Test the Indexer API Directly

Open these URLs in your browser (replace with your actual Railway URLs):

1. **Indexer Health Check:**
   ```
   https://your-indexer-url.up.railway.app/health
   ```
   Should return: `{"ok":true}`

2. **Indexer Markets Endpoint:**
   ```
   https://your-indexer-url.up.railway.app/markets
   ```
   Should return: `[]` (empty array) if no markets, or an array of market objects if markets exist

3. **Web API Proxy:**
   ```
   https://your-web-url.up.railway.app/api/markets
   ```
   Should return the same as step 2

### Step 2: Check Indexer Logs

Go to Railway → Indexer Service → Deployments → View Logs

**Look for:**
- ✅ `"Indexer event listener started"` or `"Indexer listening on factory: 0x..."`
- ❌ `"Indexer event listener disabled (RUN_INDEXER != 1)"` ← This means indexer is off
- ❌ Any error messages about RPC connection
- ❌ Any error messages about missing environment variables

### Step 3: Verify Environment Variables

**In Indexer Service:**
- ✅ `RUN_INDEXER=1` (must be exactly `1`, not `true` or `"1"`)
- ✅ `FACTORY=0x...` (your factory contract address)
- ✅ `SEPOLIA_RPC_URL=https://...`
- ✅ `ORACLE_ADDRESS=0x...`
- ✅ `ADAPTER_ADDRESS=0x...`

**In Web Service:**
- ✅ `NEXT_PUBLIC_INDEXER_URL=https://your-indexer-url.up.railway.app` (with `https://`)
- ✅ `INDEXER_URL=https://your-indexer-url.up.railway.app` (with `https://`)

### Step 4: Check When Markets Were Created

**Important:** If you created markets **before** setting `RUN_INDEXER=1`, those markets won't be in the database!

The indexer only listens to **new** events. Markets created before it was enabled need to be backfilled using the historical scan.

**To check:**
1. Go to your wallet/transaction history
2. Note the block numbers when you created markets
3. If markets were created before `RUN_INDEXER=1` was set, you need to run the historical scan

### Step 5: Create a New Market (Test)

1. Make sure `RUN_INDEXER=1` is set and indexer has redeployed
2. Check indexer logs show "Indexer event listener started"
3. Create a new market on the web frontend
4. Wait 10-30 seconds
5. Check indexer logs for `"MarketDeployed"` events
6. Refresh the markets page - the new market should appear

### Step 6: Test API Connection

**If `/markets` returns empty array `[]`:**
- ✅ API is working
- ❌ Database is empty (no markets indexed yet)
- Solution: Create a new market OR run historical scan for old markets

**If `/markets` returns an error:**
- ❌ API connection issue
- Check that `NEXT_PUBLIC_INDEXER_URL` has `https://` prefix
- Check that indexer service is running

**If you see mock data on the frontend:**
- ❌ The API call is failing
- Check browser console for errors
- Check web service logs in Railway

---

## Common Issues & Fixes

### Issue 1: Indexer is Disabled
**Symptom:** Logs show "Indexer event listener disabled"
**Fix:** Set `RUN_INDEXER=1` in indexer service variables

### Issue 2: Wrong Indexer URL
**Symptom:** `ERR_NAME_NOT_RESOLVED` or connection errors
**Fix:** Ensure `NEXT_PUBLIC_INDEXER_URL` includes `https://` prefix

### Issue 3: Markets Created Before Indexer Was Enabled
**Symptom:** API returns `[]` but you know markets exist on-chain
**Fix:** Run historical scan (see below) OR create new markets

### Issue 4: RPC Connection Issues
**Symptom:** Indexer logs show RPC errors
**Fix:** Check `SEPOLIA_RPC_URL` is correct and accessible

---

## Running Historical Scan (For Old Markets)

If you created markets before enabling the indexer, you need to backfill them:

**Option 1: SSH into Railway Container (if supported)**
```bash
pnpm run scan
```

**Option 2: Add One-Time Scan Job**
You would need to temporarily modify the indexer to run a scan on startup. This requires code changes.

**Option 3: Create New Markets**
The easiest solution: Create new markets now that the indexer is enabled - they will appear automatically.

---

## Quick Test Checklist

- [ ] Indexer health check works: `/health` returns `{"ok":true}`
- [ ] Indexer markets endpoint works: `/markets` returns `[]` or market data
- [ ] Web API proxy works: `/api/markets` returns same as above
- [ ] Indexer logs show "Indexer event listener started"
- [ ] `RUN_INDEXER=1` is set in indexer service
- [ ] `NEXT_PUBLIC_INDEXER_URL` has `https://` prefix in web service
- [ ] Created a NEW market after enabling indexer
- [ ] Waited 30 seconds after creating market
- [ ] Refreshed the markets page

---

## Still Not Working?

If after all these steps markets still don't show:

1. **Share the exact error messages** from:
   - Browser console (F12 → Console tab)
   - Indexer logs (Railway → Indexer Service → Logs)
   - Web service logs (Railway → Web Service → Logs)

2. **Share the API responses:**
   - What does `https://your-indexer-url/markets` return?
   - What does `https://your-web-url/api/markets` return?

3. **Confirm the timeline:**
   - When did you create the markets?
   - When did you set `RUN_INDEXER=1`?
   - Were markets created before or after enabling the indexer?


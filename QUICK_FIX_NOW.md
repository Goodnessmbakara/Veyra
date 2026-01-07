# 🚨 QUICK FIX: Markets Not Showing

## Two Critical Issues to Fix RIGHT NOW

### Issue 1: Indexer is Disabled
Your Docker logs show: `"Indexer event listener disabled (RUN_INDEXER != 1)"`

**Fix:**
1. Go to Railway dashboard
2. Click on your **indexer service**
3. Go to **Variables** tab
4. Add/Update: `RUN_INDEXER` = `1`
5. Save (will auto-redeploy)

### Issue 2: Wrong Indexer URL
The web service is trying to call `http://indexer:4001` which doesn't work on Railway.

**Fix:**
1. In Railway, find your **indexer service** public URL:
   - Click on indexer service → Settings → Copy the "Public Domain" URL
   - Example: `https://veyra-indexer-production.up.railway.app`

2. Go to your **web service** → **Variables** tab
3. Set these variables:
   ```
   NEXT_PUBLIC_INDEXER_URL = https://your-indexer-url.up.railway.app
   INDEXER_URL = https://your-indexer-url.up.railway.app
   ```
   (Use the same URL for both, replace with your actual indexer URL)

4. Save (will auto-redeploy)

### Issue 3: Missing RPC URL
The indexer needs a Sepolia RPC URL.

**Fix:**
1. Go to **indexer service** → **Variables**
2. Set: `SEPOLIA_RPC_URL` = `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`
   - OR use public: `https://rpc.sepolia.org` (slower, but free)

### After Fixing:

1. **Wait 2-3 minutes** for services to redeploy
2. **Check indexer logs** - should see "Indexer event listener started" (NOT "disabled")
3. **Test indexer API**: Visit `https://your-indexer-url.up.railway.app/markets` in browser
4. **Test web API**: Visit `https://your-web-url.up.railway.app/api/markets` in browser
5. **Create a new market** - should appear within seconds

---

## Summary Checklist:
- [ ] `RUN_INDEXER=1` in indexer service
- [ ] `NEXT_PUBLIC_INDEXER_URL` = indexer's public Railway URL (in web service)
- [ ] `INDEXER_URL` = indexer's public Railway URL (in web service)
- [ ] `SEPOLIA_RPC_URL` = your RPC endpoint (in indexer service)
- [ ] Services redeployed
- [ ] Indexer logs show "started" not "disabled"


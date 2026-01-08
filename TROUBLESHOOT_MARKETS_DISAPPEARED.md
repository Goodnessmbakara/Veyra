# Troubleshoot: Markets Disappeared

## Quick Checks

### 1. Check Indexer Status

**In Railway:**
1. Go to **veyra-indexer** service → **Deployments** → **Logs**
2. Look for:
   - ✅ `"Indexer API listening on :4001"` = Service is running
   - ✅ `"Indexer listening on factory: 0x..."` = Event listener is active
   - ❌ `"Indexer event listener disabled"` = Indexer is not listening
   - ❌ Any error messages

### 2. Check if Indexer is Enabled

**In Railway → veyra-indexer → Variables:**
- `RUN_INDEXER` should be set to `1` (not `0` or missing)
- If it's `0` or missing, the indexer won't listen to new events

### 3. Test the API Directly

Open in browser:
- `https://your-indexer-url.up.railway.app/markets`
- Should return an array (even if empty `[]`)
- If you see markets here, the issue is with the web frontend
- If you see `[]` empty, markets aren't in the database

### 4. Check Database State

The indexer uses SQLite stored in Railway's ephemeral storage. **Important:**
- Railway volumes are **ephemeral** - they can be lost if:
  - Service is redeployed
  - Service is restarted
  - Railway performs maintenance
  - Service is deleted and recreated

**This is likely the issue!** Railway's storage is not persistent by default.

## Common Causes

### Cause 1: Database Was Reset (Most Likely)

**What happened:**
- Railway redeployed the indexer service
- The SQLite database (`vyro.db`) was lost
- Markets are still on-chain, but not in the database

**Solution:**
1. Run the historical scan to backfill markets
2. Or create new markets (they'll be indexed automatically)

### Cause 2: Indexer Stopped Listening

**What happened:**
- `RUN_INDEXER` was set back to `0`
- Or indexer crashed and didn't restart

**Solution:**
1. Check `RUN_INDEXER=1` in Railway variables
2. Redeploy the indexer service

### Cause 3: Wrong Factory Address

**What happened:**
- Factory contract address changed
- Indexer is listening to the wrong contract

**Solution:**
1. Verify `FACTORY` address in Railway matches your deployed contract
2. Redeploy indexer

### Cause 4: RPC Connection Issues

**What happened:**
- RPC endpoint is down or rate-limited
- Indexer can't connect to blockchain

**Solution:**
1. Check `SEPOLIA_RPC_URL` in Railway
2. Try a different RPC provider (Alchemy, Infura)

## Solutions

### Solution 1: Run Historical Scan (If Markets Still Exist On-Chain)

If markets were created before the database was reset, you can backfill them:

**Option A: SSH into Railway Container (if supported)**
```bash
pnpm run scan
```

**Option B: Add Historical Scan to Startup**
Modify the indexer to run a scan on startup if database is empty.

**Option C: Create New Markets**
New markets will be indexed automatically if `RUN_INDEXER=1`.

### Solution 2: Enable Persistent Storage (Long-term Fix)

Railway offers persistent volumes. You can:
1. Add a persistent volume to the indexer service
2. Mount it to store the database permanently

**Note:** This requires Railway Pro plan or specific configuration.

### Solution 3: Use External Database (Best Long-term)

Instead of SQLite, use:
- PostgreSQL (Railway offers this)
- MySQL
- Any external database service

This ensures data persistence across deployments.

## Immediate Action Steps

1. **Check Railway Logs:**
   - Is indexer running?
   - Is it listening to events?
   - Any errors?

2. **Check Environment Variables:**
   - `RUN_INDEXER=1`?
   - `FACTORY` address correct?
   - `SEPOLIA_RPC_URL` working?

3. **Test API:**
   - Can you access `/markets` endpoint?
   - What does it return?

4. **Check Web Service:**
   - Is `NEXT_PUBLIC_INDEXER_URL` correct?
   - Can web service reach indexer?

## Prevention

To prevent this in the future:

1. **Use External Database** (PostgreSQL, MySQL)
2. **Enable Persistent Volumes** in Railway
3. **Set up Database Backups**
4. **Monitor Indexer Health** - set up alerts if indexer stops

## Quick Diagnostic

Run these checks in order:

```bash
# 1. Check indexer health
curl https://your-indexer-url/health

# 2. Check markets endpoint
curl https://your-indexer-url/markets

# 3. Check web API
curl https://your-web-url/api/markets
```

Share the results to diagnose the issue.


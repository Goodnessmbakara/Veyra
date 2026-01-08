# Fix: Markets Not Showing on Railway

## The Problem

You're seeing two issues:
1. `ERR_NAME_NOT_RESOLVED` when trying to access `/api/markets`
2. Markets you create don't appear on the frontend

## Root Causes

1. **Indexer is disabled**: The indexer logs show `"Indexer event listener disabled (RUN_INDEXER != 1)"`
2. **Indexer URL not configured**: The web service can't reach the indexer because `NEXT_PUBLIC_INDEXER_URL` is pointing to the wrong URL

## Solutions

### Step 1: Enable the Indexer

In Railway, go to your **indexer service** and set:

```
RUN_INDEXER=1
```

This enables the blockchain event listener.

### Step 2: Set the Indexer URL

You need to set `NEXT_PUBLIC_INDEXER_URL` in your **web service** to point to the indexer's public URL.

**Find your indexer's public URL:**
1. Go to Railway dashboard
2. Click on your **indexer service**
3. Go to the "Settings" tab
4. Find the "Public Domain" section
5. Copy the URL (e.g., `https://veyra-indexer-production.up.railway.app`)

**Set in web service:**
1. Go to your **web service** in Railway
2. Go to "Variables" tab
3. Add/Update: `NEXT_PUBLIC_INDEXER_URL` = `https://your-indexer-url.up.railway.app`
4. Also set: `INDEXER_URL` = `https://your-indexer-url.up.railway.app` (same value)

### Step 3: Verify Indexer Environment Variables

In your **indexer service**, make sure these are set:

```
RUN_INDEXER=1
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
# OR use public RPC: https://rpc.sepolia.org

FACTORY=0x... (your factory contract address)
ORACLE_ADDRESS=0x... (your oracle contract address)
ADAPTER_ADDRESS=0x... (your adapter contract address)
```

### Step 4: Redeploy Services

After setting the variables:
1. The indexer service will automatically redeploy
2. The web service will automatically redeploy

### Step 5: Verify It's Working

1. **Check indexer logs**: Should see `"Indexer event listener started"` (not "disabled")
2. **Test indexer API**: Visit `https://your-indexer-url.up.railway.app/markets` in browser - should return JSON (even if empty array)
3. **Test web API**: Visit `https://your-web-url.up.railway.app/api/markets` - should return JSON (not error)
4. **Create a market**: Should appear within a few seconds

### Step 6: Backfill Existing Markets (If Needed)

If you created markets before enabling the indexer, you need to run the historical scan:

**Option A: SSH into the indexer container (if Railway supports it)**
```bash
pnpm run scan
```

**Option B: Add a one-time job to docker-compose** (if using Docker locally)
```bash
docker compose run --rm indexer pnpm run scan
```

**Option C: Wait for future markets** - Only new markets created after enabling RUN_INDEXER=1 will appear automatically

## Quick Checklist

- [ ] `RUN_INDEXER=1` set in indexer service
- [ ] `NEXT_PUBLIC_INDEXER_URL` set to indexer's public URL in web service
- [ ] `INDEXER_URL` set to indexer's public URL in web service
- [ ] `SEPOLIA_RPC_URL` set in indexer service
- [ ] Contract addresses set in indexer service
- [ ] Both services redeployed
- [ ] Indexer logs show "Indexer event listener started"
- [ ] Can access `/markets` endpoint on indexer URL

## Troubleshooting

**If indexer URL is still wrong:**
- Check Railway logs for the web service
- Look for fetch errors mentioning the indexer URL
- Make sure there's no trailing slash in the URL

**If markets still don't appear:**
- Check indexer logs for "MarketDeployed" events
- Verify the factory address is correct
- Check that contracts are deployed on Sepolia testnet
- Test the indexer API directly: `curl https://your-indexer-url.up.railway.app/markets`


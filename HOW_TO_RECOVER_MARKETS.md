# How to Recover Your Missing Markets

## What Happened

The 2 markets you created before the database reset are still on-chain, but not in the indexer database. New markets work fine because the indexer is now listening.

## Solution: Use the Historical Scan Endpoint

I've added a `/scan` endpoint to the indexer that will find and index all markets from the blockchain.

## Steps to Recover Markets

### Step 1: Wait for Railway to Redeploy

Railway will automatically redeploy the indexer service with the new endpoint (usually 1-2 minutes).

### Step 2: Trigger the Scan

**Option A: Using Browser (Easiest)**

1. Install a browser extension like "REST Client" or use Postman
2. Make a POST request to:
   ```
   https://veyra-indexer-production.up.railway.app/scan
   ```
3. Body (JSON):
   ```json
   {
     "fromBlock": 0
   }
   ```
   Or leave body empty to scan from block 0

**Option B: Using curl (Command Line)**

```bash
curl -X POST https://veyra-indexer-production.up.railway.app/scan \
  -H "Content-Type: application/json" \
  -d '{"fromBlock": 0}'
```

**Option C: Using Browser Console**

Open browser console (F12) and run:
```javascript
fetch('https://veyra-indexer-production.up.railway.app/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fromBlock: 0 })
}).then(r => r.json()).then(console.log)
```

### Step 3: Wait for Scan to Complete

- The scan runs in the background
- Check Railway logs to see progress
- It may take a few minutes depending on how many blocks to scan
- Look for: `"Historical scan complete. Indexed X markets."`

### Step 4: Verify Markets Appeared

1. Check the markets endpoint:
   ```
   https://veyra-indexer-production.up.railway.app/markets
   ```
2. You should see all your markets (including the 2 missing ones)
3. Refresh your web frontend - markets should appear

## Optional: Set Starting Block

If you know when your Factory contract was deployed, you can set a starting block to make the scan faster:

```json
{
  "fromBlock": 12345678
}
```

This scans from that block instead of block 0, which is much faster.

## Troubleshooting

**If scan doesn't work:**
- Check Railway logs for errors
- Verify `SEPOLIA_RPC_URL` is set correctly
- Verify `FACTORY` address is correct
- Make sure indexer service is running

**If markets still don't appear:**
- Check Railway logs for scan completion
- Verify markets are actually on-chain (check your wallet transaction history)
- Try scanning again with a specific `fromBlock` if you know when markets were created

## After Recovery

Once markets are recovered:
- All markets should appear on the frontend
- New markets will continue to be indexed automatically
- The scan endpoint is available anytime you need to backfill markets


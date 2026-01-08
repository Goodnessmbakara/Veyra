# Recover Missing Markets (Historical Scan)

## The Problem

You created 2 markets before the database was reset. Those markets are still on-chain but not in the indexer database. New markets work fine because the indexer is now listening.

## Solution: Run Historical Scan

The historical scan will find all `MarketDeployed` events from the blockchain and add them to the database.

## Option 1: Add Scan Endpoint (Recommended)

I can add an API endpoint to trigger the scan. This would let you run it from the browser or via API call.

**Would you like me to add this?**

## Option 2: Run via Railway CLI (If Available)

If Railway supports SSH/CLI access:

```bash
# Connect to Railway service
railway run --service veyra-indexer pnpm run scan-historical

# Or if you can exec into the container:
pnpm run scan-historical
```

## Option 3: Add Scan on Startup (Automatic)

I can modify the indexer to automatically run a scan on startup if the database is empty or has very few markets.

**Would you like me to add this?**

## Option 4: Manual API Endpoint

I can add a `/scan` endpoint that you can call to trigger the historical scan:

```bash
POST https://veyra-indexer-production.up.railway.app/scan
```

## Quick Fix: Add Scan Endpoint

Let me add an API endpoint that you can call to trigger the historical scan. This is the easiest way to recover your markets.

**Steps:**
1. I'll add a `/scan` endpoint to the indexer
2. You call it from your browser or via curl
3. It scans historical blocks and adds missing markets
4. Your markets reappear!

Would you like me to add this endpoint now?


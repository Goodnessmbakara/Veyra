# Fix: Indexer Service Crashed

## The Problem

The indexer service is returning "Application failed to respond" - this means the service has crashed or is not responding.

## Immediate Actions

### Step 1: Check Railway Logs

1. Go to Railway dashboard
2. Click on **veyra-indexer** service
3. Go to **Deployments** tab
4. Click on the latest deployment
5. Click **"View Logs"** or check the **Logs** section

**Look for:**
- ❌ Error messages
- ❌ Stack traces
- ❌ "Application crashed" messages
- ❌ Database errors
- ❌ Missing environment variables

### Step 2: Check Service Status

In Railway → **veyra-indexer** service:
- Is the deployment status **green** (success) or **red** (failed)?
- Is the service actually running?
- Check **Metrics** - is there CPU/memory activity?

### Step 3: Common Causes

**Cause 1: Recent Code Change Issue**
- We just added the `/scan` endpoint
- There might be a syntax error or import issue
- Check logs for TypeScript/build errors

**Cause 2: Missing Environment Variables**
- `SEPOLIA_RPC_URL` not set
- `FACTORY` address missing
- Other required variables missing

**Cause 3: Database Error**
- SQLite database file corruption
- Permission issues
- Disk space full

**Cause 4: Port Binding Issue**
- Port 4001 already in use
- Railway port conflict

## Quick Fixes

### Fix 1: Check Recent Deployment

If the crash happened after our recent changes:
1. Check if the latest deployment succeeded
2. Look for build errors in logs
3. If build failed, there's a code issue

### Fix 2: Restart Service

In Railway:
1. Go to **veyra-indexer** service
2. Click **"Redeploy"** or **"Restart"**
3. Watch the logs to see if it starts successfully

### Fix 3: Check Environment Variables

Verify all required variables are set:
- `PORT=4001`
- `RUN_INDEXER=1`
- `SEPOLIA_RPC_URL=...`
- `FACTORY=0x...`
- `ORACLE_ADDRESS=0x...`
- `ADAPTER_ADDRESS=0x...`

### Fix 4: Check for Import Errors

The `/scan` endpoint we added imports from `historical-scan.ts`. If there's an import issue:
- Check if the file exists
- Check if exports are correct
- Check TypeScript compilation

## Diagnostic Steps

1. **Check Latest Deployment:**
   - Did it build successfully?
   - Did it deploy successfully?
   - Any errors in build logs?

2. **Check Runtime Logs:**
   - What's the last log message before crash?
   - Any error stack traces?
   - Any "uncaught exception" messages?

3. **Test Health Endpoint:**
   ```
   https://veyra-indexer-production.up.railway.app/health
   ```
   - If this also fails, service is completely down
   - If this works, only specific endpoints are broken

## Most Likely Issue

Given we just added the `/scan` endpoint, it's likely:
1. **Import error** - `historical-scan.ts` import might be failing
2. **TypeScript compilation error** - Build might have succeeded but runtime fails
3. **Missing export** - The function might not be exported correctly

## Quick Check

Try the health endpoint:
```
https://veyra-indexer-production.up.railway.app/health
```

- If this works: Only `/operators` endpoint is broken
- If this fails: Entire service is down

## Next Steps

1. **Check Railway logs** - This will tell us exactly what's wrong
2. **Share the error** - Copy the error message from logs
3. **We'll fix it** - Once we know the issue, we can fix it quickly

The service needs to be running for:
- Markets to appear
- Resolution to work
- Operators to be checked
- Everything to function!

Check the Railway logs and share what error you see - that will tell us exactly what's wrong.


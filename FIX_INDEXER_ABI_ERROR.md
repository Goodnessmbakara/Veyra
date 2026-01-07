# Fix: Indexer Missing Protocol Artifacts

## The Error

```
Error: ABI file not found: /protocol/artifacts/contracts/market/MarketFactory.sol/MarketFactory.json
```

This means the indexer can't find the contract ABI files needed to listen to blockchain events.

## The Solution

I've updated the `indexer/Dockerfile` to copy the protocol artifacts. **You need to configure Railway to build from the root directory.**

## Railway Configuration Steps

### Step 1: Configure Build Context

1. Go to Railway dashboard
2. Click on **veyra-indexer** service
3. Go to **Settings** tab
4. Scroll to **"Build"** section
5. Set these values:
   - **Root Directory:** Leave empty or set to `/` (root of repo)
   - **Dockerfile Path:** `indexer/Dockerfile`
   - Make sure Railway is building from the **root** of your repository, not from `indexer/` directory

### Step 2: Redeploy

1. After changing the build settings, Railway should automatically trigger a new deployment
2. Or manually trigger: Go to **Deployments** → Click **"Redeploy"**

### Step 3: Verify Fix

Check the deployment logs for:

✅ **Success indicators:**
- `"Indexer API listening on :4001"`
- `"Indexer listening on factory: 0x..."`
- NO "ABI file not found" errors

❌ **If you still see errors:**
- Check that the build context is correct
- Verify `protocol/artifacts/` directory exists in your repository
- Check build logs for COPY errors

## What Changed

The Dockerfile now includes:
```dockerfile
# Copy protocol artifacts (contract ABIs) - required for event listening
COPY protocol/artifacts /protocol/artifacts
```

This copies the compiled contract ABIs into the Docker image so the indexer can use them to listen for events.

## Important Notes

- The build context **MUST** be the root directory (where both `indexer/` and `protocol/` folders exist)
- If Railway was building from `indexer/` directory before, you need to change it
- The protocol artifacts must exist in your repository (they should if contracts were compiled)

## After Fixing

Once the indexer successfully starts:
1. Markets you create will be automatically indexed
2. The `/markets` endpoint will return market data
3. The frontend will display your markets instead of mock data

## Still Having Issues?

If the build context change doesn't work:

1. **Check Railway build logs** - look for COPY errors
2. **Verify artifacts exist** - Make sure `protocol/artifacts/` folder exists in your repo
3. **Try building locally** - Test the Dockerfile locally first:
   ```bash
   docker build -f indexer/Dockerfile -t test-indexer .
   ```


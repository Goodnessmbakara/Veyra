# Fix: Indexer Missing Protocol Artifacts on Railway

## The Problem

The indexer service is failing to start its event listener because it can't find the contract ABI files:

```
Error: ABI file not found: /protocol/artifacts/contracts/market/MarketFactory.sol/MarketFactory.json
```

## The Solution

I've updated the `indexer/Dockerfile` to copy the protocol artifacts. However, Railway needs to build from the **root directory** (not the `indexer/` directory) for this to work.

## Railway Configuration

You need to configure Railway to use the root directory as the build context:

### Option 1: Railway Dashboard (Recommended)

1. Go to Railway dashboard
2. Click on your **veyra-indexer** service
3. Go to **Settings** → **Build** section
4. Set:
   - **Root Directory:** Leave empty (or set to `/`)
   - **Dockerfile Path:** `indexer/Dockerfile`
   - **Build Context:** `/` (root of repository)

OR:

- **Root Directory:** Leave empty
- Railway should detect `indexer/Dockerfile` automatically
- Make sure the build context includes the whole repo (not just `indexer/`)

### Option 2: Update railway.toml

Add this to your `railway.toml` (if Railway uses it):

```toml
[build]
builder = "DOCKERFILE"
dockerfilePath = "indexer/Dockerfile"
dockerContext = "."
```

### Option 3: Copy Artifacts into Indexer Directory

If Railway must build from `indexer/` directory, we need to copy artifacts during build:

**Create a script or update the build process to copy artifacts into `indexer/protocol/artifacts/` before building.**

## Verify the Fix

After updating Railway configuration and redeploying:

1. Check indexer logs in Railway
2. Look for: `"Indexer listening on factory: 0x..."`
3. Should NOT see: `"ABI file not found"` errors
4. Test: `https://your-indexer-url/markets` should work
5. Test: Create a new market - it should appear in the database

## Alternative: Embed ABIs in Code (If Above Doesn't Work)

If Railway build context issues persist, we could:
1. Copy essential ABIs into the `indexer/src` directory
2. Update `loadAbi()` to look for them there
3. This would require code changes

But try the build context fix first - it's the cleanest solution.


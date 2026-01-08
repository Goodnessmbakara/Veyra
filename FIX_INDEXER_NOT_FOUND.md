# Fix: Indexer API Returns "Not Found" on Railway

## The Problem

When you try to access `https://your-indexer-url.up.railway.app/markets`, you get a Railway "Not Found" page. This means:

1. **The service isn't deployed** - OR
2. **No public domain is configured** - OR
3. **The service failed to start** - OR
4. **Railway is using the wrong URL**

## Diagnosis Steps

### Step 1: Check if Indexer Service Exists

1. Go to Railway dashboard
2. Look for a service named something like:
   - `veyra-indexer`
   - `indexer`
   - Or check what you named it
3. **Is the service there?** If not, you need to deploy it.

### Step 2: Check Service Status

1. Click on your **indexer service** in Railway
2. Go to **"Deployments"** tab
3. **Check the latest deployment:**
   - ✅ Green checkmark = Deployed successfully
   - ❌ Red X = Deployment failed
   - 🟡 Yellow = In progress
   - ⚠️ Gray = Not deployed

### Step 3: Check if Public Domain is Configured

1. Go to your **indexer service** in Railway
2. Click **"Settings"** tab
3. Look for **"Networking"** or **"Public Domain"** section
4. **Check if a domain is generated:**
   - If you see a domain like `veyra-indexer-production.up.railway.app`, note it
   - If there's no domain, click **"Generate Domain"** or **"Enable Public Domain"**

### Step 4: Check Service Logs

1. Go to **indexer service** → **"Deployments"** tab
2. Click on the latest deployment
3. Click **"View Logs"** or check the **"Logs"** section
4. **Look for:**
   - ✅ `"Indexer API listening on :4001"` = Service started successfully
   - ❌ Error messages about missing files, dependencies, or environment variables
   - ❌ Port binding errors
   - ❌ Database initialization errors

### Step 5: Verify Port Configuration

The indexer should be listening on port 4001. Check:

1. Railway might be expecting a different port via `PORT` environment variable
2. In Railway → Indexer Service → Variables, check:
   - `PORT=4001` should be set
   - Railway will route traffic to whatever port is in the `PORT` variable

## Common Fixes

### Fix 1: Generate Public Domain

If no public domain exists:

1. Go to Indexer Service → Settings
2. Find **"Networking"** or **"Domains"** section
3. Click **"Generate Domain"** or **"Enable Public Domain"**
4. Wait 1-2 minutes for DNS to propagate
5. Try accessing the URL again

### Fix 2: Deploy the Service

If the service doesn't exist or hasn't been deployed:

**Option A: Deploy via Docker Compose (if using compose)**
- Railway should detect `docker-compose.yml` automatically
- If not, you may need separate services

**Option B: Deploy as Separate Service**
1. In Railway, click **"+ New Project"** or **"+ New Service"**
2. Select **"Deploy from GitHub repo"** (if connected)
3. Or select **"Empty Service"** and configure manually
4. Set the root directory to your `indexer/` folder
5. Configure Dockerfile path if needed

### Fix 3: Check Service Configuration

Make sure Railway knows how to run the service:

1. **If using Docker:**
   - Railway should detect `indexer/Dockerfile`
   - Make sure Dockerfile exists and is correct

2. **If using buildpacks:**
   - Railway might auto-detect Node.js
   - But you may need to set `START_COMMAND` or use a `package.json` with a `start` script

3. **Check the indexer's package.json:**
   - Should have a `start` script: `"start": "node dist/server.js"`

### Fix 4: Verify Environment Variables

Make sure all required variables are set in Railway:

**Required for Indexer:**
- `PORT=4001`
- `RUN_INDEXER=1`
- `SEPOLIA_RPC_URL=...`
- `FACTORY=0x...`
- `ORACLE_ADDRESS=0x...`
- `ADAPTER_ADDRESS=0x...`

### Fix 5: Check Build/Start Command

In Railway → Indexer Service → Settings → Build:

1. **Start Command** should be: `node dist/server.js`
   - OR Railway should auto-detect from `package.json`

2. **Build Command** (if needed): `pnpm run build` or `npm run build`

## Quick Checklist

- [ ] Indexer service exists in Railway dashboard
- [ ] Latest deployment shows success (green checkmark)
- [ ] Public domain is generated in Settings
- [ ] `PORT=4001` is set in environment variables
- [ ] Service logs show "Indexer API listening on :4001"
- [ ] No errors in deployment logs
- [ ] All required environment variables are set
- [ ] Tried accessing `/health` endpoint: `https://your-url/health`
- [ ] Tried accessing `/markets` endpoint: `https://your-url/markets`

## Alternative: Use Railway's Internal Service Discovery

If you're having trouble with public domains, Railway services can communicate internally using service names:

1. Railway creates internal DNS names for services
2. You might be able to use: `http://indexer:4001` (if services are in same project)
3. But for `NEXT_PUBLIC_*` variables, you NEED a public URL (browser can't access internal DNS)

## Still Getting "Not Found"?

**Share these details:**
1. Screenshot of Railway dashboard showing your services
2. Latest deployment status (success/failure)
3. Service logs (last 50 lines)
4. Whether a public domain is configured
5. The exact URL you're trying to access


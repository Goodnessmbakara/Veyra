# How to Test the Indexer API

## Important: Use the Address Bar, Not Search Bar!

When testing API endpoints, you need to type the URL in the **address bar** (where URLs go), NOT in a search box.

## Step 1: Verify Service is Running in Railway

**Before testing the URL, check Railway first:**

1. Go to Railway dashboard
2. Click on **veyra-indexer** service
3. Go to **"Deployments"** tab
4. **Check the status:**
   - ✅ Green checkmark = Deployed successfully
   - ❌ Red X = Deployment failed
   - 🟡 Yellow circle = Deploying

5. **Click on the latest deployment → "View Logs"**
   - Look for: `"Indexer API listening on :4001"` ← This means it's running
   - If you see errors, the service isn't running properly

## Step 2: Verify Public Domain is Configured

1. Go to **veyra-indexer** service → **Settings** tab
2. Look for **"Networking"** or **"Public Domain"** section
3. **Make sure there's a public domain listed:**
   - Should show something like: `veyra-indexer-production.up.railway.app`
   - If it says "No domain" or is empty, click **"Generate Domain"**

## Step 3: Test the API Correctly

**In your browser:**

1. Click on the **address bar** (not search box)
2. Type exactly: `https://veyra-indexer-production.up.railway.app/health`
3. Press Enter

**You should see:**
- ✅ `{"ok":true}` ← JSON response (success!)
- ❌ Search results ← Service not accessible
- ❌ "Not Found" page ← Wrong URL or service not running
- ❌ Error page ← Service has issues

## Step 4: Test Different Endpoints

Try these in order (all in the address bar):

1. **Root endpoint:**
   ```
   https://veyra-indexer-production.up.railway.app/
   ```
   Should return JSON listing all available endpoints

2. **Health check:**
   ```
   https://veyra-indexer-production.up.railway.app/health
   ```
   Should return: `{"ok":true}`

3. **Markets endpoint:**
   ```
   https://veyra-indexer-production.up.railway.app/markets
   ```
   Should return: `[]` (empty array) or `[{...}, {...}]` (market objects)

## Alternative: Use curl or Postman

If the browser keeps doing searches, use a tool that's designed for API testing:

**Using curl (command line):**
```bash
curl https://veyra-indexer-production.up.railway.app/health
```

**Using Postman or Insomnia:**
- Create a new GET request
- URL: `https://veyra-indexer-production.up.railway.app/health`
- Send request
- Should see JSON response

**Using browser's developer tools:**
1. Press F12 to open developer tools
2. Go to "Network" tab
3. Type the URL in address bar and press Enter
4. Look at the network request - it should show the response

## What to Check if It's Not Working

### Check 1: Deployment Status
- Is the latest deployment successful (green checkmark)?
- If it failed, check the build logs for errors

### Check 2: Service Logs
- Do logs show `"Indexer API listening on :4001"`?
- Are there any error messages?

### Check 3: Environment Variables
- Is `PORT=4001` set?
- Are other required variables set?

### Check 4: Public Domain
- Is a public domain configured?
- Try clicking "Generate Domain" again if needed

### Check 5: Service Actually Running
- In Railway → Service → Metrics, is there CPU/memory activity?
- If everything is at 0%, the service might not be running

## Quick Diagnostic Command

If you have Railway CLI installed:
```bash
railway logs --service veyra-indexer
```

This shows real-time logs from the service.


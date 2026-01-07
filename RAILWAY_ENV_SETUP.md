# Railway Environment Variables Setup Guide

## For veyra-web Service

You need to set these environment variables in Railway for the `veyra-web` service:

### Required Variables:

1. **NEXT_PUBLIC_INDEXER_URL** (CRITICAL)
   - This MUST be your indexer service's public Railway URL
   - Format: `https://your-indexer-service.railway.app`
   - Example: `https://veyra-indexer-production.up.railway.app`
   - ⚠️ **NOT** `http://localhost:4001` or `http://indexer:4001`

2. **NEXT_PUBLIC_SEPOLIA_RPC_URL**
   - Your Ethereum Sepolia RPC endpoint
   - Example: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`
   - Or: `https://rpc.sepolia.org` (public, slower)

3. **NEXT_PUBLIC_FACTORY_ADDRESS**
   - Your Market Factory contract address
   - Format: `0x...` (Ethereum address)

4. **NEXT_PUBLIC_ORACLE_ADDRESS**
   - Your Oracle contract address
   - Format: `0x...` (Ethereum address)

5. **NEXT_PUBLIC_ADAPTER_ADDRESS**
   - Your Adapter contract address
   - Format: `0x...` (Ethereum address)

### Optional Variables:

6. **NEXT_PUBLIC_TEST_TOKEN_ADDRESS**
   - Test token address (if using test tokens)
   - Format: `0x...` (Ethereum address)

---

## How to Set in Railway:

### Step 1: Get Your Indexer URL
1. Go to your `veyra-indexer` service in Railway
2. Click on the service
3. Copy the **Public URL** (e.g., `https://veyra-indexer-production.up.railway.app`)

### Step 2: Set Variables for veyra-web
1. Go to your `veyra-web` service in Railway
2. Click on the **Variables** tab
3. Click **+ New Variable** for each variable
4. Add all the variables listed above
5. **Important:** Use the indexer's public URL for `NEXT_PUBLIC_INDEXER_URL`

### Step 3: Set as Build Arguments (Alternative)
Railway can also use these as build arguments:
1. Go to **Settings** → **Build**
2. Add them under **Build Arguments**
3. Railway will pass them to the Dockerfile during build

---

## For veyra-indexer Service

Set these environment variables for the `veyra-indexer` service:

1. **PORT** = `4001` (usually set automatically)
2. **RUN_INDEXER** = `0` (set to `1` to enable event listening)
3. **SEPOLIA_RPC_URL** = Your RPC endpoint
4. **FACTORY** = Factory contract address
5. **ORACLE_ADDRESS** = Oracle contract address
6. **ADAPTER_ADDRESS** = Adapter contract address

---

## Quick Copy-Paste Template

For `veyra-web` service, use this template (replace with your values):

```
NEXT_PUBLIC_INDEXER_URL=https://your-indexer-url.railway.app
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_ADAPTER_ADDRESS=0x...
NEXT_PUBLIC_TEST_TOKEN_ADDRESS=0x...
```

---

## Important Notes:

1. **NEXT_PUBLIC_INDEXER_URL** is the most critical - it must be the public Railway URL
2. All `NEXT_PUBLIC_*` variables are baked into the Next.js build at build time
3. If you change these variables, you need to **rebuild** the service
4. Railway will automatically redeploy when you add/change variables

---

## After Setting Variables:

1. Railway will automatically trigger a new deployment
2. The build will use these variables
3. Your web app will connect to the indexer service
4. Both services should be online and working

---

## Troubleshooting:

**Web app can't connect to indexer:**
- Check that `NEXT_PUBLIC_INDEXER_URL` is the correct public URL
- Verify the indexer service is online
- Check CORS settings (should be enabled by default)

**Build fails:**
- Ensure all required variables are set
- Check that URLs are valid (start with `https://`)
- Verify contract addresses are correct format (`0x...`)






# ✅ Verify Web Service Variables

## Indexer Service (✅ Confirmed Good)
- ✅ `RUN_INDEXER=1`
- ✅ `PORT=4001`
- ✅ `SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com`
- ✅ `ORACLE_ADDRESS=0xa249E2981768f8B708027418625D5a0Ac85b8f1B`
- ✅ `FACTORY=0x...` (masked)
- ✅ `ADAPTER_ADDRESS=0x...` (masked)

## Web Service - MUST CHECK THESE ⚠️

Go to Railway → **Web Service** (veyra-web) → Variables tab

**Critical Variables Needed:**

1. **NEXT_PUBLIC_INDEXER_URL** (MOST IMPORTANT!)
   - Must be your indexer's public Railway URL
   - Format: `https://your-indexer-service.railway.app`
   - Example: `https://veyra-indexer-production.up.railway.app`
   - ⚠️ **NOT** `http://localhost:4001` or `http://indexer:4001`

2. **INDEXER_URL** (Also important for API routes)
   - Same value as `NEXT_PUBLIC_INDEXER_URL`
   - Format: `https://your-indexer-service.railway.app`

3. **NEXT_PUBLIC_SEPOLIA_RPC_URL**
   - Should match your RPC URL or use the same public one
   - Example: `https://ethereum-sepolia.publicnode.com`
   - Or: `https://rpc.sepolia.org`

4. **NEXT_PUBLIC_FACTORY_ADDRESS**
   - Should match the `FACTORY` value from indexer service
   - Format: `0x...`

5. **NEXT_PUBLIC_ORACLE_ADDRESS**
   - Should be: `0xa249E2981768f8B708027418625D5a0Ac85b8f1B`
   - (Same as indexer's ORACLE_ADDRESS)

6. **NEXT_PUBLIC_ADAPTER_ADDRESS**
   - Should match the `ADAPTER_ADDRESS` value from indexer service
   - Format: `0x...`

---

## How to Get Indexer URL:

1. Go to Railway dashboard
2. Click on **veyra-indexer** service
3. Click **Settings** tab
4. Look for **"Public Domain"** or **"Generate Domain"**
5. Copy the URL (should look like `https://veyra-indexer-production.up.railway.app`)
6. Use this URL for `NEXT_PUBLIC_INDEXER_URL` and `INDEXER_URL` in the web service

---

## Quick Checklist:

- [ ] Indexer service variables are set (✅ confirmed)
- [ ] Web service has `NEXT_PUBLIC_INDEXER_URL` set to indexer's public URL
- [ ] Web service has `INDEXER_URL` set to indexer's public URL
- [ ] Web service has contract addresses matching indexer service
- [ ] Both services have redeployed after setting variables


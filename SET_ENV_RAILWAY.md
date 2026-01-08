# Quick: Set Environment Variables in Railway

## ⚠️ CRITICAL: NEXT_PUBLIC_INDEXER_URL

This is the most important variable. You MUST set it to your indexer's public Railway URL.

### Steps:

1. **Get Indexer URL:**
   - Go to `veyra-indexer` service in Railway
   - Copy the public URL (e.g., `https://veyra-indexer-production.up.railway.app`)

2. **Set in Web Service:**
   - Go to `veyra-web` service
   - Click **Variables** tab
   - Add: `NEXT_PUBLIC_INDEXER_URL` = `https://your-indexer-url.railway.app`

3. **Add Other Variables:**
   ```
   NEXT_PUBLIC_SEPOLIA_RPC_URL=https://rpc.sepolia.org
   NEXT_PUBLIC_FACTORY_ADDRESS=your_address
   NEXT_PUBLIC_ORACLE_ADDRESS=your_address
   NEXT_PUBLIC_ADAPTER_ADDRESS=your_address
   ```

4. **Redeploy:**
   - Railway will auto-redeploy when you save variables
   - Or manually click "Deploy"

---

## Why This Matters:

- `NEXT_PUBLIC_*` variables are baked into the Next.js build
- They must be set BEFORE the build happens
- The indexer URL must be the public Railway URL, not localhost

See `RAILWAY_ENV_SETUP.md` for full details.






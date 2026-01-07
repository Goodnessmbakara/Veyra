# Environment Variables - What's Required?

## Where to Add Them

**In Railway Dashboard:**
1. Go to your `veyra-web` service
2. Click the **Variables** tab
3. Click **+ New Variable**
4. Add each variable one by one

---

## Are They Important?

### ✅ REQUIRED (Must Set):

**NEXT_PUBLIC_INDEXER_URL**
- **CRITICAL** - Without this, your web app can't connect to the API
- Must be your indexer's public Railway URL
- Example: `https://veyra-indexer-production.up.railway.app`

---

### ⚠️ OPTIONAL (But Recommended):

**NEXT_PUBLIC_SEPOLIA_RPC_URL**
- **Default:** `https://rpc.sepolia.org` (public, free, but slower)
- **Recommended:** Use Alchemy or Infura for better performance
- Example: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`
- **Why set it?** Better performance, rate limits, reliability

**NEXT_PUBLIC_FACTORY_ADDRESS**
- **Default:** `0x5DbDf19ee3FbF92ABbdBf2370b85A5C8971F3cD4`
- **Set if:** You deployed your own Factory contract
- **Leave empty if:** Using the default deployed contract

**NEXT_PUBLIC_ORACLE_ADDRESS**
- **Default:** `0xa249E2981768f8B708027418625D5a0Ac85b8f1B`
- **Set if:** You deployed your own Oracle contract
- **Leave empty if:** Using the default deployed contract

**NEXT_PUBLIC_ADAPTER_ADDRESS**
- **Default:** `0x13179cdE5ff82f8ab183a5465445818c243118de`
- **Set if:** You deployed your own Adapter contract
- **Leave empty if:** Using the default deployed contract

---

## Summary

### Minimum Setup (Just to get it working):
```
NEXT_PUBLIC_INDEXER_URL=https://your-indexer-url.railway.app
```

### Recommended Setup (Better performance):
```
NEXT_PUBLIC_INDEXER_URL=https://your-indexer-url.railway.app
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
```

### Full Setup (If you have custom contracts):
```
NEXT_PUBLIC_INDEXER_URL=https://your-indexer-url.railway.app
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_FACTORY_ADDRESS=0x...
NEXT_PUBLIC_ORACLE_ADDRESS=0x...
NEXT_PUBLIC_ADAPTER_ADDRESS=0x...
```

---

## Quick Answer:

**Where?** Railway Dashboard → `veyra-web` service → Variables tab

**Required?** Only `NEXT_PUBLIC_INDEXER_URL` is absolutely required. The others have defaults that will work, but setting them gives you more control.

**Important?** 
- `NEXT_PUBLIC_INDEXER_URL` = **CRITICAL** (must set)
- `NEXT_PUBLIC_SEPOLIA_RPC_URL` = **Recommended** (better performance)
- Contract addresses = **Optional** (only if you have custom contracts)






# Fix: CORS Error When Resolving Markets

## The Problem

When trying to resolve a market, you get this error:

```
Access to fetch at 'https://rpc.sepolia.org/' from origin 'https://veyra-web-production.up.railway.app' 
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

## Why This Happens

The public RPC endpoint `https://rpc.sepolia.org` **does not support CORS** (Cross-Origin Resource Sharing) from browser origins. When your web app (running in the browser) tries to make direct RPC calls to this endpoint, the browser blocks them for security reasons.

## The Solution

You need to use an RPC provider that **supports CORS** for browser-based requests. Here are your options:

### Option 1: Use Alchemy (Recommended)

1. Go to [Alchemy](https://www.alchemy.com/)
2. Sign up for a free account
3. Create a new app for Sepolia testnet
4. Copy your RPC URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`)
5. In Railway → Web Service → Variables:
   - Set `NEXT_PUBLIC_SEPOLIA_RPC_URL` = `https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY`

### Option 2: Use Infura

1. Go to [Infura](https://infura.io/)
2. Sign up for a free account
3. Create a new project
4. Select Sepolia network
5. Copy your RPC URL (looks like: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`)
6. In Railway → Web Service → Variables:
   - Set `NEXT_PUBLIC_SEPOLIA_RPC_URL` = `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`

### Option 3: Use QuickNode

1. Go to [QuickNode](https://www.quicknode.com/)
2. Create a free endpoint for Sepolia
3. Copy your RPC URL
4. In Railway → Web Service → Variables:
   - Set `NEXT_PUBLIC_SEPOLIA_RPC_URL` = `your-quicknode-url`

### Option 4: Try PublicNode (May Work)

The code has a fallback to `https://ethereum-sepolia.publicnode.com` which might work better:

1. In Railway → Web Service → Variables:
   - Set `NEXT_PUBLIC_SEPOLIA_RPC_URL` = `https://ethereum-sepolia.publicnode.com`

**Note:** Public nodes can be unreliable and may still have CORS issues.

## Recommended: Use Alchemy or Infura

For production use, Alchemy or Infura are recommended because:
- ✅ They support CORS from browser origins
- ✅ More reliable and faster
- ✅ Better rate limits
- ✅ Free tier available
- ✅ Production-ready

## Steps to Fix

1. **Get an RPC URL** from Alchemy or Infura (see above)

2. **Update Railway Environment Variable:**
   - Go to Railway → **veyra-web** service → **Variables**
   - Update `NEXT_PUBLIC_SEPOLIA_RPC_URL` to your new RPC URL
   - Make sure it starts with `https://`

3. **Redeploy:**
   - Railway will automatically redeploy
   - Or manually trigger: Deployments → Redeploy

4. **Test:**
   - Try resolving a market again
   - Should work without CORS errors

## Important Notes

- `NEXT_PUBLIC_SEPOLIA_RPC_URL` is used by the **web frontend** (browser)
- This is different from `SEPOLIA_RPC_URL` used by the **indexer** (backend)
- The indexer can use `https://rpc.sepolia.org` (no CORS issue for backend)
- But the web frontend needs a CORS-enabled RPC endpoint

## After Fixing

Once you update the RPC URL and redeploy:
- Market resolution should work
- No more CORS errors in the console
- Blockchain interactions from the browser will work properly


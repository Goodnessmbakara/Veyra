# How to Set Up Operators for Market Resolution

## Overview

Operators are what make market resolution work. They verify outcomes and reach quorum consensus. Without operators, resolution will be stuck at "Pending Quorum" forever.

## What Are Operators?

Operators are:
- **Independent verifiers** that check if market outcomes are correct
- **Decentralized nodes** that run the AVS (Actively Validated Service)
- **Stake holders** - they must have stake (weight) to participate
- **Consensus builders** - need 66% of operator stake to agree for resolution

## Two Options for Setting Up Operators

### Option 1: Use Your Own AVS Service (Recommended for Testing)

Deploy and run the AVS service yourself:

#### Step 1: Deploy AVS Service on Railway

1. **In Railway Dashboard:**
   - Click **"+ New"** → **"Empty Service"**
   - Name it `veyra-avs`
   - Connect to your GitHub repo
   - Set **Root Directory:** `avs/`
   - Set **Dockerfile Path:** `avs/Dockerfile` (or just `Dockerfile`)

#### Step 2: Set Environment Variables

In Railway → **veyra-avs** service → **Variables**, set:

**Required:**
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY
ADAPTER_ADDRESS=0x... (your adapter contract address)
AVS_PRIVATE_KEY=0x... (private key of operator wallet)
```

**Optional but Recommended:**
```
EIGENLAYER_DELEGATION_MANAGER=0x... (EigenLayer contract address)
PINATA_API_KEY=... (for IPFS uploads)
PINATA_SECRET_API_KEY=...
GEMINI_API_KEY=... (for LLM verification)
```

#### Step 3: Register Operator on Chain

Operators need to be registered on the AVS contract:

1. **Get your operator address** from `AVS_PRIVATE_KEY`
2. **Call the AVS contract** to register:
   - Function: `registerOperator()` or similar
   - This makes the operator eligible to process requests

#### Step 4: Deploy and Start

- Railway will build and deploy automatically
- Check logs to ensure it's running
- Look for: "Operator registered" or "Listening for verification requests"

### Option 2: Use EigenLayer Operators (Production)

For production, you'd want to integrate with EigenLayer:

1. **Register AVS on EigenLayer:**
   - Your AVS contract must be registered on EigenLayer network
   - This allows EigenLayer operators to opt-in

2. **Operators Opt-In:**
   - Existing EigenLayer operators opt-in to your AVS
   - They allocate stake to your AVS
   - Their stake weight determines quorum

3. **Service Integration:**
   - Your AVS service queries EigenLayer for registered operators
   - Operator weights come from EigenLayer's DelegationManager
   - Operators process requests and submit attestations

## Quick Setup for Testing (Simplified)

If you just want to test resolution quickly:

### Minimal Setup:

1. **Deploy AVS Service:**
   - Same as Option 1, Step 1

2. **Set Minimum Variables:**
   ```
   SEPOLIA_RPC_URL=your_rpc_url
   ADAPTER_ADDRESS=your_adapter_address
   AVS_PRIVATE_KEY=your_private_key
   ```

3. **Register Operator:**
   - Use a script or interact with contract directly
   - Call: `registerOperator()` on the adapter contract
   - Operator address = address derived from `AVS_PRIVATE_KEY`

4. **Start Service:**
   - Railway will deploy automatically
   - Service starts listening for requests
   - When market resolution is triggered, operator processes it

## Verify Operators Are Working

### Check Operators Endpoint:

```
https://veyra-indexer-production.up.railway.app/operators
```

Should return operators with:
- `address`: Operator wallet address
- `enabled`: `1` (enabled)
- `stake` or `weight`: Operator's stake weight

### Check AVS Service Logs:

In Railway → **veyra-avs** service → **Logs**:
- Look for: "Operator registered"
- Look for: "Listening for verification requests"
- Look for: "Processing verification request" (when resolution triggered)

### Check Jobs Endpoint:

```
https://veyra-indexer-production.up.railway.app/jobs
```

When you trigger resolution, you should see:
- New job created
- Status updates as operator processes it
- Quorum status updates

## Requirements Summary

**For Operators to Work:**

1. ✅ **AVS Service Running** - Deploy `veyra-avs` service
2. ✅ **Environment Variables Set** - RPC, adapter address, private key
3. ✅ **Operator Registered** - On-chain registration on adapter contract
4. ✅ **Service Processing Requests** - AVS service listening and responding

**For Resolution to Complete:**

1. ✅ **At Least 1 Operator** - Minimum to process requests
2. ✅ **66% Quorum** - Need 66% of total stake to agree
3. ✅ **Operators Responding** - Operators must submit attestations
4. ✅ **Quorum Reached** - Enough operators agree on outcome

## Current Status

**Your current status:**
- ❌ No operators registered (empty array)
- ❌ Resolution stuck at "Pending Quorum"
- ✅ Can fix by deploying AVS service and registering operators

## Next Steps

1. **Deploy AVS service** on Railway (if not already deployed)
2. **Set environment variables** (especially `AVS_PRIVATE_KEY` and `ADAPTER_ADDRESS`)
3. **Register operator** on the adapter contract
4. **Verify** operators appear in `/operators` endpoint
5. **Test resolution** - should now work!

## Important Notes

- **Private Key Security:** Never commit `AVS_PRIVATE_KEY` to git! Use Railway environment variables only.
- **Multiple Operators:** For better quorum, you can run multiple operator instances with different private keys.
- **Stake Weight:** Operators with more stake have more weight in quorum calculation.
- **Testnet vs Mainnet:** On Sepolia testnet, you can use test tokens for stake.

Would you like me to help you deploy the AVS service or check if you already have it configured?


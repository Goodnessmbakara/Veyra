# AVS Service Environment Variables

## Required Variables

### 1. SEPOLIA_RPC_URL

**Use the same RPC URL as your indexer:**

```
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
```

Or if you have Alchemy/Infura (recommended for better performance):
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
```

### 2. ADAPTER_ADDRESS

**This is your VeyraOracleAVS adapter contract address.**

From your config, I can see you have:
```
ADAPTER_ADDRESS=0x13179cdE5ff82f8ab183a5465445818c243118de
```

**Double-check this is correct:**
- Go to Railway → veyra-web service → Variables
- Look for `NEXT_PUBLIC_ADAPTER_ADDRESS`
- Use that value (it should be the same)

### 3. AVS_PRIVATE_KEY

**This is the private key of the operator wallet.**

**⚠️ IMPORTANT: This must be a NEW private key, NOT your main wallet!**

**Options:**

**Option A: Generate a new private key (Recommended for testing)**
1. Use MetaMask: Create a new account → Export private key
2. Or use an online generator (for testnet only!)
3. This will be your "operator" wallet

**Option B: Use an existing wallet (if you want to use your current one)**
- Export private key from MetaMask
- Make sure this wallet has ETH on Sepolia for gas fees

**Format:**
```
AVS_PRIVATE_KEY=0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```
(64 hex characters after 0x)

## Optional Variables (Can Skip for Now)

### EIGENLAYER_DELEGATION_MANAGER
Leave empty for now unless you're using EigenLayer mainnet:
```
EIGENLAYER_DELEGATION_MANAGER=
```

### PINATA_API_KEY & PINATA_SECRET_API_KEY
Only needed if you want IPFS uploads. Can leave empty:
```
PINATA_API_KEY=
PINATA_SECRET_API_KEY=
```

### GEMINI_API_KEY
Only needed for LLM verification. Can leave empty:
```
GEMINI_API_KEY=
```

## Quick Setup Values

Copy these into Railway → veyra-avs → Variables:

```
SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com
ADAPTER_ADDRESS=0x13179cdE5ff82f8ab183a5465445818c243118de
AVS_PRIVATE_KEY=0xYOUR_PRIVATE_KEY_HERE
```

**Replace `0xYOUR_PRIVATE_KEY_HERE` with your actual private key!**

## How to Get Your Private Key

1. **Create a new MetaMask account** (for security)
2. **Export private key:**
   - Click account icon → Account details
   - Show private key
   - Copy it (starts with 0x, 66 characters total)
3. **Use that as `AVS_PRIVATE_KEY`**

## Security Note

- **Never commit private keys to git!**
- **Only store in Railway environment variables**
- **Use a separate wallet for operators** (don't use your main wallet)
- **On testnet, it's okay, but still be careful**


# How to Run the Historical Scan

## Step-by-Step Instructions

### Step 1: Open Your Browser

1. Open **Chrome** or **Edge** (any browser works)
2. Go to **any website** (doesn't matter which one)

### Step 2: Open Developer Console

**Method 1: Keyboard Shortcut (Easiest)**
- Press `F12` on your keyboard
- OR Press `Ctrl + Shift + I` (Windows/Linux)
- OR Press `Cmd + Option + I` (Mac)

**Method 2: Right-Click Menu**
- Right-click anywhere on the page
- Click **"Inspect"** or **"Inspect Element"**
- Click the **"Console"** tab

### Step 3: Paste the Command

You should see a console window open, with a prompt like `>` or `console` at the bottom.

1. Click in the console input area (where you can type)
2. Copy and paste this entire command:

```javascript
fetch('https://veyra-indexer-production.up.railway.app/scan', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ fromBlock: 0 })
}).then(r => r.json()).then(console.log)
```

3. Press **Enter**

### Step 4: What You Should See

You should see a response like:
```json
{
  "message": "Historical scan started",
  "fromBlock": 0,
  "note": "Check logs for progress. This may take a few minutes."
}
```

This means the scan has started!

### Step 5: Wait and Check

1. Wait 2-5 minutes for the scan to complete
2. Then check the markets endpoint:
   ```
   https://veyra-indexer-production.up.railway.app/markets
   ```
3. You should see your markets appear!

## Visual Guide

```
┌─────────────────────────────────────┐
│  Browser Window                     │
│                                     │
│  [Any webpage]                      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │  Developer Tools              │ │
│  │  ┌─────────────────────────┐  │ │
│  │  │ Console Tab  <─ CLICK   │  │ │
│  │  └─────────────────────────┘  │ │
│  │                                │ │
│  │  > [PASTE CODE HERE]          │ │
│  │     [PRESS ENTER]              │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Alternative: Use curl (Command Line)

If you have curl installed, you can also run:

```bash
curl -X POST https://veyra-indexer-production.up.railway.app/scan \
  -H "Content-Type: application/json" \
  -d '{"fromBlock": 0}'
```

## Troubleshooting

**If you see an error:**
- Make sure you're on the **Console** tab (not Elements, Network, etc.)
- Make sure you copied the entire command
- Check that the indexer service is running (try `/health` endpoint first)

**If scan doesn't work:**
- Check Railway logs for the indexer service
- Verify the `/scan` endpoint exists (check Railway deployment)


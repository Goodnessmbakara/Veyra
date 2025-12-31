import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseContractError(error: any): string {
  if (!error) return "Unknown error occurred";
  
  // Handle string errors
  if (typeof error === "string") {
    if (error.includes("user rejected") || error.includes("User rejected")) {
      return "Transaction rejected by user";
    }
    return error;
  }

  // Extract from ethers v6 Error object
  let msg = "";
  
  if (error.reason) {
    msg = error.reason;
  } else if (error.shortMessage) {
    msg = error.shortMessage;
  } else if (error.info?.error?.message) {
    msg = error.info.error.message;
  } else if (error.message) {
    msg = error.message;
  }

  // Handle specific codes
  if (error.code === "ACTION_REJECTED" || error.code === 4001) {
    return "Transaction rejected by user";
  }

  if (error.code === "INSUFFICIENT_FUNDS") {
    return "Insufficient funds for transaction";
  }

  if (error.code === "CALL_EXCEPTION") {
    if (msg.includes("missing revert data")) {
      // Often means gas estimation failed due to logic error
      return "Transaction would fail. Please check your inputs or balance.";
    }
  }

  // Clean common prefixes
  if (msg.includes("execution reverted:")) {
    msg = msg.split("execution reverted:")[1].trim();
  }
  
  if (msg.includes("Internal JSON-RPC error")) {
    try {
      const internal = typeof error.data === 'string' ? JSON.parse(error.data) : error.data;
      if (internal?.message) msg = internal.message;
    } catch (e) {}
  }

  // Map common custom errors
  const customErrorMap: Record<string, string> = {
    "TradingClosed": "Trading is closed for this market",
    "TradingOpen": "Trading is not yet closed",
    "InsufficientBalance": "Insufficient balance for this trade",
    "InvalidParameter": "Invalid parameter provided",
    "MarketNotResolved": "Market is not yet resolved",
    "InvalidTime": "Invalid time specified",
    "OnlyVault": "Unauthorized: Only the vault can perform this action",
    "BelowMinimum": "Amount is below the minimum required"
  };

  for (const [key, val] of Object.entries(customErrorMap)) {
    if (msg.includes(key)) return val;
  }

  // If we still have a huge JSON-like string, truncate or clean it
  if (msg.length > 200) {
    if (msg.includes("estimateGas")) {
      return "Gas estimation failed. The transaction might revert.";
    }
    return "Transaction failed. Please try again or check console logic.";
  }

  return msg || "Transaction failed";
}
import { db } from "./db.js";
import https from "https";

interface PolymarketMarket {
	id?: string;
	conditionId?: string;
	question?: string;
	endDate?: string;
	createdAt?: string;
	volume24hr?: number;
	volume1wk?: number;
}

// Fetch markets that are not closed and not archived
function fetchLiveMarkets(limit = 100): Promise<PolymarketMarket[]> {
	return new Promise((resolve, reject) => {
		const url = `https://gamma-api.polymarket.com/markets?limit=${limit}&closed=false&archived=false`;
		
		https.get(url, (res) => {
			let data = '';
			
			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				try {
					const markets = JSON.parse(data);
					resolve(markets);
				} catch (error) {
					reject(error);
				}
			});
		}).on('error', (error) => {
			reject(error);
		});
	});
}

// Filter for truly active markets (2025 or later, not expired)
function isLiveMarket(market: PolymarketMarket): boolean {
	const now = new Date();
	
	// Must have an end date in the future
	if (market.endDate) {
		const endDate = new Date(market.endDate);
		if (endDate < now) {
			return false; // Already expired
		}
		
		// Must end in 2025 or later
		if (endDate.getFullYear() < 2025) {
			return false;
		}
	}
	
	return true;
}

export async function syncPolymarketMarkets() {
	try {
		console.log('[Polymarket] Starting sync...');
		const allMarkets = await fetchLiveMarkets(200);
		
		// Filter for truly live 2025+ markets
		const liveMarkets = allMarkets.filter(isLiveMarket);
		
		// Sort by 24h volume (most active first)
		liveMarkets.sort((a, b) => {
			const volA = a.volume24hr || 0;
			const volB = b.volume24hr || 0;
			return volB - volA;
		});
		
		// Take top 50 most active markets
		const topMarkets = liveMarkets.slice(0, 50);
		
		console.log(`[Polymarket] Found ${topMarkets.length} live markets to sync`);
		
		if (topMarkets.length === 0) {
			console.log('[Polymarket] No live markets found');
			return;
		}
		
		// Clear old Polymarket markets
		db.prepare(`DELETE FROM external_markets WHERE source = 'Polymarket'`).run();
		
		// Insert new markets
		const stmt = db.prepare(`
			INSERT INTO external_markets (
				id, source, marketId, question, status, createdAt
			) VALUES (?, ?, ?, ?, ?, ?)
		`);
		
		let inserted = 0;
		for (const market of topMarkets) {
			try {
				const marketId = market.id || market.conditionId || '';
				const question = market.question || 'Unknown';
				const status = 'Pending';
				const createdAt = market.createdAt 
					? Math.floor(new Date(market.createdAt).getTime() / 1000) 
					: Math.floor(Date.now() / 1000);
				
				stmt.run(
					`poly-${marketId}`,
					'Polymarket',
					marketId,
					question,
					status,
					createdAt
				);
				inserted++;
			} catch (error: any) {
				console.error(`[Polymarket] Error inserting market:`, error.message);
			}
		}
		
		console.log(`[Polymarket] Successfully synced ${inserted} markets`);
	} catch (error: any) {
		console.error('[Polymarket] Sync error:', error.message);
		// Don't throw - allow service to continue running
	}
}

// Run sync every 30 minutes (1800000 ms)
let syncInterval: NodeJS.Timeout | null = null;

export function startPolymarketSync(intervalMs: number = 30 * 60 * 1000) {
	// Run immediately on start
	syncPolymarketMarkets();
	
	// Then run on interval
	syncInterval = setInterval(() => {
		syncPolymarketMarkets();
	}, intervalMs);
	
	console.log(`[Polymarket] Auto-sync started (every ${intervalMs / 1000 / 60} minutes)`);
}

export function stopPolymarketSync() {
	if (syncInterval) {
		clearInterval(syncInterval);
		syncInterval = null;
		console.log('[Polymarket] Auto-sync stopped');
	}
}


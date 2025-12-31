import type { MarketSummary } from "../types";

interface IndexerMarket {
	address: string;
	marketId: string;
	question: string;
	endTime: number;
	oracle: string;
	vault: string;
	status?: number; // 0=Trading, 1=PendingResolve, 2=Resolved
	outcome?: number; // 0=Short, 1=Long (only set when resolved)
	createdAt: number;
}

export class MarketsManager {
	async listRecent(): Promise<MarketSummary[]> {
		try {
			// Try to fetch from API first
			const res = await fetch("/api/markets", {
				cache: "no-store",
			});

			if (res.ok) {
				const markets: IndexerMarket[] = await res.json();
				const now = Math.floor(Date.now() / 1000);
				
				// Fetch jobs (AVS verification requests) for all markets
				let jobs: any[] = [];
				try {
					const jobsRes = await fetch("/api/jobs", { cache: "no-store" });
					if (jobsRes.ok) {
						jobs = await jobsRes.json();
					}
				} catch (e) {
					console.error("Error fetching jobs:", e);
				}

				return markets.map((m: IndexerMarket) => {
					// Map status numbers to display strings
					const statusDisplay = m.status === 2 ? "Resolved" :
					                      m.status === 1 ? "Pending" :
					                      "Active";
					
					// Map outcome to result
					let result = "Pending";
					if (m.status === 2 && m.outcome !== null && m.outcome !== undefined) {
						result = m.outcome === 1 ? "Long Wins" : "Short Wins";
					}
					
					// Find jobs for this market
					const marketJobs = jobs.filter((j: any) => j.marketRef === m.marketId);
					const proofIds = marketJobs.map((j: any) => j.requestId);

					return {
						id: m.address, // Use address as ID for now
						question: m.question,
						platform: "Veyra", // Our own markets
						status: statusDisplay,
						result: result,
						category: "Prediction Market",
						proofIds: proofIds,
					} as MarketSummary;
				});
			}
		} catch (error) {
			console.error("Error fetching markets from API:", error);
		}

		// Return empty array if API fails - no mock data
		return [];
	}

	async getMarketById(id: string): Promise<MarketSummary | null> {
		try {
			// Try to fetch from API first
			const res = await fetch(`/api/markets/${id}`, {
				cache: "no-store",
			});

			if (res.ok) {
				const market: any = await res.json();
				
				// Map status numbers to display strings
				const statusDisplay = market.status === 2 ? "Resolved" :
				                      market.status === 1 ? "Pending" :
				                      "Active";
				
				// Map outcome to result
				let result = "Pending";
				if (market.status === 2 && market.outcome !== null && market.outcome !== undefined) {
					result = market.outcome === 1 ? "Long Wins" : "Short Wins";
				}

				// Fetch jobs (AVS verification requests) to find linked proofs
				let proofIds: string[] = [];
				try {
					const jobsRes = await fetch("/api/jobs", { cache: "no-store" });
					if (jobsRes.ok) {
						const jobs: any[] = await jobsRes.json();
						// Find jobs for this market
						const marketJobs = jobs.filter((j: any) => j.marketRef === market.marketId);
						proofIds = marketJobs.map((j: any) => j.requestId);
					}
				} catch (e) {
					console.error("Error fetching jobs:", e);
				}

				return {
					id: market.address,
					question: market.question,
					platform: "Veyra",
					status: statusDisplay,
					result: result,
					category: "Prediction Market",
					proofIds: proofIds,
				} as MarketSummary;
			}
		} catch (error) {
			console.error("Error fetching market from API:", error);
		}

		// Return null if not found - no mock data fallback
		return null;
	}
}




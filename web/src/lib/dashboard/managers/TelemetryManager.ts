import type { Kpis } from "../types";

interface IndexerKpis {
	totalMarkets: number;
	activeMarkets: number;
	resolvedMarkets: number;
	totalTrades: number;
}

export class TelemetryManager {
	async getKpis(): Promise<Kpis> {
		try {
			// Try to fetch from API first
			const res = await fetch("/api/kpis", {
				cache: "no-store",
			});

			if (res.ok) {
				const kpis: IndexerKpis = await res.json();
				
				// Fetch pending jobs count
				let pendingJobs = 0;
				try {
					const jobsRes = await fetch("/api/jobs", { cache: "no-store" });
					if (jobsRes.ok) {
						const jobs: any[] = await jobsRes.json();
						pendingJobs = jobs.filter((j: any) => 
							j.status === "Queued" || j.status === "Pending" || (j.status !== "Succeeded" && j.status !== "Failed")
						).length;
					}
				} catch (e) {
					console.error("Error fetching jobs for KPIs:", e);
				}

				// Fetch attestations for 24h count
				let attestations24h = 0;
				try {
					const attsRes = await fetch("/api/attestations", { cache: "no-store" });
					if (attsRes.ok) {
						const atts: any[] = await attsRes.json();
						const now = Math.floor(Date.now() / 1000);
						const dayAgo = now - 86400; // 24 hours ago
						attestations24h = atts.filter((a: any) => {
							const createdAt = a.createdAt > 1e10 ? Math.floor(a.createdAt / 1000) : a.createdAt;
							return createdAt >= dayAgo;
						}).length;
					}
				} catch (e) {
					console.error("Error fetching attestations for KPIs:", e);
				}

				return {
					activeMarkets: kpis.activeMarkets || 0,
					pendingJobs: pendingJobs,
					success24h: 0, // Would need time-based aggregation
					failed24h: 0,
					p50LatencyMs: 0,
					p95LatencyMs: 0,
					attestations24h: attestations24h,
				};
			}
		} catch (error) {
			console.error("Error fetching KPIs from API:", error);
		}

		// Return zeros if API fails - no mock data
		return {
			activeMarkets: 0,
			pendingJobs: 0,
			success24h: 0,
			failed24h: 0,
			p50LatencyMs: 0,
			p95LatencyMs: 0,
			attestations24h: 0
		};
	}
}





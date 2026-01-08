"use client";

import React, { useEffect, useState, Suspense } from "react";
import { MarketsManager } from "@/lib/dashboard/managers/MarketsManager";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ExternalLink, FileText, Copy, CheckCircle2, Loader2 } from "lucide-react";
import type { MarketSummary } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils";
import { CreateMarketDialog } from "@/components/markets/CreateMarketDialog";
import { TradeDialog } from "@/components/markets/TradeDialog";
import { RedeemDialog } from "@/components/markets/RedeemDialog";
import { ResolveMarketDialog } from "@/components/markets/ResolveMarketDialog";

import { useSearchParams } from "next/navigation";

function MarketsContent(): React.ReactElement {
	const searchParams = useSearchParams();
	const [platformFilter, setPlatformFilter] = useState("all");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedMarket, setSelectedMarket] = useState<MarketSummary | null>(null);
	const [markets, setMarkets] = useState<MarketSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [attestations, setAttestations] = useState<Record<string, any>>({});

	const [tradeMarketId, setTradeMarketId] = useState<string | null>(null);

	useEffect(() => {
		const fetchMarkets = async () => {
			try {
				const marketsManager = new MarketsManager();
				const data = await marketsManager.listRecent();
				setMarkets(data);
			} catch (error) {
				console.error("Failed to fetch markets:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchMarkets();

		// Poll for updates every 10 seconds
		const interval = setInterval(fetchMarkets, 10000);
		return () => clearInterval(interval);
	}, []);

	// Handle deep linking to market details
	useEffect(() => {
		const marketIdParam = searchParams.get("marketId");
		if (marketIdParam && markets.length > 0 && !selectedMarket) {
			const market = markets.find(m => m.id.toLowerCase() === marketIdParam.toLowerCase());
			if (market) {
				setSelectedMarket(market);
			}
		}
	}, [searchParams, markets]);

	// Fetch attestations when selected market changes
	useEffect(() => {
		if (!selectedMarket || selectedMarket.proofIds.length === 0) {
			return;
		}

		const fetchAttestations = async () => {
			const newAttestations: Record<string, any> = {};
			for (const proofId of selectedMarket.proofIds) {
				try {
					const res = await fetch(`/api/attestations/${proofId}`);
					if (res.ok) {
						newAttestations[proofId] = await res.json();
					}
				} catch (error) {
					console.error(`Failed to fetch attestation ${proofId}:`, error);
				}
			}
			setAttestations(newAttestations);
		};

		fetchAttestations();
	}, [selectedMarket]);

	const filteredMarkets = markets.filter((market) => {
		if (platformFilter !== "all" && market.platform !== platformFilter) return false;
		if (statusFilter !== "all" && market.status !== statusFilter) return false;
		return true;
	});

	const handleMarketCreated = (marketAddress: string) => {
		// Refresh markets list immediately
		void (async () => {
			const marketsManager = new MarketsManager();
			const data = await marketsManager.listRecent();
			setMarkets(data);
		})();
	};

	return (
		<div className="space-y-4 sm:space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-xl sm:text-2xl font-semibold">Prediction Markets</h1>
				<CreateMarketDialog onSuccess={handleMarketCreated} />
			</div>

			{/* Filters */}
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Market Filters</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-4">
						<div className="flex-1 min-w-[200px]">
							<Label>Platform</Label>
							<Select value={platformFilter} onValueChange={setPlatformFilter}>
								<SelectTrigger className="mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Platforms</SelectItem>
									<SelectItem value="Polymarket">Polymarket</SelectItem>
									<SelectItem value="Gnosis">Gnosis</SelectItem>
									<SelectItem value="UMA">UMA</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="flex-1 min-w-[200px]">
							<Label>Status</Label>
							<Select value={statusFilter} onValueChange={setStatusFilter}>
								<SelectTrigger className="mt-1">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="Active">Active</SelectItem>
									<SelectItem value="Resolved">Resolved</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Markets Grid */}
			{isLoading ? (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						<p>Loading markets...</p>
					</CardContent>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					{filteredMarkets.map(market => (
					<Card
						key={market.id}
						className="flex flex-col cursor-pointer"
						onClick={() => setSelectedMarket(market)}
					>
						<CardHeader>
							<div className="flex items-start justify-between gap-2 mb-2">
								<Badge variant="secondary" className="text-xs">{market.platform}</Badge>
								<Badge 
									variant={market.status === "Active" ? "default" : "outline"}
									className={`text-xs ${
										market.status === "Active" 
											? "bg-blue-500/10 text-blue-500" 
											: market.status === "Ended"
											? "bg-orange-500/10 text-orange-500"
											: "bg-green-500/10 text-green-500"
									}`}
								>
									{market.status}
								</Badge>
							</div>
							<CardTitle className="text-sm sm:text-base line-clamp-2">{market.question}</CardTitle>
						</CardHeader>
						<CardContent className="flex-1 flex flex-col justify-between space-y-3">
							<div className="space-y-2 text-xs sm:text-sm">
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Category</span>
									<span className="font-medium">{market.category}</span>
								</div>
								<div className="flex items-center justify-between">
									<span className="text-muted-foreground">Result</span>
									<Badge 
										variant="outline"
										className={
											market.result === "Yes"
												? "bg-green-500/10 text-green-500"
												: market.result === "No"
												? "bg-red-500/10 text-red-500"
												: ""
										}
									>
										{market.result}
									</Badge>
								</div>
								<div className="flex items-center justify-between pt-1 border-t">
									<span className="text-muted-foreground">Linked Proofs</span>
									<span className="font-medium">{market.proofIds.length}</span>
								</div>
							</div>
							<div className="pt-2 flex gap-2">
								{market.status === "Active" && (
									<Button
										variant="default"
										size="sm"
										className="flex-1 text-xs"
										onClick={(e) => {
											e.stopPropagation();
											setTradeMarketId(market.id);
										}}
									>
										Trade
									</Button>
								)}
								<Button
									variant="outline"
									size="sm"
									className={market.status === "Active" ? "flex-1 text-xs" : "w-full text-xs"}
									onClick={(e) => {
										e.stopPropagation();
										setSelectedMarket(market);
									}}
								>
									View Details
								</Button>
							</div>
						</CardContent>
					</Card>
					))}
				</div>
			)}

			{!isLoading && filteredMarkets.length === 0 && (
				<Card>
					<CardContent className="py-8 text-center text-muted-foreground">
						<p>No markets found matching the selected filters.</p>
					</CardContent>
				</Card>
			)}

			{/* Trade Dialog - Rendered once at top level to prevent unmounting */}
			{tradeMarketId && (
				<TradeDialog
					marketAddress={tradeMarketId}
					open={true}
					onOpenChange={(open) => !open && setTradeMarketId(null)}
				/>
			)}

			{/* Market Details Dialog */}
			<Dialog open={!!selectedMarket} onOpenChange={() => setSelectedMarket(null)}>
				<DialogContent className="max-w-xl">
					<DialogHeader className="space-y-3 pb-4">
						<DialogTitle className="text-2xl font-bold leading-tight tracking-tight">
							{selectedMarket?.question}
						</DialogTitle>
						<DialogDescription className="text-muted-foreground/80 flex items-center gap-2">
							<FileText className="h-4 w-4" />
							Market Verification & On-chain Proofs
						</DialogDescription>
					</DialogHeader>
					{selectedMarket && (
						<div className="space-y-4">
							{/* Market Info Tiles */}
							<div className="grid grid-cols-2 gap-3">
								<div className="glass-subtle p-3 rounded-2xl border border-white/5">
									<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Platform</Label>
									<div className="mt-1 flex items-center gap-2">
										<Badge variant="secondary" className="px-2 py-0 h-5 text-[10px]">{selectedMarket.platform}</Badge>
									</div>
								</div>
								<div className="glass-subtle p-3 rounded-2xl border border-white/5">
									<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Trading Status</Label>
									<div className="mt-1">
										<Badge
											variant={selectedMarket.status === "Active" ? "default" : "outline"}
											className={cn(
												"px-2 py-0 h-5 text-[10px]",
												selectedMarket.status === "Active"
													? "bg-blue-500/10 text-blue-400 border-blue-500/20"
													: selectedMarket.status === "Ended"
													? "bg-orange-500/10 text-orange-400 border-orange-500/20"
													: "bg-green-500/10 text-green-400 border-green-500/20"
											)}
										>
											{selectedMarket.status}
										</Badge>
									</div>
								</div>
								<div className="glass-subtle p-3 rounded-2xl border border-white/5">
									<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Category</Label>
									<p className="text-sm font-medium mt-1 text-foreground/90">{selectedMarket.category}</p>
								</div>
								{selectedMarket.result !== "Pending" && (
									<div className="glass-subtle p-3 rounded-2xl border border-white/5">
										<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Final Outcome</Label>
										<div className="mt-1">
											<Badge
												variant="outline"
												className={cn(
													"px-2 py-0 h-5 text-[10px]",
													selectedMarket.result === "Yes"
														? "bg-green-500/10 text-green-400 border-green-500/20"
														: selectedMarket.result === "No"
														? "bg-red-500/10 text-red-400 border-red-400/20"
														: ""
												)}
											>
												{selectedMarket.result}
											</Badge>
										</div>
									</div>
								)}
								<div className="col-span-2 glass-subtle p-4 rounded-2xl border border-white/5">
									<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Contract Address / Market ID</Label>
									<div className="flex items-center gap-2 mt-2">
										<p className="text-xs font-mono truncate flex-1 bg-white/5 p-2 rounded-xl text-muted-foreground">
											{selectedMarket.id}
										</p>
										<Button
											size="icon"
											variant="ghost"
											className="h-8 w-8 rounded-xl hover:bg-white/10"
											onClick={() => navigator.clipboard.writeText(selectedMarket.id)}
										>
											<Copy className="h-3.5 w-3.5" />
										</Button>
									</div>
								</div>
							</div>

							{/* Proof Section */}
							<div className="space-y-3">
								<div className="flex items-center justify-between px-1">
									<Label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">On-chain Attestations</Label>
									<Badge variant="outline" className="text-[10px] px-2 py-0 border-white/10">{selectedMarket.proofIds.length} Linked</Badge>
								</div>
								
								<div className="space-y-2">
									{selectedMarket.proofIds.length > 0 ? (
										selectedMarket.proofIds.map((proofId) => {
											const attestation = attestations[proofId];
											return (
												<div key={proofId} className="glass-subtle p-3.5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
													<div className="flex items-center justify-between gap-3">
														<div className="flex items-center gap-3 overflow-hidden">
															<div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
																<CheckCircle2 className="h-4 w-4 text-primary" />
															</div>
															<div className="flex flex-col min-w-0">
																<span className="text-[10px] font-mono text-muted-foreground truncate">
																	{proofId}
																</span>
															</div>
														</div>
														<div className="flex items-center gap-1.5">
															<Button
																size="icon"
																variant="ghost"
																className="h-8 w-8 rounded-lg hover:bg-white/5"
																onClick={() => navigator.clipboard.writeText(proofId)}
															>
																<Copy className="w-3.5 h-3.5" />
															</Button>
															<Button
																size="icon"
																variant="ghost"
																className="h-8 w-8 rounded-lg hover:bg-white/5"
																onClick={() => {
																	window.location.href = `/dashboard/attestations?search=${proofId}`;
																}}
															>
																<ExternalLink className="w-3.5 h-3.5" />
															</Button>
														</div>
													</div>
													{attestation?.attestationCid && (
														<div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
															<span className="text-[10px] text-muted-foreground">Decentralized Storage (IPFS)</span>
															<a
																href={`https://gateway.pinata.cloud/ipfs/${attestation.attestationCid}`}
																target="_blank"
																rel="noopener noreferrer"
																className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors font-mono flex items-center gap-1.5"
															>
																{attestation.attestationCid.slice(0, 16)}...
																<ExternalLink className="w-3 h-3" />
															</a>
														</div>
													)}
												</div>
											);
										})
									) : (
										<div className="text-center py-6 px-4 rounded-2xl border border-dashed border-white/10 bg-white/2">
											<p className="text-xs text-muted-foreground/60 leading-relaxed italic">
												{selectedMarket.status === "Active" 
													? "No attestations yet. Market is open for trading." 
													: "Verification protocol in progress. Attestations will be linked once the consensus threshold is met."}
											</p>
										</div>
									)}
								</div>
							</div>

							{/* Action Footer */}
							<div className="flex flex-wrap gap-2 pt-4">
								{selectedMarket.status === "Resolved" && (
									<RedeemDialog
										marketAddress={selectedMarket.id}
										trigger={
											<Button className="flex-1 gap-2 h-11 rounded-xl font-bold bg-green-500 hover:bg-green-600 text-black">
												<CheckCircle2 className="w-4 h-4" />
												Settle & Redeem
											</Button>
										}
									/>
								)}
								{(selectedMarket.status === "Active" || selectedMarket.status === "Pending") && (
									<ResolveMarketDialog
										marketAddress={selectedMarket.id}
										trigger={
											<Button variant="outline" className="flex-1 gap-2 h-11 rounded-xl glass-hover">
												<ExternalLink className="w-4 h-4" />
												{selectedMarket.status === "Pending" ? "Check Status" : "Consensus Resolution"}
											</Button>
										}
									/>
								)}
								{selectedMarket.proofIds.length > 0 && (
									<Button variant="outline" className="flex-1 gap-3 h-11 rounded-xl glass-hover" onClick={() => {
										if (selectedMarket.proofIds.length === 1) {
											window.location.href = `/dashboard/attestations?search=${selectedMarket.proofIds[0]}`;
										} else {
											window.location.href = `/dashboard/attestations?search=${selectedMarket.id}`;
										}
									}}>
										<FileText className="w-4 h-4" />
										Explorer
									</Button>
								)}
							</div>
						</div>
					)}
				</DialogContent>
			</Dialog>
		</div>
	);
}

export default function MarketsPage(): React.ReactElement {
	return (
		<Suspense fallback={
			<div className="space-y-4 sm:space-y-6">
				<h1 className="text-xl sm:text-2xl font-semibold">Markets</h1>
				<div className="py-8 text-center">
					<Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
					<p className="text-muted-foreground text-sm">Loading...</p>
				</div>
			</div>
		}>
			<MarketsContent />
		</Suspense>
	);
}



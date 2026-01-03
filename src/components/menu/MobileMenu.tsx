"use client";

import { useState } from "react";
import { IMenuCategoryWithItems } from "@/types/website";
import { cn } from "@/utils/cn";
import { ChevronDown, ChevronUp, UtensilsCrossed, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MobileMenuProps {
	tenantName: string;
	tenantSlug: string;
	menuCategories: IMenuCategoryWithItems[];
	tableId?: string;
	primaryColor?: string;
	secondaryColor?: string;
	locale: string;
}

export default function MobileMenu({
	tenantName,
	menuCategories,
	tableId,
	primaryColor,
}: MobileMenuProps) {
	const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
		new Set(menuCategories.map((cat) => cat.id))
	);

	const toggleCategory = (categoryId: string) => {
		setExpandedCategories((prev) => {
			const newSet = new Set(prev);
			if (newSet.has(categoryId)) {
				newSet.delete(categoryId);
			} else {
				newSet.add(categoryId);
			}
			return newSet;
		});
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
			{/* Header */}
			<div
				className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b shadow-sm"
				style={{
					backgroundColor: primaryColor ? `${primaryColor}15` : undefined,
				}}
			>
				<div className="container max-w-2xl mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<UtensilsCrossed
								className="h-6 w-6"
								style={{ color: primaryColor || undefined }}
							/>
							<div>
								<h1 className="text-xl font-bold">{tenantName}</h1>
								{tableId && (
									<p className="text-xs text-muted-foreground">
										Table: {tableId.slice(0, 8)}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Menu Content */}
			<div className="container max-w-2xl mx-auto px-4 py-6 pb-20">
				{menuCategories.length === 0 ? (
					<Card className="mt-8">
						<CardContent className="flex flex-col items-center justify-center py-12 text-center">
							<Info className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-semibold mb-2">No Menu Available</h3>
							<p className="text-muted-foreground text-sm">
								The menu is currently being updated. Please check back later.
							</p>
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{menuCategories.map((category) => {
							const isExpanded = expandedCategories.has(category.id);

							return (
								<Card
									key={category.id}
									className="overflow-hidden transition-all duration-200 hover:shadow-md"
								>
									<button
										onClick={() => toggleCategory(category.id)}
										className="w-full text-left p-4 flex items-center justify-between transition-colors hover:bg-muted/50"
										style={{
											backgroundColor:
												isExpanded && primaryColor
													? `${primaryColor}10`
													: undefined,
										}}
									>
										<div className="flex items-center gap-3">
											<div
												className="w-1 h-8 rounded-full"
												style={{
													backgroundColor: primaryColor || "#3b82f6",
												}}
											/>
											<div>
												<h2 className="text-lg font-bold">{category.name}</h2>
												{category.description && (
													<p className="text-sm text-muted-foreground mt-0.5">
														{category.description}
													</p>
												)}
												<p className="text-xs text-muted-foreground mt-1">
													{category.items?.length || 0} items
												</p>
											</div>
										</div>
										{isExpanded ? (
											<ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
										) : (
											<ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
										)}
									</button>

									{isExpanded && (
										<CardContent className="pt-0 pb-4 px-4 space-y-3">
											{category.items && category.items.length > 0 ? (
												category.items.map((item, itemIndex) => (
													<div
														key={item.id}
														className={cn(
															"py-3 flex gap-3",
															itemIndex !== category.items.length - 1 &&
																"border-b"
														)}
													>
														{/* Item Image (if available) */}
														{item.image && (
															<div className="flex-shrink-0">
																<div className="w-20 h-20 rounded-lg overflow-hidden bg-muted">
																	{/* eslint-disable-next-line @next/next/no-img-element */}
																	<img
																		src={item.image}
																		alt={item.name}
																		className="w-full h-full object-cover"
																	/>
																</div>
															</div>
														)}

														{/* Item Details */}
														<div className="flex-1 min-w-0">
															<div className="flex items-start justify-between gap-2 mb-1">
																<h3 className="font-semibold text-base leading-tight">
																	{item.name}
																</h3>
																<span
																	className="font-bold text-base whitespace-nowrap flex-shrink-0"
																	style={{
																		color: primaryColor || undefined,
																	}}
																>
																	{item.price}
																</span>
															</div>

															{item.description && (
																<p className="text-sm text-muted-foreground leading-relaxed mb-2">
																	{item.description}
																</p>
															)}

															{/* Dietary badges */}
															{item.dietary && item.dietary.length > 0 && (
																<div className="flex flex-wrap gap-1.5 mt-2">
																	{item.dietary.map((d: string) => (
																		<Badge
																			key={d}
																			variant="secondary"
																			className="text-xs px-2 py-0 h-5 capitalize"
																		>
																			{d}
																		</Badge>
																	))}
																</div>
															)}
														</div>
													</div>
												))
											) : (
												<p className="text-sm text-muted-foreground py-4 text-center">
													No items in this category yet.
												</p>
											)}
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>
				)}
			</div>

			{/* Footer */}
			<div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t py-3 px-4">
				<div className="container max-w-2xl mx-auto">
					<p className="text-center text-xs text-muted-foreground">
						Powered by Menu Crafter
					</p>
				</div>
			</div>
		</div>
	);
}

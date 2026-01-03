"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, QrCode, Truck, Loader2 } from "lucide-react";
import { updateTenantDetails } from "@/lib/db/actions";
import { toast } from "sonner";

const DAYS_OF_WEEK = [
	{ id: "monday", name: "Monday", short: "Mon" },
	{ id: "tuesday", name: "Tuesday", short: "Tue" },
	{ id: "wednesday", name: "Wednesday", short: "Wed" },
	{ id: "thursday", name: "Thursday", short: "Thu" },
	{ id: "friday", name: "Friday", short: "Fri" },
	{ id: "saturday", name: "Saturday", short: "Sat" },
	{ id: "sunday", name: "Sunday", short: "Sun" },
];

const DEFAULT_HOURS = {
	monday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	tuesday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	wednesday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	thursday: { enabled: true, startTime: "09:00", endTime: "22:00" },
	friday: { enabled: true, startTime: "09:00", endTime: "23:00" },
	saturday: { enabled: true, startTime: "10:00", endTime: "23:00" },
	sunday: { enabled: false, startTime: "12:00", endTime: "21:00" },
};

interface DayHours {
	enabled: boolean;
	startTime: string;
	endTime: string;
}

interface OperatingHoursTabProps {
	tenantId?: string;
	initialData?: any;
}

export default function OperatingHoursTab({
	tenantId,
	initialData,
}: OperatingHoursTabProps) {
	const initialConfig = initialData?.websiteConfig?.operatingHours || {};
	const [dineInHours, setDineInHours] = useState<Record<string, DayHours>>(
		initialConfig.dineIn || DEFAULT_HOURS
	);
	const [deliveryHours, setDeliveryHours] = useState<Record<string, DayHours>>(
		initialConfig.delivery || DEFAULT_HOURS
	);
	const [isLoading, setIsLoading] = useState(false);

	const updateDineInHours = (
		dayId: string,
		field: keyof DayHours,
		value: boolean | string
	) => {
		setDineInHours((prev) => ({
			...prev,
			[dayId]: {
				...prev[dayId],
				[field]: value,
			},
		}));
	};

	const updateDeliveryHours = (
		dayId: string,
		field: keyof DayHours,
		value: boolean | string
	) => {
		setDeliveryHours((prev) => ({
			...prev,
			[dayId]: {
				...prev[dayId],
				[field]: value,
			},
		}));
	};

	const saveHours = async (type: "dineIn" | "delivery") => {
		if (!tenantId) return;
		setIsLoading(true);

		try {
			// Construct the new operatingHours object
			// We need to merge with existing websiteConfig to avoid data loss
			// initialData.websiteConfig might be stale if we don't update local state with fetch, but typically for this simple app revalidation on navigation handles it or we accept slight risk.
			// Ideally we fetch fresh, but here we assume initialData + local writes.
			// Better: merge `initialData.websiteConfig` with our changes.

			const existingConfig = initialData?.websiteConfig || {};
			const existingOperatingHours = existingConfig.operatingHours || {};

			const newOperatingHours = {
				...existingOperatingHours,
				dineIn: dineInHours,
				delivery: deliveryHours,
			};

			const newWebsiteConfig = {
				...existingConfig,
				operatingHours: newOperatingHours,
			};

			const result = await updateTenantDetails(tenantId, {
				websiteConfig: newWebsiteConfig,
			});

			if (result.succeeded) {
				toast.success(
					`${
						type === "dineIn" ? "Dine-in" : "Delivery"
					} hours saved successfully`
				);
			} else {
				toast.error(result.error?.message || "Failed to save hours");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const DayRow = ({
		day,
		hours,
		onUpdate,
	}: {
		day: (typeof DAYS_OF_WEEK)[0];
		hours: DayHours;
		onUpdate: (field: keyof DayHours, value: boolean | string) => void;
	}) => (
		<div className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
			<Checkbox
				checked={hours.enabled}
				onCheckedChange={(checked: boolean) => onUpdate("enabled", checked)}
				className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
			/>

			<div className="flex-1 min-w-0">
				<Label className="text-sm font-medium">{day.name}</Label>
			</div>

			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2">
					<Input
						type="time"
						value={hours.startTime}
						onChange={(e) => onUpdate("startTime", e.target.value)}
						disabled={!hours.enabled}
						className="w-24 h-9 text-sm"
					/>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</div>

				<span className="text-muted-foreground text-sm">to</span>

				<div className="flex items-center gap-2">
					<Input
						type="time"
						value={hours.endTime}
						onChange={(e) => onUpdate("endTime", e.target.value)}
						disabled={!hours.enabled}
						className="w-24 h-9 text-sm"
					/>
					<Clock className="h-4 w-4 text-muted-foreground" />
				</div>
			</div>
		</div>
	);

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-semibold text-foreground">
					Operating Hours
				</h2>
				<p className="text-muted-foreground mt-1">
					Configure your restaurant&apos;s operating hours for different
					services
				</p>
			</div>

			<Tabs defaultValue="dine-in" className="space-y-6">
				<TabsList className="grid w-full grid-cols-2">
					<TabsTrigger value="dine-in" className="flex items-center gap-2">
						<QrCode className="h-4 w-4" />
						Dine-in QR
					</TabsTrigger>
					<TabsTrigger value="delivery" className="flex items-center gap-2">
						<Truck className="h-4 w-4" />
						Delivery & Pick Up
					</TabsTrigger>
				</TabsList>

				<TabsContent value="dine-in" className="space-y-6">
					<Card className="shadow-sm">
						<CardContent className="p-6">
							<div className="space-y-4">
								{DAYS_OF_WEEK.map((day) => (
									<DayRow
										key={day.id}
										day={day}
										hours={dineInHours[day.id]}
										onUpdate={(field, value) =>
											updateDineInHours(day.id, field, value)
										}
									/>
								))}
							</div>

							<div className="mt-6 pt-4 border-t border-border/50">
								<Button
									className="w-full sm:w-auto"
									onClick={() => saveHours("dineIn")}
									disabled={isLoading}
								>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Dine-in Hours
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="delivery" className="space-y-6">
					<Card className="shadow-sm">
						<CardContent className="p-6">
							<div className="space-y-4">
								{DAYS_OF_WEEK.map((day) => (
									<DayRow
										key={day.id}
										day={day}
										hours={deliveryHours[day.id]}
										onUpdate={(field, value) =>
											updateDeliveryHours(day.id, field, value)
										}
									/>
								))}
							</div>

							<div className="mt-6 pt-4 border-t border-border/50">
								<Button
									className="w-full sm:w-auto"
									onClick={() => saveHours("delivery")}
									disabled={isLoading}
								>
									{isLoading && (
										<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									)}
									Save Delivery Hours
								</Button>
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">Quick Actions</CardTitle>
					<CardDescription>
						Common time configurations for your restaurant
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-3">
					<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const standardHours = DAYS_OF_WEEK.reduce<
									Record<string, DayHours>
								>(
									(acc, day) => ({
										...acc,
										[day.id]: {
											enabled: true,
											startTime: "09:00",
											endTime: "22:00",
										},
									}),
									{}
								);
								setDineInHours(standardHours);
								setDeliveryHours(standardHours);
							}}
						>
							Standard (9 AM - 10 PM)
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const extendedHours = DAYS_OF_WEEK.reduce<
									Record<string, DayHours>
								>(
									(acc, day) => ({
										...acc,
										[day.id]: {
											enabled: true,
											startTime: "07:00",
											endTime: "23:00",
										},
									}),
									{}
								);
								setDineInHours(extendedHours);
								setDeliveryHours(extendedHours);
							}}
						>
							Extended (7 AM - 11 PM)
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const weekendHours = DAYS_OF_WEEK.reduce<
									Record<string, DayHours>
								>(
									(acc, day) => ({
										...acc,
										[day.id]: {
											enabled: true,
											startTime: ["saturday", "sunday"].includes(day.id)
												? "10:00"
												: "09:00",
											endTime: ["saturday", "sunday"].includes(day.id)
												? "23:00"
												: "22:00",
										},
									}),
									{}
								);
								setDineInHours(weekendHours);
								setDeliveryHours(weekendHours);
							}}
						>
							Weekend Extended
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

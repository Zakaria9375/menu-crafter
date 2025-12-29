"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";
import { DayHours } from "@/constants/operating-hours";

interface DayRowProps {
	day: {
		id: string;
		name: string;
		short: string;
	};
	hours: DayHours;
	onUpdate: (field: keyof DayHours, value: boolean | string) => void;
}

export function DayRow({ day, hours, onUpdate }: DayRowProps) {
	return (
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
}

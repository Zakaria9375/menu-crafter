"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface TimeInputProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
}

export function TimeInput({ label, value, onChange, disabled }: TimeInputProps) {
	return (
		<div className="flex items-center gap-2">
			<Label className="text-sm">{label}</Label>
			<div className="flex items-center gap-2">
				<Input
					type="time"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					disabled={disabled}
					className="w-24 h-9 text-sm"
				/>
				<Clock className="h-4 w-4 text-muted-foreground" />
			</div>
		</div>
	);
}

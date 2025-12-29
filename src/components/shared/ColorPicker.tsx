"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
	label: string;
	value: string;
	onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
	return (
		<div className="space-y-2">
			<Label>{label}</Label>
			<div className="flex items-center gap-3">
				<Input
					type="color"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-16 h-10 p-1 cursor-pointer"
				/>
				<Input
					type="text"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder="#000000"
					className="flex-1"
				/>
			</div>
		</div>
	);
}

"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ItemBadgeProps {
	label: string;
	onRemove: () => void;
}

export function ItemBadge({ label, onRemove }: ItemBadgeProps) {
	return (
		<Badge variant="secondary" className="flex items-center gap-2 px-3 py-1">
			{label}
			<Button
				variant="ghost"
				size="sm"
				className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
				onClick={onRemove}
			>
				<X className="h-3 w-3" />
			</Button>
		</Badge>
	);
}

"use client";

import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Tablet } from "lucide-react";
import { PreviewDevice } from "@/hooks/usePreviewDevice";

interface DeviceSelectorProps {
	device: PreviewDevice;
	onDeviceChange: (device: PreviewDevice) => void;
}

export function DeviceSelector({ device, onDeviceChange }: DeviceSelectorProps) {
	return (
		<div className="flex items-center gap-2">
			<Button
				variant={device === "desktop" ? "default" : "ghost"}
				size="sm"
				onClick={() => onDeviceChange("desktop")}
			>
				<Monitor className="h-4 w-4" />
			</Button>
			<Button
				variant={device === "tablet" ? "default" : "ghost"}
				size="sm"
				onClick={() => onDeviceChange("tablet")}
			>
				<Tablet className="h-4 w-4" />
			</Button>
			<Button
				variant={device === "mobile" ? "default" : "ghost"}
				size="sm"
				onClick={() => onDeviceChange("mobile")}
			>
				<Smartphone className="h-4 w-4" />
			</Button>
		</div>
	);
}

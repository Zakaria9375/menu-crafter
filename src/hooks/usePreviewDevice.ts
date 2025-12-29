import { useState } from "react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";

/**
 * Hook for managing responsive preview device state
 * @returns Device state and setter, plus width class getter
 */
export function usePreviewDevice() {
	const [device, setDevice] = useState<PreviewDevice>("desktop");

	const getPreviewWidth = () => {
		switch (device) {
			case "mobile":
				return "max-w-[375px]";
			case "tablet":
				return "max-w-[768px]";
			default:
				return "w-full";
		}
	};

	return { device, setDevice, getPreviewWidth };
}

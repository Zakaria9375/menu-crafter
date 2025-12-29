/**
 * Downloads a QR code as PNG format
 * @param svgElement - The SVG element containing the QR code
 * @param fileName - The name for the downloaded file
 */
export function downloadQRCodeAsPNG(
	svgElement: SVGElement,
	fileName: string
): void {
	const svgData = new XMLSerializer().serializeToString(svgElement);
	const canvas = document.createElement("canvas");
	const ctx = canvas.getContext("2d");
	const img = new Image();

	img.onload = () => {
		canvas.width = img.width;
		canvas.height = img.height;
		ctx?.drawImage(img, 0, 0);
		const pngFile = canvas.toDataURL("image/png");
		const downloadLink = document.createElement("a");
		downloadLink.download = `${fileName}.png`;
		downloadLink.href = pngFile;
		downloadLink.click();
	};

	img.src = "data:image/svg+xml;base64," + btoa(svgData);
}

/**
 * Downloads a QR code as SVG format
 * @param svgElement - The SVG element containing the QR code
 * @param fileName - The name for the downloaded file
 */
export function downloadQRCodeAsSVG(
	svgElement: SVGElement,
	fileName: string
): void {
	const svgData = new XMLSerializer().serializeToString(svgElement);
	const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
	const svgUrl = URL.createObjectURL(svgBlob);
	const downloadLink = document.createElement("a");
	downloadLink.download = `${fileName}.svg`;
	downloadLink.href = svgUrl;
	downloadLink.click();
	URL.revokeObjectURL(svgUrl);
}

/**
 * Generates a QR code URL for a table in the menu
 * @param tableId - The ID of the table
 * @returns The full URL for the QR code
 */
export function getTableQRUrl(tableId: string): string {
	if (typeof window !== "undefined") {
		const protocol = window.location.protocol;
		const host = window.location.host;
		return `${protocol}//${host}/menu?tableId=${tableId}`;
	}
	return `/menu?tableId=${tableId}`;
}

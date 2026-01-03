"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Copy, Check, Save, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { updateQRCodeSettings } from "@/lib/db/actions";
import { toast } from "sonner";

interface QRCodesClientProps {
	tenantId: string;
	tenantSlug: string;
	savedSettings: {
		fgColor: string;
		bgColor: string;
		size: "small" | "medium" | "large" | "xlarge";
		level: "L" | "M" | "Q" | "H";
	};
}

export default function QRCodesClient({
	tenantId,
	tenantSlug,
	savedSettings,
}: QRCodesClientProps) {
	const [copied, setCopied] = useState(false);
	const [qrType, setQrType] = useState("menu");
	const [customUrl, setCustomUrl] = useState("");
	const [size, setSize] = useState(savedSettings.size);
	const [fgColor, setFgColor] = useState(savedSettings.fgColor);
	const [bgColor, setBgColor] = useState(savedSettings.bgColor);
	const [level, setLevel] = useState(savedSettings.level);
	const [includeLogo] = useState(false);
	const [isSaving, setIsSaving] = useState(false);

	const qrRef = useRef<SVGSVGElement>(null);

	const getBaseUrl = () => {
		// Extract the base domain (remove any existing subdomain)
		const host =
			typeof window !== "undefined" ? window.location.host : "localhost";
		const protocol =
			typeof window !== "undefined" ? window.location.protocol : "http:";

		let baseDomain = host;

		// Handle localhost development
		if (host.includes("localhost")) {
			baseDomain = host.includes(".localhost")
				? host.substring(host.indexOf(".localhost") + 1)
				: `localhost${host.includes(":") ? ":" + host.split(":")[1] : ""}`;
		} else {
			// Production: extract base domain
			const parts = host.split(".");
			if (parts.length > 2) {
				// Remove subdomain, keep domain + TLD
				baseDomain = parts.slice(-2).join(".");
			}
		}

		// Construct tenant subdomain URL
		return `${protocol}//${tenantSlug}.${baseDomain}`;
	};

	const baseUrl = getBaseUrl();

	const getQrValue = () => {
		switch (qrType) {
			case "menu":
				return `${baseUrl}/menu`; // Direct link to menu
			case "homepage":
				return `${baseUrl}`;
			case "custom":
				return customUrl || baseUrl;
			default:
				return baseUrl;
		}
	};

	const qrValue = getQrValue();

	const handleCopyLink = () => {
		navigator.clipboard.writeText(qrValue);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const getSizeInPixels = () => {
		switch (size) {
			case "small":
				return 256;
			case "medium":
				return 512;
			case "large":
				return 1024;
			case "xlarge":
				return 2048;
			default:
				return 512;
		}
	};

	const handleDownloadSVG = () => {
		if (!qrRef.current) return;
		const svgData = new XMLSerializer().serializeToString(qrRef.current);
		const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${tenantSlug}-qrcode.svg`;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};

	const handleDownloadPNG = () => {
		if (!qrRef.current) return;

		const svgData = new XMLSerializer().serializeToString(qrRef.current);
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");
		const img = new Image();

		const pixelSize = getSizeInPixels();
		canvas.width = pixelSize;
		canvas.height = pixelSize;

		img.onload = () => {
			if (!ctx) return;
			ctx.fillStyle = bgColor;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, pixelSize, pixelSize);
			const pngFile = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.download = `${tenantSlug}-qrcode.png`;
			link.href = pngFile;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		};

		img.src = "data:image/svg+xml;base64," + btoa(svgData);
	};

	const handleSaveAsDefault = async () => {
		setIsSaving(true);
		try {
			const result = await updateQRCodeSettings(tenantId, {
				fgColor,
				bgColor,
				size,
				level,
			});

			if (result.succeeded) {
				toast.success("QR code settings saved as default");
			} else {
				toast.error(result.error?.message || "Failed to save settings");
			}
		} catch (error) {
			toast.error("An error occurred while saving settings");
			console.error(error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="space-y-6">
			<div>
				<h1 className="mb-2 text-3xl font-bold">QR Codes</h1>
				<p className="text-muted-foreground">
					Generate and download QR codes for your restaurant menu
				</p>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* QR Code Preview */}
				<Card>
					<CardHeader>
						<CardTitle>Menu QR Code</CardTitle>
						<CardDescription>
							Scan this code to view your digital menu
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="flex justify-center">
							<div className="rounded-lg border-4 border-border bg-white p-8">
								<div className="flex items-center justify-center bg-white">
									<QRCodeSVG
										ref={qrRef}
										value={qrValue}
										size={256}
										bgColor={bgColor}
										fgColor={fgColor}
										level={level as "L" | "M" | "Q" | "H"}
										includeMargin={true}
										imageSettings={
											includeLogo
												? {
														src: "/logo-placeholder.png", // Access actual logo if available
														x: undefined,
														y: undefined,
														height: 24,
														width: 24,
														excavate: true,
												  }
												: undefined
										}
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label>Target URL</Label>
							<div className="flex gap-2">
								<Input value={qrValue} readOnly />
								<Button variant="outline" size="icon" onClick={handleCopyLink}>
									{copied ? (
										<Check className="h-4 w-4" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						<div className="flex gap-2">
							<Button
								className="flex-1 gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
								onClick={handleDownloadPNG}
							>
								<Download className="h-4 w-4" />
								Download PNG
							</Button>
							<Button
								variant="outline"
								className="flex-1 gap-2 bg-transparent"
								onClick={handleDownloadSVG}
							>
								<Download className="h-4 w-4" />
								Download SVG
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Customization Options */}
				<Card>
					<CardHeader>
						<CardTitle>Customize QR Code</CardTitle>
						<CardDescription>
							Personalize your QR code appearance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="style" className="space-y-4">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="style">Style</TabsTrigger>
								<TabsTrigger value="content">Content</TabsTrigger>
							</TabsList>

							<TabsContent value="style" className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="size">Download Size</Label>
									<Select
										value={size}
										onValueChange={(value) =>
											setSize(value as "small" | "medium" | "large" | "xlarge")
										}
									>
										<SelectTrigger id="size">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="small">Small (256x256)</SelectItem>
											<SelectItem value="medium">Medium (512x512)</SelectItem>
											<SelectItem value="large">Large (1024x1024)</SelectItem>
											<SelectItem value="xlarge">
												Extra Large (2048x2048)
											</SelectItem>
										</SelectContent>
									</Select>
								</div>

								<div className="space-y-2">
									<Label htmlFor="foreground">Foreground Color</Label>
									<div className="flex gap-2">
										<Input
											id="foreground"
											type="color"
											value={fgColor}
											onChange={(e) => setFgColor(e.target.value)}
											className="h-10 w-20"
										/>
										<Input
											value={fgColor}
											onChange={(e) => setFgColor(e.target.value)}
											className="flex-1"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="background">Background Color</Label>
									<div className="flex gap-2">
										<Input
											id="background"
											type="color"
											value={bgColor}
											onChange={(e) => setBgColor(e.target.value)}
											className="h-10 w-20"
										/>
										<Input
											value={bgColor}
											onChange={(e) => setBgColor(e.target.value)}
											className="flex-1"
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="errorCorrection">Error Correction</Label>
									<Select
										value={level}
										onValueChange={(value) =>
											setLevel(value as "L" | "M" | "Q" | "H")
										}
									>
										<SelectTrigger id="errorCorrection">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="L">Low (7%)</SelectItem>
											<SelectItem value="M">Medium (15%)</SelectItem>
											<SelectItem value="Q">High (25%)</SelectItem>
											<SelectItem value="H">Highest (30%)</SelectItem>
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										Higher levels allow the QR code to be read even if partially
										damaged
									</p>
								</div>

								<div className="pt-4">
									<Button
										onClick={handleSaveAsDefault}
										disabled={isSaving}
										className="w-full gap-2"
									>
										{isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
										<Save className="h-4 w-4" />
										Save as Default for All QR Codes
									</Button>
									<p className="text-xs text-muted-foreground mt-2">
										These settings will be applied to all future QR codes,
										including table QR codes
									</p>
								</div>
							</TabsContent>

							<TabsContent value="content" className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="qrType">QR Code Type</Label>
									<Select value={qrType} onValueChange={setQrType}>
										<SelectTrigger id="qrType">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="menu">Full Menu</SelectItem>
											<SelectItem value="homepage">
												Restaurant Homepage
											</SelectItem>
											<SelectItem value="custom">Custom URL</SelectItem>
										</SelectContent>
									</Select>
								</div>

								{qrType === "custom" && (
									<div className="space-y-2">
										<Label htmlFor="customUrl">Custom URL</Label>
										<Input
											id="customUrl"
											placeholder="https://..."
											value={customUrl}
											onChange={(e) => setCustomUrl(e.target.value)}
										/>
										<p className="text-xs text-muted-foreground">
											Override the default menu URL
										</p>
									</div>
								)}
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

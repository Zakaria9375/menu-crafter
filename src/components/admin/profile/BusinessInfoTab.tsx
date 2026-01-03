"use client";

import { useState, useRef } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { updateTenantDetails } from "@/lib/db/actions";
import { toast } from "sonner";

interface BusinessInfoTabProps {
	tenantId: string;
	initialData: any;
}

export default function BusinessInfoTab({
	tenantId,
	initialData,
}: BusinessInfoTabProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [logoFile, setLogoFile] = useState<File | null>(null);
	const [logoPreview, setLogoPreview] = useState<string>(
		initialData?.logo || ""
	);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [formData, setFormData] = useState({
		name: initialData?.base?.name || "",
		slug: initialData?.base?.slug || "",
		businessType: initialData?.businessType || "RESTAURANT",
		address: initialData?.base?.address || "",
		phoneNumber: initialData?.base?.phoneNumber || "",
		email: initialData?.base?.email || "",
		website: initialData?.website || "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { id, value } = e.target;
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleValueChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				toast.error("Please select an image file");
				return;
			}
			// Validate file size (2MB)
			if (file.size > 2 * 1024 * 1024) {
				toast.error("File size must be less than 2MB");
				return;
			}
			setLogoFile(file);
			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setLogoPreview(reader.result as string);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleLogoUpload = async () => {
		if (!logoFile) {
			toast.error("Please select a logo file first");
			return;
		}

		setIsLoading(true);
		try {
			const formData = new FormData();
			formData.append("file", logoFile);
			formData.append("tenantId", tenantId);

			// Upload the file
			const response = await fetch("/api/upload/logo", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to upload logo");
			}

			const data = await response.json();

			// Update the tenant details with the logo URL
			const result = await updateTenantDetails(tenantId, {
				logo: data.url,
			});

			if (result.succeeded) {
				toast.success("Logo uploaded successfully");
				setLogoFile(null);
			} else {
				toast.error(result.error?.message || "Failed to update logo");
			}
		} catch (error) {
			toast.error("Failed to upload logo");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			// Construct payload based on what we have (sending all for simplicity mostly)
			const payload = {
				name: formData.name,
				slug: formData.slug,
				businessType: formData.businessType as
					| "RESTAURANT"
					| "HOTEL"
					| "CAFE"
					| "BAR"
					| "BAKERY"
					| "OTHER",
				phoneNumber: formData.phoneNumber,
				address: formData.address,
				email: formData.email,
				website: formData.website,
			};

			const result = await updateTenantDetails(tenantId, payload);

			if (result.succeeded) {
				toast.success("Business information updated successfully");
			} else {
				toast.error(
					result.error?.message || "Failed to update business information"
				);
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			{/* Tenant Basic Information */}
			<Card>
				<CardHeader>
					<CardTitle>Restaurant Information</CardTitle>
					<CardDescription>
						Update your restaurant&apos;s basic information
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Restaurant Name</Label>
						<Input id="name" value={formData.name} onChange={handleChange} />
					</div>

					<div className="space-y-2">
						<Label htmlFor="slug">Restaurant Slug</Label>
						<Input
							id="slug"
							value={formData.slug}
							onChange={handleChange}
							placeholder="restaurant-url-slug"
						/>
						<p className="text-xs text-muted-foreground">
							This will be used in your restaurant URL
						</p>
					</div>

					<div className="space-y-2">
						<Label htmlFor="businessType">Business Type</Label>
						<Select
							value={formData.businessType}
							onValueChange={(val) => handleValueChange("businessType", val)}
						>
							<SelectTrigger id="businessType">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="RESTAURANT">Restaurant</SelectItem>
								<SelectItem value="HOTEL">Hotel</SelectItem>
								<SelectItem value="CAFE">Cafe</SelectItem>
								<SelectItem value="BAR">Bar</SelectItem>
								<SelectItem value="BAKERY">Bakery</SelectItem>
								<SelectItem value="OTHER">Other</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Button onClick={() => handleSubmit()} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</Button>
				</CardContent>
			</Card>

			{/* Contact Information */}
			<Card>
				<CardHeader>
					<CardTitle>Contact Information</CardTitle>
					<CardDescription>How customers can reach you</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="address">Address</Label>
						<Textarea
							id="address"
							value={formData.address}
							onChange={handleChange}
							rows={2}
						/>
					</div>

					<div className="grid gap-4 sm:grid-cols-2">
						<div className="space-y-2">
							<Label htmlFor="phoneNumber">Phone Number</Label>
							<Input
								id="phoneNumber"
								type="tel"
								value={formData.phoneNumber}
								onChange={handleChange}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								value={formData.email}
								onChange={handleChange}
							/>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="website">Website</Label>
						<Input
							id="website"
							type="url"
							value={formData.website}
							onChange={handleChange}
							placeholder="https://yourrestaurant.com"
						/>
					</div>

					<Button onClick={() => handleSubmit()} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Changes
					</Button>
				</CardContent>
			</Card>

			{/* Logo */}
			<Card>
				<CardHeader>
					<CardTitle>Restaurant Logo</CardTitle>
					<CardDescription>Upload your restaurant&apos;s logo</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label>Logo</Label>
						<div className="flex items-center gap-4">
							<div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted overflow-hidden">
								{logoPreview ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={logoPreview}
										alt="Logo preview"
										className="h-full w-full object-cover"
									/>
								) : (
									<span className="text-3xl font-bold text-muted-foreground">
										{formData.name
											? formData.name.substring(0, 2).toUpperCase()
											: "GS"}
									</span>
								)}
							</div>
							<div className="space-y-2">
								<input
									ref={fileInputRef}
									type="file"
									accept="image/*"
									onChange={handleLogoSelect}
									className="hidden"
								/>
								<Button
									variant="outline"
									size="sm"
									className="gap-2"
									onClick={() => fileInputRef.current?.click()}
									type="button"
								>
									<Upload className="h-4 w-4" />
									{logoFile ? "Change Logo" : "Upload Logo"}
								</Button>
								<p className="text-xs text-muted-foreground">
									PNG, JPG up to 2MB. Recommended 512x512px
								</p>
							</div>
						</div>
					</div>

					<Button onClick={handleLogoUpload} disabled={!logoFile || isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						Save Logo
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}

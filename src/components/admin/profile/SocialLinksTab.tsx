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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
	Facebook,
	Instagram,
	Twitter,
	MessageCircle,
	Music2,
	Globe,
	Loader2,
} from "lucide-react";
import { updateTenantDetails } from "@/lib/db/actions";
import { toast } from "sonner";

const SOCIAL_PLATFORMS = [
	{
		id: "facebook",
		label: "Facebook",
		icon: Facebook,
		placeholder: "https://facebook.com/yourrestaurant",
		type: "url",
	},
	{
		id: "instagram",
		label: "Instagram",
		icon: Instagram,
		placeholder: "https://instagram.com/yourrestaurant",
		type: "url",
	},
	{
		id: "twitter",
		label: "X (Twitter)",
		icon: Twitter,
		placeholder: "https://x.com/yourrestaurant",
		type: "url",
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		icon: MessageCircle,
		placeholder: "+1234567890",
		type: "tel",
		helper: "Enter phone number with country code",
	},
	{
		id: "tiktok",
		label: "TikTok",
		icon: Music2,
		placeholder: "https://tiktok.com/@yourrestaurant",
		type: "url",
	},
];

interface SocialLinksTabProps {
	tenantId: string;
	initialData: any;
}

export default function SocialLinksTab({
	tenantId,
	initialData,
}: SocialLinksTabProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [formData, setFormData] = useState({
		facebook: initialData?.facebook || "",
		instagram: initialData?.instagram || "",
		twitter: initialData?.x || "", // map x to twitter input
		whatsapp: initialData?.whatsapp || "",
		tiktok: initialData?.tiktok || "",
		website: initialData?.website || "",
	});

	const handleChange = (id: string, value: string) => {
		setFormData((prev) => ({ ...prev, [id]: value }));
	};

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const payload = {
				facebook: formData.facebook,
				instagram: formData.instagram,
				x: formData.twitter, // map twitter input back to x
				whatsapp: formData.whatsapp,
				tiktok: formData.tiktok,
				website: formData.website,
			};

			const result = await updateTenantDetails(tenantId, payload);

			if (result.succeeded) {
				toast.success("Social links updated successfully");
			} else {
				toast.error(result.error?.message || "Failed to update social links");
			}
		} catch (error) {
			toast.error("An unexpected error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Social Media Accounts</CardTitle>
				<CardDescription>
					Connect your social media profiles to appear on your menu
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{SOCIAL_PLATFORMS.map((platform) => (
					<div key={platform.id} className="space-y-2">
						<Label htmlFor={platform.id} className="flex items-center gap-2">
							<platform.icon className="h-4 w-4" />
							{platform.label}
						</Label>
						<Input
							id={platform.id}
							type={platform.type}
							placeholder={platform.placeholder}
							value={(formData as any)[platform.id]}
							onChange={(e) => handleChange(platform.id, e.target.value)}
						/>
						{platform.helper && (
							<p className="text-xs text-muted-foreground">{platform.helper}</p>
						)}
					</div>
				))}

				<Separator />

				<div className="space-y-2">
					<Label htmlFor="website" className="flex items-center gap-2">
						<Globe className="h-4 w-4" />
						Website
					</Label>
					<Input
						id="website"
						type="url"
						placeholder="https://yourrestaurant.com"
						value={formData.website}
						onChange={(e) => handleChange("website", e.target.value)}
					/>
				</div>

				<Button onClick={handleSubmit} disabled={isLoading}>
					{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					Save Changes
				</Button>
			</CardContent>
		</Card>
	);
}

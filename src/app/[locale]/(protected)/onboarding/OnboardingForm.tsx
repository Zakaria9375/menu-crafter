"use client";

import { useState, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	createOnboardingSchema,
	OnboardingFormData,
} from "@/lib/validation/onboarding-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/ui/error-message";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function OnboardingForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const t = useTranslations();
	
	const onboardingSchema = useMemo(() => createOnboardingSchema(t), [t]);

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<OnboardingFormData>({
		resolver: zodResolver(onboardingSchema),
	});

	const onSubmit = async (data: OnboardingFormData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			const response = await fetch("/api/onboarding", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();

			if (result.success) {
				// Redirect to the tenant dashboard
				router.push(`/${result.tenant.slug}/dashboard`);
			} else {
				setError(result.message || "Failed to create business");
			}
		} catch (err) {
			setError("An error occurred. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="businessName">Business Name</Label>
				<Controller
					control={control}
					name="businessName"
					render={({ field }) => (
						<>
							<Input
								id="businessName"
								type="text"
								placeholder="My Restaurant"
								{...field}
							/>
							<ErrorMessage error={errors.businessName?.message} />
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="phoneNumber">Phone Number</Label>
				<Controller
					control={control}
					name="phoneNumber"
					render={({ field }) => (
						<>
							<Input
								id="phoneNumber"
								type="tel"
								placeholder="+212 34 56 78"
								{...field}
							/>
							<ErrorMessage error={errors.phoneNumber?.message} />
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="address">Business Address</Label>
				<Controller
					control={control}
					name="address"
					render={({ field }) => (
						<>
							<Textarea
								id="address"
								placeholder="123 Main St, Marrakech, Morocco"
								rows={3}
								{...field}
							/>
							<ErrorMessage error={errors.address?.message} />
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="tenantSlug">Subdomain</Label>
				<div className="flex items-center">
					<Controller
						control={control}
						name="tenantSlug"
						render={({ field }) => (
							<>
								<Input
									id="tenantSlug"
									type="text"
									placeholder="my-restaurant"
									className="rounded-r-none"
									{...field}
								/>
								<ErrorMessage error={errors.tenantSlug?.message} />
							</>
						)}
					/>
					<span className="text-sm text-muted-foreground whitespace-nowrap bg-muted px-3 flex items-center rounded-r-md border border-input border-l-0 h-10">
						.menu-crafter.com
					</span>
				</div>
				<p className="text-sm text-gray-500 mt-1">
					This will be your business subdomain (e.g.,
					my-restaurant.menu-crafter.com)
				</p>
			</div>

			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? "Creating Business..." : "Create Business"}
			</Button>
		</form>
	);
}

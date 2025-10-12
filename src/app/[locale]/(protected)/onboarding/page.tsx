import OnboardingForm from "./OnboardingForm";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ChefHat } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "@/i18n/navigation";

export default async function Onboarding() {
	const session = await auth();

	// If not logged in, redirect to login (middleware should handle this, but double-check)
	if (!session?.user?.id) {
		redirect({ href: "/login", locale: "en" });
	}

	// If user has tenants, redirect to first tenant's dashboard
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const memberships = (session?.user as any)?.memberships as Array<{ slug: string }> | undefined;
	if (memberships && memberships.length > 0) {
		redirect({ href: `/${memberships[0].slug}/admin/dashboard`, locale: "en" });
	}

	return (
		<div className="min-h-screen bg-gradient-hero flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-elegant border-0">
				<CardHeader className="space-y-2 text-center">
					<ChefHat className="h-6 w-6 text-primary-foreground" />
					<h1 className="text-2xl font-bold text-gray-900">
						Business Onboarding
					</h1>
					<p className="text-gray-600 mt-2 max-w-[24rem] mx-auto">
						Set up your restaurant profile to get started with Menu Crafter.
					</p>
				</CardHeader>
				<CardContent>
					<OnboardingForm />
				</CardContent>
			</Card>
		</div>
	);
}

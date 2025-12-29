import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BusinessInfoTab from "@/components/admin/profile/BusinessInfoTab";
import SocialLinksTab from "@/components/admin/profile/SocialLinksTab";
import OperatingHoursTab from "@/components/admin/profile/OperatingHoursTab";
import LanguagesCurrenciesTab from "@/components/admin/profile/LanguagesCurrenciesTab";
import { getTenantBySubdomain, getTenantDetails } from "@/lib/db/actions";
import { notFound } from "next/navigation";

interface ProfilePageProps {
	params: Promise<{
		tenant: string;
		locale: string;
	}>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
	const { tenant: tenantSlug } = await params;

	// 1. Get tenant ID from slug
	const tenantResult = await getTenantBySubdomain(tenantSlug);
	if (!tenantResult.succeeded || !tenantResult.data) {
		notFound();
	}
	const tenantId = tenantResult.data.id;

	// 2. Get tenant details
	const detailsResult = await getTenantDetails(tenantId);
	const tenantData = detailsResult.succeeded ? detailsResult.data : null;

	return (
		<div className="space-y-6">
			<div>
				<h1 className="mb-2 text-3xl font-bold">Business Profile</h1>
				<p className="text-muted-foreground">
					Manage your business profile information and business details
				</p>
			</div>

			<Tabs defaultValue="business" className="space-y-6">
				<TabsList>
					<TabsTrigger value="business">Business Info</TabsTrigger>
					<TabsTrigger value="social">Social Links</TabsTrigger>
					<TabsTrigger value="hours">Operating Hours</TabsTrigger>
					<TabsTrigger value="languages">Languages & Currencies</TabsTrigger>
				</TabsList>

				<TabsContent value="business">
					<BusinessInfoTab tenantId={tenantId} initialData={tenantData} />
				</TabsContent>

				<TabsContent value="social">
					<SocialLinksTab tenantId={tenantId} initialData={tenantData} />
				</TabsContent>

				<TabsContent value="hours">
					<OperatingHoursTab tenantId={tenantId} initialData={tenantData} />
				</TabsContent>

				<TabsContent value="languages">
					<LanguagesCurrenciesTab tenantId={tenantId} initialData={tenantData} />
				</TabsContent>
			</Tabs>
		</div>
	);
}

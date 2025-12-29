import { getTenantBySubdomain } from "@/lib/db/actions/tenants";
import { getTenantDetails } from "@/lib/db/actions/tenant-details";
import { getMenu } from "@/lib/db/actions/menu";
import { getWebsiteConfig } from "@/lib/db/actions/website";
import { notFound } from "next/navigation";
import TranslationCenter from "@/components/admin/translation/TranslationCenter";

interface PageProps {
	params: Promise<{
		tenant: string;
		locale: string;
	}>;
}

export default async function TranslationCenterPage({ params }: PageProps) {
	const { tenant: tenantSlug } = await params;

	// Fetch tenant
	const tenantResult = await getTenantBySubdomain(tenantSlug);
	if (!tenantResult.succeeded || !tenantResult.data) {
		notFound();
	}
	const tenant = tenantResult.data;

	// Fetch tenant details for languages
	const detailsResult = await getTenantDetails(tenant.id);
	if (!detailsResult.succeeded || !detailsResult.data) {
		notFound();
	}

	const languages = detailsResult.data.languages || ["en"];

	// Fetch menu data
	const categories = await getMenu(tenant.id);

	// Fetch website config
	const websiteConfigResult = await getWebsiteConfig(tenant.id);
	const websiteConfig = websiteConfigResult.success
		? websiteConfigResult.data
		: { content: {}, theme: "modern" as const };

	return (
		<TranslationCenter
			tenantId={tenant.id}
			languages={languages}
			categories={categories}
			websiteContent={websiteConfig?.content || {}}
			websiteTranslations={websiteConfig?.translations || {}}
		/>
	);
}

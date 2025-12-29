import { getWebsiteConfig } from "@/lib/db/actions/website";
import { getTenantBySubdomain, getTenantDetails } from "@/lib/db/actions";
import WebsiteEditor from "@/components/admin/website/WebsiteEditor";
import { notFound } from "next/navigation";

interface WebsiteEditorPageProps {
	params: Promise<{ tenant: string }>;
}

export default async function WebsiteEditorPage({
	params,
}: WebsiteEditorPageProps) {
	const { tenant } = await params;

	const tenantInfo = await getTenantBySubdomain(tenant);

	if (!tenantInfo?.data?.id) {
		notFound();
	}

	const tenantId = tenantInfo.data.id;
	const websiteConfig = await getWebsiteConfig(tenantId);

	// Fetch tenant details for languages
	const detailsResult = await getTenantDetails(tenantId);
	const languages = detailsResult.succeeded
		? detailsResult.data?.languages || ["en"]
		: ["en"];

	return (
		<WebsiteEditor
			tenantId={tenantId}
			initialContent={websiteConfig.data?.content || {}}
			initialTheme={websiteConfig.data?.theme || "modern"}
			initialPrimaryColor={websiteConfig.data?.primaryColor}
			initialSecondaryColor={websiteConfig.data?.secondaryColor}
			languages={languages}
			initialTranslations={websiteConfig.data?.translations || {}}
		/>
	);
}

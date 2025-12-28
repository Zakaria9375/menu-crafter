import { getWebsiteConfig } from "@/lib/db/actions/website";
import { getTenantBySubdomain } from "@/lib/db/actions";
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

	return (
		<WebsiteEditor
			tenantId={tenantId}
			initialContent={websiteConfig.data || {}}
			initialTheme={websiteConfig.data?.theme || "modern"}
		/>
	);
}

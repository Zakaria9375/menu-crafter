import { getTenantBySubdomain, getMenu } from "@/lib/db/actions";
import { getWebsiteConfig } from "@/lib/db/actions/website";
import WebsiteRenderer from "@/components/website/WebsiteRenderer";
import { notFound } from "next/navigation";
import { IMenuCategoryWithItems } from "@/types/website";

interface TenantPageProps {
	params: Promise<{ tenant: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
	const { tenant } = await params;
	const tenantInfo = await getTenantBySubdomain(tenant);

	if (!tenantInfo?.data?.id) {
		notFound();
	}

	const websiteConfig = await getWebsiteConfig(tenantInfo.data.id);
	const menuData = await getMenu(tenantInfo.data.id);

	const config = websiteConfig.data;
	const content = config?.content || {};
	const theme = config?.theme || "modern";

	return (
		<WebsiteRenderer
			content={content}
			theme={theme}
			menuCategories={menuData as unknown as IMenuCategoryWithItems[]}
			primaryColor={config?.primaryColor}
			secondaryColor={config?.secondaryColor}
		/>
	);
}

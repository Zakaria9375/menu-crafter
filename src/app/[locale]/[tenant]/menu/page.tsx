import { getTenantBySubdomain, getMenu } from "@/lib/db/actions";
import { getWebsiteConfig } from "@/lib/db/actions/website";
import { notFound } from "next/navigation";
import { IMenuCategoryWithItems } from "@/types/website";
import MobileMenu from "@/components/menu/MobileMenu";

interface MenuPageProps {
	params: Promise<{ tenant: string; locale: string }>;
	searchParams: Promise<{ tableId?: string }>;
}

export default async function MenuPage({ params, searchParams }: MenuPageProps) {
	const { tenant, locale } = await params;
	const { tableId } = await searchParams;

	const tenantInfo = await getTenantBySubdomain(tenant);

	if (!tenantInfo?.data?.id) {
		notFound();
	}

	const websiteConfig = await getWebsiteConfig(tenantInfo.data.id);
	const menuData = await getMenu(tenantInfo.data.id);

	const config = websiteConfig.data;
	const primaryColor = config?.primaryColor;
	const secondaryColor = config?.secondaryColor;

	return (
		<MobileMenu
			tenantName={tenantInfo.data.name}
			tenantSlug={tenant}
			menuCategories={menuData as unknown as IMenuCategoryWithItems[]}
			tableId={tableId}
			primaryColor={primaryColor}
			secondaryColor={secondaryColor}
			locale={locale}
		/>
	);
}

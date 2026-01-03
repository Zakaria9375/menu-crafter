import { getTenantBySubdomain, getQRCodeSettings } from "@/lib/db/actions";
import { notFound } from "next/navigation";
import QRCodesClient from "@/components/admin/qr-codes/QRCodesClient";

interface QRCodesPageProps {
	params: Promise<{
		tenant: string;
		locale: string;
	}>;
}

export default async function AdminQRCodesPage({ params }: QRCodesPageProps) {
	const { tenant: tenantSlug } = await params;

	// Get tenant ID from slug
	const tenantResult = await getTenantBySubdomain(tenantSlug);
	if (!tenantResult.succeeded || !tenantResult.data) {
		notFound();
	}
	const tenant = tenantResult.data;

	// Get saved QR code settings
	const settingsResult = await getQRCodeSettings(tenant.id);
	const savedSettings = {
		fgColor: settingsResult.data?.fgColor || "#000000",
		bgColor: settingsResult.data?.bgColor || "#ffffff",
		size: settingsResult.data?.size || ("medium" as const),
		level: settingsResult.data?.level || ("M" as const),
	};

	return (
		<QRCodesClient
			tenantId={tenant.id}
			tenantSlug={tenant.slug}
			savedSettings={savedSettings}
		/>
	);
}

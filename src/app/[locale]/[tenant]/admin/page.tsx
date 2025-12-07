import { redirect } from "@/i18n/navigation";

interface AdminPageProps {
	params: Promise<{ locale: string; tenant: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
	const { tenant, locale } = await params;
	redirect({ href: `/${tenant}/admin/dashboard`, locale: locale });
}

import { getMenu } from "@/lib/db/actions/menu"
import MenuManager from "@/components/admin/menu/MenuManager"
import { getTenantBySubdomain } from "@/lib/db/actions"

interface AdminMenuPageProps {
  params: Promise<{ tenant: string }>
}

export default async function AdminMenuPage({ params }: AdminMenuPageProps) {
  const { tenant } = await params
  const tenantInfo = await getTenantBySubdomain(tenant)
  const tenantId = tenantInfo?.data?.id || ''
  const menuCategories = await getMenu(tenantId )

  return <MenuManager tenantId={tenantId} initialCategories={menuCategories} />
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StaffTab from "@/components/admin/operations/StaffTab";
import TablesTab from "@/components/admin/operations/TablesTab";
import {
	getTenantBySubdomain,
	getTables,
	getTenantMembers,
} from "@/lib/db/actions";
import { notFound } from "next/navigation";
import { UtensilsCrossed, Users } from "lucide-react";
import { auth } from "@/lib/auth";

interface OperationsPageProps {
	params: Promise<{
		tenant: string;
		locale: string;
	}>;
}

export default async function OperationsPage({ params }: OperationsPageProps) {
	const { tenant: tenantSlug } = await params;
	const session = await auth();

	// 1. Get tenant ID from slug
	const tenantResult = await getTenantBySubdomain(tenantSlug);
	if (!tenantResult.succeeded || !tenantResult.data) {
		notFound();
	}
	const tenant = tenantResult.data;

	// 2. Fetch tables & staff
	const [tablesResult, membersResult] = await Promise.all([
		getTables(tenant.id),
		getTenantMembers(tenant.id),
	]);

	const tables = tablesResult.succeeded ? tablesResult.data || [] : [];
	const members = membersResult.succeeded ? membersResult.data || [] : [];

	return (
		<div className="space-y-6">
			<div>
				<h1 className="mb-2 text-3xl font-bold">Operations Management</h1>
				<p className="text-muted-foreground">
					Manage tables, staff, and daily operations
				</p>
			</div>

			<Tabs defaultValue="tables" className="space-y-6">
				<TabsList>
					<TabsTrigger value="tables" className="flex items-center gap-2">
						<UtensilsCrossed className="h-4 w-4" />
						Tables
					</TabsTrigger>
					<TabsTrigger value="staff" className="flex items-center gap-2">
						<Users className="h-4 w-4" />
						Staff
					</TabsTrigger>
				</TabsList>

				<TabsContent value="tables">
					<TablesTab
						tenantId={tenant.id}
						tenantSlug={tenant.slug}
						initialTables={tables}
					/>
				</TabsContent>

				<TabsContent value="staff">
					<StaffTab
						tenantId={tenant.id}
						initialMembers={members}
						currentUserEmail={session?.user?.email || ""}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}

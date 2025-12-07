import LeftSideBar from "@/components/nav/LeftSideBar";
import DashBoardNavBar from "@/components/nav/DashBoardNavBar";
import { getUserTenants } from "@/lib/db/actions";
import { auth } from "@/lib/auth";
interface AdminLayoutProps {
	params: Promise<{ tenant: string }>;
	children: React.ReactNode;
}
export default async function AdminLayout({	params,
	children,
}: AdminLayoutProps) {
	const { tenant } = await params;
	const session = await auth();
	const userId = session?.user?.id ?? '';
	const userTenants = await getUserTenants(userId);
	return (
		<div className="min-h-screen bg-background flex">
			{/* Left Sidebar */}
			<LeftSideBar tenant={tenant} userTenants={userTenants.data ?? []}/>

			{/* Main Content */}
			<div className="flex-1 flex flex-col">
				{/* Top Navigation */}
				<DashBoardNavBar />

				{/* Content */}
				<div className="flex-1 p-6 overflow-auto">
					<div className="max-w-7xl mx-auto">{children}</div>
				</div>
			</div>
		</div>
	);
}

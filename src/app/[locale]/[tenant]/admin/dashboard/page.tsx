import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
	FileEdit,
	Settings,
	BarChart3,
	UtensilsCrossed,
	Grid3x3,
	QrCode,
	Globe,
} from "lucide-react";
import db from "@/lib/db";
import { categories, menuItems, tables } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";
import { getTenantBySubdomain } from "@/lib/db/actions";
import { notFound } from "next/navigation";

interface DashboardPageProps {
	params: Promise<{
		tenant: string;
		locale: string;
	}>;
}

const Dashboard = async ({ params }: DashboardPageProps) => {
	const { tenant: tenantSlug } = await params;

	// Get tenant ID from slug
	const tenantResult = await getTenantBySubdomain(tenantSlug);
	if (!tenantResult.succeeded || !tenantResult.data) {
		notFound();
	}
	const tenantId = tenantResult.data.id;
	const tenantName = tenantResult.data.name;

	// Fetch statistics
	const [menuItemsCount, categoriesCount, tablesCount] = await Promise.all([
		db
			.select({ count: count() })
			.from(menuItems)
			.leftJoin(categories, eq(menuItems.categoryId, categories.id))
			.where(eq(categories.tenantId, tenantId))
			.then((result) => result[0]?.count || 0),

		db
			.select({ count: count() })
			.from(categories)
			.where(eq(categories.tenantId, tenantId))
			.then((result) => result[0]?.count || 0),

		db
			.select({ count: count() })
			.from(tables)
			.where(eq(tables.tenantId, tenantId))
			.then((result) => result[0]?.count || 0),
	]);

	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">
					Welcome to {tenantName} Dashboard
				</h1>
				<p className="text-muted-foreground">
					Manage your restaurant pages and settings from here
				</p>
			</div>

			{/* Statistics Grid */}
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Total Menu Items</CardTitle>
						<UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{menuItemsCount}</div>
						<p className="text-xs text-muted-foreground">
							Active items in menu
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Categories</CardTitle>
						<Grid3x3 className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{categoriesCount}</div>
						<p className="text-xs text-muted-foreground">
							Menu categories
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">QR Tables</CardTitle>
						<QrCode className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{tablesCount}</div>
						<p className="text-xs text-muted-foreground">
							Active tables with QR codes
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">Website</CardTitle>
						<Globe className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">Active</div>
						<p className="text-xs text-muted-foreground">
							Your digital menu is live
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Feature Cards */}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<FileEdit className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Menu Management</CardTitle>
						<CardDescription>
							Edit your digital menu items and categories
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/admin">
							<Button variant="outline" className="w-full">
								Manage Menu
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<QrCode className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>QR Codes</CardTitle>
						<CardDescription>
							Generate and download QR codes for your menu
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/admin/qr-codes">
							<Button variant="outline" className="w-full">
								Manage QR Codes
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<Globe className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Website Builder</CardTitle>
						<CardDescription>
							Customize your restaurant website appearance
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/admin/website">
							<Button variant="outline" className="w-full">
								Edit Website
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<Settings className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Business Profile</CardTitle>
						<CardDescription>
							Configure your business information and settings
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/admin/profile">
							<Button variant="outline" className="w-full">
								Edit Profile
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<BarChart3 className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Analytics</CardTitle>
						<CardDescription>
							View insights and performance metrics
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" className="w-full" disabled>
							View Reports (Coming Soon)
						</Button>
					</CardContent>
				</Card>

				<Card className="hover:shadow-lg transition-shadow">
					<CardHeader>
						<div className="mb-4 w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
							<Settings className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Settings</CardTitle>
						<CardDescription>
							Configure your account preferences
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Link href="/admin/settings">
							<Button variant="outline" className="w-full">
								Open Settings
							</Button>
						</Link>
					</CardContent>
				</Card>
			</div>
		</>
	);
};

export default Dashboard;

"use client";
import {
	BarChart3,
	ChefHat,
	Globe,
	LayoutDashboard,
	Menu,
	QrCode,
	Settings,
	User,
} from "lucide-react";
import { Button } from "../ui/button";
import { Link, usePathname } from "@/i18n/navigation";
import VenueSelector from "../admin/VenueSelector";
import { IUserTenants } from "@/types/IUserTenants";

interface LeftSideBarProps {
	tenant: string;
	userTenants: IUserTenants[];
}

export default function LeftSideBar({ tenant, userTenants }: LeftSideBarProps) {
	const pathname = usePathname();
	const navigation = [
		{
			name: "Dashboard",
			href: "dashboard",
			icon: LayoutDashboard,
		},
		{ name: "Menu Management", href: "menu", icon: Menu },
		{ name: "Analytics", href: "analytics", icon: BarChart3 },
		{ name: "QR Codes", href: "qr-codes", icon: QrCode },
		{ name: "Website", href: "website", icon: Globe },
		{ name: "Profile", href: "profile", icon: User },
		{ name: "Settings", href: "settings", icon: Settings },
	];

	return (
		<aside className="w-64 border-r border-border bg-card/50 backdrop-blur-sm">
			<div className="p-4 border-b border-border">
				{/* Logo */}
				<div className="flex items-center space-x-2 mb-4">
					<ChefHat className="h-6 w-6 text-primary" />
					<span className="text-lg font-bold text-primary">Menu Crafter</span>
				</div>

				{/* Venue Selector */}
				<VenueSelector userTenants={userTenants} tenant={tenant} />
			</div>

			{/* Navigation Items */}
			<nav className="p-4 space-y-2">
				{navigation.map((item) => (
					<Link href={`/${tenant}/admin/${item.href}`} key={item.name}>
						<Button
							variant={item.href === pathname ? "secondary" : "ghost"}
							className="w-full justify-start"
						>
							<item.icon className="mr-2 h-4 w-4" />
							{item.name}
						</Button>
					</Link>
				))}
			</nav>
		</aside>
	);
}

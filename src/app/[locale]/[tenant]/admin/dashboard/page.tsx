import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { FileEdit, Settings, BarChart3 } from "lucide-react";

const Dashboard = () => {
	return (
		<>
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Welcome to Dashboard</h1>
				<p className="text-muted-foreground">
					Manage your restaurant pages and settings from here
				</p>
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
							<BarChart3 className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle>Analytics</CardTitle>
						<CardDescription>
							View insights and performance metrics
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button variant="outline" className="w-full">
							View Reports
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
						<Link href="/profile">
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

import AuthNavBar from "@/components/nav/AuthNavBar";

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gradient-hero flex flex-col">
			<AuthNavBar />
			{children}
		</div>
	);
}

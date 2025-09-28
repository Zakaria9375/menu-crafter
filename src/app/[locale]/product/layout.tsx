import Footer from "@/components/nav/Footer";
import HomeNavBar from "@/components/nav/HomeNavBar";

export default function ProductLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-background">
			<HomeNavBar />
			{children}
			<Footer />
		</div>
	);
}

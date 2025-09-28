import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import Hero from "@/components/home/Hero";
import HomeNavBar from "@/components/nav/HomeNavBar";

export default function Home() {
	return (
		<div className="min-h-screen bg-background">
			<HomeNavBar />
			<Hero />
			<Features />
			<Footer />
		</div>
	);
}

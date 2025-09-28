import Features from "@/components/home/Features";
import Hero from "@/components/home/Hero";
import ProductLayout from "./product/layout";

export default function Home() {
	return (
		<ProductLayout>
			<Hero />
			<Features />
		</ProductLayout>
	);
}

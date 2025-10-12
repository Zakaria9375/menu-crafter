import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

const Hero = () => {
	const t = useTranslations("home.hero");
	return (
		<section className="relative overflow-hidden bg-gradient-hero">
			<div className="container mx-auto px-6 py-24">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-8">
						<h1 className="text-5xl lg:text-6xl font-bold leading-tight">
							{t("title")}
						</h1>

						<p className="text-xl text-muted-foreground max-w-lg">
							{t("subtitle")}
						</p>

						<div className="flex flex-col sm:flex-row gap-4">
							<Link href="/register">
								<Button variant="hero" size="lg" className="group">
									{t("cta")}
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</Link>
							<Link href="/demo">
								<Button variant="outline" size="lg">
									{t("secondary")}
								</Button>
							</Link>
						</div>
					</div>

					<div className="relative">
						<div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-2xl opacity-20"></div>
						<Image
							src="/hero-restaurant.jpg"
							alt="Restaurant kitchen"
							className="relative rounded-2xl shadow-elegant w-full h-auto"
							width={500}
							height={500}
							quality={100}
						/>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Hero;

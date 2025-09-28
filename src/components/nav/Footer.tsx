"use client"
import { Link } from "@/i18n/navigation"
import { ChefHat } from "lucide-react"
import { useTranslations } from "next-intl"

const Footer = () => {
	const t = useTranslations('footer');
	return (
		<footer className="border-t border-border bg-muted/30 pt-16 pb-6">
		<div className="container mx-auto px-6">
			<div className="grid md:grid-cols-4 gap-8 mb-12">
				{/* Brand */}
				<div className="space-y-4">
					<div className="flex items-center space-x-2">
						<ChefHat className="h-8 w-8 text-primary" />
						<span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
							{t('title')}
						</span>
					</div>
					<p className="text-muted-foreground">
						{t('subtitle')}
					</p>
				</div>
				
				{/* Product */}
				<div className="space-y-4">
					<h3 className="font-semibold text-lg">{t('product')}</h3>
					<ul className="space-y-2 text-muted-foreground">
						<li>
							<Link href="/product/pricing" className="hover:text-primary transition-colors">
								{t('pricing')}
							</Link>
						</li>
						<li>
							<Link href="/product/features" className="hover:text-primary transition-colors">
								{t('features')}
							</Link>
						</li>
						<li>
							<Link href="/product/demo" className="hover:text-primary transition-colors">
								{t('demo')}
							</Link>
						</li>
					</ul>
				</div>
				
				{/* Support */}
				<div className="space-y-4">
					<h3 className="font-semibold text-lg">{t('support')}</h3>
					<ul className="space-y-2 text-muted-foreground">
						<li>
							<Link href="/product/faq" className="hover:text-primary transition-colors">
								{t('faq')}
							</Link>
						</li>
						<li>
							<Link href="/product/contact" className="hover:text-primary transition-colors">
								{t('contact')}
							</Link>
						</li>
						<li>
							<Link href="/product/help-center" className="hover:text-primary transition-colors">
								{t('helpCenter')}
							</Link>
						</li>
					</ul>
				</div>
				
				{/* Legal */}
				<div className="space-y-4">
					<h3 className="font-semibold text-lg">{t('legal')}</h3>
					<ul className="space-y-2 text-muted-foreground">
						<li>
								<Link href="/product/privacy" className="hover:text-primary transition-colors">
								{t('privacyPolicy')}
							</Link>
						</li>
						<li>
							<Link href="/product/terms" className="hover:text-primary transition-colors">
								{t('termsOfService')}
							</Link>
						</li>
					</ul>
				</div>
			</div>
			
			{/* Bottom */}
			<div className="border-t border-border/20 pt-8">
				<div className="flex justify-center items-center space-y-2 md:space-y-0">
					<p className="text-sm text-muted-foreground">
					{(t('copyright'))}
					</p>
				</div>
			</div>
		</div>
	</footer>
	)
}

export default Footer

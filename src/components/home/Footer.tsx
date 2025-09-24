"use client"
import { ChefHat } from "lucide-react"

const Footer = () => {
	return (
		<footer className="border-t border-border bg-muted/30 py-12">
			<div className="container mx-auto px-6">
				<div className="flex items-center justify-center">
					<div className="flex items-center space-x-2">
						<ChefHat className="h-6 w-6 text-primary" />
						<span className="text-lg font-semibold">Menu Crafter</span>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer

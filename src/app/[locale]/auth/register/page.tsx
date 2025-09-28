"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChefHat } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

const Register = () => {
	const t = useTranslations('auth.register');

		const [formData, setFormData] = useState({
			name: "",
			phone: "",
			address: "",
			email: "",
		});

		const handleInputChange = (field: string, value: string) => {
			setFormData(prev => ({ ...prev, [field]: value }));
		};
	
		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			console.log('Registration attempt:', formData);
			// TODO: Implement actual registration logic
		};
	

	return (
			<div className="flex-1 flex items-center justify-center p-6">
				<Card className="w-full max-w-md bg-card/80 backdrop-blur-sm shadow-elegant border-0">
					<CardHeader className="space-y-2 text-center">
						<div className="mx-auto w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
							<ChefHat className="h-6 w-6 text-primary-foreground" />
						</div>
						<CardTitle className="text-2xl font-bold">
							{t("title")}
						</CardTitle>
						<p className="text-muted-foreground">
							{t("subtitle")}
						</p>
					</CardHeader>

					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="name">{t("name")}</Label>
								<Input
									id="name"
									type="text"
									value={formData.name}
									onChange={(e) => handleInputChange("name", e.target.value)}
									required
									className="transition-all focus:shadow-soft"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="phone">{t("phone")}</Label>
								<Input
									id="phone"
									type="tel"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									required
									className="transition-all focus:shadow-soft"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="address">{t("address")}</Label>
								<Input
									id="address"
									type="text"
									value={formData.address}
									onChange={(e) => handleInputChange("address", e.target.value)}
									required
									className="transition-all focus:shadow-soft"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">{t("email")}</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									required
									className="transition-all focus:shadow-soft"
								/>
							</div>

							<Button type="submit" className="w-full" variant="hero">
								{t("button")}
							</Button>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-muted-foreground">
								{t("hasAccount")}{" "}
								<Link
									href="/auth/login"
									className="text-primary hover:text-primary-glow font-semibold transition-colors"
								>
									{t("signIn")}
								</Link>
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
	);
};

export default Register;

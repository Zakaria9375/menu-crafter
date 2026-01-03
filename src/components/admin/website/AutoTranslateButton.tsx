"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Languages, Loader2 } from "lucide-react";
import { autoTranslateWebsiteContent } from "@/lib/db/actions/translation";
import { toast } from "sonner";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface AutoTranslateButtonProps {
	tenantId: string;
	currentLanguage: string;
	sourceLanguage: string;
	onTranslationComplete?: () => void;
}

type TranslationProvider = "google" | "libre" | "openai";

const PROVIDER_OPTIONS: {
	value: TranslationProvider;
	label: string;
	description: string;
}[] = [
	{
		value: "google",
		label: "Google Translate",
		description: "Free tier available, fast",
	},
	{
		value: "libre",
		label: "LibreTranslate",
		description: "Free & open source",
	},
	{
		value: "openai",
		label: "OpenAI GPT",
		description: "Best quality, more expensive",
	},
];

export default function AutoTranslateButton({
	tenantId,
	currentLanguage,
	sourceLanguage,
	onTranslationComplete,
}: AutoTranslateButtonProps) {
	const [isTranslating, setIsTranslating] = useState(false);
	const [showDialog, setShowDialog] = useState(false);
	const [provider, setProvider] = useState<TranslationProvider>("google");

	const handleAutoTranslate = async () => {
		if (currentLanguage === sourceLanguage) {
			toast.error("Cannot translate to the same language");
			return;
		}

		setIsTranslating(true);
		setShowDialog(false);

		try {
			const result = await autoTranslateWebsiteContent({
				tenantId,
				targetLanguage: currentLanguage,
				sourceLanguage,
				provider,
			});

			if (result.success) {
				toast.success("Content translated successfully!");
				onTranslationComplete?.();
				// Reload the page to show translated content
				window.location.reload();
			} else {
				toast.error(result.error || "Translation failed");
			}
		} catch (error) {
			console.error("Translation error:", error);
			toast.error("Failed to translate content");
		} finally {
			setIsTranslating(false);
		}
	};

	// Don't show button if on primary language
	if (currentLanguage === sourceLanguage) {
		return null;
	}

	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => setShowDialog(true)}
				disabled={isTranslating}
				className="gap-2"
			>
				{isTranslating ? (
					<>
						<Loader2 className="h-4 w-4 animate-spin" />
						Translating...
					</>
				) : (
					<>
						<Languages className="h-4 w-4" />
						Auto-Translate
					</>
				)}
			</Button>

			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Auto-Translate Content</DialogTitle>
						<DialogDescription>
							Automatically translate all website content from the primary
							language to the current language. This will overwrite any existing
							translations.
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label>Translation Provider</Label>
							<Select
								value={provider}
								onValueChange={(value) =>
									setProvider(value as TranslationProvider)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{PROVIDER_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<div>
												<div className="font-medium">{option.label}</div>
												<div className="text-xs text-muted-foreground">
													{option.description}
												</div>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<p className="text-xs text-muted-foreground">
								Choose your preferred translation service. Make sure you have
								the API key configured in your environment variables.
							</p>
						</div>

						<div className="rounded-lg border p-3 bg-muted/50">
							<p className="text-sm">
								<strong>Source:</strong> Primary language ({sourceLanguage})
								<br />
								<strong>Target:</strong> {currentLanguage}
							</p>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={() => setShowDialog(false)}>
							Cancel
						</Button>
						<Button onClick={handleAutoTranslate}>
							<Languages className="h-4 w-4 mr-2" />
							Translate Now
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}

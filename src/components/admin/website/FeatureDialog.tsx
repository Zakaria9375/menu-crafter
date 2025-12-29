"use client";

import { useState, useEffect } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IWhyUsFeature } from "@/types/website";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface FeatureDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (feature: IWhyUsFeature) => void;
	feature?: IWhyUsFeature; // undefined for add, defined for edit
}

const ICON_OPTIONS = [
	{ value: "Star", label: "Star" },
	{ value: "Award", label: "Award" },
	{ value: "Heart", label: "Heart" },
	{ value: "ThumbsUp", label: "Thumbs Up" },
	{ value: "Zap", label: "Zap" },
	{ value: "Shield", label: "Shield" },
	{ value: "Coffee", label: "Coffee" },
	{ value: "Clock", label: "Clock" },
	{ value: "Users", label: "Users" },
	{ value: "Sparkles", label: "Sparkles" },
	{ value: "Gift", label: "Gift" },
	{ value: "Flame", label: "Flame" },
];

export default function FeatureDialog({
	isOpen,
	onClose,
	onSave,
	feature,
}: FeatureDialogProps) {
	const [title, setTitle] = useState(feature?.title || "");
	const [description, setDescription] = useState(feature?.description || "");
	const [icon, setIcon] = useState(feature?.icon || "");

	useEffect(() => {
		if (feature) {
			setTitle(feature.title);
			setDescription(feature.description);
			setIcon(feature.icon || "");
		} else {
			setTitle("");
			setDescription("");
			setIcon("");
		}
	}, [feature, isOpen]);

	const handleSave = () => {
		if (!title || !description) return;
		onSave({ title, description, icon });
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						{feature ? "Edit Feature" : "Add Feature"}
					</DialogTitle>
					<DialogDescription>
						{feature
							? "Update feature details"
							: "Add a new feature to highlight"}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="feature-title">Title *</Label>
						<Input
							id="feature-title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g., Fresh Ingredients"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="feature-description">Description *</Label>
						<Textarea
							id="feature-description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Describe this feature..."
							rows={3}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="feature-icon">Icon (optional)</Label>
						<Select value={icon} onValueChange={setIcon}>
							<SelectTrigger id="feature-icon">
								<SelectValue placeholder="Choose an icon" />
							</SelectTrigger>
							<SelectContent>
								{ICON_OPTIONS.map((opt) => (
									<SelectItem key={opt.value} value={opt.value}>
										{opt.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!title || !description}>
						{feature ? "Update" : "Add"} Feature
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

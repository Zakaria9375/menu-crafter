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
import { Button } from "@/components/ui/button";
import { IFooterLink } from "@/types/website";

interface FooterLinkDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onSave: (link: IFooterLink) => void;
	link?: IFooterLink;
}

export default function FooterLinkDialog({
	isOpen,
	onClose,
	onSave,
	link,
}: FooterLinkDialogProps) {
	const [label, setLabel] = useState(link?.label || "");
	const [url, setUrl] = useState(link?.url || "");

	useEffect(() => {
		if (link) {
			setLabel(link.label);
			setUrl(link.url);
		} else {
			setLabel("");
			setUrl("");
		}
	}, [link, isOpen]);

	const handleSave = () => {
		if (!label || !url) return;
		onSave({ label, url });
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{link ? "Edit Link" : "Add Link"}</DialogTitle>
					<DialogDescription>
						{link ? "Update link details" : "Add a new footer link"}
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-4 py-4">
					<div className="space-y-2">
						<Label htmlFor="link-label">Label *</Label>
						<Input
							id="link-label"
							value={label}
							onChange={(e) => setLabel(e.target.value)}
							placeholder="e.g., Privacy Policy"
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="link-url">URL *</Label>
						<Input
							id="link-url"
							value={url}
							onChange={(e) => setUrl(e.target.value)}
							placeholder="e.g., /privacy"
						/>
					</div>
				</div>
				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button onClick={handleSave} disabled={!label || !url}>
						{link ? "Update" : "Add"} Link
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

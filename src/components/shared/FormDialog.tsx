"use client";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description?: string;
	children: React.ReactNode;
	onSubmit: () => void;
	onCancel: () => void;
	submitLabel?: string;
	isLoading?: boolean;
}

export function FormDialog({
	open,
	onOpenChange,
	title,
	description,
	children,
	onSubmit,
	onCancel,
	submitLabel = "Submit",
	isLoading = false,
}: FormDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{title}</DialogTitle>
					{description && <DialogDescription>{description}</DialogDescription>}
				</DialogHeader>
				<div className="grid gap-4 py-4">{children}</div>
				<DialogFooter>
					<Button variant="outline" onClick={onCancel} disabled={isLoading}>
						Cancel
					</Button>
					<Button onClick={onSubmit} disabled={isLoading}>
						{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{submitLabel}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

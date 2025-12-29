"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Plus } from "lucide-react";
import { ItemBadge } from "./ItemBadge";

interface SearchableSelectorProps<T> {
	label: string;
	placeholder: string;
	options: T[];
	selectedItems: T[];
	onAdd: (item: T) => void;
	onRemove: (item: T) => void;
	renderOption: (item: T) => { primary: string; secondary?: string };
	isSelected: (item: T) => boolean;
	renderBadge: (item: T) => string;
}

export function SearchableSelector<T>({
	label,
	placeholder,
	options,
	selectedItems,
	onAdd,
	onRemove,
	renderOption,
	isSelected,
	renderBadge,
}: SearchableSelectorProps<T>) {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredOptions = options.filter(
		(option) => !isSelected(option) && searchTerm.length > 0
	);

	return (
		<div className="space-y-3">
			<Label className="text-base font-medium">{label}</Label>

			{selectedItems.length > 0 && (
				<div className="flex flex-wrap gap-2 mb-3">
					{selectedItems.map((item, index) => (
						<ItemBadge
							key={index}
							label={renderBadge(item)}
							onRemove={() => onRemove(item)}
						/>
					))}
				</div>
			)}

			<div className="space-y-2">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={placeholder}
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className="pl-10"
					/>
				</div>

				{searchTerm && filteredOptions.length > 0 && (
					<div className="max-h-48 overflow-y-auto border rounded-md">
						{filteredOptions.map((option, index) => {
							const rendered = renderOption(option);
							return (
								<div
									key={index}
									className="flex items-center justify-between p-3 hover:bg-muted cursor-pointer"
									onClick={() => {
										onAdd(option);
										setSearchTerm("");
									}}
								>
									<div>
										<div className="font-medium">{rendered.primary}</div>
										{rendered.secondary && (
											<div className="text-sm text-muted-foreground">
												{rendered.secondary}
											</div>
										)}
									</div>
									<Plus className="h-4 w-4 text-muted-foreground" />
								</div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

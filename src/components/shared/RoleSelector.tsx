"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const ROLE_OPTIONS = [
	{ value: "OWNER", label: "Owner" },
	{ value: "ADMIN", label: "Admin" },
	{ value: "STAFF", label: "Staff" },
	{ value: "MEMBER", label: "Member" },
] as const;

type Role = (typeof ROLE_OPTIONS)[number]["value"];

interface RoleSelectorProps {
	value: Role;
	onChange: (value: Role) => void;
	label?: string;
	disabled?: boolean;
}

export function RoleSelector({
	value,
	onChange,
	label,
	disabled,
}: RoleSelectorProps) {
	return (
		<div className="space-y-2">
			{label && <Label>{label}</Label>}
			<Select value={value} onValueChange={onChange} disabled={disabled}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{ROLE_OPTIONS.map((role) => (
						<SelectItem key={role.value} value={role.value}>
							{role.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

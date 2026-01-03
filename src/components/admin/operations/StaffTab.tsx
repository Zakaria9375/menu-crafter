"use client";

import { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Plus,
	MoreHorizontal,
	Trash2,
	UserCog,
	Loader2,
	Shield,
} from "lucide-react";
import {
	addTenantMember,
	updateTenantMemberRole,
	removeTenantMember,
} from "@/lib/db/actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface StaffMember {
	userId: string;
	name: string | null;
	email: string;
	image: string | null;
	role: "OWNER" | "ADMIN" | "STAFF" | "MEMBER";
	joinedAt: Date;
}

interface StaffTabProps {
	tenantId: string;
	initialMembers: StaffMember[];
	currentUserEmail?: string;
}

export default function StaffTab({ tenantId, initialMembers }: StaffTabProps) {
	const [members, setMembers] = useState<StaffMember[]>(initialMembers);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedMember, setSelectedMember] = useState<StaffMember | null>(
		null
	);

	// Form states
	const [email, setEmail] = useState("");
	const [role, setRole] = useState<"ADMIN" | "STAFF" | "MEMBER">("STAFF");

	const resetForm = () => {
		setEmail("");
		setRole("STAFF");
		setSelectedMember(null);
	};

	const handleAddMember = async () => {
		if (!email) return;
		setIsLoading(true);
		try {
			const result = await addTenantMember(tenantId, email, role);

			if (result.succeeded) {
				toast.success("Member added successfully");
				// Ideally we fetch fresh list here, or optimistically add if we had all user details.
				// Since we don't have full user details (name, image) without fetching, let's just reload page or
				// for valid UX, let's trigger a refresh via router or just show success message.
				// Simplest for now: reload window to fetch fresh data
				window.location.reload();
				setIsAddDialogOpen(false);
				resetForm();
			} else {
				toast.error(result.error?.message || "Failed to add member");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdateRole = async () => {
		if (!selectedMember) return;
		setIsLoading(true);
		try {
			const result = await updateTenantMemberRole(
				tenantId,
				selectedMember.userId,
				role
			);

			if (result.succeeded) {
				setMembers(
					members.map((m) =>
						m.userId === selectedMember.userId
							? { ...m, role: role as StaffMember["role"] }
							: m
					)
				);
				toast.success("Role updated successfully");
				setIsRoleDialogOpen(false);
				resetForm();
			} else {
				toast.error(result.error?.message || "Failed to update role");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleRemoveMember = async (member: StaffMember) => {
		if (
			!confirm(
				`Are you sure you want to remove ${member.name || member.email}?`
			)
		)
			return;
		try {
			const result = await removeTenantMember(tenantId, member.userId);
			if (result.succeeded) {
				setMembers(members.filter((m) => m.userId !== member.userId));
				toast.success("Member removed successfully");
			} else {
				toast.error(result.error?.message || "Failed to remove member");
			}
		} catch (error) {
			toast.error("An error occurred");
			console.error(error);
		}
	};

	const openRoleDialog = (member: StaffMember) => {
		setSelectedMember(member);
		setRole(member.role as "ADMIN" | "STAFF" | "MEMBER");
		setIsRoleDialogOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-semibold text-foreground">Staff</h2>
					<p className="text-muted-foreground mt-1">
						Manage staff access and permissions
					</p>
				</div>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" /> Add Staff
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Team Members</CardTitle>
					<CardDescription>People with access to this tenant.</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{members.map((member) => (
								<TableRow key={member.userId}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar>
												<AvatarImage src={member.image || ""} />
												<AvatarFallback>
													{member.name?.charAt(0) ||
														member.email.charAt(0).toUpperCase()}
												</AvatarFallback>
											</Avatar>
											<div>
												<div className="font-medium">{member.name}</div>
												<div className="text-sm text-muted-foreground">
													{member.email}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Shield className="h-4 w-4 text-muted-foreground" />
											<span className="capitalize">
												{member.role.toLowerCase()}
											</span>
										</div>
									</TableCell>
									<TableCell>
										{new Date(member.joinedAt).toLocaleDateString()}
									</TableCell>
									<TableCell className="text-right">
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													variant="ghost"
													className="h-8 w-8 p-0"
													disabled={member.role === "OWNER"}
												>
													<span className="sr-only">Open menu</span>
													<MoreHorizontal className="h-4 w-4" />
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent align="end">
												<DropdownMenuLabel>Actions</DropdownMenuLabel>
												<DropdownMenuItem
													onClick={() => openRoleDialog(member)}
												>
													<UserCog className="mr-2 h-4 w-4" />
													Change Role
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() => handleRemoveMember(member)}
													className="text-destructive focus:text-destructive"
												>
													<Trash2 className="mr-2 h-4 w-4" />
													Remove Member
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Add Member Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Add Staff Member</DialogTitle>
						<DialogDescription>
							Add a new member by email address. The user must already be
							registered.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="email" className="text-right">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="col-span-3"
								placeholder="colleague@example.com"
							/>
						</div>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role" className="text-right">
								Role
							</Label>
							<Select
								value={role}
								onValueChange={(value) =>
									setRole(value as "ADMIN" | "STAFF" | "MEMBER")
								}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ADMIN">Admin</SelectItem>
									<SelectItem value="STAFF">Staff</SelectItem>
									<SelectItem value="MEMBER">Member</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsAddDialogOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button onClick={handleAddMember} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Add Member
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Role Dialog */}
			<Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Change Role</DialogTitle>
						<DialogDescription>
							Update role for {selectedMember?.name || selectedMember?.email}
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-4 py-4">
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="role-edit" className="text-right">
								Role
							</Label>
							<Select
								value={role}
								onValueChange={(value) =>
									setRole(value as "ADMIN" | "STAFF" | "MEMBER")
								}
							>
								<SelectTrigger className="col-span-3">
									<SelectValue placeholder="Select a role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ADMIN">Admin</SelectItem>
									<SelectItem value="STAFF">Staff</SelectItem>
									<SelectItem value="MEMBER">Member</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsRoleDialogOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button onClick={handleUpdateRole} disabled={isLoading}>
							{isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

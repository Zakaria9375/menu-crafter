"use client";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { User, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@radix-ui/react-avatar";
import { Session } from "next-auth";
import { Link } from "@/i18n/navigation";
import { getInitials } from "@/utils/getInitials";
import { signOutAction } from "@/lib/auth/actions";

type UserMenuProps = {
	user: Session["user"];
}
export default function UserMenu({ user }: UserMenuProps) {
	
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-10 w-10 rounded-full">
						<Avatar className="h-10 w-10">
							<AvatarImage
								src={user?.image ?? ""}
								alt={`${user?.name ?? ""}`}
							/>
							<AvatarFallback className="bg-gradient-primary text-primary-foreground">
								{getInitials(user)}
							</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-56">
					<DropdownMenuItem asChild>
						<Link href="/profile" className="flex items-center cursor-pointer">
							<User className="mr-2 h-4 w-4" />
							<span>My Profile</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => signOutAction()}
						className="flex items-center cursor-pointer"
					>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/utils/cn";

export default function NavigationLink({
	href,
	...rest
}: ComponentProps<typeof Link>) {
	const selectedLayoutSegment = useSelectedLayoutSegment();
	const pathname = selectedLayoutSegment ? `/${selectedLayoutSegment}` : "/";
	const isActive = pathname === href;

	return (
		<Link
			aria-current={isActive ? "page" : undefined}
			href={href}
			className={cn(rest.className, isActive ? "font-bold" : "font-normal", "cursor-pointer")}
			{...rest}
		/>
	);
}

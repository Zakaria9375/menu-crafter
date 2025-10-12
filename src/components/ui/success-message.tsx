import React from "react";
import { cn } from "@/utils/cn";
import { CheckCircle2 } from "lucide-react";

const SuccessMessage = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & { message: string | undefined }
>(({ className, children, message, ...props }, ref) => {
	if (!message) {
		return null;
	}

	return (
		<div
			ref={ref}
			className={cn(
				"flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 px-4 py-3 rounded-md",
				className
			)}
			{...props}
		>
			<CheckCircle2 className="h-4 w-4 flex-shrink-0" />
			<p>{message}</p>
		</div>
	);
});
SuccessMessage.displayName = "SuccessMessage";

export { SuccessMessage };


import React from "react";
import { cn } from "@/utils/cn";

const ErrorMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement> & { error: string | undefined }>(
  ({ className, children, error, ...props }, ref) => {

    if (!error) {
      return null;
    }

    return (
      <p ref={ref} className={cn("text-sm font-medium text-destructive", className)} {...props}>
        {error}
      </p>
    );
  },
);
ErrorMessage.displayName = "ErrorMessage";


export default ErrorMessage;
import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
	return (
		<textarea
			data-slot="textarea"
			className={cn(
				"glass border-white/20 placeholder:text-muted-foreground focus-visible:border-white/40 focus-visible:ring-white/30 focus-visible:ring-2 aria-invalid:ring-destructive/20 aria-invalid:border-destructive flex field-sizing-content min-h-16 w-full rounded-xl px-3 py-2 text-base transition-all duration-200 outline-none focus-visible:glass-strong disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				className
			)}
			{...props}
		/>
	)
}

export { Textarea }






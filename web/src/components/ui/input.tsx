import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<input
			type={type}
			data-slot="input"
			className={cn(
				"file:text-foreground placeholder:text-muted-foreground selection:bg-primary/30 selection:text-primary-foreground glass border-white/20 flex h-10 w-full min-w-0 rounded-xl px-4 py-2 text-base transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
				"focus-visible:border-white/40 focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:glass-strong",
				"autofill:shadow-[0_0_0_1000px_rgba(26,26,26,0.6)_inset] autofill:text-white [-webkit-text-fill-color:white]",
				"aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
				className
			)}
			{...props}
		/>
	)
}

export { Input }






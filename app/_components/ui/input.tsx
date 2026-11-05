import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/app/_utils/cn"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-10 w-full min-w-0 rounded-none border border-hairline bg-field px-3 py-2 text-base text-ink transition-colors outline-none placeholder:text-mute focus-visible:border-navy focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-navy disabled:cursor-not-allowed disabled:opacity-55 aria-invalid:border-jet-red",
        className
      )}
      {...props}
    />
  )
}

export { Input }

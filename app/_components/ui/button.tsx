import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/app/_utils/cn"

const buttonVariants = cva(
  "group/button tab-caps inline-flex shrink-0 items-center justify-center gap-2 rounded-none border-2 border-transparent text-[0.8rem] whitespace-nowrap transition-[background-color,color,border-color,transform] duration-150 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-55 aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-navy text-on-navy hover:bg-navy-deep",
        outline:
          "border-navy bg-transparent text-navy hover:bg-navy hover:text-on-navy",
        secondary: "bg-secondary text-navy hover:bg-tint",
        ghost: "text-navy hover:bg-tint",
        destructive:
          "border-jet-red bg-transparent text-jet-red hover:bg-jet-red hover:text-on-red",
        "destructive-solid": "bg-jet-red text-on-red hover:bg-jet-red-deep",
        link: "border-0 px-0 normal-case tracking-normal text-navy underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-[0.72rem]",
        lg: "h-11 px-5",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

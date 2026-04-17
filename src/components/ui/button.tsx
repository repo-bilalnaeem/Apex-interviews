import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-150 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#CAFF02]/60 focus-visible:ring-offset-1 focus-visible:ring-offset-[#0A0A0A] aria-invalid:border-[#FF4444] active:scale-[0.97]",
  {
    variants: {
      variant: {
        /* Lime CTA — primary action */
        default:
          "bg-[#CAFF02] text-black font-bold hover:bg-[#A8D900]",
        /* Dark surface — secondary action */
        outline:
          "bg-[#1E1E1E] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#CAFF02]/40 hover:bg-[#252525]",
        secondary:
          "bg-[#1E1E1E] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#CAFF02]/40 hover:bg-[#252525]",
        /* Danger */
        destructive:
          "bg-[#FF4444] text-white hover:bg-[#cc3636]",
        /* Transparent with lime text */
        ghost:
          "bg-transparent text-[#CAFF02] hover:bg-[#CAFF02]/10",
        link:
          "text-[#CAFF02] underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-xl px-6 has-[>svg]:px-4 text-base",
        icon: "size-10 rounded-xl",
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
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

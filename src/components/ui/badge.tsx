import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 w-fit whitespace-nowrap shrink-0 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        /* Generic — lime dot */
        default:    "text-[#CAFF02] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#CAFF02]",
        /* Upcoming */
        upcoming:   "text-[#CAFF02] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#CAFF02]",
        /* Active */
        active:     "text-[#34D399] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#34D399]",
        /* Processing */
        processing: "text-[#818CF8] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#818CF8]",
        /* Completed */
        completed:  "text-[#6B6B6B] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#34D399]",
        /* Cancelled */
        destructive:"text-[#FF4444] before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-[#FF4444]",
        /* Subtle pill for counts/labels */
        secondary:  "bg-[#1E1E1E] text-[#6B6B6B] border border-[#2A2A2A] px-2 py-0.5 rounded-md",
        outline:    "border border-[#2A2A2A] text-[#F5F5F5] px-2 py-0.5 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

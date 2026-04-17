import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-xl border border-[#2A2A2A] bg-[#141414] px-3 py-2 text-sm text-[#F5F5F5]",
        "placeholder:text-[#6B6B6B] selection:bg-[#CAFF02]/30 selection:text-[#F5F5F5]",
        "transition-colors duration-150 outline-none",
        "focus-visible:border-[#CAFF02] focus-visible:ring-1 focus-visible:ring-[#CAFF02]/30",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
        "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#F5F5F5]",
        "aria-invalid:border-[#FF4444] aria-invalid:ring-[#FF4444]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }

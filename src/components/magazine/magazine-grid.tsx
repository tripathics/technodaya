import { cn } from "@/lib/utils"
import React from "react"

const MagazineGrid = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithRef<"div">
>(({ children, className, ...props }, ref) => (
  <div ref={ref} {...props} className={cn(
    "grid w-full md:grid-cols-3 sm:grid-cols-2 gap-x-9 gap-y-11",
    className
  )}>
    {children}
  </div>
))

MagazineGrid.displayName = "MagezineGrid"

export { MagazineGrid }

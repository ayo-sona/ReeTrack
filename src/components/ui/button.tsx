import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4",
  {
    variants: {
      variant: {
        // This is your Primary "Sign Up" Coral
        default:
          "bg-[#F06543] text-white shadow-md hover:bg-[#D85436] active:scale-95",
        // This is your Secondary "Brand" Teal
        secondary:
          "bg-[#0D9488] text-white shadow-sm hover:bg-[#0B7A70] active:scale-95",
        // This is your "Trusted Partner" Outline
        outline:
          "border-2 border-[#0D9488] bg-transparent text-[#0D9488] hover:bg-[#0D9488] hover:text-white",
        ghost: "text-[#0D9488] hover:bg-[#0D9488]/10",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        link: "text-[#0D9488] hover:text-[#0B7A70] no-underline",
      },
      size: {
        default: "h-11 px-6 py-2", // Made slightly taller for a premium feel
        sm: "h-9 px-4 text-xs",
        lg: "h-14 rounded-full px-10 text-base", // Hero CTA size
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
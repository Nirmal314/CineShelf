import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import Image from "next/image"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-normal border-none cursor-pointer outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-black rounded-xl",
                green: "bg-green-800 rounded-xl",
                red: "bg-red-800 rounded-xl",
                yellow: "bg-yellow-600 rounded-xl",
                orange: "bg-orange-700 rounded-xl",
                blue: "bg-blue-800 rounded-xl",
                warm: "bg-[#a0522d] rounded-xl"
            },
            size: {
                default: "text-base",
                xs: "text-xs",
                sm: "text-sm",
                lg: "text-lg",
                icon: "text-base",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const buttonTopVariants = cva(
    `display-block box-border border-2 px-6 py-3 font-semibold transition-transform duration-100 ease-out transform active:translate-y-0`,
    {
        variants: {
            variant: {
                default: "bg-gray-200 text-black border-black rounded-xl",
                green: "bg-green-200 text-green-800 border-green-800 rounded-xl",
                red: "bg-red-200 text-red-800 border-red-800 rounded-xl",
                yellow: "bg-yellow-200 text-yellow-600 border-yellow-600 rounded-xl",
                orange: "bg-orange-200 text-orange-700 border-orange-700 rounded-xl",
                blue: "bg-blue-200 text-blue-800 border-blue-800 rounded-xl",
                warm: "bg-[#eae3d2] text-[#a0522d] border-[#a0522d] rounded-xl",
            },
            size: {
                default: "-translate-y-1 hover:-translate-y-1.5 px-6 py-3",
                xs: "-translate-y-0.5 hover:-translate-y-1 px-2 py-1",
                sm: "-translate-y-1 hover:-translate-y-1.5 px-4 py-2",
                lg: "-translate-y-1 hover:-translate-y-1.5 px-8 py-4",
                icon: "-translate-y-1 hover:-translate-y-1.5 p-3",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "sm",
        },
    }
)

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
    asChild?: boolean,
    icon?: string
}

function Button({
    className,
    variant,
    size,
    asChild = false,
    children,
    icon,
    ...props
}: ButtonProps) {
    const Comp = asChild ? Slot : "button"

    return (
        <Comp
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            <span className={cn(buttonTopVariants({ variant, size }), "flex items-center gap-2")}>
                {icon && <Image src={icon} className={
                    cn(
                        "shrink-0",
                        size === "xs" && "size-3",
                        size === "sm" && "size-4",
                        size === "default" && "size-5",
                        size === "lg" && "size-6",
                        size === "icon" && "size-5"
                    )
                } alt="" width={20} height={20} />}
                {children}
            </span>
        </Comp>
    )
}

export { Button, buttonVariants }
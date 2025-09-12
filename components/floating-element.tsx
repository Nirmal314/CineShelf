import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type FloatingElementProps = {
    icon: LucideIcon;
    className?: string;
    size?: "sm" | "md" | "lg";
    animation?: "float-gentle" | "float-drift" | "float-circle" | "float-wave";
    delay?: number;
}

const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12"
};

const getRandomPosition = () => {
    const top = Math.floor(Math.random() * 80) + 10; // between 10% and 90%
    const left = Math.floor(Math.random() * 80) + 10;
    return { top: `${top}%`, left: `${left}%` };
};

const FloatingElement = ({
    icon: Icon,
    className,
    size = "md",
    animation = "float-gentle",
    delay = 0
}: FloatingElementProps) => {
    const { top, left } = getRandomPosition();

    return (
        <div
            className={cn(
                "absolute opacity-30 pointer-events-none text-muted-foreground/60",
                `animate-${animation}`,
                className
            )}
            style={{
                top,
                left,
                animationDelay: `${delay}s`,
            }}
        >
            <Icon className={cn(sizeClasses[size])} />
        </div>
    );
};


export { FloatingElement };
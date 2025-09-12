import { Film, Popcorn, Ticket, Camera, Music, Play, Star, Heart, Coffee, BookOpen, Headphones } from 'lucide-react'
import { FloatingElement } from '@/components/floating-element'

const icons = [Film, Popcorn, Ticket, Camera, Music, Play, Star, Heart, Coffee, BookOpen, Headphones]

const getRandomAnimation = (): "float-gentle" | "float-drift" | "float-circle" | "float-wave" => {
    const classes = ["float-gentle", "float-drift", "float-circle", "float-wave"] as const
    return classes[Math.floor(Math.random() * classes.length)]
}

const getRandomDelay = () => (Math.random() * 6).toFixed(1)

const getRandomSize = (): "sm" | "md" | "lg" => {
    const sizes = ["sm", "md", "lg"] as const
    return sizes[Math.floor(Math.random() * sizes.length)]
}

export const getFloatingItems = (howMany: number) => {
    return Array.from({ length: howMany }, (_, i) => {
        const Icon = icons[i % icons.length]
        return (
            <FloatingElement
                key={i}
                icon={Icon}
                size={getRandomSize()}
                animation={getRandomAnimation()}
                delay={parseFloat(getRandomDelay())}
            />
        )
    })
}
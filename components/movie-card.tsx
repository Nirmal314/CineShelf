"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AspectRatio } from "./ui/aspect-ratio"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { UserMovie } from "@/types"

type MovieCardProps = {
    movie: UserMovie
    className?: string,
    disabled: boolean
}

const MovieCard = ({ movie, className, disabled }: MovieCardProps) => {
    const router = useRouter()
    const pointerStart = useRef<{ x: number, y: number } | null>(null)
    const draggingRef = useRef(false)
    const [loading, setLoading] = useState(true)

    const handlePointerDown = (e: React.PointerEvent) => {
        if (disabled) return

        pointerStart.current = { x: e.clientX, y: e.clientY }
        draggingRef.current = false
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (disabled) return

        if (!pointerStart.current) return
        const x = e.clientX - pointerStart.current.x
        const y = e.clientY - pointerStart.current.y
        const displaced = Math.sqrt(x * x + y * y)
        if (displaced > 5) draggingRef.current = true
    }

    const handleClick = (e: React.MouseEvent) => {
        if (disabled) return

        if (draggingRef.current) {
            e.preventDefault()
            return
        }

        router.push(`/movie/${movie.id}`)
    }

    return (
        <motion.div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onClick={handleClick}
            animate={{
                opacity: disabled ? 0.5 : 1,
                scale: disabled ? 0.98 : 1,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="select-none"
            style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
            <Card
                className={cn(
                    "group border-none py-0 relative overflow-hidden rounded-xl bg-paper text-charcoal shadow-lg hover:shadow-cinema transition-all",
                    className
                )}
                aria-label={`${movie.title} movie card`}
            >
                <div className="relative">
                    <AspectRatio ratio={2 / 3} className="bg-charcoal/20">
                        <AnimatePresence>
                            {loading && (
                                <motion.div
                                    key="skeleton"
                                    initial={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                                    className="absolute inset-0 rounded-xl overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-primary/30" />
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "100%" }}
                                        transition={{
                                            repeat: Infinity,
                                            duration: 1.2,
                                            ease: "linear",
                                        }}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: loading ? 0.95 : 1, opacity: loading ? 0 : 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            className="w-full h-full"
                        >
                            <Image
                                src={movie.poster || "/placeholder.svg"}
                                alt={`${movie.title} poster`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                style={{ objectFit: "cover" }}
                                onLoad={() => setLoading(false)}
                                priority={false}
                            />
                        </motion.div>
                    </AspectRatio>

                    <div className="absolute inset-0 z-20" />
                </div>
            </Card>
        </motion.div>
    )
}

export default MovieCard

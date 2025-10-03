"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { AspectRatio } from "./ui/aspect-ratio"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Check } from "lucide-react"

type MovieCardProps = {
    movie: {
        id: string;
        title: string;
        poster: string | null;
    }
    className?: string
    deleteMode?: boolean
    selected?: boolean
    onSelect?: () => void
}

const MovieCard = ({ movie, className, deleteMode = false, selected = false, onSelect }: MovieCardProps) => {
    const router = useRouter()
    const pointerStart = useRef<{ x: number, y: number } | null>(null)
    const draggingRef = useRef(false)
    const [loading, setLoading] = useState(true)

    const handlePointerDown = (e: React.PointerEvent) => {
        pointerStart.current = { x: e.clientX, y: e.clientY }
        draggingRef.current = false
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!pointerStart.current) return
        const x = e.clientX - pointerStart.current.x
        const y = e.clientY - pointerStart.current.y
        const displaced = Math.sqrt(x * x + y * y)
        if (displaced > 5) draggingRef.current = true
    }

    const handleClick = (e: React.MouseEvent) => {
        if (draggingRef.current) {
            e.preventDefault()
            return
        }
        if (deleteMode && onSelect) {
            onSelect()
            return
        }
        router.push(`/movie/${movie.id}`)
    }

    return (
        <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onClick={handleClick}
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

                    {!deleteMode && !selected && <div className="absolute inset-0 z-20" />}

                    <AnimatePresence>
                        {deleteMode && selected && (
                            <motion.div
                                key="overlay"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="absolute inset-0 bg-primary/60 flex items-center justify-center z-20 rounded-xl"
                            >
                                <Check className="w-12 h-12 text-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </Card>
        </div>
    )
}

export default MovieCard

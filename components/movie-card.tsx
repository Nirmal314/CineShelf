import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Movie } from "@/types"
import Image from "next/image"

type MovieCardProps = {
    movie: Movie
    className?: string
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
    const formattedDuration = `${Math.floor(movie.durationInMinutes / 60)}h ${movie.durationInMinutes % 60}m`
    const releasedYear = movie.released.getFullYear()

    return (
        <Card
            className={cn(
                "group py-0 relative overflow-hidden rounded-xl bg-paper text-charcoal shadow-soft hover:shadow-cinema transition-all",
                className,
            )}
            aria-label={`${movie.title} movie card`}
        >
            <div className="relative">
                <div className="aspect-[2/3] w-full bg-charcoal/20">
                    <Image
                        src={movie.poster || "/placeholder.svg"}
                        alt={`${movie.title} poster`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        style={{ objectFit: "cover" }}
                        priority={false}
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL={movie.poster || "/placeholder.svg"}
                    />
                </div>

                <div className="absolute inset-0 z-20">

                </div>
            </div>
        </Card>
    )
}

export default MovieCard
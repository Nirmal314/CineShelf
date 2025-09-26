import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Movie } from "@/types"

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
                    <img
                        src={movie.poster || "/placeholder.svg"}
                        alt={`${movie.title} poster`}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>

                <div className="group-hover:hidden pointer-events-none absolute inset-x-0 bottom-0 z-10">
                    <div className="m-3 rounded-md bg-paper/80 p-3 backdrop-blur-md shadow-2xs">
                        <h3 className="text-base font-semibold leading-tight text-wood">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">Directed by {movie.director}</p>
                        <div className="flex flex-wrap gap-1">
                            {movie.genre.split(",").map((g) => (
                                <Badge
                                    key={g.trim()}
                                    variant="secondary"
                                    className="bg-warm-2/20 text-warm-1 border border-warm-2/30 px-2 py-0.5 text-[0.65rem]"
                                >
                                    {g.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Minimal info bar (always visible, hidden on hover) */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 hidden group-hover:hidden">
                    <div className="m-3 rounded-md bg-paper/90 p-3 backdrop-blur-md shadow-2xs">
                        <h3 className="text-base font-semibold leading-tight text-wood">{movie.title}</h3>
                        <p className="text-xs text-muted-foreground mb-1">Directed by {movie.director}</p>
                        <div className="flex flex-wrap gap-1">
                            {movie.genre.split(",").map((g) => (
                                <Badge
                                    key={g.trim()}
                                    variant="secondary"
                                    className="bg-warm-2/20 text-warm-1 border border-warm-2/30 px-2 py-0.5 text-[0.65rem]"
                                >
                                    {g.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 z-20 flex flex-col justify-end bg-gradient-to-t from-paper/90 via-paper/70 to-transparent p-4 opacity-0 backdrop-blur-sm transition-all duration-300 ease-out group-hover:opacity-100">
                    <div className="mt-auto space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <h3 className="text-lg font-semibold leading-tight text-charcoal">{movie.title}</h3>
                            <span className="inline-flex items-center rounded-md bg-warm-1 px-2.5 py-1 text-xs font-medium text-paper shadow-xs">
                                IMDb {movie.imdbRating}
                            </span>
                        </div>

                        <p className="text-sm leading-relaxed text-charcoal">{movie.plot}</p>

                        <div className="grid grid-cols-2 gap-3 text-xs text-charcoal">
                            <div className="space-y-1">
                                <span className="block font-medium text-warm-2">Released</span>
                                <span>{releasedYear}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="block font-medium text-warm-2">Duration</span>
                                <span>{formattedDuration}</span>
                            </div>
                            <div className="col-span-2 space-y-1">
                                <span className="block font-medium text-warm-2">Director</span>
                                <span>{movie.director}</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-1">
                            {movie.genre.split(",").map((g) => (
                                <Badge
                                    key={g.trim()}
                                    variant="secondary"
                                    className="bg-warm-2/20 text-warm-1 border border-warm-2/50 px-2 py-1 text-[0.7rem]"
                                >
                                    {g.trim()}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    )
}

export default MovieCard
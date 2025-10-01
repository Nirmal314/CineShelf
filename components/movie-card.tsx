"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Movie } from "@/types"
import Image from "next/image"
import { AspectRatio } from "./ui/aspect-ratio"
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable"

type MovieCardProps = {
    movie: Movie
    className?: string
}

const MovieCard = ({ movie, className }: MovieCardProps) => {
    const formattedDuration = `${Math.floor(movie.durationInMinutes / 60)}h ${movie.durationInMinutes % 60
        }m`
    const releasedYear = movie.released.getFullYear()

    const pointerStart = useRef<{ x: number, y: number } | null>(null)
    const draggingRef = useRef(false)

    const handlePointerDown = (e: React.PointerEvent) => {
        // mark initial coordinates

        pointerStart.current = { x: e.clientX, y: e.clientY }
        draggingRef.current = false
    }

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!pointerStart.current) return

        const x = e.clientX - pointerStart.current.x
        const y = e.clientY - pointerStart.current.y

        const displaced = Math.sqrt(x * x + y * y);

        if (displaced > 5) { // threshold for drag
            draggingRef.current = true
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        if (draggingRef.current) {
            e.preventDefault()
            return
        }
    }

    return (
        <Drawer>
            <DrawerTrigger asChild
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onClick={handleClick}>
                <Card
                    className={cn(
                        "group border-none py-0 relative overflow-hidden rounded-xl bg-paper text-charcoal shadow-lg hover:shadow-cinema transition-all",
                        className,
                    )}
                    aria-label={`${movie.title} movie card`}
                >
                    <div className="relative">
                        <AspectRatio ratio={2 / 3} className="bg-charcoal/20">
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
                        </AspectRatio>

                        <div className="absolute inset-0 z-20"></div>
                    </div>
                </Card>
            </DrawerTrigger>

            <DrawerContent className="h-[90vh] flex flex-col">
                <DrawerHeader>
                    <DrawerTitle className="text-xl font-bold">{movie.title}</DrawerTitle>
                    <DrawerDescription>
                        {releasedYear} • {movie.genre} • {formattedDuration}
                    </DrawerDescription>
                </DrawerHeader>

                <ResizablePanelGroup
                    direction="horizontal"
                    className="flex flex-1 h-full gap-6 px-4"
                >
                    <ResizablePanel
                        defaultSize={100}
                        className="flex-shrink-0 w-full"
                    >
                        <Card className="flex flex-col sm:flex-row shadow-cinema rounded-xl overflow-hidden h-full">
                            {/* <CardContent className="px-0 py-0 sm:w-1/2 relative">
                                <Image
                                    src={movie.poster}
                                    alt={movie.title}
                                    fill
                                    className="object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
                                />
                            </CardContent> */}

                            <div className="sm:w-1/2 flex flex-col justify-between">
                                <CardHeader className="pt-6 px-4">
                                    <CardTitle className="text-2xl font-bold text-foreground">{movie.title}</CardTitle>
                                    <CardDescription className="text-sm text-muted-foreground">
                                        {new Date(movie.released).getFullYear()} • {movie.genre} • {Math.floor(movie.durationInMinutes / 60)}h {movie.durationInMinutes % 60}m
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-4 py-2 space-y-3 overflow-y-auto text-sm text-muted-foreground flex-1">
                                    <p>{movie.plot}</p>

                                    <div>
                                        <p className="font-medium text-foreground">Director:</p>
                                        <p>{movie.director}</p>
                                    </div>

                                    <div>
                                        <p className="font-medium text-foreground">IMDb Rating:</p>
                                        <p>
                                            {movie.imdbRating} ({movie.imdbVotes} votes)
                                        </p>
                                    </div>

                                    <div>
                                        <p className="font-medium text-foreground">Ratings:</p>
                                        <ul className="list-disc list-inside">
                                            {movie.ratings.map((r) => (
                                                <li key={r.source}>
                                                    {r.source}: {r.value}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>
                            </div>
                        </Card>
                    </ResizablePanel>

                    {/* <ResizableHandle /> */}

                    <ResizablePanel defaultSize={0} className="bg-transparent" />
                </ResizablePanelGroup>


                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default MovieCard

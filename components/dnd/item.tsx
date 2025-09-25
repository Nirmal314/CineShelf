"use client"

import React, { forwardRef, HTMLAttributes } from "react"
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card"

export type MovieCardProps = HTMLAttributes<HTMLDivElement> & {
    id: string
    name: string
    description: string
    genre: string
    imdbRating: number
    director: string
    musicComposer: string
    year: number
    duration: string
    withOpacity?: boolean
    isDragging?: boolean
}

const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
    (
        {
            id,
            name,
            description,
            genre,
            imdbRating,
            director,
            musicComposer,
            year,
            duration,
            withOpacity,
            isDragging,
            className,
            ...props
        },
        ref
    ) => {
        return (
            <Card
                ref={ref}
                className={`
          w-full max-w-xs mx-auto 
          rounded-xl shadow-md transition-transform 
          ${isDragging ? "scale-105 shadow-lg cursor-grabbing" : "cursor-grab"} 
          ${withOpacity ? "opacity-50" : "opacity-100"} 
          ${className}
        `}
                {...props}
            >
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                        {genre} • {year}
                    </p>
                </CardHeader>
                <CardContent className="space-y-1">
                    <p className="text-sm mb-2 line-clamp-3">{description}</p>
                    <p className="text-sm">
                        <span className="font-medium">Director:</span> {director}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Music:</span> {musicComposer}
                    </p>
                    <p className="text-sm">
                        <span className="font-medium">Duration:</span> {duration}
                    </p>
                </CardContent>
                <CardFooter className="flex justify-between text-sm font-medium">
                    <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                        ⭐ {imdbRating}/10
                    </span>
                    <span className="text-muted-foreground">ID: {id}</span>
                </CardFooter>
            </Card>
        )
    }
)

MovieCard.displayName = "MovieCard"

export default MovieCard

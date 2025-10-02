"use client"

import React, { useEffect, useRef } from 'react'
import { createSwapy, Swapy } from 'swapy'
import MovieCard from '../movie-card'

type Movie = {
    userId?: string;
    movieId: string;
    title: string;
    poster: string | null;
}

const UserMovies = ({ initialMovies }: {
    initialMovies: Movie[]
}) => {
    const swapy = useRef<Swapy | null>(null)
    const container = useRef<HTMLDivElement | null>(null)

    const cards = initialMovies

    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current, {
                animation: "spring",
                autoScrollOnDrag: true
            })
            // swapy.current.onSwap((event) => {})
            // swapy.current.onSwapStart((event) => {})
            // swapy.current.onSwapEnd((event) => {})
        }
        return () => swapy.current?.destroy()
    }, [cards])

    return (
        <div
            ref={container}
            className="grid 
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            gap-6 items-stretch"
        >
            {cards.map((movie) => (
                <div
                    key={movie.movieId}
                    data-swapy-slot={movie.movieId}
                    className="flex h-full"
                >
                    <div
                        data-swapy-item={movie.movieId}
                        className="cursor-grab active:cursor-grabbing w-full"
                    >
                        <MovieCard movie={movie} className='min-w-56' />
                    </div>
                </div>
            ))}
        </div>

    )
}

export default UserMovies

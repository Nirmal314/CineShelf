"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createSwapy, Swapy } from 'swapy'
import MovieCard from '../movie-card'
import { deleteMovies } from '@/actions/movies'
import { Button } from '../ui/cool-button'

type Movie = {
    id: string;
    title: string;
    poster: string | null;
}

const UserMovies = ({ initialMovies }: { initialMovies: Movie[] }) => {
    const swapy = useRef<Swapy | null>(null)
    const container = useRef<HTMLDivElement | null>(null)
    const movies = initialMovies
    const [deleteMode, setDeleteMode] = useState(false)
    const [selectedMovies, setSelectedMovies] = useState<string[]>([])

    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current, {
                animation: "spring",
                autoScrollOnDrag: true,
                enabled: !deleteMode,
            })
        }
        return () => swapy.current?.destroy()
    }, [movies, deleteMode])

    const toggleMovieSelection = (movieId: string) => {
        if (!deleteMode) return

        const newSet = new Set(selectedMovies)
        if (newSet.has(movieId)) newSet.delete(movieId)
        else newSet.add(movieId)

        setSelectedMovies(Array.from(newSet))
    }

    // const handleDelete = async () => {
    //     const success = await deleteMovies(selectedMovies)

    //     if (success) {
    //         setSelectedMovies([])
    //         setDeleteMode(false)
    //     }
    // }

    const handleCancel = () => {
        setSelectedMovies([])
        setDeleteMode(false)
    }

    return (
        <div>
            {/* <div className="flex gap-2 mb-4">
                {!deleteMode && (
                    <Button
                        onClick={() => setDeleteMode(true)}
                        variant="red"
                    >
                        Delete Movies
                    </Button>
                )}
                {deleteMode && (
                    <>
                        <Button
                            variant="red"
                            onClick={handleDelete}
                            disabled={selectedMovies.length === 0}
                        >
                            Delete Selected ({selectedMovies.length})
                        </Button>
                        <Button
                            variant="warm"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </>
                )}
            </div> */}
            <div
                ref={container}
                className="grid 
                grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
                gap-6 items-stretch"
            >
                {movies.map((movie) => (
                    <div
                        key={movie.id}
                        data-swapy-slot={movie.id}
                        className="flex h-full"
                    >
                        <div
                            data-swapy-item={movie.id}
                            className="cursor-grab active:cursor-grabbing w-full"
                        >
                            <MovieCard
                                movie={movie}
                                className='min-w-56'
                                deleteMode={deleteMode}
                                selected={selectedMovies.includes(movie.id)}
                                onSelect={() => toggleMovieSelection(movie.id)}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserMovies

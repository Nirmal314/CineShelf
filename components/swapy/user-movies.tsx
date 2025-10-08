"use client"

import React, { useEffect, useRef, useState } from 'react'
import { createSwapy, Swapy } from 'swapy'
import MovieCard from '../movie-card'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu'
import { Clapperboard, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { removeMovie } from '@/actions/movies'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'

type Movie = {
    id: string;
    title: string;
    poster: string | null;
}

const UserMovies = ({ initialMovies }: { initialMovies: Movie[] }) => {
    const swapy = useRef<Swapy | null>(null)
    const container = useRef<HTMLDivElement | null>(null)
    const movies = initialMovies
    const [open, setOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)

    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current, {
                animation: "spring",
                autoScrollOnDrag: true,
            })
        }
        return () => swapy.current?.destroy()
    }, [movies])

    const confirm = (movie: Movie) => {
        setSelectedMovie(movie)
        setOpen(true)
    }

    const handleRemove = async () => {
        if (!selectedMovie) return

        try {
            await removeMovie(selectedMovie.id)
        } catch (error) {
            console.error("Failed to delete movie:", error)
            alert("Failed to delete movie. Please try again.")
        } finally {
            setOpen(false)
            setSelectedMovie(null)
        }
    }

    return (
        <div>
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
                            <ContextMenu>
                                <ContextMenuTrigger>
                                    <MovieCard
                                        movie={movie}
                                        className='min-w-56'
                                    />
                                </ContextMenuTrigger>
                                <ContextMenuContent>
                                    <ContextMenuItem variant='destructive'>
                                        <Trash2 className='mr-1' />
                                        <button onClick={() => confirm(movie)}>Remove</button>
                                    </ContextMenuItem>
                                    <ContextMenuItem>
                                        <Clapperboard className='mr-1' />
                                        <Link href={`https://www.imdb.com/title/${movie.id}`} target='_blank'>IMDb</Link>
                                    </ContextMenuItem>
                                </ContextMenuContent>
                            </ContextMenu>
                        </div>
                    </div>
                ))}
            </div>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className='bg-secondary'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='mb-6 text-2xl'>One less movie on the shelf?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You’re about to remove <span className='font-bold'>{selectedMovie?.title}</span> from your shelf. <br />
                            It’ll be gone for now, but you can always bring it back later!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleRemove}>
                            Yes, Remove
                        </AlertDialogAction>
                        <AlertDialogCancel className='!bg-primary/10 hover:!bg-primary/15 transition-colors duration-200 border !border-primary'>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div>
    )
}

export default UserMovies

"use client"

import React, { useId, useState, useEffect } from 'react'
import { DndContext, closestCenter, DragEndEvent, useSensors, useSensor, PointerSensor } from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import MovieCard from '../movie-card'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '../ui/context-menu'
import { Clapperboard, Trash2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { removeMovie, shiftMovies } from '@/actions/movies'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { tryCatch } from '@/lib/try-catch'
import { UserMovie } from '@/types'
import { toast } from 'sonner'

const SortableMovieItem = ({ movie, swapping, onRemove, isRemoving }: { movie: UserMovie, swapping: boolean, onRemove: (m: UserMovie) => void, isRemoving?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: movie.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition: transition || 'transform 250ms ease',
        zIndex: isDragging ? 9999 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className={`flex h-full transition-all duration-300 ${isRemoving ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}>
            <ContextMenu>
                <ContextMenuTrigger>
                    <MovieCard
                        movie={movie}
                        className='min-w-40 md:min-w-56 cursor-grab active:cursor-grabbing w-full'
                        disabled={swapping}
                    />
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem variant='destructive' onClick={() => onRemove(movie)}>
                        <Trash2 className='mr-1' />
                        Remove
                    </ContextMenuItem>
                    <ContextMenuItem>
                        <Clapperboard className='mr-1' />
                        <Link href={`https://www.imdb.com/title/${movie.id}`} target='_blank'>IMDb</Link>
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}

const UserMovies = ({ movies: initialMovies }: { movies: UserMovie[] }) => {
    const id = useId()
    const [movies, setMovies] = useState<UserMovie[]>(initialMovies)
    const [movieToRemove, setMovieToRemove] = useState<UserMovie | null>(null)

    useEffect(() => {
        setMovies(initialMovies)
    }, [initialMovies])

    const [open, setOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<UserMovie | null>(null)
    const [swapping, setSwapping] = useState(false)
    const [isRemoving, setIsRemoving] = useState(false)
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 0.1
            }
        })
    )

    const confirm = (movie: UserMovie) => {
        setSelectedMovie(movie)
        setOpen(true)
    }

    const handleRemove = async () => {
        if (!selectedMovie) return
        setIsRemoving(true)
        const { error } = await tryCatch(removeMovie(selectedMovie.id))
        if (error) {
            toast.error(error.message || "Failed to delete movie.")
            setIsRemoving(false)
            return
        }

        toast.success(`"${selectedMovie.title}" removed from your shelf!`)
        setMovieToRemove(selectedMovie)
        setOpen(false)

        setTimeout(() => {
            setMovies(prev => prev.filter(m => m.id !== selectedMovie.id))
            setSelectedMovie(null)
            setIsRemoving(false)
            setMovieToRemove(null)
        }, 300)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const prevMovies = movies;

        const oldIndex = movies.findIndex(m => m.id === active.id)
        const newIndex = movies.findIndex(m => m.id === over.id)

        setSwapping(true)

        setMovies(arrayMove(movies, oldIndex, newIndex))

        const { error } = await tryCatch(shiftMovies(active.id.toString(), over.id.toString()))

        if (error) {
            toast.error(error.message || "Swap failed!")
            setMovies(prevMovies)
        }

        setSwapping(false)
    }

    return (
        <div>
            {movies.length === 0 && !movieToRemove ? (
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                    <p className="text-lg">No movies added yet!</p>
                    <p className="text-sm">Start by searching and adding your favorite films.</p>
                </div>
            ) : (
                <DndContext
                    id={id} // Fixes hydration
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    sensors={sensors}
                >
                    <SortableContext
                        items={movies.map(m => m.id)}
                        strategy={rectSortingStrategy}
                    >
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
                            {movies.map((movie) => (
                                <SortableMovieItem key={movie.id} movie={movie} swapping={swapping} onRemove={confirm} isRemoving={movie.id === movieToRemove?.id} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            <AlertDialog open={open} onOpenChange={(o) => !isRemoving && setOpen(o)}>
                <AlertDialogContent className='bg-secondary'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='mb-6 text-2xl'>One less movie on the shelf?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You’re about to remove <span className='font-bold'>{selectedMovie?.title}</span> from your shelf. <br />
                            It’ll be gone for now, but you can always bring it back later!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex-col'>
                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleRemove} disabled={isRemoving}>
                            {isRemoving && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                            Yes, Remove
                        </AlertDialogAction>
                        <AlertDialogCancel className='!bg-primary/10 hover:!bg-primary/15 transition-colors duration-200 border !border-primary' disabled={isRemoving}>Cancel</AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default UserMovies

"use client"

import React, { useId, useState } from 'react'
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
import { Clapperboard, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { removeMovie, shiftMovies } from '@/actions/movies'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { tryCatch } from '@/lib/try-catch'
import { UserMovie } from '@/types'
import { toast } from 'sonner'

const SortableMovieItem = ({ movie, swapping, onRemove }: { movie: UserMovie, swapping: boolean, onRemove: (m: UserMovie) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: movie.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 9999 : 1,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="flex h-full">
            <ContextMenu>
                <ContextMenuTrigger>
                    <MovieCard
                        movie={movie}
                        className='min-w-56 cursor-grab active:cursor-grabbing w-full'
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
    const [open, setOpen] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<UserMovie | null>(null)
    const [swapping, setSwapping] = useState(false)
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
        const res = await tryCatch(removeMovie(selectedMovie.id))
        if (res.error) {
            console.error("Failed to delete movie:", res.error)
            toast.error(res.error.message || "Failed to delete movie.")
        } else {
            setMovies(prev => prev.filter(m => m.id !== selectedMovie.id))
        }
        setOpen(false)
        setSelectedMovie(null)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const prevMovies = movies;

        const oldIndex = movies.findIndex(m => m.id === active.id)
        const newIndex = movies.findIndex(m => m.id === over.id)

        setSwapping(true)

        setMovies(arrayMove(movies, oldIndex, newIndex))

        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(0)
            }, 2000);
        })

        const res = await tryCatch(shiftMovies(active.id.toString(), over.id.toString()))

        if (res.error) {
            console.error("Swap failed:", res.error)
            toast.error(res.error.message || "Swap failed!")
            setMovies(prevMovies)
        }

        setSwapping(false)
    }

    return (
        <div>
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
                        {movies.map((movie) => (
                            <SortableMovieItem key={movie.id} movie={movie} swapping={swapping} onRemove={confirm} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent className='bg-secondary'>
                    <AlertDialogHeader>
                        <AlertDialogTitle className='mb-6 text-2xl'>One less movie on the shelf?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You’re about to remove <span className='font-bold'>{selectedMovie?.title}</span> from your shelf. <br />
                            It’ll be gone for now, but you can always bring it back later!
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='flex-col'>
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

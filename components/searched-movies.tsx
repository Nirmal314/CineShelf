"use client"

import type { SearchedMovie } from "@/types"
import { useEffect, useState } from "react"
import { X, Plus, Star, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/cool-button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { addMovie } from "@/actions/movies"
import { tryCatch } from "@/lib/try-catch"
import { toast } from "sonner"

type Props = {
    movies: SearchedMovie[] | null
    error: Error | null
}

const SearchedMovies = ({ movies, error }: Props) => {
    const [open, setOpen] = useState(false)
    const [loadingMovieId, setLoadingMovieId] = useState<string | null>(null)

    useEffect(() => {
        if (movies !== null || error !== null) {
            setOpen(true)
        }
    }, [movies, error])

    const handleAddMovie = async (movie: SearchedMovie) => {
        setLoadingMovieId(movie.id)
        const { error } = await tryCatch(addMovie({
            id: movie.id,
            title: movie.primaryTitle,
            poster: movie.primaryImage?.url,
        }));
        setLoadingMovieId(null)

        if (error) {
            toast.error(error.message || "Failed to add movie.");
            return;
        }

        toast.success(`"${movie.primaryTitle}" added to your shelf.`);
        setOpen(false)
    }

    if (!open) return null

    const isAdding = loadingMovieId !== null

    return (
        <AlertDialog open={open} onOpenChange={(o) => !isAdding && setOpen(o)}>
            <AlertDialogContent className="w-full sm:max-w-xl max-h-[90vh] rounded-xl bg-secondary border-none flex flex-col">
                <AlertDialogHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <AlertDialogTitle>Search Results</AlertDialogTitle>
                            {movies && <AlertDialogDescription>{movies.length} movies found</AlertDialogDescription>}
                        </div>
                        <button
                            className="p-2 rounded-full hover:bg-accent transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
                            onClick={() => setOpen(false)}
                            disabled={isAdding}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </AlertDialogHeader>

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-lg mb-4">
                        Error: {error.message}
                    </div>
                )}

                {movies && movies.length > 0 ? (
                    <div className="overflow-y-auto px-2 sm:px-0 no-scrollbar">
                        {movies.map((m) => (
                            <Card key={m.id} className="w-full py-0 sm:flex-row sm:gap-0 mb-4 overflow-hidden border-none shadow-xl">
                                <CardContent className="px-0 sm:w-1/3">
                                    {m.primaryImage?.url ? (
                                        <div className="relative h-full w-full bg-muted">
                                            <img
                                                src={m.primaryImage.url}
                                                alt={m.primaryTitle}
                                                className="size-full object-cover
                                                rounded-tl-xl
                                                rounded-tr-xl sm:rounded-tr-none
                                                rounded-bl-none sm:rounded-bl-xl"
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center bg-muted rounded-xl">
                                            <p className="text-muted-foreground text-sm">No image</p>
                                        </div>
                                    )}
                                </CardContent>
                                <div className="w-full sm:w-2/3 flex flex-col">
                                    <CardHeader className="pt-6">
                                        <CardTitle className="line-clamp-2">{m.primaryTitle}</CardTitle>
                                        {m.originalTitle && m.originalTitle !== m.primaryTitle && (
                                            <CardDescription className="line-clamp-1">{m.originalTitle}</CardDescription>
                                        )}
                                        <div className="flex items-center gap-2 text-sm mt-2">
                                            <span className="text-muted-foreground">{m.startYear || "N/A"}</span>
                                            {m.rating?.aggregateRating && (
                                                <div className="flex items-center gap-1 ml-auto">
                                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                    <span className="font-medium">{m.rating.aggregateRating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                        {m.rating?.voteCount && (
                                            <p className="text-xs text-muted-foreground">
                                                {m.rating.voteCount.toLocaleString()} votes
                                            </p>
                                        )}
                                    </CardHeader>
                                    <CardFooter className="py-4 mt-auto">
                                        <Button size="xs" onClick={() => handleAddMovie(m)} disabled={loadingMovieId === m.id}>
                                            {loadingMovieId === m.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                            Add
                                        </Button>
                                    </CardFooter>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    !error && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No results found.</p>
                        </div>
                    )
                )}
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default SearchedMovies

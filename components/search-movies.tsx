"use client"

import React from "react"
import { useActionState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/cool-button"
import { searchMovies } from "@/actions/movies"
import SearchedMovies from "./searched-movies"

const SearchMovies = () => {
    const [state, formAction, isPending] = useActionState(searchMovies, {
        data: null,
        error: null,
    })

    return (
        <>
            <form action={formAction} className="w-full flex space-x-2 mb-4">
                <Input
                    name="movie"
                    className="border border-primary"
                    placeholder="Search movies or shows..."
                />
                <Button disabled={isPending} variant="warm" size="sm">
                    {isPending ? "Searching..." : "Search"}
                </Button>
            </form>

            <SearchedMovies movies={state.data} error={state.error} />
        </>
    )
}

export default SearchMovies

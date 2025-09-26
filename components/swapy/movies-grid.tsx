"use client"

import { Movie } from '@/types'
import React, { useEffect, useRef, useState } from 'react'
import { createSwapy, Swapy } from 'swapy'
import MovieCard from '../movie-card'

const MoviesGrid = () => {
    const swapy = useRef<Swapy | null>(null)
    const container = useRef<HTMLDivElement | null>(null)

    const [cards, setCards] = useState<Movie[]>([
        {
            title: "Inception",
            imdbID: "tt1375666",
            poster: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
            plot: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
            genre: "Action, Adventure, Sci-Fi",
            director: "Christopher Nolan",
            released: new Date("2010-07-16"),
            durationInMinutes: 148,
            imdbRating: "8.8",
            ratings: [
                { source: "Internet Movie Database", value: "8.8/10" },
                { source: "Rotten Tomatoes", value: "87%" },
                { source: "Metacritic", value: "74/100" }
            ],
            imdbVotes: "2,234,567",
            type: "movie"
        },
        {
            title: "Interstellar",
            imdbID: "tt0816692",
            poster: "https://m.media-amazon.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_SX300.jpg",
            plot: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
            genre: "Adventure, Drama, Sci-Fi",
            director: "Christopher Nolan",
            released: new Date("2014-11-07"),
            durationInMinutes: 169,
            imdbRating: "8.6",
            ratings: [
                { source: "Internet Movie Database", value: "8.6/10" },
                { source: "Rotten Tomatoes", value: "73%" },
                { source: "Metacritic", value: "74/100" }
            ],
            imdbVotes: "1,900,000",
            type: "movie"
        },
        {
            title: "Tenet",
            imdbID: "tt6723592",
            poster: "https://m.media-amazon.com/images/M/MV5BMTU0ZjZlYTUtYzIwMC00ZmQzLWEwZTAtZWFhMWIwYjMxY2I3XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "Armed with only one word, Tenet, and fighting for the survival of the entire world, a protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.",
            genre: "Action, Sci-Fi, Thriller",
            director: "Christopher Nolan",
            released: new Date("2020-09-03"),
            durationInMinutes: 150,
            imdbRating: "7.3",
            ratings: [
                { source: "Internet Movie Database", value: "7.3/10" },
                { source: "Rotten Tomatoes", value: "69%" },
                { source: "Metacritic", value: "69/100" }
            ],
            imdbVotes: "400,000",
            type: "movie"
        },
        {
            title: "Dune: Part Two",
            imdbID: "tt15239678",
            poster: "https://m.media-amazon.com/images/M/MV5BNTc0YmQxMjEtODI5MC00NjFiLTlkMWUtOGQ5NjFmYWUyZGJhXkEyXkFqcGc@._V1_SX300.jpg",
            plot: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            genre: "Action, Adventure, Drama",
            director: "Denis Villeneuve",
            released: new Date("2024-03-01"),
            durationInMinutes: 166,
            imdbRating: "8.8",
            ratings: [
                { source: "Internet Movie Database", value: "8.8/10" },
                { source: "Rotten Tomatoes", value: "92%" },
                { source: "Metacritic", value: "79/100" }
            ],
            imdbVotes: "600,000",
            type: "movie"
        },
        {
            title: "Oppenheimer",
            imdbID: "tt15398776",
            poster: "https://m.media-amazon.com/images/M/MV5BN2JkMDc5MGQtZjg3YS00NmFiLWIyZmQtZTJmNTM5MjVmYTQ4XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
            genre: "Biography, Drama, History",
            director: "Christopher Nolan",
            released: new Date("2023-07-21"),
            durationInMinutes: 180,
            imdbRating: "8.4",
            ratings: [
                { source: "Internet Movie Database", value: "8.4/10" },
                { source: "Rotten Tomatoes", value: "93%" },
                { source: "Metacritic", value: "88/100" }
            ],
            imdbVotes: "1,200,000",
            type: "movie"
        }
    ])


    useEffect(() => {
        if (container.current) {
            swapy.current = createSwapy(container.current, {
                animation: "spring",
                autoScrollOnDrag: true
            })
            swapy.current.onSwap((event) => console.log("swap", event))
        }
        return () => swapy.current?.destroy()
    }, [cards])

    const addCard = (movie?: Movie) => {
        if (!movie) return
        setCards([...cards, { ...movie }])
    }

    return (
        <div
            ref={container}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch border-4 border-blue-500 p-2"
        >
            {cards.map((movie) => (
                <div
                    key={movie.imdbID}
                    data-swapy-slot={movie.imdbID}
                    className="flex h-full"
                >
                    <div
                        data-swapy-item={movie.imdbID}
                        className="cursor-grab active:cursor-grabbing w-full"
                    >
                        <MovieCard movie={movie} />
                    </div>
                </div>
            ))}
        </div>

    )
}

export default MoviesGrid

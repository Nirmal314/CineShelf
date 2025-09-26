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
        },
        {
            title: "The Matrix",
            imdbID: "tt0133093",
            poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZmFjLWEzYjMtOTQ3Y2E0ZjZhZGM3XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
            genre: "Action, Sci-Fi",
            director: "The Wachowskis",
            released: new Date("1999-03-31"),
            durationInMinutes: 136,
            imdbRating: "8.7",
            ratings: [
                { source: "Internet Movie Database", value: "8.7/10" },
                { source: "Rotten Tomatoes", value: "88%" },
                { source: "Metacritic", value: "73/100" }
            ],
            imdbVotes: "1,900,000",
            type: "movie"
        },
        {
            title: "Blade Runner",
            imdbID: "tt0083658",
            poster: "https://m.media-amazon.com/images/M/MV5BZjhkZTMwNmQtNjk5Ny00YmEzLWE5OTUtMWQ5YjliNmE4OGQ3XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "A blade runner must pursue and terminate four replicants who stole a ship in space and have returned to Earth.",
            genre: "Sci-Fi, Thriller",
            director: "Ridley Scott",
            released: new Date("1982-06-25"),
            durationInMinutes: 117,
            imdbRating: "8.1",
            ratings: [
                { source: "Internet Movie Database", value: "8.1/10" },
                { source: "Rotten Tomatoes", value: "89%" },
                { source: "Metacritic", value: "84/100" }
            ],
            imdbVotes: "800,000",
            type: "movie"
        },
        {
            title: "Blade Runner 2049",
            imdbID: "tt1856101",
            poster: "https://m.media-amazon.com/images/M/MV5BMjQzOTQzOTY1M15BMl5BanBnXkFtZTgwNDQ0NTkzMzI@._V1_SX300.jpg",
            plot: "A young blade runner uncovers a long-buried secret that leads him to track down former blade runner Rick Deckard.",
            genre: "Drama, Mystery, Sci-Fi",
            director: "Denis Villeneuve",
            released: new Date("2017-10-06"),
            durationInMinutes: 164,
            imdbRating: "8.0",
            ratings: [
                { source: "Internet Movie Database", value: "8.0/10" },
                { source: "Rotten Tomatoes", value: "88%" },
                { source: "Metacritic", value: "81/100" }
            ],
            imdbVotes: "700,000",
            type: "movie"
        },
        {
            title: "2001: A Space Odyssey",
            imdbID: "tt0062622",
            poster: "https://m.media-amazon.com/images/M/MV5BYWY0ZGIxYjUtYWE5NS00MDAxLTlhMWEtZTc1MWNlNzY3ZTcyXkEyXkFqcGc@._V1_SX300.jpg",
            plot: "After discovering a mysterious monolith on the moon, mankind sets off on a journey to find its origins with the help of HAL 9000.",
            genre: "Adventure, Sci-Fi",
            director: "Stanley Kubrick",
            released: new Date("1968-04-02"),
            durationInMinutes: 149,
            imdbRating: "8.3",
            ratings: [
                { source: "Internet Movie Database", value: "8.3/10" },
                { source: "Rotten Tomatoes", value: "92%" },
                { source: "Metacritic", value: "84/100" }
            ],
            imdbVotes: "700,000",
            type: "movie"
        },
        {
            title: "Star Wars: Episode IV - A New Hope",
            imdbID: "tt0076759",
            poster: "https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmRhMC00ZDI1LWFmNTEtODM1ZmFlZWI2YzY3XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire.",
            genre: "Action, Adventure, Fantasy",
            director: "George Lucas",
            released: new Date("1977-05-25"),
            durationInMinutes: 121,
            imdbRating: "8.6",
            ratings: [
                { source: "Internet Movie Database", value: "8.6/10" },
                { source: "Rotten Tomatoes", value: "93%" },
                { source: "Metacritic", value: "90/100" }
            ],
            imdbVotes: "1,400,000",
            type: "movie"
        },
        {
            title: "Star Wars: Episode V - The Empire Strikes Back",
            imdbID: "tt0080684",
            poster: "https://m.media-amazon.com/images/M/MV5BMTk4NjU2NTA5Nl5BMl5BanBnXkFtZTcwNDUyMDM0NA@@._V1_SX300.jpg",
            plot: "After the Rebels are overpowered by the Empire, Luke begins Jedi training while his friends are pursued across the galaxy.",
            genre: "Action, Adventure, Fantasy",
            director: "Irvin Kershner",
            released: new Date("1980-06-20"),
            durationInMinutes: 124,
            imdbRating: "8.7",
            ratings: [
                { source: "Internet Movie Database", value: "8.7/10" },
                { source: "Rotten Tomatoes", value: "94%" },
                { source: "Metacritic", value: "82/100" }
            ],
            imdbVotes: "1,300,000",
            type: "movie"
        },
        {
            title: "Star Wars: Episode VI - Return of the Jedi",
            imdbID: "tt0086190",
            poster: "https://m.media-amazon.com/images/M/MV5BZTc2ZmFhY2MtYjFkNy00ZjdiLTk0YmItZmQ5NTljYzVkMTZmXkEyXkFqcGc@._V1_SX300.jpg",
            plot: "After a daring mission to rescue Han Solo, the Rebels dispatch to Endor to destroy the second Death Star.",
            genre: "Action, Adventure, Fantasy",
            director: "Richard Marquand",
            released: new Date("1983-05-25"),
            durationInMinutes: 131,
            imdbRating: "8.3",
            ratings: [
                { source: "Internet Movie Database", value: "8.3/10" },
                { source: "Rotten Tomatoes", value: "82%" },
                { source: "Metacritic", value: "58/100" }
            ],
            imdbVotes: "1,100,000",
            type: "movie"
        },
        {
            title: "Alien",
            imdbID: "tt0078748",
            poster: "https://m.media-amazon.com/images/M/MV5BZTVjMGYwMjUtYTdiYS00ZTA1LWEzNjYtNDQxMzNkNjBiNDMxXkEyXkFqcGc@._V1_SX300.jpg",
            plot: "The crew of a commercial spacecraft encounter a deadly alien organism after investigating a distress signal.",
            genre: "Horror, Sci-Fi",
            director: "Ridley Scott",
            released: new Date("1979-06-22"),
            durationInMinutes: 117,
            imdbRating: "8.5",
            ratings: [
                { source: "Internet Movie Database", value: "8.5/10" },
                { source: "Rotten Tomatoes", value: "94%" },
                { source: "Metacritic", value: "89/100" }
            ],
            imdbVotes: "900,000",
            type: "movie"
        },
        {
            title: "Aliens",
            imdbID: "tt0090605",
            poster: "https://m.media-amazon.com/images/M/MV5BNjQyOTk4OTctMmRlMC00MmM5LTkwZjEtY2RhMDI1Mjk5ZjQ3XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "Decades after her first alien encounter, Ellen Ripley returns with a squad of Marines to battle the creatures again.",
            genre: "Action, Adventure, Sci-Fi",
            director: "James Cameron",
            released: new Date("1986-07-18"),
            durationInMinutes: 137,
            imdbRating: "8.4",
            ratings: [
                { source: "Internet Movie Database", value: "8.4/10" },
                { source: "Rotten Tomatoes", value: "98%" },
                { source: "Metacritic", value: "84/100" }
            ],
            imdbVotes: "800,000",
            type: "movie"
        },
        {
            title: "Terminator 2: Judgment Day",
            imdbID: "tt0103064",
            poster: "https://m.media-amazon.com/images/M/MV5BYzQ5N2I2YWUtNzA0Zi00MjM5LTliMzYtMWUyMGRhYjk3MjM5XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her teenage son, John Connor.",
            genre: "Action, Sci-Fi",
            director: "James Cameron",
            released: new Date("1991-07-03"),
            durationInMinutes: 137,
            imdbRating: "8.6",
            ratings: [
                { source: "Internet Movie Database", value: "8.6/10" },
                { source: "Rotten Tomatoes", value: "94%" },
                { source: "Metacritic", value: "75/100" }
            ],
            imdbVotes: "1,200,000",
            type: "movie"
        },
        {
            title: "The Fifth Element",
            imdbID: "tt0119116",
            poster: "https://m.media-amazon.com/images/M/MV5BZGViMjA0YzUtMmIwYS00NmRkLTljYmYtNTg2ZmFlMTljNmZlXkEyXkFqcGc@._V1_SX300.jpg",
            plot: "In the colorful future, a cab driver unwittingly becomes the central figure in the search for a legendary cosmic weapon.",
            genre: "Action, Adventure, Sci-Fi",
            director: "Luc Besson",
            released: new Date("1997-05-09"),
            durationInMinutes: 126,
            imdbRating: "7.6",
            ratings: [
                { source: "Internet Movie Database", value: "7.6/10" },
                { source: "Rotten Tomatoes", value: "71%" },
                { source: "Metacritic", value: "52/100" }
            ],
            imdbVotes: "500,000",
            type: "movie"
        },
        {
            title: "E.T. the Extra-Terrestrial",
            imdbID: "tt0083866",
            poster: "https://m.media-amazon.com/images/M/MV5BMzQ3NTAwNmQtZjA3OS00MTY4LWJhMjYtMWFjNjE2ODlkMTQ2XkEyXkFqcGc@._V1_SX300.jpg",
            plot: "A troubled child summons the courage to help a friendly alien escape Earth and return to his home world.",
            genre: "Adventure, Family, Sci-Fi",
            director: "Steven Spielberg",
            released: new Date("1982-06-11"),
            durationInMinutes: 115,
            imdbRating: "7.9",
            ratings: [
                { source: "Internet Movie Database", value: "7.9/10" },
                { source: "Rotten Tomatoes", value: "99%" },
                { source: "Metacritic", value: "91/100" }
            ],
            imdbVotes: "450,000",
            type: "movie"
        },
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
            className="grid 
            grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 
            gap-6 items-stretch"
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

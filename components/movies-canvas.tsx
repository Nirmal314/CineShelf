import React, { FC, useState, useCallback } from "react"
import {
    DndContext,
    closestCenter,
    MouseSensor,
    TouchSensor,
    DragOverlay,
    useSensor,
    useSensors,
    DragStartEvent,
    DragEndEvent,
    UniqueIdentifier,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import Grid from "./dnd/grid"
import SortableItem from "./dnd/sortable-item"
import Item from "./dnd/item"

const dummyMovies: {
    id: string
    name: string
    description: string
    genre: string
    imdbRating: number
    director: string
    musicComposer: string
    year: number
    duration: string
}[] = [
        {
            id: "1",
            name: "Inception",
            description: "A skilled thief leads a team into dreams to steal secrets.",
            genre: "Sci-Fi",
            imdbRating: 8.8,
            director: "Christopher Nolan",
            musicComposer: "Hans Zimmer",
            year: 2010,
            duration: "2h 28m",
        },
        {
            id: "2",
            name: "The Godfather",
            description: "The aging patriarch of a crime dynasty transfers control.",
            genre: "Crime, Drama",
            imdbRating: 9.2,
            director: "Francis Ford Coppola",
            musicComposer: "Nino Rota",
            year: 1972,
            duration: "2h 55m",
        },
        {
            id: "3",
            name: "Interstellar",
            description: "Explorers travel through a wormhole in space to ensure humanity’s survival.",
            genre: "Adventure, Drama, Sci-Fi",
            imdbRating: 8.6,
            director: "Christopher Nolan",
            musicComposer: "Hans Zimmer",
            year: 2014,
            duration: "2h 49m",
        },
        {
            id: "4",
            name: "Parasite",
            description: "Greed and class discrimination threaten a newly formed symbiotic relationship.",
            genre: "Thriller, Drama",
            imdbRating: 8.6,
            director: "Bong Joon-ho",
            musicComposer: "Jung Jae-il",
            year: 2019,
            duration: "2h 12m",
        },
        {
            id: "5",
            name: "The Dark Knight",
            description: "Batman battles the Joker, a criminal mastermind who plunges Gotham into chaos.",
            genre: "Action, Crime, Drama",
            imdbRating: 9.0,
            director: "Christopher Nolan",
            musicComposer: "Hans Zimmer",
            year: 2008,
            duration: "2h 32m",
        },
        {
            id: "6",
            name: "Dune: Part One",
            description: "Paul Atreides leads nomadic tribes in a battle to control the desert planet Arrakis.",
            genre: "Adventure, Drama, Sci-Fi",
            imdbRating: 8.0,
            director: "Denis Villeneuve",
            musicComposer: "Hans Zimmer",
            year: 2021,
            duration: "2h 35m",
        },
        {
            id: "7",
            name: "Dune: Part Two",
            description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
            genre: "Action, Adventure, Drama",
            imdbRating: 8.7,
            director: "Denis Villeneuve",
            musicComposer: "Hans Zimmer",
            year: 2024,
            duration: "2h 46m",
        },
        {
            id: "8",
            name: "Oppenheimer",
            description: "The story of J. Robert Oppenheimer and the creation of the atomic bomb.",
            genre: "Biography, Drama, History",
            imdbRating: 8.4,
            director: "Christopher Nolan",
            musicComposer: "Ludwig Göransson",
            year: 2023,
            duration: "3h 0m",
        },
        {
            id: "9",
            name: "Arrival",
            description: "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.",
            genre: "Drama, Mystery, Sci-Fi",
            imdbRating: 7.9,
            director: "Denis Villeneuve",
            musicComposer: "Jóhann Jóhannsson",
            year: 2016,
            duration: "1h 56m",
        },
        {
            id: "10",
            name: "Blade Runner 2049",
            description: "A young blade runner's discovery of a long-buried secret leads him to track down former blade runner Rick Deckard.",
            genre: "Action, Drama, Sci-Fi",
            imdbRating: 8.0,
            director: "Denis Villeneuve",
            musicComposer: "Hans Zimmer, Benjamin Wallfisch",
            year: 2017,
            duration: "2h 44m",
        },
        {
            id: "11",
            name: "Tenet",
            description: "Armed with only one word, Tenet, a protagonist journeys through a twilight world of international espionage.",
            genre: "Action, Sci-Fi, Thriller",
            imdbRating: 7.3,
            director: "Christopher Nolan",
            musicComposer: "Ludwig Göransson",
            year: 2020,
            duration: "2h 30m",
        },
        {
            id: "12",
            name: "La La Land",
            description: "While navigating their careers in Los Angeles, a pianist and an actress fall in love while attempting to reconcile their aspirations.",
            genre: "Comedy, Drama, Music",
            imdbRating: 8.0,
            director: "Damien Chazelle",
            musicComposer: "Justin Hurwitz",
            year: 2016,
            duration: "2h 8m",
        },
        {
            id: "13",
            name: "The Prestige",
            description: "After a tragic accident, two stage magicians engage in a battle to create the ultimate illusion.",
            genre: "Drama, Mystery, Sci-Fi",
            imdbRating: 8.5,
            director: "Christopher Nolan",
            musicComposer: "David Julyan",
            year: 2006,
            duration: "2h 10m",
        },
        {
            id: "14",
            name: "The Martian",
            description: "An astronaut becomes stranded on Mars and must rely on his ingenuity to survive.",
            genre: "Adventure, Drama, Sci-Fi",
            imdbRating: 8.0,
            director: "Ridley Scott",
            musicComposer: "Harry Gregson-Williams",
            year: 2015,
            duration: "2h 24m",
        },
        {
            id: "15",
            name: "Fight Club",
            description: "An insomniac office worker and a soap maker form an underground fight club.",
            genre: "Drama",
            imdbRating: 8.8,
            director: "David Fincher",
            musicComposer: "The Dust Brothers",
            year: 1999,
            duration: "2h 19m",
        },
        {
            id: "16",
            name: "Se7en",
            description: "Two detectives hunt a serial killer who uses the seven deadly sins as his motives.",
            genre: "Crime, Drama, Mystery",
            imdbRating: 8.6,
            director: "David Fincher",
            musicComposer: "Howard Shore",
            year: 1995,
            duration: "2h 7m",
        },
        {
            id: "17",
            name: "2001: A Space Odyssey",
            description: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins.",
            genre: "Adventure, Sci-Fi",
            imdbRating: 8.3,
            director: "Stanley Kubrick",
            musicComposer: "Richard Strauss, György Ligeti",
            year: 1968,
            duration: "2h 29m",
        },
        {
            id: "18",
            name: "The Odyssey",
            description: "The epic journey of Odysseus as he returns home from the Trojan War.",
            genre: "Adventure, Drama, Fantasy",
            imdbRating: 7.0,
            director: "Andrei Konchalovsky",
            musicComposer: "Eduard Artemyev",
            year: 1997,
            duration: "2h 58m",
        },
    ]


export const MoviesCanvas: FC = () => {
    const [items, setItems] = useState<UniqueIdentifier[]>(
        dummyMovies.map((movie) => movie.id)
    )
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))

    const handleDragStart = useCallback((event: DragStartEvent) => {
        console.log("Dragging: ", event.active)
        setActiveId(event.active.id)
    }, [])

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event
        if (active.id !== over?.id) {
            setItems((items) => {
                const oldIndex = items.indexOf(active.id)
                const newIndex = items.indexOf(over!.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
        setActiveId(null)
    }, [])

    const handleDragCancel = useCallback(() => {
        setActiveId(null)
    }, [])

    const activeMovie = dummyMovies.find((m) => m.id === activeId)

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext items={items} strategy={rectSortingStrategy}>
                <div className="overflow-y-auto border border-red-700">
                    <Grid columns={5}>
                        {items.map((id) => {
                            const movie = dummyMovies.find((m) => m.id === id)
                            return movie ? <SortableItem key={movie.id} {...movie} /> : null
                        })}
                    </Grid>
                </div>
            </SortableContext>

            <DragOverlay adjustScale style={{ transformOrigin: "0 0" }}>
                {activeMovie ? <Item {...activeMovie} isDragging /> : null}
            </DragOverlay>
        </DndContext>
    )
}

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription, CardTitle, CardFooter } from '@/components/ui/card'
import { Movie } from '@/types'
import { Badge } from './ui/badge'

type MovieCardProps = {
    movie: Movie
    className?: string
}

const MovieCard = ({ movie }: MovieCardProps) => {
    const formattedDuration = `${Math.floor(movie.durationInMinutes / 60)}h ${movie.durationInMinutes % 60}min`
    const releasedYear = movie.released.getFullYear()

    return (
        <Card className='max-w-4xl py-0 sm:flex-row sm:gap-0'>
            <CardContent className='grow-1 px-0 w-56'>
                <img
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    className='size-full rounded-l-xl object-cover'
                />
            </CardContent>
            <div className='flex flex-col justify-between sm:min-w-72'>
                <CardHeader className='pt-6'>
                    <CardTitle>{movie.title}</CardTitle>
                    <CardDescription className='space-y-2'>
                        <p>{movie.plot}</p>
                        <div className="flex flex-wrap gap-2">
                            {movie.genre.split(", ").map((genre) => (
                                <Badge variant="secondary" className='border border-primary' key={genre}>
                                    {genre}
                                </Badge>
                            ))}
                        </div>
                        <div><strong>Director:</strong> {movie.director}</div>
                        <div><strong>Released:</strong> {releasedYear}</div>
                        <div><strong>Duration:</strong> {formattedDuration}</div>
                        <div><strong>IMDb Rating:</strong> {movie.imdbRating}</div>
                        <div><strong>IMDb Votes:</strong> {movie.imdbVotes}</div>
                    </CardDescription>
                </CardHeader>
                <CardFooter className='gap-3 py-6 max-sm:flex-col max-sm:items-stretch'>
                    <Button>Add to watchlist</Button>
                    <Button variant={'outline'}>IMDb</Button>
                </CardFooter>
            </div>
        </Card>
    )
}

export default MovieCard

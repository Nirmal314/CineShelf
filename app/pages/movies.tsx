import { searchMovies } from '@/actions/movies'
import { ProfileButton } from '@/components/profile-button'
import MoviesGrid from '@/components/swapy/movies-grid'
import { Button } from '@/components/ui/cool-button'
import { Input } from '@/components/ui/input'
import { Session } from 'next-auth'
import React from 'react'

const Movies = async ({ session }: { session: Session }) => {
    const search = async (formData: FormData) => {
        "use server"

        const searchedTerm = formData.get("movie") as string | null

        if (!searchedTerm) return;

        const movies = await searchMovies(searchedTerm)

        console.log(movies)
    }
    return (
        <div className="mt-10 relative z-10 flex min-h-screen items-start justify-center px-4 sm:px-6 md:px-8">
            <div>
                <form action={search} className="w-full flex space-x-2 mb-4">
                    <Input name='movie' className='border border-primary' placeholder='Search movies or shows...' />
                    <Button variant="warm" size="sm">Search</Button>
                </form>
                <MoviesGrid />
            </div>

            <ProfileButton
                name={session.user.name || ""}
                email={session.user.email || ""}
                image={session.user.image || ""}
            />
        </div>
    )
}

export default Movies

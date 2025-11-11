import { ProfileButton } from '@/components/profile-button'
import SearchBar from '@/components/search-movies'
import { Session } from 'next-auth'
import React, { Suspense } from 'react'
import MoviesLoader from '@/components/loaders/movies-loader'
import { getUserMovies } from '@/actions/movies'
import UserMovies from '@/components/swapy/user-movies'

const Movies = async ({ session }: { session: Session }) => {
    const movies = await getUserMovies();

    return (
        <div className="pt-20 md:pt-10 relative z-10 flex min-h-screen items-start justify-center px-4 sm:px-6 md:px-8">
            <div className='min-w-1/2'>
                <SearchBar />
                <Suspense fallback={<MoviesLoader />}>
                    <UserMovies movies={movies} />
                </Suspense>
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

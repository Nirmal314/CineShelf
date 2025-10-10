import { ProfileButton } from '@/components/profile-button'
import SearchMovies from '@/components/search-movies'
import MoviesGrid from '@/components/movies-grid'
import { Session } from 'next-auth'
import React, { Suspense } from 'react'

const Movies = async ({ session }: { session: Session }) => {
    return (
        <div className="pt-20 md:pt-10 relative z-10 flex min-h-screen items-start justify-center px-4 sm:px-6 md:px-8">
            <div>
                <Suspense fallback={<div className='text-primary text-3xl animate-pulse duration-300'>Searching movies...</div>}>
                    <SearchMovies />
                </Suspense>
                <Suspense fallback={<div className='text-primary text-3xl animate-pulse duration-300'>Loading movies...</div>}>
                    <MoviesGrid />
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

import { ProfileButton } from '@/components/profile-button'
import SearchMovies from '@/components/search-movies'
import MoviesGrid from '@/components/swapy/movies-grid'
import { Session } from 'next-auth'
import React from 'react'

const Movies = async ({ session }: { session: Session }) => {
    return (
        <div className="mt-10 relative z-10 flex min-h-screen items-start justify-center px-4 sm:px-6 md:px-8">
            <div>
                <SearchMovies />
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

"use client"

import { ProfileButton } from '@/components/profile-button'
import MoviesGrid from '@/components/swapy/movies'
import { Session } from 'next-auth'
import React from 'react'

const Movies = ({ session }: { session: Session }) => {
    return (
        <div className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 md:px-8">
            <MoviesGrid />

            <ProfileButton
                name={session.user.name || ""}
                email={session.user.email || ""}
                image={session.user.image || ""}
            />
        </div>
    )
}

export default Movies

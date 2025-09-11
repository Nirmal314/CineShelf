import { auth } from '@/auth';
import React from 'react'
import { GoogleSignIn, SpotifySignIn, UserProfile } from './auth-buttons';

const Header = async () => {
    const session = await auth();

    return (
        <header className='border-b border-neutral-800 p-5 flex justify-center sm:justify-between items-center'>
            <h1 className='text-2xl font-bold hidden sm:block'>CineShelf</h1>

            {session?.user && (
                <UserProfile name={session.user.name} image={session.user.image} />
            )}

            {!session?.user && (
                <div className="flex space-x-4">
                    <SpotifySignIn />
                    <GoogleSignIn />
                </div>
            )}
        </header>
    )
}

export default Header
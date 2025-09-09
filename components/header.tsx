import { signIn } from '@/auth';
import React from 'react'

const Header = () => {
    return (
        <form className='border-b border-neutral-800 p-5 flex justify-between items-center'
            action={async () => {
                "use server"

                await signIn("spotify", {
                    callbackUrl: "/",
                });
            }}
        >
            <h1 className='text-2xl font-bold'>CineShelf</h1>
            <button className='bg-green-500 text-black px-4 py-2 rounded-full font-semibold'>Sign in with Spotify</button>
        </form>
    )
}

export default Header
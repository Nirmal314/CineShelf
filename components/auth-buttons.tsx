import { signIn, signOut } from "@/auth";
import Image from "next/image";

const SpotifySignIn = () => {
    return (
        <form action={async () => {
            "use server"
            await signIn("spotify", {
                callbackUrl: "/",
            });
        }}>
            <button className='bg-green-500 text-black px-4 py-2 rounded-full font-semibold'>Sign in with Spotify</button>
        </form>
    )
}

const GoogleSignIn = () => {
    return (
        <form action={async () => {
            "use server"
            await signIn("google", {
                callbackUrl: "/",
            });
        }}>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-full font-semibold'>Sign in with Google</button>
        </form>
    )
}

const UserProfile = ({ image, name }: { image?: string | null, name?: string | null }) => {
    return (
        <div className='flex items-center gap-3'>
            <Image src={image || ""} alt={name || "User"} width={35} height={35} className='rounded-full' />
            <span>{name || "User"}</span>

            <form action={async () => {
                "use server"
                await signOut({
                    redirectTo: "/"
                });
            }}>
                <button className='bg-red-500 text-white px-4 py-2 rounded-full font-semibold'>Sign out</button>
            </form>
        </div>
    )
}

export { SpotifySignIn, GoogleSignIn, UserProfile }
'use client'

import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Button } from "./ui/cool-button";

const SpotifySignIn = () => {
    return (
        <Button onClick={() => signIn("spotify")} icon="/spotify.svg" variant={"green"} size={"sm"}>Spotify</Button>
    )
}

const GoogleSignIn = () => {
    return (
        <Button onClick={() => signIn("google")} icon="/google.svg" variant={"blue"} size={"sm"}>Google</Button>
    )
}

// const UserProfile = ({ image, name }: { image?: string | null, name?: string | null }) => {
//     return (
//         <div className='flex items-center gap-3'>
//             <Image src={image || ""} alt={name || "User"} width={35} height={35} className='rounded-full' />
//             <span>{name || "User"}</span>

//             <form action={async () => {
//                 "use server"
//                 await signOut({
//                     redirectTo: "/"
//                 });
//             }}>
//                 <Button variant={"red"} size={"xs"}>Sign out</Button>
//             </form>
//         </div>
//     )
// }

// export { SpotifySignIn, GoogleSignIn, UserProfile }
export { SpotifySignIn, GoogleSignIn }
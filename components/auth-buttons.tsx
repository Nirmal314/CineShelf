import { signIn, signOut } from "@/auth";
import Image from "next/image";
import { Button } from "./ui/cool-button";

const SpotifySignIn = () => {
    return (
        <form action={async () => {
            "use server"
            await signIn("spotify", {
                callbackUrl: "/",
            });
        }}>
            <Button icon="https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" variant={"green"} size={"sm"}>Sign in with Spotify</Button>
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
            <Button icon="https://www.svgrepo.com/show/303108/google-icon-logo.svg" variant={"blue"} size={"sm"}>Sign in with Google</Button>
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
                <Button variant={"red"} size={"xs"}>Sign out</Button>
            </form>
        </div>
    )
}

export { SpotifySignIn, GoogleSignIn, UserProfile }
import { signIn } from "@/auth";
import { Button } from "./ui/cool-button";

const SpotifySignIn = () => {
    return (
        <form action={async () => {
            "use server"
            await signIn("spotify", {
                callbackUrl: "/",
            });
        }}>
            <Button icon="/spotify.svg" variant={"green"} size={"sm"}>Spotify</Button>
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
            <Button icon="/google.svg" variant={"blue"} size={"sm"}>Google</Button>
        </form>
    )
}

export { SpotifySignIn, GoogleSignIn }
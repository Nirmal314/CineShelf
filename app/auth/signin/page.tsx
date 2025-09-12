"use client";

import { GoogleSignIn, SpotifySignIn } from "@/components/auth-buttons-client";
import { getFloatingItems } from "@/components/floating-items";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/cool-button";
import { Home } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const SignIn = () => {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    const errorMessages: Record<string, string> = {
        OAuthAccountNotLinked: "This account is already linked with another sign-in method.",
        CredentialsSignin: "Invalid credentials.",
        default: "Something went wrong. Please try again.",
    };

    return (
        <>
            {error && (
                <div className="absolute p-4 top-5 w-full flex justify-center z-20">
                    <Card className="w-full sm:max-w-lg bg-red-400/30 backdrop-blur-xs border-red-700 text-white rounded-2xl shadow-lg animate-fade-in">
                        <CardContent className="p-2 text-center text-lg text-red-600">
                            {errorMessages[error] || errorMessages.default}
                        </CardContent>
                    </Card>
                </div>
            )}
            <div className="relative flex flex-col justify-center items-center w-full h-full space-y-6 p-4">
                {getFloatingItems(7).map((el) => el)}


                <Card className="relative border-warm-1/60 z-10 rounded-2xl bg-card/60 backdrop-blur-md p-10 animate-fade-in">
                    <CardContent className="space-y-8 text-center">
                        <p className="text-4xl md:text-5xl font-serif text-foreground tracking-tight leading-snug">
                            Welcome to{" "}
                            <span className="italic">
                                Cine<span className="text-primary">Shelf</span>
                            </span>
                        </p>

                        <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md mx-auto">
                            Your personal digital shelf for movies and music.
                        </p>

                        <div className="space-y-4">
                            <p className="text-sm text-muted-foreground">Sign in with your account</p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <GoogleSignIn />
                                <SpotifySignIn />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default SignIn;

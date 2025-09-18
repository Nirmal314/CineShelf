"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "./ui/cool-button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Image from "next/image"

type Props = {
    image: string
    name: string
    email: string
}

export function ProfileButton({ image, name, email }: Props) {
    return (
        <div className="fixed top-6 right-6 z-50">
            <Popover>
                <PopoverTrigger asChild>
                    <Image
                        src={image}
                        alt={name}
                        height={10}
                        width={10}
                        className="rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                    />
                </PopoverTrigger>

                <PopoverContent
                    align="end"
                    sideOffset={8}
                    className="w-64 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 
                    data-[state=open]:slide-in-from-left-20 
                    data-[state=open]:slide-in-from-top-0 
                    data-[state=open]:zoom-in-100 
                    data-[state=closed]:slide-out-to-left-20 
                    data-[state=closed]:slide-out-to-top-0 
                    data-[state=closed]:zoom-out-100"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <Image
                            src={image}
                            alt={name}
                            height={12}
                            width={12}
                            className="rounded-full border border-gray-200 shadow-sm"
                        />
                        <div>
                            <p className="text-sm font-semibold text-gray-900">{name}</p>
                            <p className="text-xs text-gray-500">{email}</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
                        variant="red"
                        size="sm"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </Button>
                </PopoverContent>
            </Popover>
        </div>
    )
}
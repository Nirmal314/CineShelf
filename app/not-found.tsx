import { getFloatingItems } from '@/components/floating-items'
import { Button } from '@/components/ui/cool-button'
import { Home } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className="relative flex flex-col justify-center items-center">
            {getFloatingItems(8).map((el) => el)}
            <div className="relative z-10 flex flex-col justify-center items-center space-y-6 text-center p-6">
                <p className="text-6xl md:text-7xl font-serif animate-fade-in">
                    404
                </p>
                <p className="text-2xl md:text-3xl font-light animate-fade-in">
                    Uh-oh! Page not found.
                </p>
                <Link href="/">
                    <Button variant="warm" className="mt-4"><Home /> Home</Button>
                </Link>
            </div>
        </div>
    )
}

export default NotFound

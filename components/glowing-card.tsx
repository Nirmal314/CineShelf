'use client'

import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import clsx from 'clsx'

type GlowingCardProps = {
    title?: string
    children: React.ReactNode
    className?: string
    glowColor?: string
}

const GlowingCard = ({ title, children, className, glowColor = 'bg-amber-800/60 dark:bg-amber-600/60' }: GlowingCardProps) => {
    useEffect(() => {
        const cards = document.querySelectorAll('.glowing-card')
        const handleMouseMove = (ev: MouseEvent) => {
            cards.forEach(c => {
                const blob = c.querySelector('.blob') as HTMLElement
                const fblob = c.querySelector('.fake-blob') as HTMLElement
                if (!blob || !fblob) return
                const rect = fblob.getBoundingClientRect()
                blob.style.opacity = '1'
                blob.animate(
                    [{ transform: `translate(${ev.clientX - rect.left - rect.width / 2}px, ${ev.clientY - rect.top - rect.height / 2}px)` }],
                    { duration: 300, fill: 'forwards' }
                )
            })
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <div className={clsx('w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl', className)}>
            <div className="glowing-card group relative overflow-hidden rounded-xl p-px transition-all duration-300 ease-in-out">
                <Card className="group-hover:bg-card/90 w-full border-none transition-all duration-300 ease-in-out group-hover:backdrop-blur-[20px]">
                    {title && (
                        <CardHeader>
                            <CardTitle>{title}</CardTitle>
                        </CardHeader>
                    )}
                    <CardContent>{children}</CardContent>
                </Card>
                <div className={clsx('blob absolute start-0 top-0 h-20 w-20 rounded-full opacity-0 blur-2xl transition-all duration-300 ease-in-out', glowColor)} />
                <div className="fake-blob absolute start-0 top-0 h-20 w-20 rounded-full" />
            </div>
        </div>
    )
}

export default GlowingCard

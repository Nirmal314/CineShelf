import React from 'react'
import { Skeleton } from '../ui/skeleton'

const MoviesLoader = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-stretch">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-64 w-full" />
      ))}
    </div>
  )
}

export default MoviesLoader

import React, { FC } from "react"

type GridProps = {
    columns: number;
    children: React.ReactNode
}

const Grid: FC<GridProps> = ({ children }) => {
    return (
        <div
            className="
              w-full h-full 
              grid gap-6 p-6 
              grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
              overflow-y-auto
            "
        >
            {children}
        </div>
    )
}

export default Grid

"use client"

import React, { useState, useEffect } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    useSortable,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

type GetItemStyles = (opts: { index: number; id: string }) => React.CSSProperties;
type WrapperStyle = (opts: { index: number; id: string }) => React.CSSProperties;

export function SortableGrid<T extends { id: string; title?: string; subtitle?: string; content?: React.ReactNode }>({
    items: initialItems,
    columns = 4,
    gap = 12,
    getItemStyles,
    wrapperStyle,
    onChange,
}: {
    items: T[];
    columns?: number;
    gap?: number;
    getItemStyles?: GetItemStyles;
    wrapperStyle?: WrapperStyle;
    onChange?: (items: T[]) => void;
}) {
    const [items, setItems] = useState<T[]>(initialItems);
    useEffect(() => setItems(initialItems), [initialItems]);

    const sensors = useSensors(useSensor(PointerSensor));
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const next = arrayMove(items, oldIndex, newIndex);
        setItems(next);
        onChange?.(next);
    }

    const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap,
        width: "100%",
        alignItems: "start",
    };

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map((i) => i.id)} strategy={rectSortingStrategy}>
                <div style={gridStyle}>
                    {items.map((item, index) => (
                        <SortableItem
                            key={item.id}
                            id={item.id}
                            index={index}
                            wrapperStyle={() => (wrapperStyle ? wrapperStyle({ index, id: item.id }) : {})}
                            getItemStyles={() => (getItemStyles ? getItemStyles({ index, id: item.id }) : {})}
                            title={item.title}
                            subtitle={item.subtitle}
                        >
                            {item.content}
                        </SortableItem>
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}

function SortableItem({
    id,
    children,
    index,
    wrapperStyle,
    getItemStyles,
    title,
    subtitle,
}: {
    id: string;
    children: React.ReactNode;
    index: number;
    wrapperStyle?: () => React.CSSProperties;
    getItemStyles?: () => React.CSSProperties;
    title?: string;
    subtitle?: string;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 999 : undefined,
        touchAction: "manipulation",
        ...getItemStyles?.(),
    };

    const outerStyle: React.CSSProperties = {
        ...wrapperStyle?.(),
        display: "block",
    };

    return (
        <div ref={setNodeRef} style={outerStyle} {...attributes} {...(listeners as any)}>
            <div style={style}>
                <Card className="shadow-sm">
                    {title || subtitle ? (
                        <CardHeader>
                            {title ? <CardTitle>{title}</CardTitle> : null}
                        </CardHeader>
                    ) : null}
                    <CardContent className="p-4">
                        {children}
                    </CardContent>
                    <CardFooter>
                        {subtitle ? <div className="text-sm text-muted-foreground">{subtitle}</div> : null}
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
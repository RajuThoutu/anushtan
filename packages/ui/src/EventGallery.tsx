"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "./Button";

interface EventGalleryProps {
    images: string[];
    title: string;
}

export function EventGallery({ images, title }: EventGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="relative aspect-square cursor-pointer overflow-hidden rounded-lg"
                        onClick={() => setSelectedImage(image)}
                    >
                        <img
                            src={image}
                            alt={`${title} - ${index + 1}`}
                            className="absolute inset-0 h-full w-full object-cover transition-transform hover:scale-105"
                        />
                    </div>
                ))}
            </div>

            {/* Simple Modal for larger view */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-h-[90vh] max-w-[90vw] aspect-video w-full flex items-center justify-center">
                        <img
                            src={selectedImage}
                            alt={title}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

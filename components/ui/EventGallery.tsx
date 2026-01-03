'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { urlForImage } from '@/sanity/lib/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface EventGalleryProps {
    images: any[];
    title: string;
}

export function EventGallery({ images, title }: EventGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);

    const nextImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prev) => (prev! + 1) % images.length);
    };

    const prevImage = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedImageIndex === null) return;
        setSelectedImageIndex((prev) => (prev! - 1 + images.length) % images.length);
    };

    return (
        <>
            {/* Masonry-style Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {images.map((image: any, index: number) => (
                    <motion.div
                        key={image._key || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        className="break-inside-avoid relative rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-zoom-in group bg-white border border-anushtan-border/20"
                        onClick={() => openLightbox(index)}
                    >
                        <div className="relative w-full">
                            {/* Aspect Ratio Preservation Strategy: Render naturally based on dimensions */}
                            <Image
                                src={urlForImage(image).width(800).url()}
                                alt={`${title} - Photo ${index + 1}`}
                                width={800}
                                height={600} // This is just a base ratio, object-cover handles the rest if enforced, but in masonry we want natural height usually. 
                                // However, for Sanity images we might not know dimensions upfront easily without metadata. 
                                // Let's use 'responsive' layout via standard Image component styling.
                                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox Overlay */}
            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 md:p-8"
                        onClick={closeLightbox}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors z-50 p-2"
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block hover:bg-white/10 rounded-full"
                        >
                            <ChevronLeft size={40} />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors z-50 p-2 hidden md:block hover:bg-white/10 rounded-full"
                        >
                            <ChevronRight size={40} />
                        </button>

                        {/* Main Image */}
                        <motion.div
                            layoutId={`image-${selectedImageIndex}`}
                            className="relative w-full max-w-6xl max-h-[90vh] flex items-center justify-center"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                        >
                            <Image
                                src={urlForImage(images[selectedImageIndex]).quality(100).url()}
                                alt={`${title} - Fullscreen ${selectedImageIndex + 1}`}
                                width={1920}
                                height={1080}
                                className="object-contain max-h-[90vh] w-auto h-auto rounded shadow-2xl"
                            />
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 font-medium tracking-widest text-sm">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

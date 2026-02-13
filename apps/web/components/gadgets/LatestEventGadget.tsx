'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

interface EventData {
    title: string;
    slug: { current: string };
    date: string;
    description: string;
    gallery: any[];
}

const EVENT_QUERY = `*[_type == 'event'] | order(date desc)[0] {
  title,
  slug,
  date,
  description,
  "gallery": gallery[0..4]
}`;

export function LatestEventGadget() {
    const [event, setEvent] = useState<EventData | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const data = await client.fetch(EVENT_QUERY);
                setEvent(data);
            } catch (error) {
                console.error('Failed to fetch latest event:', error);
            }
        };

        fetchEvent();
    }, []);

    useEffect(() => {
        if (!event || !event.gallery || event.gallery.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % event.gallery.length);
        }, 5000); // Rotate every 5 seconds

        return () => clearInterval(interval);
    }, [event]);

    if (!event) return null;

    return (
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-anushtan-border hover:shadow-2xl transition-shadow duration-300">
            <Link href={`/events/${event.slug.current}`}>
                <div className="relative h-64 w-full bg-gray-100">
                    {event.gallery && event.gallery.length > 0 ? (
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={currentImageIndex}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={urlForImage(event.gallery[currentImageIndex]).url()}
                                    alt={`${event.title} - Image ${currentImageIndex + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </AnimatePresence>
                    ) : (
                        <div className="flex items-center justify-center h-full text-anushtan-charcoal/50">
                            No images available
                        </div>
                    )}

                    {/* Carousel Indicators */}
                    {event.gallery && event.gallery.length > 1 && (
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
                            {event.gallery.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 w-1.5 rounded-full shadow-sm transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="bg-anushtan-saffron/10 text-anushtan-saffron text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                            Latest Event
                        </span>
                        <span className="text-anushtan-charcoal/60 text-xs">
                            {new Date(event.date).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                    </div>

                    <h3 className="font-heading text-xl font-bold text-anushtan-maroon mb-2 line-clamp-2">
                        {event.title}
                    </h3>

                    {event.description && (
                        <p className="text-anushtan-charcoal/80 text-sm line-clamp-3 leading-relaxed">
                            {event.description}
                        </p>
                    )}
                </div>
            </Link>
        </div>
    );
}

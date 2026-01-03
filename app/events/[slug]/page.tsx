import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';
import { EventGallery } from '@/components/ui/EventGallery';

interface Props {
    params: { slug: string };
}

// 1. Generate Static Params for SEO
export async function generateStaticParams() {
    const query = `*[_type == "event"]{ "slug": slug.current }`;
    const slugs = await client.fetch(query);
    return slugs.map((s: any) => ({ slug: s.slug }));
}

// 2. Fetch Event Data
async function getEvent(slug: string) {
    const query = `*[_type == "event" && slug.current == $slug][0] {
    title,
    date,
    description,
    gallery
  }`;
    return client.fetch(query, { slug });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const event = await getEvent(params.slug);
    if (!event) return { title: 'Event Not Found' };
    return {
        title: `${event.title} | Anushtan Indic School`,
        description: event.description || `View photos from ${event.title}`,
    };
}

export default async function EventPage({ params }: Props) {
    const event = await getEvent(params.slug);

    if (!event) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-anushtan-cream/20 font-sans">
            <Navbar />

            <main className="container-custom py-20 min-h-[80vh]">
                {/* Header */}
                <header className="mb-16 text-center max-w-4xl mx-auto">
                    <div className="inline-block mb-4 px-3 py-1 bg-anushtan-saffron/10 text-anushtan-saffron text-sm font-bold uppercase tracking-widest rounded-full">
                        Event Gallery
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-anushtan-maroon mb-6 leading-tight">
                        {event.title}
                    </h1>
                    <p className="text-anushtan-charcoal/60 text-lg mb-8 font-serif italic">
                        {new Date(event.date).toLocaleDateString(undefined, {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                    {event.description && (
                        <p className="text-xl text-anushtan-charcoal/80 leading-relaxed max-w-2xl mx-auto">
                            {event.description}
                        </p>
                    )}
                </header>

                {/* Gallery Grid */}
                {event.gallery && event.gallery.length > 0 ? (
                    <EventGallery images={event.gallery} title={event.title} />
                ) : (
                    <div className="text-center py-20 text-anushtan-charcoal/50">
                        No images available for this event.
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}

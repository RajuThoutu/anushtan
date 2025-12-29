import React from 'react';

export function VideoSection() {
    return (
        <section className="py-16 bg-[#fdfbf7]">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Video 1 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/MxmaIQdhnKg"
                            title="Anushtan Video 1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video 2 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/d9bQAwoekfQ"
                            title="Anushtan Video 2"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from 'react';

export function VideoSection() {
    return (
        <section className="py-16 bg-[#fdfbf7]">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Video 1 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/dPlyO0rxvRQ"
                            title="Modulus Video 1"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video 2 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/3EH3N9-QtNI"
                            title="Modulus Video 2"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video 3 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/zabwC1SP63c"
                            title="Modulus Video 3"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video 4 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/RQKY5o-PiK8"
                            title="Modulus Video 4"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* Video 5 */}
                    <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg border border-anushtan-border">
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/PZLQpEeAIb4"
                            title="Modulus Video 5"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>
        </section>
    );
}

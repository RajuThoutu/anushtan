import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";

export default function InsightsPage() {
    return (
        <>
            <Navbar />
            <Hero
                title="Insights & Thought Leadership"
                subtitle="Exploring the intersection of tradition and modernity."
                background="bg-primary/5"
            />

            <section className="py-24 bg-background">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12">
                        <SectionHeader title="Latest Articles" align="left" className="mb-0" />
                        <div className="w-full md:w-64 mt-4 md:mt-0">
                            <input type="search" placeholder="Search insights..." className="w-full h-10 px-3 rounded-full border border-text/20 bg-surface focus:outline-none focus:ring-2 focus:ring-primary/50" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i} hoverEffect>
                                <div className="h-48 bg-background mb-4 rounded flex items-center justify-center text-text/30">[BLOG_THUMBNAIL]</div>
                                <div className="text-xs font-bold text-accent uppercase tracking-wider mb-2">Category</div>
                                <h3 className="font-heading text-xl font-bold mb-2 hover:text-primary cursor-pointer">Blog Post Title Placeholder {i}</h3>
                                <p className="text-sm text-text/70 line-clamp-3 mb-4">
                                    [Excerpt placeholder regarding educational insights, parenting tips, or school news.]
                                </p>
                                <span className="text-xs text-text/50 font-medium">Oct 12, 2024 • 5 min read</span>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </>
    );
}

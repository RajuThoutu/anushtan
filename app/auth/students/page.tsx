import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"

export default async function StudentsPage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    return (
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                            Student Inquiries
                        </h1>
                        <p className="text-sm text-anushtan-charcoal/60">
                            Search and manage all student inquiries
                        </p>
                    </div>
                    <a
                        href="/auth/dashboard"
                        className="text-sm text-anushtan-terracotta hover:underline"
                    >
                        ← Back to Dashboard
                    </a>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-xl border border-anushtan-border p-8">
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="font-heading text-2xl font-bold text-anushtan-charcoal mb-2">
                            Search & View Coming Soon
                        </h2>
                        <p className="text-anushtan-charcoal/60 mb-6">
                            This page will show all student inquiries with search and filter options.
                        </p>
                        <p className="text-sm text-anushtan-charcoal/50 mb-6">
                            Available after Google Sheets integration is complete.
                        </p>
                        <a
                            href="/auth/students/add"
                            className="inline-block bg-anushtan-terracotta text-white font-semibold py-3 px-6 rounded-lg hover:bg-anushtan-terracotta/90 transition-colors"
                        >
                            ➕ Add New Inquiry
                        </a>
                    </div>
                </div>
            </main>
        </div>
    )
}

import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth/auth-config"
import DashboardClient from "./DashboardClient"

export default async function AuthDashboard() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect('/auth')
    }

    return <DashboardClient />
}

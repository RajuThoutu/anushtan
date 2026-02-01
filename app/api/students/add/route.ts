import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"
import { NextResponse } from "next/server"

// This will work once Google Sheets is set up
// For now, it's a placeholder that logs the data
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await req.json()

        // TODO: Once Google Sheets is set up, uncomment this:
        // const { appendToSheet } = await import('@/lib/googleSheets')
        // await appendToSheet([
        //   data.inquiryDate,
        //   data.status,
        //   data.priority,
        //   '', // Admission (filled later)
        //   '', // TNT (filled later)
        //   data.studentName,
        //   data.parentName,
        //   data.occupation || '',
        //   '', // Date of Joining (filled later)
        //   data.primaryContact,
        //   data.secondaryContact || '',
        //   data.currentSchool || '',
        //   data.currentClass,
        //   data.board || '',
        //   data.leadSource,
        //   data.dsHostel,
        //   '0', // Number of visits (starts at 0)
        //   data.comments || '',
        //   '', // Fee discussed (filled later)
        //   '', // Follow-up date (filled later)
        //   '', // Follow-up remarks (filled later)
        //   session.user.name // Added by
        // ])

        // For now, just log the data
        console.log('Student inquiry data:', {
            ...data,
            addedBy: session.user.name,
            addedAt: new Date().toISOString()
        })

        return NextResponse.json({
            success: true,
            message: 'Student inquiry added successfully (mock - Google Sheets not yet configured)'
        })
    } catch (error) {
        console.error('Error adding student inquiry:', error)
        return NextResponse.json({
            error: 'Failed to add student inquiry'
        }, { status: 500 })
    }
}

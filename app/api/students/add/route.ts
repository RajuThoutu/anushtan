import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth/auth-config"
import { NextResponse } from "next/server"
import { createInquiry } from "@/lib/sheets/client"

// This will work once Google Sheets is set up
// For now, it's a placeholder that logs the data
export async function POST(req: Request) {
    const session = await getServerSession(authOptions)

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await req.json()

        // Map form data to Google Sheets structure (all 21 columns)
        const result = await createInquiry({
            studentName: data.studentName,
            currentClass: data.currentClass,
            currentSchool: data.currentSchool || '',
            board: data.board || '',
            parentName: data.parentName,
            occupation: data.occupation || '',
            phone: data.primaryContact, // Map primaryContact to phone
            secondaryContact: data.secondaryContact || '',
            email: data.email || '',
            educationGuide: data.q1_education_guide || '',
            learningMethod: data.q2_learning_approach || '',
            teacherPreference: data.q3_teacher_preference || '',
            childImportance: data.q4_child_priority || '',
            schoolEnvironment: data.q5_school_environment || '',
            howHeard: data.leadSource || 'Digital',
            dayScholarHostel: data.dsHostel || '',
            priority: data.priority || '',
            createdBy: session.user.name,
            source: 'Digital',
            notes: data.comments || 'Added via Add Student form',
            status: data.status || 'New',
        });

        return NextResponse.json({
            success: true,
            message: 'Student inquiry added successfully',
            id: result.id
        })
    } catch (error) {
        console.error('Error adding student inquiry:', error)
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Failed to add student inquiry'
        }, { status: 500 })
    }
}

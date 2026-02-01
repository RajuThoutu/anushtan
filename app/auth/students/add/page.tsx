'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AddStudentPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        // Student Information
        studentName: '',
        currentClass: '',
        currentSchool: '',
        board: '',

        // Parent Information
        parentName: '',
        occupation: '',
        primaryContact: '',
        secondaryContact: '',
        email: '',

        // Parent Preferences
        q1_education_guide: '',
        q2_learning_approach: '',
        q3_teacher_preference: '',
        q4_child_priority: '',
        q5_school_environment: '',

        // Inquiry Details
        leadSource: '',
        dsHostel: 'Day Scholar',
        comments: '',

        // Initial Status (auto-filled)
        inquiryDate: new Date().toISOString().split('T')[0],
        status: 'New',
        priority: 'Medium'
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            const response = await fetch('/api/students/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                // Reset form
                setFormData({
                    studentName: '',
                    currentClass: '',
                    currentSchool: '',
                    board: '',
                    parentName: '',
                    occupation: '',
                    primaryContact: '',
                    secondaryContact: '',
                    email: '',
                    q1_education_guide: '',
                    q2_learning_approach: '',
                    q3_teacher_preference: '',
                    q4_child_priority: '',
                    q5_school_environment: '',
                    leadSource: '',
                    dsHostel: 'Day Scholar',
                    comments: '',
                    inquiryDate: new Date().toISOString().split('T')[0],
                    status: 'New',
                    priority: 'Medium'
                })

                // Show success for 2 seconds then redirect
                setTimeout(() => {
                    router.push('/auth/dashboard')
                }, 2000)
            } else {
                setError(data.error || 'Failed to add student inquiry')
            }
        } catch (err) {
            setError('An error occurred. Please try again.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-anushtan-parchment">
            {/* Header */}
            <header className="bg-white border-b border-anushtan-border">
                <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                            Add Student Inquiry
                        </h1>
                        <p className="text-sm text-anushtan-charcoal/60">
                            Capture new lead information
                        </p>
                    </div>
                    <button
                        onClick={() => router.push('/auth/dashboard')}
                        className="text-sm text-anushtan-terracotta hover:underline"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="container-custom max-w-4xl mx-auto px-4 py-8">
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                        ✅ Student inquiry added successfully! Redirecting to dashboard...
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-anushtan-border p-8 space-y-8">

                    {/* Student Information Section */}
                    <div>
                        <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                            Student Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Student Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="studentName"
                                    value={formData.studentName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="Enter student's full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Current Class <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="currentClass"
                                    value={formData.currentClass}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                >
                                    <option value="">Select class</option>
                                    <option value="Nursery">Nursery</option>
                                    <option value="LKG">LKG</option>
                                    <option value="UKG">UKG</option>
                                    <option value="1st Grade">1st Grade</option>
                                    <option value="2nd Grade">2nd Grade</option>
                                    <option value="3rd Grade">3rd Grade</option>
                                    <option value="4th Grade">4th Grade</option>
                                    <option value="5th Grade">5th Grade</option>
                                    <option value="6th Grade">6th Grade</option>
                                    <option value="7th Grade">7th Grade</option>
                                    <option value="8th Grade">8th Grade</option>
                                    <option value="9th Grade">9th Grade</option>
                                    <option value="10th Grade">10th Grade</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Current School
                                </label>
                                <input
                                    type="text"
                                    name="currentSchool"
                                    value={formData.currentSchool}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="Current school name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Board
                                </label>
                                <select
                                    name="board"
                                    value={formData.board}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                >
                                    <option value="">Select board</option>
                                    <option value="CBSE">CBSE</option>
                                    <option value="ICSE">ICSE</option>
                                    <option value="State Board">State Board</option>
                                    <option value="IB">IB</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Parent Information Section */}
                    <div>
                        <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                            Parent Information
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Parent Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="Parent/Guardian name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Occupation
                                </label>
                                <input
                                    type="text"
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="Parent's occupation"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Primary Contact <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="primaryContact"
                                    value={formData.primaryContact}
                                    onChange={handleChange}
                                    required
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="10-digit mobile number"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Secondary Contact
                                </label>
                                <input
                                    type="tel"
                                    name="secondaryContact"
                                    value={formData.secondaryContact}
                                    onChange={handleChange}
                                    pattern="[0-9]{10}"
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="10-digit mobile number (optional)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="parent@example.com (optional)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Parent Preferences Section */}
                    <div>
                        <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                            Parent Preferences
                        </h2>
                        <p className="text-sm text-anushtan-charcoal/60 mb-6">
                            Help us understand your educational philosophy and expectations
                        </p>
                        <div className="space-y-6">
                            {/* Question 1 */}
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                    1. Who should guide a child's education?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q1_education_guide"
                                            value="schools_marks"
                                            checked={formData.q1_education_guide === 'schools_marks'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Schools mainly focused on marks and ranks</span>
                                    </label>
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q1_education_guide"
                                            value="teachers_mentors"
                                            checked={formData.q1_education_guide === 'teachers_mentors'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Teachers and mentors who guide children step by step</span>
                                    </label>
                                </div>
                            </div>

                            {/* Question 2 */}
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                    2. How should children learn subjects?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q2_learning_approach"
                                            value="memorising"
                                            checked={formData.q2_learning_approach === 'memorising'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">By memorising and completing the syllabus</span>
                                    </label>
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q2_learning_approach"
                                            value="understanding"
                                            checked={formData.q2_learning_approach === 'understanding'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">By understanding concepts with explanation and activities</span>
                                    </label>
                                </div>
                            </div>

                            {/* Question 3 */}
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                    3. What kind of teachers do you prefer?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q3_teacher_preference"
                                            value="strict_syllabus"
                                            checked={formData.q3_teacher_preference === 'strict_syllabus'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Teachers who strictly complete the syllabus</span>
                                    </label>
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q3_teacher_preference"
                                            value="caring_explaining"
                                            checked={formData.q3_teacher_preference === 'caring_explaining'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Teachers who explain well and care about each child</span>
                                    </label>
                                </div>
                            </div>

                            {/* Question 4 */}
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                    4. What is more important for your child?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q4_child_priority"
                                            value="only_studies"
                                            checked={formData.q4_child_priority === 'only_studies'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Only studies and marks</span>
                                    </label>
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q4_child_priority"
                                            value="holistic"
                                            checked={formData.q4_child_priority === 'holistic'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Studies along with sports, skills, and activities</span>
                                    </label>
                                </div>
                            </div>

                            {/* Question 5 */}
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                    5. Which school environment do you prefer?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q5_school_environment"
                                            value="selective_performance"
                                            checked={formData.q5_school_environment === 'selective_performance'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Schools that select children only by current performance</span>
                                    </label>
                                    <label className="flex items-start p-3 border border-anushtan-border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="radio"
                                            name="q5_school_environment"
                                            value="nurturing_improvement"
                                            checked={formData.q5_school_environment === 'nurturing_improvement'}
                                            onChange={handleChange}
                                            className="mt-1 mr-3"
                                        />
                                        <span className="text-sm">Schools that help every child improve with guidance and care</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Inquiry Details Section */}
                    <div>
                        <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                            Inquiry Details
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Lead Source <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="leadSource"
                                    value={formData.leadSource}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                >
                                    <option value="">Select source</option>
                                    <option value="Walk-in">Walk-in</option>
                                    <option value="Phone Call">Phone Call</option>
                                    <option value="Website">Website</option>
                                    <option value="Referral">Referral</option>
                                    <option value="Social Media">Social Media</option>
                                    <option value="Advertisement">Advertisement</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Day Scholar / Hostel <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="dsHostel"
                                    value={formData.dsHostel}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                >
                                    <option value="Day Scholar">Day Scholar</option>
                                    <option value="Hostel">Hostel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Inquiry Date
                                </label>
                                <input
                                    type="date"
                                    name="inquiryDate"
                                    value={formData.inquiryDate}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta bg-gray-50"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                    Comments / Notes
                                </label>
                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    placeholder="Any additional information about the inquiry..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-anushtan-terracotta text-white font-semibold py-3 px-6 rounded-lg hover:bg-anushtan-terracotta/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Adding Inquiry...' : '✅ Add Student Inquiry'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.push('/auth/dashboard')}
                            className="px-6 py-3 border border-anushtan-border text-anushtan-charcoal rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </main>
        </div>
    )
}

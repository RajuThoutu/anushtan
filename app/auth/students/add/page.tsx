'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// Translation object
const translations = {
    en: {
        pageTitle: 'Add Student Inquiry',
        pageSubtitle: 'Capture new lead information',
        backToDashboard: '← Back to Dashboard',
        successMessage: '{t.successMessage}',

        // Student Information
        studentInfo: 'Student Information',
        studentName: 'Student Name',
        studentNamePlaceholder: "Enter student's full name",
        currentClass: 'Current Class',
        selectClass: 'Select class',
        currentSchool: 'Current School',
        currentSchoolPlaceholder: 'Current school name',
        board: 'Board',
        selectBoard: 'Select board',

        // Parent Information
        parentInfo: 'Parent Information',
        parentName: 'Parent Name',
        parentNamePlaceholder: 'Parent/Guardian name',
        occupation: 'Occupation',
        occupationPlaceholder: "Parent's occupation",
        primaryContact: 'Primary Contact',
        primaryContactPlaceholder: '10-digit mobile number',
        secondaryContact: 'Secondary Contact',
        secondaryContactPlaceholder: '10-digit mobile number (optional)',
        emailAddress: 'Email Address',
        emailPlaceholder: 'parent@example.com (optional)',

        // Parent Preferences
        parentPreferences: 'Parent Preferences',
        preferencesSubtitle: 'Help us understand your educational philosophy and expectations',
        q1: 'Who should guide a child\'s education?',
        q1_opt1: 'Schools mainly focused on marks and ranks',
        q1_opt2: 'Teachers and mentors who guide children step by step',
        q2: 'How should children learn subjects?',
        q2_opt1: 'By memorising and completing the syllabus',
        q2_opt2: 'By understanding concepts with explanation and activities',
        q3: 'What kind of teachers do you prefer?',
        q3_opt1: 'Teachers who strictly complete the syllabus',
        q3_opt2: 'Teachers who explain well and care about each child',
        q4: 'What is more important for your child?',
        q4_opt1: 'Only studies and marks',
        q4_opt2: 'Studies along with sports, skills, and activities',
        q5: 'Which school environment do you prefer?',
        q5_opt1: 'Schools that select children only by current performance',
        q5_opt2: 'Schools that help every child improve with guidance and care',

        // Inquiry Details
        inquiryDetails: 'Inquiry Details',
        leadSource: 'Lead Source',
        selectSource: 'Select source',
        dsHostel: 'Day Scholar / Hostel',
        inquiryDate: 'Inquiry Date',
        priority: 'Priority',
        comments: 'Comments / Notes',
        commentsPlaceholder: 'Any additional information about the inquiry...',

        // Buttons
        submitButton: '✅ Add Student Inquiry',
        submittingButton: 'Adding Inquiry...',
        cancelButton: 'Cancel',

        // Options
        dayScholar: 'Day Scholar',
        hostel: 'Hostel',
        low: 'Low',
        medium: 'Medium',
        high: 'High',

        // Lead Sources
        walkIn: 'Walk-in',
        phoneCall: 'Phone Call',
        website: 'Website',
        referral: 'Referral',
        socialMedia: 'Social Media',
        advertisement: 'Advertisement',
        other: 'Other',

        // Boards
        cbse: 'CBSE',
        icse: 'ICSE',
        stateBoard: 'State Board',
        ib: 'IB',

        // Classes
        nursery: 'Nursery',
        lkg: 'LKG',
        ukg: 'UKG',
        grade1: '1st Grade',
        grade2: '2nd Grade',
        grade3: '3rd Grade',
        grade4: '4th Grade',
        grade5: '5th Grade',
        grade6: '6th Grade',
        grade7: '7th Grade',
        grade8: '8th Grade',
        grade9: '9th Grade',
        grade10: '10th Grade',
    },
    te: {
        pageTitle: 'విద్యార్థి విచారణ జోడించండి',
        pageSubtitle: 'కొత్త లీడ్ సమాచారాన్ని సేకరించండి',
        backToDashboard: '← డాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి',
        successMessage: '✅ విద్యార్థి విచారణ విజయవంతంగా జోడించబడింది! డాష్‌బోర్డ్‌కు మళ్లిస్తోంది...',

        // Student Information
        studentInfo: 'విద్యార్థి సమాచారం',
        studentName: 'విద్యార్థి పేరు',
        studentNamePlaceholder: 'విద్యార్థి పూర్తి పేరు నమోదు చేయండి',
        currentClass: 'ప్రస్తుత తరగతి',
        selectClass: 'తరగతిని ఎంచుకోండి',
        currentSchool: 'ప్రస్తుత పాఠశాల',
        currentSchoolPlaceholder: 'ప్రస్తుత పాఠశాల పేరు',
        board: 'బోర్డు',
        selectBoard: 'బోర్డును ఎంచుకోండి',

        // Parent Information
        parentInfo: 'తల్లిదండ్రుల సమాచారం',
        parentName: 'తల్లిదండ్రుల పేరు',
        parentNamePlaceholder: 'తల్లిదండ్రుల/సంరక్షకుల పేరు',
        occupation: 'వృత్తి',
        occupationPlaceholder: 'తల్లిదండ్రుల వృత్తి',
        primaryContact: 'ప్రాథమిక సంప్రదింపు',
        primaryContactPlaceholder: '10-అంకెల మొబైల్ నంబర్',
        secondaryContact: 'ద్వితీయ సంప్రదింపు',
        secondaryContactPlaceholder: '10-అంకెల మొబైల్ నంబర్ (ఐచ్ఛికం)',
        emailAddress: 'ఇమెయిల్ చిరునామా',
        emailPlaceholder: 'parent@example.com (ఐచ్ఛికం)',

        // Parent Preferences
        parentPreferences: 'తల్లిదండ్రుల ప్రాధాన్యతలు',
        preferencesSubtitle: 'మీ విద్యా తత్వశాస్త్రం మరియు అంచనాలను అర్థం చేసుకోవడంలో మాకు సహాయపడండి',
        q1: 'పిల్లల విద్యకు ఎవరు మార్గదర్శకత్వం వహించాలి?',
        q1_opt1: 'ప్రధానంగా మార్కులు మరియు ర్యాంకులపై దృష్టి సారించే పాఠశాలలు',
        q1_opt2: 'పిల్లలకు అడుగడుగునా మార్గదర్శకత్వం చేసే ఉపాధ్యాయులు మరియు మార్గదర్శకులు',
        q2: 'పిల్లలు విషయాలను ఎలా నేర్చుకోవాలి?',
        q2_opt1: 'పాఠ్యాంశాలను కంఠస్థం చేయడం మరియు పూర్తి చేయడం ద్వారా',
        q2_opt2: 'వివరణ మరియు కార్యకలాపాలతో భావనలను అర్థం చేసుకోవడం ద్వారా',
        q3: 'మీరు ఎలాంటి ఉపాధ్యాయులను ఇష్టపడతారు?',
        q3_opt1: 'పాఠ్యాంశాలను ఖచ్చితంగా పూర్తి చేసే ఉపాధ్యాయులు',
        q3_opt2: 'బాగా వివరించే మరియు ప్రతి పిల్లవాడి గురించి శ్రద్ధ వహించే ఉపాధ్యాయులు',
        q4: 'మీ పిల్లవాడికి ఏది ముఖ్యం?',
        q4_opt1: 'చదువులు మరియు మార్కులు మాత్రమే',
        q4_opt2: 'క్రీడలు, నైపుణ్యాలు మరియు కార్యకలాపాలతో పాటు చదువులు',
        q5: 'మీరు ఏ పాఠశాల వాతావరణాన్ని ఇష్టపడతారు?',
        q5_opt1: 'ప్రస్తుత పనితీరు ఆధారంగా మాత్రమే పిల్లలను ఎంపిక చేసే పాఠశాలలు',
        q5_opt2: 'మార్గదర్శకత్వం మరియు శ్రద్ధతో ప్రతి పిల్లవాడిని మెరుగుపరచడంలో సహాయపడే పాఠశాలలు',

        // Inquiry Details
        inquiryDetails: 'విచారణ వివరాలు',
        leadSource: 'లీడ్ మూలం',
        selectSource: 'మూలాన్ని ఎంచుకోండి',
        dsHostel: 'డే స్కాలర్ / హాస్టల్',
        inquiryDate: 'విచారణ తేదీ',
        priority: 'ప్రాధాన్యత',
        comments: 'వ్యాఖ్యలు / గమనికలు',
        commentsPlaceholder: 'విచారణ గురించి ఏదైనా అదనపు సమాచారం...',

        // Buttons
        submitButton: '✅ విద్యార్థి విచారణ జోడించండి',
        submittingButton: 'విచారణ జోడిస్తోంది...',
        cancelButton: 'రద్దు చేయండి',

        // Options
        dayScholar: 'డే స్కాలర్',
        hostel: 'హాస్టల్',
        low: 'తక్కువ',
        medium: 'మధ్యస్థ',
        high: 'అధిక',

        // Lead Sources
        walkIn: 'వాక్-ఇన్',
        phoneCall: 'ఫోన్ కాల్',
        website: 'వెబ్‌సైట్',
        referral: 'రెఫరల్',
        socialMedia: 'సోషల్ మీడియా',
        advertisement: 'ప్రకటన',
        other: 'ఇతరం',

        // Boards
        cbse: 'CBSE',
        icse: 'ICSE',
        stateBoard: 'రాష్ట్ర బోర్డు',
        ib: 'IB',

        // Classes
        nursery: 'నర్సరీ',
        lkg: 'LKG',
        ukg: 'UKG',
        grade1: '1వ తరగతి',
        grade2: '2వ తరగతి',
        grade3: '3వ తరగతి',
        grade4: '4వ తరగతి',
        grade5: '5వ తరగతి',
        grade6: '6వ తరగతి',
        grade7: '7వ తరగతి',
        grade8: '8వ తరగతి',
        grade9: '9వ తరగతి',
        grade10: '10వ తరగతి',
    }
}

export default function AddStudentPage() {
    const { data: session } = useSession()
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [language, setLanguage] = useState<'en' | 'te'>('en')

    const t = translations[language]

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
        <>
            {/* Print-specific styles */}
            <style jsx>{`
                @media print {
                    /* Hide non-essential elements */
                    header,
                    .language-toggle,
                    button[type="button"] {
                        display: none !important;
                    }

                    /* Page setup */
                    @page {
                        size: A4;
                        margin: 0.5cm;
                    }

                    /* Container adjustments */
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }

                    /* Form container */
                    .min-h-screen {
                        min-height: auto !important;
                        background: white !important;
                    }

                    main {
                        padding: 0 !important;
                        max-width: 100% !important;
                    }

                    /* Form styling */
                    form {
                        padding: 1rem !important;
                        border: 1px solid #ddd !important;
                        page-break-inside: avoid;
                    }

                    /* Section spacing */
                    form > div {
                        margin-bottom: 0.75rem !important;
                        page-break-inside: avoid;
                    }

                    /* Headers */
                    h2 {
                        font-size: 14px !important;
                        margin-bottom: 0.5rem !important;
                        padding-bottom: 0.25rem !important;
                    }

                    /* Grid layouts - make more compact */
                    .grid {
                        gap: 0.5rem !important;
                    }

                    /* Labels and inputs */
                    label {
                        font-size: 11px !important;
                        margin-bottom: 0.25rem !important;
                    }

                    input,
                    select,
                    textarea {
                        padding: 0.25rem 0.5rem !important;
                        font-size: 11px !important;
                        border: 1px solid #ddd !important;
                    }

                    textarea {
                        min-height: 35px !important;
                        max-height: 35px !important;
                    }

                    /* Radio buttons section */
                    .space-y-6 {
                        gap: 0.5rem !important;
                    }

                    .space-y-2 {
                        gap: 0.25rem !important;
                        display: grid !important;
                        grid-template-columns: 1fr 1fr !important;
                    }

                    /* Radio button labels - remove boxes and borders */
                    label.flex {
                        padding: 0.15rem !important;
                        font-size: 10px !important;
                        border: none !important;
                        background: transparent !important;
                        box-shadow: none !important;
                    }

                    /* Preference subtitle */
                    p.text-sm {
                        font-size: 10px !important;
                        margin-bottom: 0.5rem !important;
                    }

                    /* Submit button area */
                    .flex.gap-4 {
                        margin-top: 0.5rem !important;
                    }

                    button[type="submit"] {
                        padding: 0.5rem 1rem !important;
                        font-size: 12px !important;
                    }

                    /* Success/Error messages */
                    .bg-green-50,
                    .bg-red-50 {
                        padding: 0.5rem !important;
                        font-size: 11px !important;
                        margin-bottom: 0.5rem !important;
                    }

                    /* Ensure everything fits on one page */
                    * {
                        box-sizing: border-box;
                    }

                    /* Remove excessive margins */
                    .mb-6 {
                        margin-bottom: 0.5rem !important;
                    }

                    .mb-4 {
                        margin-bottom: 0.5rem !important;
                    }

                    .mb-3 {
                        margin-bottom: 0.25rem !important;
                    }

                    .mb-2 {
                        margin-bottom: 0.25rem !important;
                    }

                    .py-8 {
                        padding-top: 0.5rem !important;
                        padding-bottom: 0.5rem !important;
                    }

                    .py-4 {
                        padding-top: 0.25rem !important;
                        padding-bottom: 0.25rem !important;
                    }

                    .py-3 {
                        padding-top: 0.25rem !important;
                        padding-bottom: 0.25rem !important;
                    }

                    .p-8 {
                        padding: 1rem !important;
                    }

                    .p-4 {
                        padding: 0.5rem !important;
                    }

                    .p-3 {
                        padding: 0.25rem !important;
                    }

                    /* More aggressive spacing reductions */
                    .space-y-4 {
                        gap: 0.4rem !important;
                    }

                    /* Optimize Inquiry Details section with 3-column layout */
                    form > div:last-of-type .grid {
                        grid-template-columns: repeat(3, 1fr) !important;
                        gap: 0.4rem !important;
                    }

                    /* Make textarea span full width in its row */
                    form > div:last-of-type .grid > div:has(textarea) {
                        grid-column: 1 / -1 !important;
                    }

                    /* Reduce section header spacing */
                    h2.font-heading {
                        margin-top: 0.4rem !important;
                        margin-bottom: 0.4rem !important;
                        padding-bottom: 0.2rem !important;
                    }

                    /* Reduce form padding */
                    form {
                        padding: 0.75rem !important;
                    }

                    /* Two-column layout for form fields */
                    .md\\:grid-cols-2 {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
            `}</style>
            <div className="min-h-screen bg-anushtan-parchment">
                {/* Header */}
                <header className="bg-white border-b border-anushtan-border">
                    <div className="container-custom max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="font-heading text-2xl font-bold text-anushtan-terracotta">
                                {t.pageTitle}
                            </h1>
                            <p className="text-sm text-anushtan-charcoal/60">
                                {t.pageSubtitle}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Language Toggle */}
                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'en'
                                        ? 'bg-white text-anushtan-terracotta shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    English
                                </button>
                                <button
                                    onClick={() => setLanguage('te')}
                                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${language === 'te'
                                        ? 'bg-white text-anushtan-terracotta shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    తెలుగు
                                </button>
                            </div>
                            <button
                                onClick={() => router.push('/auth/dashboard')}
                                className="text-sm text-anushtan-terracotta hover:underline"
                            >
                                {t.backToDashboard}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="container-custom max-w-4xl mx-auto px-4 py-8">
                    {success && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {t.successMessage}
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
                                {t.studentInfo}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.studentName} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="studentName"
                                        value={formData.studentName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.studentNamePlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.currentClass} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="currentClass"
                                        value={formData.currentClass}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    >
                                        <option value="">{t.selectClass}</option>
                                        <option value="Nursery">{t.nursery}</option>
                                        <option value="LKG">{t.lkg}</option>
                                        <option value="UKG">{t.ukg}</option>
                                        <option value="1st Grade">{t.grade1}</option>
                                        <option value="2nd Grade">{t.grade2}</option>
                                        <option value="3rd Grade">{t.grade3}</option>
                                        <option value="4th Grade">{t.grade4}</option>
                                        <option value="5th Grade">{t.grade5}</option>
                                        <option value="6th Grade">{t.grade6}</option>
                                        <option value="7th Grade">{t.grade7}</option>
                                        <option value="8th Grade">{t.grade8}</option>
                                        <option value="9th Grade">{t.grade9}</option>
                                        <option value="10th Grade">{t.grade10}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.currentSchool}
                                    </label>
                                    <input
                                        type="text"
                                        name="currentSchool"
                                        value={formData.currentSchool}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.currentSchoolPlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.board}
                                    </label>
                                    <select
                                        name="board"
                                        value={formData.board}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    >
                                        <option value="">{t.selectBoard}</option>
                                        <option value="CBSE">{t.cbse}</option>
                                        <option value="ICSE">{t.icse}</option>
                                        <option value="State Board">{t.stateBoard}</option>
                                        <option value="IB">{t.ib}</option>
                                        <option value="Other">{t.other}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Parent Information Section */}
                        <div>
                            <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                                {t.parentInfo}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.parentName} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="parentName"
                                        value={formData.parentName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.parentNamePlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.occupation}
                                    </label>
                                    <input
                                        type="text"
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.occupationPlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.primaryContact} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        name="primaryContact"
                                        value={formData.primaryContact}
                                        onChange={handleChange}
                                        required
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.primaryContactPlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.secondaryContact}
                                    </label>
                                    <input
                                        type="tel"
                                        name="secondaryContact"
                                        value={formData.secondaryContact}
                                        onChange={handleChange}
                                        pattern="[0-9]{10}"
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.secondaryContactPlaceholder}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.emailAddress}
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.emailPlaceholder}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Parent Preferences Section */}
                        <div>
                            <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                                {t.parentPreferences}
                            </h2>
                            <p className="text-sm text-anushtan-charcoal/60 mb-6">
                                {t.preferencesSubtitle}
                            </p>
                            <div className="space-y-6">
                                {/* Question 1 */}
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                        {`1. ${t.q1}`}
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
                                            <span className="text-sm">{t.q1_opt1}</span>
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
                                            <span className="text-sm">{t.q1_opt2}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Question 2 */}
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                        {`2. ${t.q2}`}
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
                                            <span className="text-sm">{t.q2_opt1}</span>
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
                                            <span className="text-sm">{t.q2_opt2}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Question 3 */}
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                        {`3. ${t.q3}`}
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
                                            <span className="text-sm">{t.q3_opt1}</span>
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
                                            <span className="text-sm">{t.q3_opt2}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Question 4 */}
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                        {`4. ${t.q4}`}
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
                                            <span className="text-sm">{t.q4_opt1}</span>
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
                                            <span className="text-sm">{t.q4_opt2}</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Question 5 */}
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-3">
                                        {`5. ${t.q5}`}
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
                                            <span className="text-sm">{t.q5_opt1}</span>
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
                                            <span className="text-sm">{t.q5_opt2}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Inquiry Details Section */}
                        <div>
                            <h2 className="font-heading text-xl font-bold text-anushtan-charcoal mb-4 pb-2 border-b border-anushtan-border">
                                {t.inquiryDetails}
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.leadSource} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="leadSource"
                                        value={formData.leadSource}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    >
                                        <option value="">{t.selectSource}</option>
                                        <option value="Walk-in">{t.walkIn}</option>
                                        <option value="Phone Call">{t.phoneCall}</option>
                                        <option value="Website">{t.website}</option>
                                        <option value="Referral">{t.referral}</option>
                                        <option value="Social Media">{t.socialMedia}</option>
                                        <option value="Advertisement">{t.advertisement}</option>
                                        <option value="Other">{t.other}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.dsHostel} <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="dsHostel"
                                        value={formData.dsHostel}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    >
                                        <option value="Day Scholar">{t.dayScholar}</option>
                                        <option value="Hostel">{t.hostel}</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.inquiryDate}
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
                                        {t.priority}
                                    </label>
                                    <select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                    >
                                        <option value="Low">{t.low}</option>
                                        <option value="Medium">{t.medium}</option>
                                        <option value="High">{t.high}</option>
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-anushtan-charcoal mb-2">
                                        {t.comments}
                                    </label>
                                    <textarea
                                        name="comments"
                                        value={formData.comments}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-anushtan-border rounded-lg focus:outline-none focus:ring-2 focus:ring-anushtan-terracotta"
                                        placeholder={t.commentsPlaceholder}
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
                                {isSubmitting ? t.submittingButton : t.submitButton}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push('/auth/dashboard')}
                                className="px-6 py-3 border border-anushtan-border text-anushtan-charcoal rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                {t.cancelButton}
                            </button>
                        </div>
                    </form>
                </main>
            </div>
        </>
    )
}

/**
 * Anushtan WhatsApp Inquiry Chatbot — Questionnaire Definition
 *
 * Mirrors the admin Add Student form at /students/add/page.tsx exactly.
 * 4 Sections: Student Info, Parent Info, Parent Preferences, Final.
 */

export interface Question {
    id: string;
    text: string;
    required: boolean;
    section?: string;       // Section header shown before this question
    sectionEmoji?: string;
}

// ─── Messages ────────────────────────────────────────────────────

export const GREETING_MESSAGE = `🙏 *Namaste! Welcome to Anushtan.*

We're glad you're interested. How can we help you today?

*Reply with a number:*
1️⃣ Fill Inquiry Form
2️⃣ Talk to a Counselor
3️⃣ Visit our Website`;

export const FORM_INTRO_MESSAGE = `📝 *Great! Let's fill out the inquiry form.*

I'll walk you through a few questions — just reply with your answer.
For optional questions, type *skip* to move on.

Let's start! 👇`;

export const COMPLETION_MESSAGE = `✅ *Thank you! Your inquiry has been submitted successfully.*

Our counselor team will review your responses and reach out to you shortly on this number.

If you have any questions, feel free to message us anytime.

🙏 *Anushtan — Not Just a School. A Swadharma.*

_Type "hi" to start a new conversation._`;

export const COUNSELOR_MESSAGE = `📞 *Talk to a Counselor*

Please call us at: *+91 90000 00000*
Or email: *info@anushtan.com*

Our team is available Mon–Sat, 9 AM – 6 PM.

_Type "hi" to go back to the menu._`;

export const WEBSITE_MESSAGE = `🌐 *Visit our Website*

👉 https://anushtan.com

_Type "hi" to go back to the menu._`;

// ─── Questions (13 total, mirrors admin form) ────────────────────

export const QUESTIONS: Question[] = [
    // ── Section 1: Student Information ──
    {
        id: 'studentName',
        text: '👤 What is the *student\'s full name*?',
        required: true,
        section: '📚 *Section 1: Student Information*',
    },
    {
        id: 'currentClass',
        text: `🎓 *Current class/grade?*

1. Nursery
2. LKG
3. UKG
4. 1st Grade
5. 2nd Grade
6. 3rd Grade
7. 4th Grade
8. 5th Grade
9. 6th Grade
10. 7th Grade
11. 8th Grade
12. 9th Grade
13. 10th Grade

_(Reply with a number or type the class name)_`,
        required: true,
    },
    {
        id: 'currentSchool',
        text: '🏫 Current school name? _(type "skip" if not applicable)_',
        required: false,
    },
    {
        id: 'board',
        text: `📋 *Which board?*

1. CBSE
2. ICSE
3. State Board
4. IB
5. Other

_(Reply with a number or type "skip")_`,
        required: false,
    },

    // ── Section 2: Parent Information ──
    {
        id: 'parentName',
        text: '👨‍👩‍👧 *Parent/Guardian\'s name?*',
        required: true,
        section: '👪 *Section 2: Parent Information*',
    },
    {
        id: 'occupation',
        text: '💼 Parent\'s occupation? _(type "skip" if you prefer not to share)_',
        required: false,
    },
    {
        id: 'email',
        text: '📧 Email address? _(type "skip" if you prefer not to share)_',
        required: false,
    },

    // ── Section 3: Parent Preferences ──
    {
        id: 'q1_education_guide',
        text: `🎓 *Who should guide a child's education?*

A) Schools mainly focused on marks and ranks
B) Teachers and mentors who guide children step by step

_(Reply A or B)_`,
        required: false,
        section: '💡 *Section 3: Parent Preferences*\n_Help us understand your educational philosophy_',
    },
    {
        id: 'q2_learning_approach',
        text: `📖 *How should children learn subjects?*

A) By memorising and completing the syllabus
B) By understanding concepts with explanation and activities

_(Reply A or B)_`,
        required: false,
    },
    {
        id: 'q3_teacher_preference',
        text: `👩‍🏫 *What kind of teachers do you prefer?*

A) Teachers who strictly complete the syllabus
B) Teachers who explain well and care about each child

_(Reply A or B)_`,
        required: false,
    },
    {
        id: 'q4_child_priority',
        text: `⭐ *What is more important for your child?*

A) Only studies and marks
B) Studies along with sports, skills, and activities

_(Reply A or B)_`,
        required: false,
    },
    {
        id: 'q5_school_environment',
        text: `🏫 *Which school environment do you prefer?*

A) Schools that select children only by current performance
B) Schools that help every child improve with guidance and care

_(Reply A or B)_`,
        required: false,
    },

    // ── Section 4: Final ──
    {
        id: 'dayScholarHostel',
        text: `🏠 *Day Scholar or Hostel?*

1. Day Scholar
2. Hostel
3. Not sure yet

_(Reply with a number)_`,
        required: false,
        section: '📋 *Almost done!*',
    },
];

// ─── Answer Resolution ──────────────────────────────────────────

const CLASS_MAP: Record<string, string> = {
    '1': 'Nursery', '2': 'LKG', '3': 'UKG',
    '4': '1st Grade', '5': '2nd Grade', '6': '3rd Grade',
    '7': '4th Grade', '8': '5th Grade', '9': '6th Grade',
    '10': '7th Grade', '11': '8th Grade', '12': '9th Grade',
    '13': '10th Grade',
};

const BOARD_MAP: Record<string, string> = {
    '1': 'CBSE', '2': 'ICSE', '3': 'State Board', '4': 'IB', '5': 'Other',
};

const DS_HOSTEL_MAP: Record<string, string> = {
    '1': 'Day Scholar', '2': 'Hostel', '3': 'Not sure yet',
};

const PREFERENCE_MAP: Record<string, Record<string, string>> = {
    q1_education_guide: {
        'a': 'Schools mainly focused on marks and ranks',
        'b': 'Teachers and mentors who guide children step by step',
    },
    q2_learning_approach: {
        'a': 'By memorising and completing the syllabus',
        'b': 'By understanding concepts with explanation and activities',
    },
    q3_teacher_preference: {
        'a': 'Teachers who strictly complete the syllabus',
        'b': 'Teachers who explain well and care about each child',
    },
    q4_child_priority: {
        'a': 'Only studies and marks',
        'b': 'Studies along with sports, skills, and activities',
    },
    q5_school_environment: {
        'a': 'Schools that select children only by current performance',
        'b': 'Schools that help every child improve with guidance and care',
    },
};

/**
 * Resolves a user's reply to a readable answer.
 */
export function resolveAnswer(questionId: string, rawAnswer: string): string {
    const trimmed = rawAnswer.trim();

    if (trimmed.toLowerCase() === 'skip') return '';

    // Class selection
    if (questionId === 'currentClass') {
        return CLASS_MAP[trimmed] || trimmed;
    }

    // Board selection
    if (questionId === 'board') {
        return BOARD_MAP[trimmed] || trimmed;
    }

    // Day Scholar / Hostel
    if (questionId === 'dayScholarHostel') {
        return DS_HOSTEL_MAP[trimmed] || trimmed;
    }

    // Preference questions (A/B)
    const prefMap = PREFERENCE_MAP[questionId];
    if (prefMap) {
        const lower = trimmed.toLowerCase();
        return prefMap[lower] || trimmed;
    }

    return trimmed;
}

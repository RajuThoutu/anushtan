/**
 * Hardcoded user credentials
 *
 * To add a new user:
 * 1. Generate password hash: https://bcrypt-generator.com/ (use rounds: 10)
 * 2. Add user object below
 * 3. Commit and deploy
 *
 * Roles: super_admin, admin, hr, career_councillor
 */

export interface User {
    id: string
    email: string
    password_hash: string
    name: string
    role: 'super_admin' | 'admin' | 'hr' | 'career_councillor'
    is_active: boolean
}

export const users: User[] = [
    {
        id: '1',
        email: 'raju',
        // Password: Vedansh@2026
        password_hash: '$2b$10$J65a/FZrmE2gXRPfBF0hIuEK6o2GhDZfjvPUQNx3lGqB5QKHZEag2',
        name: 'Raju Thoutu',
        role: 'super_admin',
        is_active: true
    },
    {
        id: '2',
        email: 'naren',
        // Password: naren@2026
        password_hash: '$2b$10$dkT9CXpxalncbM8oy1A1n.cuKzRMzGSBV9MSsA627SV.X7LNqEj1y',
        name: 'Naren',
        role: 'admin',
        is_active: true
    },
    {
        id: '3',
        email: 'karthik',
        // Password: karthik@2026
        password_hash: '$2b$10$YhvzIeWZ6kaoqOATEay3kO/XQnxmVAKXTt/2bEHcEwBtJzWn/Ci3u',
        name: 'Karthik',
        role: 'admin',
        is_active: true
    },
    {
        id: '4',
        email: 'bhaskar',
        // Password: bhaskar@2026
        password_hash: '$2b$10$qto7m.GtBGGlbHCGCf86GueTueNA6YAUkH4EFxGLy6.G38wpOUzuS',
        name: 'Bhaskar',
        role: 'admin',
        is_active: true
    },
    {
        id: '5',
        email: 'jyothi',
        // Password: jyothi@2026
        password_hash: '$2b$10$/Fv8.NDOGLVZfgeqfDRsIesHwECghkRKYcCZoBkMki2mdNrSwWCdC',
        name: 'Jyothi',
        role: 'admin',
        is_active: true
    },
    {
        id: '6',
        email: 'bhargavi',
        // Password: Aum@2026
        password_hash: '$2b$10$iMuwDZPu7pBTX8lQL/XvRulJ11awWXYk19It.kdBgv1qf4cijaa/C',
        name: 'Bhargavi',
        role: 'hr', // HR & Counsellor
        is_active: true
    },
    {
        id: '7',
        email: 'sravani',
        // Password: sravani@2026
        password_hash: '$2b$10$S7iahxA2clCgoF7IYyWvy.oic5F745p2Eh2Tb5OLo2EsAi60wpGN2',
        name: 'Sravani',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '8',
        email: 'bhavani',
        // Password: bhavani@2026
        password_hash: '$2b$10$bS7q1TI85llXPwDXq/VNReBsYhjv4ZrWq5BVTojIoG.ipH5APyWX2',
        name: 'Bhavani',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '9',
        email: 'kavitha',
        // Password: kavitha@2026
        password_hash: '$2b$10$VKPL66i0iHus.tVjkmO0z.1QEmaY0Yx1VoIJBGA6bjFjP4Q272jPS',
        name: 'Kavitha',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '10',
        email: 'cc1',
        // Password: cc1@2026
        password_hash: '$2b$10$wW/6cmIuF/1libostp0n4uJdwqeOPKC3hOLUaPJ8scE.kSVNunWrS',
        name: 'CC1',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '11',
        email: 'cc2',
        // Password: cc2@2026
        password_hash: '$2b$10$ze4JrHFv/jregP6Y1YiN7eCSsVYubu.nEHfe003FEIwbN86KpmY2W',
        name: 'CC2',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '12',
        email: 'cc3',
        // Password: cc3@2026
        password_hash: '$2b$10$Aoeogzg7FmVirEiVrD6vO.bX0PbuxzuYcZz6Ow4El.tbrYm59GDY.',
        name: 'CC3',
        role: 'career_councillor',
        is_active: true
    }
]

export function findUserByEmail(email: string): User | undefined {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase() && user.is_active)
}

export function findUserById(id: string): User | undefined {
    return users.find(user => user.id === id && user.is_active)
}

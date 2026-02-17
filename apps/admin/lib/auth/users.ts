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
        // Password: Raju@2026
        password_hash: '$2b$10$1PRiOmIlh2.aXXiW8DiTLOStNeWOzp3RVyvVYC8OrT67NabzxsCG2',
        name: 'Raju Thoutu',
        role: 'super_admin',
        is_active: true
    },
    {
        id: '2',
        email: 'naren',
        // Password: Naren@2026
        password_hash: '$2b$10$gCD1CUCEbIgcMMNdWPcjReMpVh9TkNe6lkz5p8OX.AqzL.S71Zoom',
        name: 'Naren',
        role: 'admin',
        is_active: true
    },
    {
        id: '3',
        email: 'karthik',
        // Password: Karthik@2026
        password_hash: '$2b$10$QzP6NT8KdZ7nKuQuTFPKseLOt428ltk7kWGsG0uje1.LAb/3GPElq',
        name: 'Karthik',
        role: 'admin',
        is_active: true
    },
    {
        id: '4',
        email: 'bhaskar',
        // Password: Bhaskar@2026
        password_hash: '$2b$10$qzLve/LP7CNBrUVmkIhGI.U6rQf8X7Uluw0VjHtgZZI22UzjPXm72',
        name: 'Bhaskar',
        role: 'admin',
        is_active: true
    },
    {
        id: '5',
        email: 'jyothi',
        // Password: Jyothi@2026
        password_hash: '$2b$10$avuyoZO4/bIoxptuTyZ.KeQBg.4f7lNjeC.FjNGYEsskMH2g.uh8m',
        name: 'Jyothi',
        role: 'admin',
        is_active: true
    },
    {
        id: '6',
        email: 'bhargavi',
        // Password: Bhargavi@2026
        password_hash: '$2b$10$hRp.tLndRdG5L19olFEbg.gQej9Y0/7SJxHxVPK4hvFgh9D6zjOgO',
        name: 'Bhargavi',
        role: 'hr', // HR & Counsellor
        is_active: true
    },
    {
        id: '7',
        email: 'sravani',
        // Password: Sravani@2026
        password_hash: '$2b$10$1N7LVFw0Px.m5egLSewGV.Av/mhougBu6CzNOUzJcGPV1Eb9w2sXu',
        name: 'Sravani',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '8',
        email: 'bhavani',
        // Password: Bhavani@2026
        password_hash: '$2b$10$ZHcXr860IePr4lJHMaHil.atF6q908BCaxwveUdRKHsj410wjoj2S',
        name: 'Bhavani',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '9',
        email: 'kavitha',
        // Password: Kavitha@2026
        password_hash: '$2b$10$7mTX.DFPMrsih9YTPcVYfe8uLtWd99xfy7QW2esUIARZNrpPli6Qi',
        name: 'Kavitha',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '10',
        email: 'cc1',
        // Password: CC1@2026
        password_hash: '$2b$10$zeJr8XLxbwZVzX96nnveROzL/EahQtRR6wUF9cqR4iNQuZCZZWBG6',
        name: 'CC1',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '11',
        email: 'cc2',
        // Password: CC2@2026
        password_hash: '$2b$10$L1Ssxn2H7gsVdupQGIkX6Oh1Ap4pZWe8oYR4WToR6e4705jdK8/Iq',
        name: 'CC2',
        role: 'career_councillor',
        is_active: true
    },
    {
        id: '12',
        email: 'cc3',
        // Password: CC3@2026
        password_hash: '$2b$10$iDyS8T3qGmltVif.xR5u1OvZEIQGhQjRbz4Oo5FYjdttktsVhdiTW',
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

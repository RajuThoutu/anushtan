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
        password_hash: '$2b$10$FTz5jh2atiFqblyjnsfFJOyi1Hbf.xPLZEvPFh/UwOvc0ZemrYHWu',
        name: 'Bhargavi',
        role: 'hr', // HR & Counsellor
        is_active: true
    },
    {
        id: '7',
        email: 'sravani',
        // Password: Sravani@2026
        password_hash: '$2b$10$hdGzQZXIMd4gnv9VmBDGYOsJFX3eoQkdEDJPj5a92TH/5z0D/rGtu',
        name: 'Sravani',
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

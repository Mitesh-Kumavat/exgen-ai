import React, { createContext, useContext, useState } from 'react';
import type { Student, StudentAuthState } from '@/types';

export const StudentAuthContext = createContext<StudentAuthState | undefined>(undefined);

export const useStudentAuth = (): StudentAuthState => {
    const context = useContext(StudentAuthContext);
    if (!context) {
        throw new Error('useStudentAuth must be used within a StudentAuthProvider');
    }
    return context;
};

export const StudentAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (enrollmentNumber: string, password: string) => {
        // mock login
        setStudent({ _id: '1', name: 'Test', email: 'test@example.com', enrollmentNumber: '101', semester: '4', branch: 'CSE', createdAt: new Date().toISOString() });
        setIsAuthenticated(true);
    };

    const logout = () => {
        setStudent(null);
        setIsAuthenticated(false);
    };

    return (
        <StudentAuthContext.Provider
            value={{ student, isAuthenticated, login, logout }}
        >
            {children}
        </StudentAuthContext.Provider>
    );
};

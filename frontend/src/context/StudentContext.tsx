import React, { createContext, useState } from 'react';
import type { Student, StudentAuthState } from '@/types';
import { axiosInstance } from '@/utils/axiosInstance';
import { API_ENDPOINTS } from '@/utils/apiPaths';

export const StudentAuthContext = createContext<StudentAuthState>({
    student: null,
    isAuthenticated: false,
    login: async () => { },
    logout: () => { },
});

export const StudentAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [student, setStudent] = useState<Student | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (enrollmentNumber: string, password: string) => {

        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.STUDENT.LOGIN, {
            enrollmentNumber,
            password,
        });

        setStudent({
            _id: response.data.data._id,
            mobile: response.data.data.mobile,
            name: response.data.data.name,
            email: response.data.data.email,
            enrollmentNumber: response.data.data.enrollmentNumber,
            semester: response.data.data.semester,
            branch: response.data.data.branch,
            createdAt: response.data.data.createdAt,
        });
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await axiosInstance.get(API_ENDPOINTS.AUTH.STUDENT.LOGOUT);
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

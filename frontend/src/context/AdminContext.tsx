import React, { createContext, useState } from 'react';
import type { AdminAuthState, Admin } from '@/types';
import { axiosInstance } from '@/utils/axiosInstance';
import { API_ENDPOINTS } from '@/utils/apiPaths';

export const AdminAuthContext = createContext<AdminAuthState>({
    admin: null,
    isAuthenticated: false,
    login: async () => { },
    logout: () => { },
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (email: string, password: string) => {

        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.ADMIN.LOGIN, {
            email,
            password,
        });

        setAdmin({
            _id: response.data.data._id,
            email: response.data.data.email,
            name: response.data.data.name,
        })
        setIsAuthenticated(true);
    };

    const logout = async () => {
        await axiosInstance.get(API_ENDPOINTS.AUTH.ADMIN.LOGOUT);
        setAdmin(null);
        setIsAuthenticated(false);
    };

    return (
        <AdminAuthContext.Provider
            value={{ admin, isAuthenticated, login, logout }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

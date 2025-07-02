import React, { createContext, useState } from 'react';
import type { AdminAuthState, Admin } from '@/types';
import { axiosInstance } from '@/utils/axios-instance';
import { API_ENDPOINTS } from '@/utils/api-path';

export const AdminAuthContext = createContext<AdminAuthState>({
    admin: null,
    isAuthenticated: false,
    login: async () => { },
    logout: () => { },
    setAdmin: () => { },
});

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const login = async (email: string, password: string) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.ADMIN.LOGIN, {
            email,
            password,
        }, {
            withCredentials: true
        });

        const token = response.data.data.token;
        localStorage.setItem('adminToken', token);

        setAdmin({
            _id: response.data.data._id,
            email: response.data.data.email,
            name: response.data.data.name,
        })
        setIsAuthenticated(true);
    };

    const logout = async () => {
        localStorage.removeItem('adminToken');
        setAdmin(null);
        setIsAuthenticated(false);
        await axiosInstance.get(API_ENDPOINTS.AUTH.ADMIN.LOGOUT, {
            withCredentials: true
        });
    };

    return (
        <AdminAuthContext.Provider
            value={{ admin, isAuthenticated, login, logout, setAdmin }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
};

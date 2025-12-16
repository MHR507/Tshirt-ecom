import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiService from '@/services/apiService';

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'customer' | 'designer' | 'admin';
    avatar?: string;
    wallet_balance?: number;
    created_at?: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string, role: 'customer' | 'designer') => Promise<void>;
    adminLogin: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: 'customer' | 'designer') => Promise<void>;
    logout: () => void;
    isAdmin: boolean;
    isDesigner: boolean;
    isCustomer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check for existing token on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                try {
                    const response = await apiService.getMe();
                    setUser(response.user);
                } catch (error) {
                    // Token invalid, clear it
                    localStorage.removeItem('auth_token');
                }
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const login = useCallback(async (email: string, password: string, role: 'customer' | 'designer') => {
        const response = await apiService.login(email, password, role);
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
    }, []);

    const adminLogin = useCallback(async (email: string, password: string) => {
        const response = await apiService.adminLogin(email, password);
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
    }, []);

    const register = useCallback(async (name: string, email: string, password: string, role: 'customer' | 'designer') => {
        const response = await apiService.register(name, email, password, role);
        localStorage.setItem('auth_token', response.token);
        setUser(response.user);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
    }, []);

    const isAuthenticated = !!user;
    const isAdmin = user?.role === 'admin';
    const isDesigner = user?.role === 'designer' || user?.role === 'admin';
    const isCustomer = user?.role === 'customer';

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated,
                login,
                adminLogin,
                register,
                logout,
                isAdmin,
                isDesigner,
                isCustomer,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

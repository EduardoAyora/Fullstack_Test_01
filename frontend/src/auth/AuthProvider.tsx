import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getToken, removeToken, setToken } from '../utils/token';
import { User } from '../types/auth.types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setAuthToken] = useState<string | null>(getToken());
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!token) {
            setUser(null);
        }
    }, [token]);

    const login = (token: string) => {
        setToken(token);
        setAuthToken(token);
    };

    const loadUserData = (user: User) => {
        setUser(user);
    }

    const logout = () => {
        removeToken();
        setAuthToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                login,
                logout,
                loadUserData,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
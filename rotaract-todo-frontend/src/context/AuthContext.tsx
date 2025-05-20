// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextData {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
    token: null,
    login: () => { },
    logout: () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) setToken(t);
    }, []);

    const login = (t: string) => {
        localStorage.setItem('token', t);
        setToken(t);
        navigate('/tasks');
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        navigate('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

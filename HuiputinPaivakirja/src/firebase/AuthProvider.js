import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './Config';
import { onAuthStateChanged } from 'firebase/auth';

// Here we create context that manages the user's authentication state.
const AuthContext = createContext(null);

// app is wrapped in the AuthProvider component to provide the context to the application.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // The onAuthStateChanged function listens for changes in the user's authentication state.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// The useAuth hook is used to access the authentication context in the application.
export const useAuth = () => useContext(AuthContext);

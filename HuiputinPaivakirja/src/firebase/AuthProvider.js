import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from './Config';
import { onAuthStateChanged, signOut } from 'firebase/auth';

// Here we create context that manages the user's authentication state.
const AuthContext = createContext(null);

// app is wrapped in the AuthProvider component to provide the context to the application.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('AuthProvider mounted');
        // The onAuthStateChanged function listens for changes in the user's authentication state.
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            console.log('Auth state changed:', currentUser);
            if (currentUser) {
                // Wait for the displayName to be set
                const checkDisplayName = async () => {
                    while (!currentUser.displayName) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }
                    setUser(currentUser);
                    setLoading(false);
                };
                checkDisplayName();
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => {
            console.log('AuthProvider unmounted');
            unsubscribe();
        };
    }, []);

    const logout = () => {
        signOut(auth).then(() => {
            setUser(null);
        }).catch((error) => {
            console.error('Sign out failed: ', error.message);
        });
    }

    return (
        <AuthContext.Provider value={{ user, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// The useAuth hook is used to access the authentication context in the application.
export const useAuth = () => useContext(AuthContext);

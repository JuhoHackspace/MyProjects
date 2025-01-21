import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, doc, db, setDoc } from './Config';
import {
    onAuthStateChanged,
    signOut,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    reauthenticateWithCredential,
    EmailAuthProvider,
    deleteUser,
} from 'firebase/auth';

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

    const login = (email, password) => {
        signInWithEmailAndPassword(auth, email.trim(), password)
            .catch((error) => {
                alert('Login failed: ' + error.message);
            });
    };

    const createAccount = (username, email, password, confirmPassword) => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        // Create a new user account with the email and password provided using Firebase authentication.
        // then update the user's profile with the username provided.
        createUserWithEmailAndPassword(auth, email.trim(), password)
            .then((userCredential) => {
                const user = userCredential.user;
                const userDocRef = doc(db, "users", user.uid);
                setDoc(userDocRef, {
                    sends: [],
                }).then(() => {
                    console.log("User document created successfully");
                }).catch((error) => {
                    console.error("Error creating user document:", error);
                });
                return updateProfile(user, {
                    displayName: username,
                });
            })
            .catch((error) => {
                alert('Account creation failed: ' + error.message);
            });
    };

    // Reauthenticate user with password
    const reauthenticateUser = async (password) => {
        try {
            if (!user?.email) throw new Error("User email not found");

            const credential = EmailAuthProvider.credential(user.email, password);
            await reauthenticateWithCredential(auth.currentUser, credential);
            console.log("Reauthentication successful");
            return true;
        } catch (error) {
            console.error("Error reauthenticating user:", error);
            throw new Error("Reauthentication failed. Please check your password.");
        }
    };

    // Delete user account
    const deleteAccount = async () => {
        try {
            if (auth.currentUser) {
                await deleteUser(auth.currentUser);
                console.log("Account deleted successfully");
            } else {
                throw new Error("No user is logged in");
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            throw new Error("Failed to delete account. Please reauthenticate.");
        }
    };


    return (
        <AuthContext.Provider value={{
            user,
            loading,
            createAccount,
            login,
            logout,
            reauthenticateUser,
            deleteAccount,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// The useAuth hook is used to access the authentication context in the application.
export const useAuth = () => useContext(AuthContext);

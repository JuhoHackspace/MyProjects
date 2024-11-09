import {
        db,
        storage,
        collection,
        addDoc,
        query,
        onSnapshot,
        deleteDoc,
        doc,
        getDocs,
        ref,
        uploadBytesResumable,
        getDownloadURL,
        auth // In use
} from './Config';

/**
* Get the display name of the currently authenticated user.
* Returns 'User' as a fallback if no display name is set.
*/
export const getUserDisplayName = () => {
        return auth.currentUser?.displayName || 'User';
};


// This file will contain all the methods that interact with the Firebase services.
// The methods will be exported and used in the application.

// This should not be the case anymore as there are checks implemented to the Config.js -> Dont uncomment the import lines above, before there are correct values in the .env file,
// otherwise the app might crash, because Config.js will be executed, and will not be able to
// initialize the Firebase services.
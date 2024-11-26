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
        getDoc,
        setDoc,
        ref,
        uploadBytesResumable,
        getDownloadURL,
        auth, // In use
        routes,
        users,
        markers,
} from './Config';

/**
* Get the display name of the currently authenticated user.
* Returns 'User' as a fallback if no display name is set.
*/
export const getUserDisplayName = () => {
        return auth.currentUser?.displayName || 'User';
};

/**
 * Store image in Firebase storage and return the download URL.
 */

const uploadImage = async (imageUri, routeName) => {
        try {
            // Get the image from the file system
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = () => {
                    resolve(xhr.response);
                };
                xhr.onerror = (e) => {
                    console.log(e);
                    reject(new TypeError('Network request failed'));
                };
                xhr.responseType = 'blob';
                xhr.open('GET', imageUri, true);
                xhr.send(null);
            });
    
            // Create a reference to the location where the image will be saved
            const storageRef = ref(storage, 'images/' + routeName + "-" + new Date().toISOString());
    
            // Upload the image to the location
            const snapshot = await uploadBytesResumable(storageRef, blob);
    
            // Get the download URL
            const url = await getDownloadURL(snapshot.ref);
    
            console.log('Uploaded image with URL : ', url);
    
            return url;
        } catch (error) {
            console.error('Error uploading image:', error);
        }
};

/**
 * Store a new route in Firestore.
 */

const saveRouteToFirebase = async (imageUri, routeInfo) => {
        try {
            const url = await uploadImage(imageUri, routeInfo.name);
            const docRef = await addDoc(routes, {
                routeImageUrl: url,
                created: new Date().toISOString(),
                createdBy: {id: auth.currentUser.uid, name: auth.currentUser.displayName? auth.currentUser.displayName: 'Unknown'},
                routeName: routeInfo.name,
                routeGradeColor: routeInfo.grade,
                routeHoldColor: routeInfo.holdColor,
                routeGradeVotes: [],
                votedForDelete: [],
                sentBy: [], // Tähän tulee lista käyttäjän id:stä, joka on lähettänyt reitin
                visible: true,
                votedGrade: '',

            });
            const routeId = docRef.id;
            console.log('Image added with ID: ', docRef.id);
            return routeId;
        } catch (error) {
            console.error('Error adding image:', error);
        }    
};

/**
 * Add the route to Firestore and store a new marker in Firestore.
 */

const addRouteAndMarker = async (imageUri, routeInfo, markerInfo) => {
        try {
            const routeId = await saveRouteToFirebase(imageUri, routeInfo);
            const docRef = await addDoc(markers, {
                routeId: routeId,
                x: markerInfo.x,
                y: markerInfo.y,
                created: new Date().toISOString(),
                holdColor: routeInfo.holdColor,
                gradeColor: routeInfo.grade,
            });
            const markerId = docRef.id;
            console.log("Marker added with ID: ", docRef.id);
            return markerId;
        } catch (error) {
            console.error('Error adding route and marker:', error);
        }
}

/*const fetchUserData = async(userId, setUserData) => {
    if  (!userId)
        return
    try {
        const userDocRef = doc(db, 'users', userId);
        const userSnapshot = await getDoc(userDocRef); //haetaan tiedot jo niitä on siellä
        if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            // Set the user data to the state
            setUserData(userData);
        } else {
            console.log('No user data found!');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);

    }
}*/

const fetchUserData = (userId, setUserData) => {
    if (!userId) return;
  
    const userDocRef = doc(db, 'users', userId);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      } else {
        console.log('No user data found!');
        setUserData(null);
      }
    }, (error) => {
      console.error('Error fetching user data:', error);
    });
  
    return unsubscribe;
};

const AddUserInfo = async (userId, data) => {
    if (!userId){
        alert('Miten vittu pääsit tänne?')
        return
    }
    try {
        const userDocRef = doc(db, 'users', userId);
            //tallentaa tiedot
        await setDoc(userDocRef, data, { merge: true }); //mergellä pysty ainaki vaihtamaan vaan yhtäkin tietoa
    } catch (error) {
        console.error('Error saving data to Firestore:', error);
    }
}

const listenToMarkers = (callback) => {
        return onSnapshot(markers, (snapshot) => {
            const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(markers);
        }, (error) => {
            console.error('Error listening to markers:', error);
        });
    };

export { addRouteAndMarker,AddUserInfo,fetchUserData, listenToMarkers }
import {
        arrayUnion,
        arrayRemove,
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
        updateDoc,
        ref,
        uploadBytesResumable,
        getDownloadURL,
        auth, // In use
        routes,
        users,
        markers,
} from './Config';
import { convertGrade } from '../Helpers/Calculate';

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
                sentBy: [],
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
            visible: true,
          });
          const markerId = docRef.id;
          console.log("Marker added with ID: ", docRef.id);
          return { routeId, markerId };
        } catch (error) {
          console.error('Error adding route and marker:', error);
        }
}

/**
 * Listen to user data changes in Firestore.
 */
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

/**
 * Add user information to Firestore. Used for updating user data in the profile.
 */
const AddUserInfo = async (userId, data) => {
    console.log('Adding user info:', data);
    if (!userId){
        return
    }
    try {
        const userDocRef = doc(db, 'users', userId);
            //tallentaa tiedot
        await updateDoc(userDocRef, data, { merge: true });
    } catch (error) {
        console.error('Error saving data to Firestore:', error);
    }
}

/**
 * Listen to marker data changes in Firestore.
 */ 
const listenToMarkers = (callback) => {
        return onSnapshot(markers, (snapshot) => {
            const markers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            callback(markers);
        }, (error) => {
            console.error('Error listening to markers:', error);
        });
    };

/**
 * Listen to route data changes in Firestore.
 */
const fetchRouteData = (routeId, setRouteData, setLoading) => {
    const routeDocRef = doc(routes, routeId);
    const unsubscribe = onSnapshot(routeDocRef, (doc) => {
      if (doc.exists()) {
        setRouteData(doc.data());
      } else {
        console.log('No route data found!');
        setRouteData(null);
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching route data:', error);
    });
  
    return unsubscribe;
};

/**
 * Add a vote for deleting a route. The vote is stored in the route document.
 */
const voteForDelete = async (routeId) => {
    try {
        const routeDocRef = doc(routes, routeId);
        await updateDoc(routeDocRef, {
            votedForDelete: arrayUnion({votedBy: auth.currentUser.uid, votedAt: new Date().toISOString()}),
        });
        console.log('Voted for delete successfully!');
    } catch (error) {
        console.error('Error voting for delete:', error);
    }
};

/**
 * Cancel a vote for deleting a route. The vote is removed from the route document. 
 */
const cancelVoteForDelete = async (routeId, vote) => {
    try {
        const routeDocRef = doc(routes, routeId);
        await updateDoc(routeDocRef, {
            votedForDelete: arrayRemove(vote),
        });
        console.log('Voted for delete successfully!');
    } catch (error) {
        console.error('Error voting for delete:', error);
    }
}
/**
 * Sets the route marker invisible in the map. The route is not deleted from the database.
 */
const setRouteInvisible = async (markerId) => {
    try {
        const markerDocRef = doc(markers, markerId);
        await updateDoc(markerDocRef, {
            visible: false,
        });
    } catch (error) {
        console.error('Error deleting route:', error);
    }
}

/**
 * Updates the route document to mark the route as sent by the user.
 * The user document is updated to include the sent route in the users document.
 */
const markRouteAsSent = async (routeId, tryCount) => {
  const date = new Date().toISOString();
  try {
      const userDocRef = doc(users, auth.currentUser.uid);
      await updateDoc(userDocRef, {
        sends: arrayUnion({ route: routeId, tries: tryCount, sentAt: date }),
      });
      const routeDocRef = doc(routes, routeId);
      // Päivitys
      await updateDoc(routeDocRef, {
          sentBy: arrayUnion({ senderId: auth.currentUser.uid, senderName: auth.currentUser.displayName, sentAt: date })
      });

      console.log('Route marked as sent successfully!');
  } catch (error) {
      console.error('Error marking route as sent:', error);
  }
};

/**
 * Updates the route document for voting for the grade of the route.
 */
const voteForGrade = async (routeId, existingVotes, gradeVote, gradeColor) => {
    try {
        const routeDocRef = doc(routes, routeId);
        let newVotes = [];
        if(existingVotes.some(vote => vote.votedBy === auth.currentUser.uid)){
            newVotes = existingVotes.map(vote => 
                vote.votedBy === auth.currentUser.uid ? { ...vote, grade: gradeVote, votedAt: new Date().toISOString() } : vote
            );
        } else {
            newVotes = [...existingVotes,{grade: gradeVote, votedAt: new Date().toISOString(), votedBy: auth.currentUser.uid}];
            console.log('Updated routeGradeVotes:', newVotes);
        }
        console.log('new vote:', gradeVote);
        console.log('Existing routeGradeVotes:', existingVotes);
        const updatedGradeVotes = newVotes.map(vote => vote.grade);
        // Lasketaan keskiarvo ConvertGrade funktiolla -> Calculate.js
        const averageGrade = convertGrade(updatedGradeVotes, gradeColor);
        console.log('Calculated averageGrade:', averageGrade);

        // Päivitys
        await updateDoc(routeDocRef, {
            routeGradeVotes: newVotes,
            votedGrade: averageGrade
        });
    } catch (error) {
        console.error('Error voting for grade:', error);
    }
};

/**
 * Updates the route document to cancel the route as sent by the user.
 */
const cancelRouteAsSent = async (routeId, tryCount, sentAt) => {
    try {
        const routeDocRef = doc(routes, routeId);
        await updateDoc(routeDocRef, {
            sentBy: arrayRemove({ senderId: auth.currentUser.uid, senderName: auth.currentUser.displayName, sentAt: sentAt })
        });

        const userDocRef = doc(users, auth.currentUser.uid);
        await updateDoc(userDocRef, {
            sends: arrayRemove({ route: routeId, tries: tryCount, sentAt: sentAt }),
        });

        console.log('Route marked as not sent successfully!');
    } catch (error) {
        console.error('Error marking route as not sent:', error);
    }
}

/**
 * Returns the creator ID of the route.
 */
const getRouteCreatorId = async (routeId) => {
    try {
        const routeDocRef = doc(routes, routeId);
        const routeDoc = await getDoc(routeDocRef);
        if (routeDoc.exists()) {
            return routeDoc.data().createdBy.id;
        } else {
            console.log('No route data found!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching route data:', error);
        return null;
    }
};

/**
 * Returns the boulder history of the user.
 * The function returns an array of objects containing the send data and the associated route data.
 */
const retrieveBoulderHistory = async () => {
    try {
        const userDocRef = doc(users, auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const sends = userDoc.data().sends;
            const sendsAndRoutes = await Promise.all(sends.map(async (send) => {
                const routeDocRef = doc(db, 'routes', send.route);
                const routeDoc = await getDoc(routeDocRef);
                return { send, route: routeDoc.data() };
            }));

            return sendsAndRoutes;

        } else {
            console.log('No user data found!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

/**
 * Returns the number of tries for the user on a given route.
 */
const getRouteTries = async (routeId) => {
    try {
        const userDocRef = doc(users, auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const sends = userDoc.data().sends;
            if(sends.length === 0) return 0;
            const tries = sends.find(send => send.route === routeId).tries;
            return tries;
        } else {
            console.log('No user data found!');
            return null;
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export { addRouteAndMarker, AddUserInfo, fetchUserData, listenToMarkers, fetchRouteData, voteForDelete, setRouteInvisible, markRouteAsSent, getRouteCreatorId, retrieveBoulderHistory, getRouteTries, cancelRouteAsSent, voteForGrade, cancelVoteForDelete }
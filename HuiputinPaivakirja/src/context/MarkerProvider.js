import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { View, Text } from 'react-native'
import { listenToMarkers } from '../firebase/FirebaseMethods';
import { useNotification } from './NotificationProvider';
import sectors from '../Helpers/Sectors';
import { getRouteCreatorId } from '../firebase/FirebaseMethods';
import { useAuth } from '../firebase/AuthProvider';

/**
 * MarkerProvider is a context provider that provides a marker context to its children.
 * The marker context is used to manage markers and clusters of markers.
 * It provides notifications to the user when new routes are added to a sector.
 * @param {Object} children - The children components that will be wrapped by the MarkerProvider.
 * @returns {Object} - The MarkerProvider component.
 */
const MarkerContext = createContext();

export default function MarkerProvider({children}) {
  const [markers, setMarkers] = useState([]);
  const initialMarkers = useRef([]);
  const showNotification = useNotification();
  const newRoutes = useRef([]);
  const [clusters, setClusters] = useState([]);
  const { user, loading } = useAuth();
  const userId = user?.uid;

  // Listen to markers and update the markers state when markers change. Keep track of new routes added.
  useEffect(() => {
    if(loading) {
        return;
    }
    if (!user) {
        console.log('User is not authenticated');
        return;
    }
    const unsubscribe = listenToMarkers((newMarkers) => {
      console.log('Initial markers length: ', initialMarkers.current.length);
      newRoutes.current = []; // Reset new routes

      // If there are no initial markers, set the new markers as initial markers
      if (initialMarkers.current.length === 0) {
        initialMarkers.current = newMarkers;
        console.log('Initial markers: ', initialMarkers.current);
      } else { // If there are initial markers, check for new routes
        const _newRoutes = newMarkers.filter(marker => !(initialMarkers.current.some(initialMarker => initialMarker.id === marker.id)));
        console.log('New routes: ', _newRoutes);
        if (_newRoutes.length > 0) { // If there are new routes, set the new routes
           console.log('New routes added!');
           newRoutes.current = _newRoutes;
        }
      }
      // Allways set all markers to the markers state
      setMarkers(newMarkers);
    });

    return () => unsubscribe();
  }, [user, loading]);
  
  // Cluster markers by sectors when markers change
  useEffect(() => {
    async function clusterMarkers() {
      try {
        setClusters(await clusterMarkersBySectors(markers));
      } catch (error) {
        console.log('Error setting clusters: ', error);
      }
    }
    clusterMarkers();
  }, [markers]);

  // Cluster markers by sectors. Creates a cluster for each sector and counts the markers in each sector.
  // Displays a notification if there are new routes to climb in a sector. Route creator will not receive the notification.
  const clusterMarkersBySectors = async (markers) => {
    // Cluster markers by sectors
    const clusters = sectors.map(sector => {
      const sectorMarkers = markers.filter(marker => 
        marker.x >= sector.xMin && marker.x <= sector.xMax &&
        marker.y >= sector.yMin && marker.y <= sector.yMax && marker.visible
      );
      const centerX = (sector.xMin + sector.xMax) / 2;
      const centerY = (sector.yMin + sector.yMax) / 2;
      return {
        id: sector.id,
        name: sector.name,
        x: centerX,
        y: centerY,
        count: sectorMarkers.length,
        visible: sectorMarkers.length > 0,
        markers: sectorMarkers,
      };
    });
    console.log('Clusters: ', clusters);
    // Display a notification if there are new routes to climb in a sector

    // If there are no new routes, return the clusters
    if (newRoutes.current.length === 0) {
        return clusters;
    }

    // Check if there are new routes in any of the clusters
    const clustersWithNewRoutes = clusters.filter(cluster => cluster.markers.map(marker => marker.id).some(id => newRoutes.current.map(route => route.id).includes(id)));
    const clusterNames = clustersWithNewRoutes.map(cluster => cluster.name).join(', ');
    let routeCreatorId = null;

    // Check if the new route was added by the current user
    if(newRoutes.current.length === 1) {
        routeCreatorId = await getRouteCreatorId(newRoutes.current[0].routeId);
    }

    // If there are new routes set by another user in any of the clusters, display a notification
    if(!(newRoutes.current.length === 1 && routeCreatorId === userId)) {
        if(clustersWithNewRoutes.length > 0) {
            showNotification('New route(s) to climb in ' + clusterNames, 8000);
            initialMarkers.current = [...initialMarkers.current, ...newRoutes.current];
        } else if (newRoutes.length > 0) {
            showNotification('No new routes to climb!', 8000);
            initialMarkers.current = [...initialMarkers.current, ...newRoutes.current];
        }
    }else {
        initialMarkers.current = [...initialMarkers.current, ...newRoutes.current];
    }
    return clusters;
  };
  
  return (
    <MarkerContext.Provider value={{markers, clusters}}>
      {children}
    </MarkerContext.Provider>
  )
}

export const useMarkers = () => useContext(MarkerContext);
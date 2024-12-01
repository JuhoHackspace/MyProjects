import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { View, Text } from 'react-native'
import { listenToMarkers } from '../firebase/FirebaseMethods';
import { useNotification } from './NotificationProvider';
import sectors from '../Helpers/Sectors';
import { getRouteCreatorId } from '../firebase/FirebaseMethods';
import { useAuth } from '../firebase/AuthProvider';

const MarkerContext = createContext();

export default function MarkerProvider({children}) {
  const [markers, setMarkers] = useState([]);
  const initialMarkers = useRef([]);
  const showNotification = useNotification();
  const newRoutes = useRef([]);
  const [clusters, setClusters] = useState([]);
  const { user } = useAuth();
  const userId = user?.uid;

  useEffect(() => {
    const unsubscribe = listenToMarkers((newMarkers) => {
      console.log('Initial markers length: ', initialMarkers.current.length);
      newRoutes.current = [];
      if (initialMarkers.current.length === 0) {
        initialMarkers.current = newMarkers;
        console.log('Initial markers: ', initialMarkers.current);
      } else {
        const _newRoutes = newMarkers.filter(marker => !(initialMarkers.current.some(initialMarker => initialMarker.id === marker.id)));
        console.log('New routes: ', _newRoutes);
        if (_newRoutes.length > 0) {
           console.log('New routes added!');
           newRoutes.current = _newRoutes;
        }
      }
      setMarkers(newMarkers);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    async function fetchData() {
        setClusters(await clusterMarkersBySectors(markers));
    }
    fetchData();
  }, [markers]);

  // Cluster markers by sectors. Creates a cluster for each sector and counts the markers in each sector.
  const clusterMarkersBySectors = async (markers) => {
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
    if (newRoutes.current.length === 0) {
        return clusters;
    }
    const clustersWithNewRoutes = clusters.filter(cluster => cluster.markers.map(marker => marker.id).some(id => newRoutes.current.map(route => route.id).includes(id)));
    const clusterNames = clustersWithNewRoutes.map(cluster => cluster.name).join(', ');
    let routeCreatorId = null;
    if(newRoutes.current.length === 1) {
        routeCreatorId = await getRouteCreatorId(newRoutes.current[0].routeId);
    }
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
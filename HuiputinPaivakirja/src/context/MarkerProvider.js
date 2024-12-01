import React, { useEffect, useRef, useState, useContext, createContext } from 'react'
import { View, Text } from 'react-native'
import { listenToMarkers } from '../firebase/FirebaseMethods';
import { useNotification } from './NotificationContext';
import sectors from '../Helpers/Sectors';

const MarkerContext = createContext();

export default function MarkerProvider({children}) {
  const [markers, setMarkers] = useState([]);
  const [initialMarkers, setInitialMarkers] = useState([]);
  const showNotification = useNotification();
  const [newRoutes, setNewRoutes] = useState([]);
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToMarkers((newMarkers) => {
      if (initialMarkers.length === 0) {
        setInitialMarkers(newMarkers);
      } else {
        const newRoutes = newMarkers.filter(marker => !initialMarkers.some(initialMarker => initialMarker.id === marker.id));
        if (newRoutes.length > 0) {
           showNotification('New route(s) to climb', 4000);
        }
      }
      setMarkers(newMarkers);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    setClusters(clusterMarkersBySectors(markers));
  }, [markers]);

  // Cluster markers by sectors. Creates a cluster for each sector and counts the markers in each sector.
  const clusterMarkersBySectors = (markers) => {
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
    /*const clustersWithNewRoutes = clusters.filter(cluster => cluster.markers.map(marker => marker.id).some(id => newRoutes.map(route => route.id).includes(id)));
    const clusterNames = clustersWithNewRoutes.map(cluster => cluster.name).join(', ');
    if (clustersWithNewRoutes.length === 1) {
      showNotification(`New route(s) to climb on sector ${clusterNames}`, 3000);
    } else if (clustersWithNewRoutes.length > 1) {
      showNotification(`New route(s) to climb on sectors ${clusterNames}`, 3000);
    }*/
    return clusters;
  };
  
  return (
    <MarkerContext.Provider value={{markers, clusters}}>
      {children}
    </MarkerContext.Provider>
  )
}

export const useMarkers = () => useContext(MarkerContext);
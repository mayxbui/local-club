import React, { useEffect, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import './LocalsMap.css';
import pin from '../../assets/pin.png';
import placeHolder from '../../assets/placeholder.png';

const defaultCenter = {
  lat: 39.64323822800205,
  lng: -86.86339359225649,
};

const redDot = pin;
const redPin = placeHolder;

const LocalsMap = ({ locals, selectedLocal, setSelectedLocal }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  });

  const mapRef = useRef(null);

  const onLoad = (map) => {
    mapRef.current = map;
  };

  useEffect(() => {
    if (mapRef.current && selectedLocal) {
      mapRef.current.panTo({ lat: selectedLocal.lat, lng: selectedLocal.lng });
    }
  }, [selectedLocal]);

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerClassName="map-container"
      center={defaultCenter}
      zoom={17}
      onLoad={onLoad}
    >
      {locals.map((local) => {
        const isSelected = selectedLocal?.id === local.id;
        return (
          <Marker
            key={local.id}
            position={{ lat: local.lat, lng: local.lng }}
            icon={{
              url: isSelected ? redPin : redDot,
              scaledSize: isSelected ? { width: 30, height: 30 } : { width: 20, height: 20 },
            }}
            onClick={() => setSelectedLocal(local)}
            title={local.name}
          />
        );
      })}
    </GoogleMap>
  );
};


export default LocalsMap;

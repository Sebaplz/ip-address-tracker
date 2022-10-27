import React, { useEffect, useMemo } from "react";
import { Marker, useMap } from "react-leaflet";

export default function Map({ address }) {
  const locationSVG = L.icon({
    iconUrl: "images/icon-location.svg",
  });

  const position = useMemo(() => {
    return [address.location.lat, address.location.lng];
  }, [address.location.lat, address.location.lng]);
  const map = useMap();

  useEffect(() => {
    map.flyTo(position, 13, {
      animate: true,
    });
  }, [map, position]);

  return (
    <>
      <Marker icon={locationSVG} position={position}></Marker>
    </>
  );
}

/*
  This function component will render the leaflet map.
  When the user clicks on the map, it will trigger a handler that will place a
  pin. The coordinates are fed back up to the parent component through a function
  passed in as a prop.
*/

// Global npm libraries
import React from 'react'
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

let currentMarker = null

function CreateStoreMap (props) {
  // Data passed from the parent component.
  let { markers, mapCenterLat, mapCenterLong, zoom } = props.mapObj

  // Default settings for map, if they are not overwritten by parent component.
  if (!Array.isArray(markers)) markers = []
  // if (!mapCenterLat) mapCenterLat = 45.5767026
  // if (!mapCenterLong) mapCenterLong = -122.6437683
  if (!mapCenterLat) mapCenterLat = 43.4691314
  if (!mapCenterLong) mapCenterLong = -103.2816322
  if (!zoom) zoom = 12
  // console.log(`markers2: ${JSON.stringify(markers, null, 2)}`)

  return (
    <>
      <MapContainer
        center={[mapCenterLat, mapCenterLong]}
        zoom={zoom}
        style={{ height: '70vh' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <MapClickHandler mapObj={props.mapObj} />
      </MapContainer>
    </>
  )
}

// Functional component used to tap into the click handler for the map.
function MapClickHandler (props) {
  const { handleMapClickEvent } = props.mapObj

  const map = useMapEvents({
    click: (event) => {
      // console.log('event: ', event)

      const { lat, lng } = event.latlng
      // console.log(`lat: ${lat}, lng: ${lng}`)

      const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
      })

      if (currentMarker) {
        // console.log('currentMarker: ', currentMarker)
        currentMarker.remove()
      }

      currentMarker = L.marker([lat, lng], {
        icon,
        draggable: false,
        interactive: false
      })
      currentMarker.addTo(map)

      // Pass the coordinates up to the parent component.
      handleMapClickEvent(lat, lng)
    }
  })

  return null
}

export default CreateStoreMap

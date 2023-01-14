/*
  This function component will render the leaflet map.
*/

// Global npm libraries
import React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Local libraries

function MapOfStreets (props) {
  window.handleFlagStore = handleFlagStore

  // console.log('map-of-store2 props: ', JSON.stringify(props, null, 2))
  let { markers, mapCenterLat, mapCenterLong, zoom } = props.mapObj

  if (!Array.isArray(markers)) markers = []
  if (!mapCenterLat) mapCenterLat = 45.5767026
  if (!mapCenterLong) mapCenterLong = -122.6437683
  if (!zoom) zoom = 12
  console.log(`markers2: ${JSON.stringify(markers, null, 2)}`)

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

        <Markers markers={markers} />
      </MapContainer>
    </>
  )
  // }
}

// This is an onclick event handler for the button inside the pin dialog.
// When clicked, it will call this function and pass the Token ID.
async function handleFlagStore (tokenId) {
  console.log('handleFlagStore() tokenId: ', tokenId)
}

// This is a React function component. It loads the markers on the map.
function Markers (props) {
  console.log('Marker props: ', props)

  const { markers } = props

  // globalMap = useMap()
  const map = useMap()
  console.log('map: ', map)

  if (markers.length) {
    console.log(`Adding this marker to the map: ${JSON.stringify(markers, null, 2)}`)
    const { lat, long, id, name, description, tokenId } = markers[0]

    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
    })

    const pin = L.marker([lat, long], { id, icon })
    pin.addTo(map)
    console.log('pin: ', pin)

    const popUpHtml = `
    <p><b>Name</b>: ${name}</p>
    <p><b>Description</b>: ${description}</p>
    <button onclick="window.handleFlagStore('${tokenId}')">Flag</button>
    `

    pin.bindPopup(popUpHtml)
  }

  return null
}

export default MapOfStreets

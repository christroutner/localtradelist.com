/*
  This function component will render the leaflet map.
  It is passed an array of markers by the parent component and generates pins
  on the map to represent those markers. It also attaches popups to each pin,
  and wires up the Confirmation and Waiting modals for the buttons inside
  those popups.
*/

// Global npm libraries
import React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import ReactDOMServer from 'react-dom/server'

// Local libraries
import InfoPopup from './popup-component.js'
import PopupProducts from './popup-products.js'

// Placeholders. These will be replaced by parent-level data passed in by props.
// let wallet = null
// let updateWaitingModal = null
let updateConfirmModal = null
let popupLib = null

function MapOfStreets (props) {
  // Attach the button handlers to the window object, so that they can be called
  // outside of the context of this component. This is needed as a hack for
  // working with leaflet and react-leaflet.
  window.handleFlagNsfw = handleFlagNsfw
  window.handleFlagGarbage = handleFlagGarbage

  // Data passed from the parent component.
  let { markers, mapCenterLat, mapCenterLong, zoom, appData } = props.mapObj

  // Extract parent-level functions from the appData.
  // wallet = appData.wallet
  popupLib = appData.popupLib
  // updateWaitingModal = popupLib.updateWaitingModal
  updateConfirmModal = popupLib.updateConfirmModal

  // Default settings for map, if they are not overwritten by parent component.
  if (!Array.isArray(markers)) markers = []
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

        <Markers markers={markers} appData={appData} />
      </MapContainer>
    </>
  )
}

// This function is called when the 'NSFW' flag button is clicked.
async function handleFlagNsfw (tokenId) {
  try {
    console.log('handleFlagNsfw() called with token ID: ', tokenId)
    // showContinueCancelModal = true
    // globalSetShowContinueCancelModal(true)

    const confirmModalBody = (
      <>
        <p>
          Are you sure you want to flag this store as 'Not Safe For Work' (NSFW)?
        </p>
        <p>
          Continuing will write the flag to the Bitcoin Cash blockchain. It will
          cost a few cents in BCH and it will take a few minutes.
        </p>
      </>
    )

    const confirmModalObj = {
      showConfirmModal: true,
      confirmModalBody,
      tokenId,
      confirmType: 'nsfw'
    }

    await updateConfirmModal(confirmModalObj)
  } catch (err) {
    console.log('Error in handleFlagNsfw(): ', err)
  }
}

// This function is called when the 'Garbage' flag button is clicked.
async function handleFlagGarbage (tokenId) {
  console.log(`handleFlagGarbage() called for token ${tokenId}`)

  const confirmModalBody = (
    <>
      <p>
        Are you sure you want to flag this store as 'Garbage'? This indicates
        that the store provides no value.
      </p>
      <p>
        Continuing will write the flag to the Bitcoin Cash blockchain. It will
        cost a few cents in BCH and it will take a few minutes.
      </p>
    </>
  )

  const confirmModalObj = {
    showConfirmModal: true,
    confirmModalBody,
    tokenId,
    confirmType: 'garbage'
  }

  await updateConfirmModal(confirmModalObj)
}

// This is a React function component. It loads the markers on the map.
function Markers (props) {
  // console.log('Marker props: ', props)

  const { markers } = props

  // globalMap = useMap()
  const map = useMap()
  // console.log('map: ', map)

  if (markers.length) {
    for (let i = 0; i < markers.length; i++) {
      // console.log(`Adding this marker to the map: ${JSON.stringify(markers, null, 2)}`)
      const { lat, long, id, name, description, tokenId, moreInfoLink } = markers[i]

      const icon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
      })

      const pin = L.marker([lat, long], { id, icon })
      pin.addTo(map)
      // console.log('pin: ', pin)

      // Data to pass on to the popup React component.
      const popupData = {
        name,
        description,
        tokenId,
        moreInfoLink
      }

      // Render the popup component as an HTML string.
      let htmlString = ReactDOMServer.renderToString(<InfoPopup popupData={popupData} />)

      // Append the buttons to the bottom. They do not render properly in the
      // popup component, so they are added here.
      htmlString += `
        <button type="button" class="btn btn-primary">Comment</button>
        <button type="button" class="btn btn-dark">Block</button>
        <br /><br />
        <button type="button" class="btn btn-danger" onclick="window.handleFlagNsfw('${tokenId}')">NSFW</button>
        <button type="button" class="btn btn-warning" onclick="window.handleFlagGarbage('${tokenId}')">Garbage</button>
        <br /><br /><br />
        `
      // console.log('htmlString: ', htmlString)

      htmlString += ReactDOMServer.renderToString(<PopupProducts appData={props.appData} marker={markers[i]} />)

      // Bind the popup component to the map pin.
      pin.bindPopup(htmlString, {'maxHeight': '300'})
    }
  }

  return null
}

export default MapOfStreets

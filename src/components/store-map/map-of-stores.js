/*
  This function component will render the leaflet map.
*/

// Global npm libraries
import React from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import TradelistLib from '@chris.troutner/tradelist-lib'
import ReactDOMServer from 'react-dom/server'

// Local libraries
import InfoPopup from './info-popup.js'
// import WaitingModal from '../waiting-modal'

let wallet = null
let updateModal = null

function MapOfStreets (props) {
  window.handleFlagStore = handleFlagStore

  // console.log('map-of-store2 props: ', JSON.stringify(props, null, 2))
  let { markers, mapCenterLat, mapCenterLong, zoom, appData } = props.mapObj

  wallet = appData.wallet
  updateModal = appData.updateModal

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

        <Markers markers={markers} appData={appData} />
      </MapContainer>
    </>
  )
  // }
}

// This is an onclick event handler for the button inside the pin dialog.
// When clicked, it will call this function and pass the Token ID.
async function handleFlagStore (tokenId) {
  try {
    console.log('handleFlagStore() tokenId: ', tokenId)

    // console.log('wallet: ', wallet)

    // Start the waiting modal
    const modalBody = ['Publishing data to IPFS...']
    const modalHeader = 'Flagging Store'
    let modalObj = {
      showModal: true,
      modalHeader,
      modalBody,
      hideSpinner: false,
      denyClose: true
    }
    await updateModal(modalObj)

    const tradelistLib = new TradelistLib({ wallet })

    const data = {
      about: tokenId
    }

    // Instantiate the support libraries.
    await tradelistLib.util.instantiateWrite()
    await tradelistLib.util.instantiatePin()

    // Generate flag data and pin it to IPFS.
    const cid = await tradelistLib.util.pinJson({ data })
    console.log('IPFS CID: ', cid)

    // Update modal
    modalBody.push('...published to IPFS pinning cluster:')
    modalBody.push(<a href={`https://p2wdb-gateway-678.fullstack.cash/ipfs/${cid}/data.json`} target='_blank' rel='noreferrer'>{cid}</a>)
    modalBody.push('Writing IPFS CID to BCH blockchain...')
    modalObj = {
      showModal: true,
      modalHeader,
      modalBody,
      hideSpinner: false,
      denyClose: true
    }
    await updateModal(modalObj)

    // Signal success
    modalBody.push('Flag successfully published to blockchain!')
    modalObj = {
      showModal: true,
      modalHeader,
      modalBody,
      hideSpinner: true,
      denyClose: false
    }
    await updateModal(modalObj)
  } catch (err) {
    // This is a top-level function. Errors must be handled and not thrown.

    // Display the error in the modal
    const modalObj = {
      showModal: true,
      modalHeader: 'Error Flagging Store',
      modalBody: [err.message],
      hideSpinner: true,
      denyClose: false
    }
    await updateModal(modalObj)

    console.log('Error in handleFlagStore(): ', err)
  }
}

// This is a React function component. It loads the markers on the map.
function Markers (props) {
  // console.log('Marker props: ', props)

  const { markers } = props

  // globalMap = useMap()
  const map = useMap()
  // console.log('map: ', map)

  if (markers.length) {
    // console.log(`Adding this marker to the map: ${JSON.stringify(markers, null, 2)}`)
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
    // console.log('pin: ', pin)

    // Data to pass on to the popup React component.
    const popupData = {
      name,
      description,
      tokenId
    }

    // Render the popup component as an HTML string.
    let htmlString = ReactDOMServer.renderToString(<InfoPopup popupData={popupData} />)

    // Append the buttons to the bottom. They do not render properly in the
    // popup component, so they are added here.
    htmlString += `<button type="button" class="btn btn-danger" onclick="window.handleFlagStore('${tokenId}')">Flag</button>`
    // console.log('htmlString: ', htmlString)

    // Bind the popup component to the map pin.
    pin.bindPopup(htmlString)
  }

  return null
}

export default MapOfStreets

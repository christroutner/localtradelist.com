/*
  This function component will render the leaflet map.
  It is passed an array of markers by the parent component and generates pins
  on the map to represent those markers. It also attaches popups to each pin,
  and wires up the Confirmation and Waiting modals for the buttons inside
  those popups.
*/

// Global npm libraries
import React from 'react'
// import React, { useState } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import TradelistLib from '@chris.troutner/tradelist-lib'
import ReactDOMServer from 'react-dom/server'

// Local libraries
import InfoPopup from './popup-component.js'

// Placeholders. These will be replaced by parent-level data passed in by props.
let wallet = null
let updateModal = null
let updateConfirmModal = null

function MapOfStreets (props) {
  // Attach the button handlers to the window object, so that they can be called
  // outside of the context of this component. This is needed as a hack for
  // working with leaflet and react-leaflet.
  window.handleFlagStore = handleFlagStore
  window.handleFlagGarbage = handleFlagGarbage

  // Data passed from the parent component.
  let { markers, mapCenterLat, mapCenterLong, zoom, appData } = props.mapObj

  // Extract parent-level functions from the appData.
  wallet = appData.wallet
  updateModal = appData.updateModal
  updateConfirmModal = appData.updateConfirmModal

  // Default settings for map, if they are not overwritten by parent component.
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
}

// This function is called when the 'NSFW' flag button is clicked.
async function handleFlagStore (tokenId) {
  try {
    console.log('handleFlagStore() called')
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
      confirmModalBody
    }

    await updateConfirmModal(confirmModalObj)
  } catch (err) {
    console.log('Error in handleFlagStore(): ', err)
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
    confirmModalBody
  }

  await updateConfirmModal(confirmModalObj)
}

// This is an onclick event handler for the button inside the pin dialog.
// When clicked, it will call this function and pass the Token ID.
async function handleFlagStore2 (tokenId) {
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

    // Generate the OP_RETURN TX for a claim
    const opReturnObj = {
      cid,
      storeTokenId: tokenId,
      type: 0
    }
    const hex = await tradelistLib.util.writeCidToBlockchain(opReturnObj)

    // Broadcast the transaction
    const txid = await wallet.broadcast(hex)

    modalBody.push('Claim written to blockchain. TXID:')
    modalBody.push(<a href={`https://blockchair.com/bitcoin-cash/transaction/${txid}`} target='_blank' rel='noreferrer'>{txid}</a>)
    modalBody.push(' ')

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
    htmlString += `<button type="button" class="btn btn-danger" onclick="window.handleFlagStore('${tokenId}')">NSFW</button> <buttontype="button" class="btn btn-primary" onclick="window.handleFlagGarbage('${tokenId}')">Garbage</button>`
    // console.log('htmlString: ', htmlString)

    // Bind the popup component to the map pin.
    pin.bindPopup(htmlString)
  }

  return null
}

export default MapOfStreets

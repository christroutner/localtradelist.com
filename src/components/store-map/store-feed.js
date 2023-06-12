/*
  This component controlls the store feed, to the rigth of the map. It updates
  any time the map is moved or zoomed. The stores are sorted with the most
  recently updated mutable data first.
*/

// Global npm libraries
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import axios from 'axios'

const SERVER = process.env.REACT_APP_SSP_SERVER

function StoreFeed (props) {
  const { mapFilterBoxProps } = props
  const { mapFilterBox } = mapFilterBoxProps
  // console.log('mapFilterBox: ', mapFilterBox)

  const box = mapFilterBox

  let boxIsEmpty = true
  if (mapFilterBox._northEast) boxIsEmpty = false

  // const storeDetails = []

  const [storeDetails, setStoreDetails] = useState([])

  useEffect(() => {
    async function asyncEffect () {
      try {
        if (!boxIsEmpty) {
          // Get a list of stores that are visible within the map window. They will be
          // sorted with the first having the most recent update to its mutable data.
          const response = await axios.post(`${SERVER}/store/box`, { box })
          // console.log('response.data: ', response.data)

          const stores = response.data.stores
          // console.log('stores: ', stores)

          const tempStoreDetails = []

          for (let i = 0; i < stores.length; i++) {
            const thisStore = stores[i]
            // console.log('thisStore: ', thisStore)

            const storeIcon = thisStore.mutableData.tokenIcon

            let storeDesc = thisStore.storeData.description
            if (storeDesc.length > 80) storeDesc = `${storeDesc.slice(0, 80)}...`

            const thisStoreDetails = (
              <div key={`store-detail-${i}`}>
                <Row onClick={() => handleShowStore({mapFilterBoxProps, thisStore})}>
                  <Col>
                    <Image src={storeIcon} fluid thumbnail />
                  </Col>
                  <Col>
                    <h4>{thisStore.storeData.name}</h4>
                    <p>{storeDesc}</p>
                  </Col>
                </Row>
              </div>
            )
            tempStoreDetails.push(thisStoreDetails)
          }

          if (tempStoreDetails.length !== storeDetails.length) {
            setStoreDetails(tempStoreDetails)
            // console.log('storeDetails: ', storeDetails)
          }
        }
      } catch (err) {
        console.error('Error trying to get store feed: ', err)
      }
    }
    asyncEffect()
  })

  return (
    <>
      <Container>
        {storeDetails}
      </Container>
    </>
  )
}

// This function is called when the user clicks on a store in the store feed.
// It loads the pin dialog in the map for that store.
function handleShowStore(inObj = {}) {
  // console.log('showStore() called. inObj: ', inObj)
  const {thisStore, mapFilterBoxProps} = inObj
  const {appData} = mapFilterBoxProps
  // console.log('appData: ', appData)

  // console.log('thisStore: ', thisStore)
  const storeName = thisStore.storeData.name

  // const map = appData.map
  const pins = appData.pins
  // console.log('pins: ', pins)

  for(let i=0; i < pins.length; i++) {
    const thisPin = pins[i]

    const popupContent = thisPin._popup._content

    if(popupContent.includes(storeName)) {
      // console.log('Found popup')
      thisPin.openPopup()
    }
  }

}

export default StoreFeed

/*
  This component is identical to store-feed.js. While the original component
  displays the first 3 entries, this one displays the rest.
*/

// Global npm libraries
import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'
import axios from 'axios'

const SERVER = process.env.REACT_APP_SSP_SERVER

function StoreFeed2 (props) {
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

          // Exit if there are less than 3 entries.
          const numStores = stores.length
          if (numStores < 4) return

          for (let i = 3; i < numStores; i += 2) {
            const thisStore1 = stores[i]
            // console.log('thisStore: ', thisStore)

            const storeIcon1 = thisStore1.mutableData.tokenIcon

            let storeDesc1 = thisStore1.storeData.description
            if (storeDesc1.length > 80) storeDesc1 = `${storeDesc1.slice(0, 80)}...`

            const thisStore2 = stores[i + 1]
            // console.log('thisStore: ', thisStore)

            let storeIcon2, storeName2, storeDesc2
            if (thisStore2) {
              storeIcon2 = thisStore2.mutableData.tokenIcon
              storeName2 = thisStore2.storeData.name
              storeDesc2 = thisStore2.storeData.description
              if (storeDesc2.length > 80) storeDesc2 = `${storeDesc2.slice(0, 80)}...`
            } else {
              storeIcon2 = ''
              storeName2 = ''
              storeDesc2 = ''
            }

            const thisStoreDetails = (
              <div key={`store-detail-${i}`}>
                <Row>

                  <Col xs={12} lg={6}>
                    <Row
                      onClick={() => handleShowStore({ mapFilterBoxProps, thisStore: thisStore1 })}
                      style={{
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    >
                      <Col xs={4} lg={4}>
                        <Image src={storeIcon1} fluid thumbnail />
                      </Col>
                      <Col xs={8} lg={6}>
                        <h4>{thisStore1.storeData.name}</h4>
                        <p>{storeDesc1}</p>
                      </Col>
                    </Row>
                  </Col>

                  <Col xs={12} lg={6}>
                    <Row
                      onClick={() => handleShowStore({ mapFilterBoxProps, thisStore: thisStore2 })}
                      style={{
                        paddingTop: '10px',
                        paddingBottom: '10px'
                      }}
                    >
                      <Col xs={4} lg={4}>
                        <Image src={storeIcon2} fluid thumbnail />
                      </Col>
                      <Col xs={8} lg={6}>
                        <h4>{storeName2}</h4>
                        <p>{storeDesc2}</p>
                      </Col>
                    </Row>
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
function handleShowStore (inObj = {}) {
  // console.log('showStore() called. inObj: ', inObj)
  const { thisStore, mapFilterBoxProps } = inObj
  const { appData } = mapFilterBoxProps
  // console.log('appData: ', appData)

  // console.log('thisStore: ', thisStore)
  let storeName = thisStore.storeData.name
  storeName = storeName.split(' ')
  storeName = storeName[0]
  // console.log('storeName: ', storeName)

  // const map = appData.map
  const pins = appData.pins
  // console.log('pins: ', pins)

  for (let i = 0; i < pins.length; i++) {
    const thisPin = pins[i]

    const popupContent = thisPin._popup._content

    if (popupContent.includes(storeName)) {
      // console.log('Found popup')
      thisPin.openPopup()
    }
  }
}

export default StoreFeed2

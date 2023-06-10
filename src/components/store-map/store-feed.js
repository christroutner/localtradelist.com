/*
  This component controlls the store feed, to the rigth of the map. It updates
  any time the map is moved or zoomed. The stores are sorted with the most
  recently updated mutable data first.
*/

// Global npm libraries
import React, { useEffect } from 'react'
import axios from 'axios'

function StoreFeed (props) {
  const { mapFilterBoxProps } = props
  const { mapFilterBox } = mapFilterBoxProps
  console.log('mapFilterBox: ', mapFilterBox)

  const box = mapFilterBox

  let boxIsEmpty = true
  if (mapFilterBox._northEast) boxIsEmpty = false

  useEffect(() => {
    async function asyncEffect () {
      try {
        if (!boxIsEmpty) {
          // Get a list of stores that are visible within the map window. They will be
          // sorted with the first having the most recent update to its mutable data.
          const response = await axios.post('http://localhost:5020/store/box', { box })
          console.log('response.data: ', response.data)
        }
      } catch (err) {
        console.error('Error trying to get store feed: ', err)
      }
    }
    asyncEffect()
  })

  return (
    <>
      <p>Loading stores from blockchain...</p>
    </>
  )
}

export default StoreFeed
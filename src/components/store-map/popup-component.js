/*
  This component is bound to each map pin. It renders the popup information
  when the user clicks on the pin.
*/

// Global npm libraries
import React from 'react'

function InfoPopup (props) {
  const { name, description, tokenId } = props.popupData

  return (
    <>
      <p><b>Name</b>: {name}</p>
      <p><b>Description</b>: {description}</p>
      <p style={{ overflowWrap: 'break-word' }}><b>Token ID</b>: {tokenId}</p>
    </>
  )
}

export default InfoPopup

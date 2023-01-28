/*
  This component is bound to each map pin. It renders the popup information
  when the user clicks on the pin.
*/

// Global npm libraries
import React from 'react'

function InfoPopup (props) {
  const { name, description, tokenId, moreInfoLink } = props.popupData

  return (
    <>
      <p><b>Name</b>: {name}</p>
      <p><b>Description</b>: {description}</p>
      {
        moreInfoLink
          ? (
            <p><a href={moreInfoLink} target='_blank' rel='noreferrer'>More Information</a></p>
            )
          : null
      }

      <p style={{ overflowWrap: 'break-word' }}><b>Token ID</b>: <a href={`https://slp-token.fullstack.cash/?tokenid=${tokenId}`} target='_blank' rel='noreferrer'>{tokenId}</a></p>
    </>
  )
}

export default InfoPopup

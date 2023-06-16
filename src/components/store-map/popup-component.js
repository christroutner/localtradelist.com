/*
  This component is bound to each map pin. It renders the popup information
  when the user clicks on the pin.
*/

// Global npm libraries
import React from 'react'
import { Image } from 'react-bootstrap'

function InfoPopup (props) {
  const { name, description, tokenId, moreInfoLink, tokenIcon } = props.popupData
  // console.log('tokenIcon: ', tokenIcon)

  return (
    <>
      <p><Image src={tokenIcon} fluid thumbnail /></p>
      <p><b>Name</b>: {name}</p>
      <p><b>Description</b>: {description}</p>
      {
        moreInfoLink
          ? (
            <p><a href={moreInfoLink} target='_blank' rel='noreferrer'>More Information</a></p>
            )
          : null
      }

      <p style={{ overflowWrap: 'break-word' }}>
        <a
          href={`https://profile.localtradelist.com/?tokenid=${tokenId}`}
          target='_blank'
          rel='noreferrer'
        >
          <b>Profile Page</b>
        </a>
      </p>
    </>
  )
}

export default InfoPopup

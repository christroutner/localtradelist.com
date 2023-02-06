/*
  This component renders as a red 'Delete' button. It allows the user to delete
  a product by removing that product data from the mutable data of the token,
  then generating a blockchain transaction to update the mutable data.
*/

// Global npm libraries
import React, {useState} from 'react'
import { Button} from 'react-bootstrap'

// Local libraries
import updateMutableData from '../update-mutable-data.js'
import SspApi from '../../../services/ssp-api'
import ModalContinueCancel from '../../confirm-modal'
import ModalWaiting from '../../waiting-modal'

function DeleteProduct(props) {
  // State for Confirm/Cancel Modal
  const [showCCModal, setShowCCModal] = useState(false)

  // State of waiting modal
  const [showWaitingModal, setShowWaitingModal] = useState(false)
  const [waitingModalBody, setWaitingModalBody] = useState([])
  const [hideSpinner, setHideSpinner] = useState(false)
  const [denyClose, setDenyClose] = useState(true)

  // console.log('props.appData: ', props.appData)
  // console.log('props.index: ', props.index)
  // console.log('props.productData: ', props.productData)

  const modalBody = (
    <>
      <br />
      <p>
        If you click the Continue Button, the product {props.productData.name} will
        be deleted from your store.
      </p>
      <br />
    </>
  )

  // Encapsulate state and state update functions
  const deleteProdState = {
    showCCModal,
    setShowCCModal,
    showWaitingModal,
    setShowWaitingModal,
    waitingModalBody,
    setWaitingModalBody,
    hideSpinner,
    setHideSpinner,
    denyClose,
    setDenyClose
  }

  return (
    <>
    <Button variant='danger' onClick={(e) => handleInitialClick(props, deleteProdState)}>
      Delete
    </Button>
    {
      showCCModal
        ? (<ModalContinueCancel
            onCancel={(e) => handleCancel(props, deleteProdState)}
            onContinue={(e) => handleContinue(props, deleteProdState)}
            heading="Really Delete Product?"
            body={modalBody}
          />)
        : null
    }
    {
      showWaitingModal
        ? (<ModalWaiting
          heading={`Deleting ${props.productData.name}...`}
          body={waitingModalBody}
          denyClose={denyClose}
          hideSpinner={hideSpinner}
          closeFunc={waitingModalClose}
        />)
        : null
    }
    </>
  )
}

// This function is called when the Delete button is clicked. It activates the
// Cancel/Confirm modal.
function handleInitialClick(props, deleteProdState) {
  deleteProdState.setShowCCModal(true)
  return
}

// This function is called when the Cancel button in the Cancel/Confirm modal
// is clicked.
function handleCancel(props, deleteProdState) {
  deleteProdState.setShowCCModal(false)
}

// This function is called when the Continue button in the Cancel/Confirm modal
// is clicked.
function handleContinue(props, deleteProdState) {
  console.log('continue button clicked.')

  deleteProdState.setShowCCModal(false)
  deleteProdState.setShowWaitingModal(true)

  handleDeleteProduct(props, deleteProdState)
}

// Button click handler. Deletes the product associated with this button.
async function handleDeleteProduct(props, deleteProdState) {
  console.log('handleDeleteProduct() actived.')
  // console.log('props: ', props)

  try {
    // Update the modal body
    const modalBody = [`Deleting ${props.productData.name}...`]
    deleteProdState.setWaitingModalBody(modalBody)

    const {appData, index} = props

    let oldMutableData = {}
    let products = []
    try {
      oldMutableData = JSON.parse(appData.mutableData)
      products = oldMutableData.jsonLd.storeData.products
    } catch (err) {
      console.log('err: ', err)
      throw new Error('Could not delete product. Could not retrieve product array from mutable data.')
    }

    // Remove the product from the array
    products.splice(index, 1)

    // Stringify the mutable data.
    const mutableDataStr = JSON.stringify(oldMutableData)
    console.log('Updated mutable data: ', mutableDataStr)

    // Update the modal body
    modalBody.push(`Writing update to IPFS and BCH blockchain...`)
    deleteProdState.setWaitingModalBody(modalBody)

    // Generate a transaction to update the mutable data.
    await updateMutableData({mutableData: mutableDataStr, wallet: appData.wallet})

    // Get updated mutable data
    console.log('Updating token data cache on server.')
    await appData.getMutableData(props.appData.wallet, true)

    // Have the SSP API server also update the mutable data for this token.
    const sspApi = new SspApi()
    await sspApi.updateStore(oldMutableData.tokenId)

    // Update the modal body
    modalBody.push(`Done!`)
    deleteProdState.setWaitingModalBody(modalBody)
    deleteProdState.setHideSpinner(true)

    // Allow the user to close the waiting modal.
    deleteProdState.setDenyClose(false)
  } catch(err) {
    console.error('Error in handleDeleteProduct(): ', err)

    const modalBody = [`Error: ${err.message}`]
    deleteProdState.setWaitingModalBody(modalBody)
    deleteProdState.setHideSpinner(true)
  }
}

// This function is called when the Waiting Modal is closed.
function waitingModalClose() {
  console.log('waiting modal closed.')
}

export default DeleteProduct

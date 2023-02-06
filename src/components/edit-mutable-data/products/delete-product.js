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

function DeleteProduct(props) {
  const [showCCModal, setShowCCModal] = useState(false)

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

  return (
    <>
    <Button variant='danger' onClick={(e) => handleInitialClick(props, setShowCCModal)}>
      Delete
    </Button>
    {
      showCCModal
        ? (<ModalContinueCancel
            onCancel={(e) => handleCancel(props, setShowCCModal)}
            onContinue={(e) => handleContinue(props, setShowCCModal)}
            heading="Really Delete Product?"
            body={modalBody}
          />)
        : null
    }
    </>
  )
}

function handleCancel(props, setShowCCModal) {
  setShowCCModal(false)
}

function handleContinue(props, setShowCCModal) {
  console.log('continue button clicked.')
}

function handleInitialClick(props, setShowCCModal) {
  setShowCCModal(true)
  return
}

// Button click handler. Deletes the product associated with this button.
async function handleDeleteProduct(props, setShowCCModal) {
  console.log('handleDeleteProduct() actived.')
  // console.log('props: ', props)

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

  // Generate a transaction to update the mutable data.
  await updateMutableData({mutableData: mutableDataStr, wallet: appData.wallet})

  // Get updated mutable data
  console.log('Updating token data cache on server.')
  await appData.getMutableData(props.appData.wallet, true)

  // Have the SSP API server also update the mutable data for this token.
  const sspApi = new SspApi()
  await sspApi.updateStore(oldMutableData.tokenId)
}



export default DeleteProduct

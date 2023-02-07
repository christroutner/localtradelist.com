/*
  This component contains a form for adding a new product to the stores
  mutable data.
*/

// Global npm libraries
import React, { useState } from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'

// Local libraries
import updateMutableData from '../update-mutable-data.js'
import SspApi from '../../../services/ssp-api'
import ModalWaiting from '../../waiting-modal'

function AddProduct (props) {
  // Form state
  const [prodName, setProdName] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodPrice, setProdPrice] = useState('')

  // Waiting modal state
  const [showWaitingModal, setShowWaitingModal] = useState(false)
  const [waitingModalBody, setWaitingModalBody] = useState([])
  const [hideSpinner, setHideSpinner] = useState(false)
  const [denyClose, setDenyClose] = useState(true)

  // Encapsulate state and state update functions
  const formState = {
    prodName,
    setProdName,
    prodDesc,
    setProdDesc,
    prodImage,
    setProdImage,
    prodPrice,
    setProdPrice
  }
  const waitingModalState = {
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
      <Container style={{ border: 'black 1px solid', padding: '15px' }}>
        <Row>
          <Col><h4>Add a Product</h4></Col>
        </Row>

        <Row>
          <Col>
            <Form.Group>
              <Form.Label><b>Name</b></Form.Label>
              <Form.Control
                type='text'
                onChange={e => setProdName(e.target.value)}
                value={prodName}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <Form.Group>
              <Form.Label><b>Description</b></Form.Label>
              <Form.Control
                type='text'
                onChange={e => setProdDesc(e.target.value)}
                value={prodDesc}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <Form.Group>
              <Form.Label><b>Image Url</b></Form.Label>
              <Form.Control
                type='text'
                onChange={e => setProdImage(e.target.value)}
                value={prodImage}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <Form.Group>
              <Form.Label><b>Price</b></Form.Label>
              <Form.Control
                type='text'
                onChange={e => setProdPrice(e.target.value)}
                value={prodPrice}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <Button variant='primary' onClick={(e) => handleAddProduct({ props, formState, waitingModalState })}>
              Add Product
            </Button>
          </Col>
        </Row>
      </Container>
      {
      showWaitingModal
        ? (<ModalWaiting
            heading={`Adding new product: ${prodName}`}
            body={waitingModalBody}
            denyClose={denyClose}
            hideSpinner={hideSpinner}
            closeFunc={(e) => waitingModalClose(props, waitingModalState)}
           />)
        : null
    }
    </>
  )
}

// Add the new product to the products array in the tokens mutable data.
async function handleAddProduct (inObj) {
  console.log('handleAddProduct() handler activated.')

  try {
    // Expand the input parameters.
    const { props, formState, waitingModalState } = inObj
    const { prodName, prodDesc, prodImage, prodPrice } = formState

    // Setup Waiting Modal
    waitingModalState.setShowWaitingModal(true)
    const modalBody = [`Adding new product to token mutable data: ${prodName}`]
    waitingModalState.setWaitingModalBody(modalBody)

    const mutableData = props.appData.mutableData
    const wallet = props.appData.wallet

    let products = []
    let oldMutableData = {}
    try {
      oldMutableData = JSON.parse(mutableData)
      products = oldMutableData.jsonLd.storeData.products
    } catch (err) {
      throw new Error('Could not add new product. Store JSON-LD does not follow expected schema.')
    }

    // Add the new product to the product array.
    const newProduct = {
      name: prodName,
      desc: prodDesc,
      imgUrl: prodImage,
      price: prodPrice
    }
    products.push(newProduct)

    // Stringify the mutable data.
    const mutableDataStr = JSON.stringify(oldMutableData)
    console.log('Updated mutable data: ', mutableDataStr)

    // Update waiting modal
    modalBody.push('Writing new data to IPFS and BCH blockchain...')
    waitingModalState.setWaitingModalBody(modalBody)

    // Generate a transaction to update the mutable data.
    await updateMutableData({ mutableData: mutableDataStr, wallet })

    // Update waiting modal
    modalBody.push('Waiting for changes to propegate...')
    waitingModalState.setWaitingModalBody(modalBody)

    // Wait for changes to propegate
    await props.appData.wallet.bchjs.Util.sleep(3000)

    // Get updated mutable data
    // console.log('Updating token data cache on server.')
    // await props.appData.getMutableData(props.appData.wallet, true)

    // Have the SSP API server also update the mutable data for this token.
    const sspApi = new SspApi()
    await sspApi.updateStore(oldMutableData.tokenId, true)

    // Wait for changes to propegate
    await props.appData.wallet.bchjs.Util.sleep(3000)

    // Update the modal
    modalBody.push('Done!')
    waitingModalState.setWaitingModalBody(modalBody)
    waitingModalState.setHideSpinner(true)
    waitingModalState.setDenyClose(false)
  } catch (err) {
    console.error('Error in handleDeleteProduct(): ', err)

    const { waitingModalState } = inObj

    // Update the modal
    const modalBody = [`Error: ${err.message}`]
    waitingModalState.setWaitingModalBody(modalBody)
    waitingModalState.setHideSpinner(true)
    waitingModalState.setDenyClose(false)
  }
}

// This function is called when the waiting modal is closed.
async function waitingModalClose (props, waitingModalState) {
  console.log('waiting modal closed. Updating token mutable data.')

  // Refresh the mutable data.
  // await props.appData.getMutableData(props.appData.wallet, true)
  window.location.href = '/'
}

export default AddProduct

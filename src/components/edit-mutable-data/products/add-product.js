/*
  This component contains a form for adding a new product to the stores
  mutable data.
*/

// Global npm libraries
import React, {useState} from 'react'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'

// Local libraries
import updateMutableData from '../update-mutable-data.js'
import SspApi from '../../../services/ssp-api'

function AddProduct(props) {
  const [prodName, setProdName] = useState('')
  const [prodDesc, setProdDesc] = useState('')
  const [prodImage, setProdImage] = useState('')
  const [prodPrice, setProdPrice] = useState('')

  return (
    <Container style={{border: 'black 1px solid', padding: '15px'}}>
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
          <Button variant='primary' onClick={(e) => handleAddProduct({props, prodName, prodDesc, prodImage, prodPrice})}>
            Add Product
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

// Add the new product to the products array in the tokens mutable data.
async function handleAddProduct(inObj) {
  console.log('handleAddProduct() handler activated.')

  const {props, prodName, prodDesc, prodImage, prodPrice} = inObj

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

  // Generate a transaction to update the mutable data.
  await updateMutableData({mutableData: mutableDataStr, wallet})

  // Get updated mutable data
  console.log('Updating token data cache on server.')
  await props.appData.getMutableData(props.appData.wallet, true)

  // Have the SSP API server also update the mutable data for this token.
  const sspApi = new SspApi()
  await sspApi.updateStore(oldMutableData.tokenId)
}

export default AddProduct

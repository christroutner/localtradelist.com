/*
  This component lets the user edit products for their store.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Button, Image } from 'react-bootstrap'

// Local libraries
import AddProduct from './add-product.js'

function EditProducts (props) {

  // Get products from the mutable data.
  let products = null
  try {
    const mutableData = JSON.parse(props.appData.mutableData)
    products = mutableData.jsonLd.storeData.products
  } catch(err) {
    return (
      <Container>
        <Row>
          <Col>
            <br />
            <p>No products found for this store. Add some!</p>
          </Col>
        </Row>
        <br />
        <AddProduct appData={props.appData} />
      </Container>
    )
  }

  const productsJsx = []
  for(let i=0; i < products.length; i++) {
    const thisProduct = products[i]

    const productJsx = new Product(thisProduct)
    productsJsx.push(productJsx)
  }

  return (
    <>
    <Container>
      <Row>
        <Col>
          <b>Products:</b>
        </Col>
      </Row>
      <Row>
        <Col>
          {productsJsx}
        </Col>
      </Row>
      <br />

      <Row>
        <Col>
          <AddProduct appData={props.appData} />
        </Col>
      </Row>
    </Container>
    </>
  )
}

function Product(props) {
  return (
    <Container>
      <Row>
        <Col>
          Name: {props.name}
        </Col>
      </Row>
      <Row>
        <Col>
          Description: {props.desc}
        </Col>
      </Row>
      <Row>
        <Col>
          Price: {props.price}
        </Col>
      </Row>
      <Row>
        <Col>
          <Image src={props.imgUrl} fluid thumbnail />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant='primary'>
            Edit
          </Button>{'   '}
          <Button variant='danger'>
            Delete
          </Button>
        </Col>
      </Row>
      <br /><br />
    </Container>
  )
}

export default EditProducts

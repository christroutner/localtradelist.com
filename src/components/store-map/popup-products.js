/*
  This component shows two products in the popup.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Image } from 'react-bootstrap'

function PopupProducts (props) {
  // let mutableData

  // try {
  //   mutableData = JSON.parse(props.appData.mutableData)
  //   // console.log('PopupProducts mutableData: ', mutableData)
  //   products = mutableData.jsonLd.storeData.products
  //   // console.log('PopupProducts products: ', products)
  // } catch(err) { return null }

  // If the store has no products listed in its array, return null.
  const products = props.marker.products
  // console.log(`PopupProducts products for ${props.marker.name}: `, products)
  if (!products) return null

  let showProd1 = false
  let showProd2 = false
  if (products.length > 0) showProd1 = true
  if (products.length > 1) showProd2 = true

  return (
    <Container>
      <Row>
        <Col>
          <h4>Products</h4>
        </Col>
      </Row>

      {
        showProd1
          ? (
            <>
              <Row>
                <Col>
                  Name: {products[0].name}
                </Col>
              </Row>
              <Row>
                <Col>
                  Description: {products[0].desc}
                </Col>
              </Row>
              <Row>
                <Col>
                  Price: {products[0].price}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image src={products[0].imgUrl} fluid thumbnail />
                </Col>
              </Row>
              <br /><br />
            </>
            )
          : (<p>This store has no products</p>)
      }

      {
        showProd2
          ? (
            <>
              <Row>
                <Col>
                  Name: {products[1].name}
                </Col>
              </Row>
              <Row>
                <Col>
                  Description: {products[1].desc}
                </Col>
              </Row>
              <Row>
                <Col>
                  Price: {products[1].price}
                </Col>
              </Row>
              <Row>
                <Col>
                  <Image src={products[1].imgUrl} fluid thumbnail />
                </Col>
              </Row>
              <br /><br />
            </>
            )
          : null
      }

    </Container>
  )
}

export default PopupProducts

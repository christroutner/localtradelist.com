/*
  This View allows the user to update the mutable data associated with the token,
  which is in-turn controlled by the wallet (12 words).
*/

// Global npm libraries
import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

function EditRawJson (props) {
  const [mutableData, setMutableData] = useState(props.appData.mutableData)

  const handleUpdateMutableData = () => {
    console.log('handleUpdateMutableData() called from button click')

    let newMutableData = null
    try {
      newMutableData = JSON.parse(mutableData)
    } catch (err) {
      console.error('Syntax error: the mutable data could not be parsed from text to an object.')
    }

    if (newMutableData) {
      // Update the mutable data for the token.
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col>
            <b>Mutable Data:</b>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                type='text'
                as='textarea'
                placeholder=''
                onChange={e => setMutableData(e.target.value)}
                value={mutableData}
                style={{ height: '300px' }}
              />
            </Form.Group>
          </Col>
        </Row>
        <br />

        <Row>
          <Col>
            <Button variant='info' onClick={(e) => handleUpdateMutableData(e)}>Update Mutable Data</Button>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default EditRawJson

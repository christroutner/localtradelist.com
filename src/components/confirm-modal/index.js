/*
  This 'Confirmation Modal' displays a Yes/No or Continue/Cancel pair. Handler
  functions are passed as props, and they are called depending on the choice
  of the user.
*/

// Global npm libraries
import React from 'react'
// import React, { useState } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'

function ModalContinueCancel (props) {

  // Closing this modal is the same as clicking the Cancel button.
  const handleClose = () => {
    props.onCancel()
  }


  return (
    <Modal show onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Col style={{ textAlign: 'center' }}>
              {props.body}
            </Col>
          </Row>
          <Row style={{ textAlign: 'center' }}>
            <Col>
              <Button onClick={props.onCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button onClick={props.onContinue}>Continue</Button>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  )
}

// export default WaitingModal
export default ModalContinueCancel

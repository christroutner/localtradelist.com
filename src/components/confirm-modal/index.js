/*
  This 'Confirmation Modal' displays a Yes/No or Continue/Cancel pair. Handler
  functions are passed as props, and they are called depending on the choice
  of the user.
*/

// Global npm libraries
import React, { useState } from 'react'
import { Container, Row, Col, Modal, Button } from 'react-bootstrap'

function ModalContinueCancel (props) {
  const [show, setShow] = useState(true)

  const handleClose = () => {
    props.handleCancel()
  }

  // const handleShow = () => setShow(true)

  return (
    <Modal show={show} onHide={handleClose}>
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
              <Button onClick={props.handleCancel}>Cancel</Button>
            </Col>
            <Col>
              <Button onClick={props.handleContinue}>Continue</Button>
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

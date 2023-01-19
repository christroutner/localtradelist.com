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
    // Refuse to close the modal if denyClose is set.
    // console.log(`props.denyClose: ${props.denyClose}`)
    // if (props.denyClose) return

    // setShow(false)

    // if (props.closeFunc) {
    //   props.closeFunc()
    // }

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

// <BodyList body={props.body} />
// {props.hideSpinner ? null : <Spinner animation='border' />}

// function BodyList (props) {
//   const items = props.body
//
//   const listItems = []
//
//   // Paragraphs
//   for (let i = 0; i < items.length; i++) {
//     // Generate a unique key for each entry.
//     const rndNum = Math.floor(Math.random() * 1000)
//     const key = `${items[i].toString()}${rndNum}`
//     // console.log(`Dialog key: ${key}`)
//
//     listItems.push(<p key={key}><code>{items[i]}</code></p>)
//   }
//
//   return (
//     listItems
//   )
// }

// export default WaitingModal
export default ModalContinueCancel

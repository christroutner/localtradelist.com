/*
  This View allows the user to update the mutable data associated with the token,
  which is in-turn controlled by the wallet (12 words).
*/

// Global npm libraries
import React, { useState } from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'
import { SlpMutableData } from 'slp-mutable-data'

function EditRawJson (props) {
  const [mutableData, setMutableData] = useState(props.appData.mutableData)

  const handleUpdateMutableData = async () => {
    console.log('handleUpdateMutableData() called from button click')

    let newMutableData = null
    try {
      newMutableData = JSON.parse(mutableData)
    } catch (err) {
      throw new Error('Syntax error: the mutable data could not be parsed from text to an object.')
    }

    // Instantiate the slp-mutable-data library
    const slpMutableData = new SlpMutableData({ wallet: props.appData.wallet })

    // Update the mutable data for the token.
    let cidMutable = await slpMutableData.data.createTokenData(newMutableData)
    cidMutable = `ipfs://${cidMutable}`
    console.log(`new mutable data CID: ${cidMutable}`)

    // Get a key pair from the wallet library.
    const keyPair = await props.appData.wallet.getKeyPair(1)
    console.log('keyPair: ', keyPair)

    // Instantiate a wallet based on the Mutable Data Address (MDA) private key
    let BchWallet = null
    if (typeof window !== 'undefined' && window.SlpWallet) {
      BchWallet = window.SlpWallet
    } else {
      throw new Error('Could not find wallet library.')
    }

    const mdaWallet = new BchWallet(keyPair.wif, { interface: 'consumer-api' })
    await mdaWallet.initialize()

    // Generate an OP_RETURN transaction from the MDA.
    const mdaMutableData = new SlpMutableData({ wallet: mdaWallet })

    const hex = await mdaMutableData.data.writeCIDToOpReturn(cidMutable)

    const txid = await mdaWallet.broadcast(hex)
    console.log('txid: ', txid)
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

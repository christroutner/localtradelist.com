/*
  This View allows the user to update the mutable data associated with the token,
  which is in-turn controlled by the wallet (12 words).
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Form, Button } from 'react-bootstrap'

class EditMutableData extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      appData: props.appData,

      mutableData: ''
    }
  }

  async componentDidMount() {
    await this.getMutableData()
  }

  render() {
    return(
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
                  onChange={e => this.setState({ mutableData: e.target.value })}
                  value={this.state.mutableData}
                  style={{height: '300px'}}
                />
              </Form.Group>
            </Col>
          </Row>
          <br />

          <Row>
            <Col>
              <Button variant='info' onClick={(e) => this.handleUpdateMutableData(e)}>Create Token</Button>
            </Col>
          </Row>
        </Container>
      </>
    )
  }

  async handleUpdateMutableData(event) {
    console.log('handleUpdateMutableData() button clicked')
  }

  // This function retrieves the mutable data for an SSP token controlled by
  // the wallet. It looks for a Group minting baton held by the wallet. If
  // found, and if the token contains SSP in the ticker, then the mutable
  // data for that token is retrieved and saved to the state.
  async getMutableData() {
    try {
      const groupMintBaton = this.state.appData.wallet.utxos.utxoStore.slpUtxos.group.mintBatons[0]
      console.log('groupMintBaton: ', groupMintBaton)

      if(groupMintBaton && groupMintBaton.tokenId) {
        // Get the mutable data
        const tokenData = await this.state.appData.wallet.getTokenData2(groupMintBaton.tokenId)
        console.log('tokenData: ', tokenData)

        if(tokenData.mutableData) {
          // console.log('token data found.')
          this.setState({
            mutableData: JSON.stringify(tokenData.mutableData, null, 2)
          })
        } else {
          this.setState({
            mutableData: `Mutable data for token named ${tokenData.tokenStats.name} (Token ID ${groupMintBaton.tokenId}) could not be retrieved.`
          })
        }
      }
    } catch(err) {
      console.error('Error in getMutableData(): ', err)
    }
  }
}

export default EditMutableData

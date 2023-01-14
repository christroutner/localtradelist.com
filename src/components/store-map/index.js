/*
  This Sweep component allows users to sweep a private key and transfer any
  BCH or SLP tokens into their wallet.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'

// Local libraries
import SspApi from '../../services/ssp-api.js'
import MapOfStores from './map-of-stores.js'
import WaitingModal from '../waiting-modal'

class StoreMap extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      appData: props.appData,
      wifToSweep: '',

      // Modal control
      showModal: false,
      modalHeader: 'Waiting...',
      modalBody: [], // Strings displayed in the modal
      hideSpinner: false, // Spinner gif in modal
      denyClose: false,

      // Map
      markers: []
    }

    // Encapsulate dependecies
    this.sspApi = new SspApi()

    // Bind the 'this' object to subfunctions.
    this.updateModal = this.updateModal.bind(this)

  }

  // This function is passed to lower-level components, so that they can directly
  // control the waiting modal in this parent component.
  async updateModal(inObj) {
    const {showModal, modalHeader, modalBody, hideSpinner, denyClose} = inObj

    await this.setState({
      showModal,
      modalHeader,
      modalBody,
      hideSpinner,
      denyClose
    })
  }

  async componentDidMount () {
    await this.loadTokens()
  }

  render () {
    // Generate the JSX for the modal.
    // const modal = this.getModal()

    const mapProps = {
      markers: this.state.markers,
      mapCenterLat: 45.5767026,
      mapCenterLong: -122.6437683,
      zoom: 12,
      appData: this.state.appData
    }
    mapProps.appData.updateModal = this.updateModal
    console.log('mapProps: ', mapProps)

    return (
      <>
        <Container>
          <Row>
            <Col style={{ textAlign: 'right' }}>
              <a href='https://youtu.be/QW9xixHaEJE' target='_blank' rel='noreferrer'>
                <FontAwesomeIcon icon={faCircleQuestion} size='lg' />
              </a>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col>
              <MapOfStores mapObj={mapProps} />
            </Col>
            <Col>
              Loading stores from blockchain...
            </Col>
          </Row>
        </Container>

        {
          this.state.showModal
            ? (
              <WaitingModal
                heading={this.state.modalHeader}
                body={this.state.modalBody}
                hideSpinner={this.state.hideSpinner}
                denyClose={this.state.denyClose}
              />
            )
            : null
        }
      </>
    )
  }

  // Load the tokens from the blockchain.
  // Right now this is mocked by loading a hard-coded array of token IDs.
  async loadTokens () {
    try {
      // Get all the stores from the ssp-api
      const allStoreData = await this.sspApi.getAllStores()
      console.log(`allStoreData: ${JSON.stringify(allStoreData, null, 2)}`)

      const markers = []

      // Loop through each store.
      const stores = allStoreData.stores
      for (let i = 0; i < stores.length; i++) {
        const thisStore = stores[i]
        const storeData = thisStore.storeData

        // Skip this entry if it does not include the store data from the mutable data.
        if (!storeData) continue

        const lat = storeData.location.geo.latitude
        const long = storeData.location.geo.longitude
        console.log(`lat,long: ${lat},${long}`)

        const marker = {
          lat,
          long,
          id: 1,
          name: storeData.name,
          description: storeData.description,
          tokenId: thisStore.tokenId
        }

        markers.push(marker)
      }

      console.log(`Updating state with these markers: ${JSON.stringify(markers, null, 2)}`)
      this.setState({
        // markers: [marker]
        markers
      })
    } catch (err) {
      console.error('Error in loadTokens(): ', err)
    }
  }

  // Generate the info modal that is displayed when the button is clicked.
  // getModal () {
  //   // const token = this.state.token
  //   // console.log(`token: ${JSON.stringify(token, null, 2)}`)
  //
  //   return (
  //     <Modal show={this.state.showModal} size='lg' onHide={(e) => this.handleCloseModal(this)}>
  //       <Modal.Header closeButton>
  //         <Modal.Title>Sweeping...</Modal.Title>
  //       </Modal.Header>
  //       <Modal.Body>
  //         <Container>
  //           <Row>
  //             <Col style={{ textAlign: 'center' }}>
  //               Sweeping private key... {
  //                 this.state.hideSpinner ? null : <Spinner animation='border' />
  //               }
  //             </Col>
  //           </Row>
  //           <br />
  //
  //           <Row>
  //             <Col style={{ textAlign: 'center' }}>
  //               {this.state.statusMsg}
  //             </Col>
  //           </Row>
  //         </Container>
  //       </Modal.Body>
  //       <Modal.Footer />
  //     </Modal>
  //   )
  // }

  // This handler function is called when the modal is closed.
  async handleCloseModal () {
    this.setState({
      showModal: false
    })
  }
}

export default StoreMap

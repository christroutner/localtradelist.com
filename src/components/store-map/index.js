/*
  This is the top-level parent component for the store-map View.

  It contains a lot of state that it manages for parent children components.
  That is why this top-level component is a Class component and not a Function
  component.
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
import ModalConfirm from '../confirm-modal'

class StoreMap extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      appData: props.appData,
      wifToSweep: '',

      // Waiting modal control
      showModal: false,
      modalHeader: 'Waiting...',
      modalBody: [], // Strings displayed in the modal
      hideSpinner: false, // Spinner gif in modal
      denyClose: false,

      // Continue/Cancel Confirmation Modal control
      showConfirmModal: false,
      confirmModalBody: '',

      // Map
      markers: []
    }

    // Encapsulate dependecies
    this.sspApi = new SspApi()

    // Bind the 'this' object to subfunctions.
    this.updateModal = this.updateModal.bind(this)
    this.updateConfirmModal = this.updateConfirmModal.bind(this)
    this.handleContinueFlag = this.handleContinueFlag.bind(this)
    this.handleCancelFlag = this.handleCancelFlag.bind(this)
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
    mapProps.appData.updateConfirmModal = this.updateConfirmModal
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

        {
          this.state.showConfirmModal
            ? (
              <ModalConfirm
                heading='Flag NSWF'
                onContinue={this.handleContinueFlag}
                onCancel={this.handleCancelFlag}
                body={this.state.confirmModalBody}
              />
              )
            : null
        }
      </>
    )
  }

  // This function is called when the component is loaded, from componentDidMount()
  // It loads the tokens from the blockchain, retrieves their mutable data,
  // and generates a pin on the map if the token has lat and long coordinates.
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

  // BEGIN WAITING MODAL

  // This handler function is called when the modal is closed.
  async handleCloseModal () {
    this.setState({
      showModal: false
    })
  }

  // This function is passed to lower-level components, so that they can directly
  // control the waiting modal in this parent component.
  async updateModal (inObj) {
    const { showModal, modalHeader, modalBody, hideSpinner, denyClose } = inObj

    await this.setState({
      showModal,
      modalHeader,
      modalBody,
      hideSpinner,
      denyClose
    })
  }

  // END WAITING MODAL

  // BEGIN CONFIRMATION MODAL

  // This function is passed to child components in order to control the showing
  // of the Confirm (Continue/Cancel) modal. It lets the child components update
  // the state of the modal and trigger a re-render.
  async updateConfirmModal (inObj) {
    const { showConfirmModal, confirmModalBody } = inObj

    await this.setState({
      showConfirmModal,
      confirmModalBody
    })
  }

  // This function is called when the 'Continue' button is clicked on the
  // Confirmation Modal.
  handleContinueFlag () {
    console.log('handleContinueFlag() called')
  }

  // This function is called when the 'Cancel' button is clicked on the
  // Confirmation Modal.
  handleCancelFlag () {
    console.log('handleCancelFlag() called')

    this.setState({
      showConfirmModal: false
    })
  }

  // END CONFIRMATION MODAL
}

export default StoreMap

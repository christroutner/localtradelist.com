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
import PopupLib from './popup-lib.js'
import StoreFeed from './store-feed.js'

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
      confirmTokenId: null,
      confirmType: null,

      // Map
      markers: [],

      mapFilterBox: {}
    }

    // Bind the 'this' object to subfunctions.
    this.updateWaitingModal = this.updateWaitingModal.bind(this)
    this.updateConfirmModal = this.updateConfirmModal.bind(this)
    this.updateMapFilterBox = this.updateMapFilterBox.bind(this)
    this.onCloseModal = this.onCloseModal.bind(this)

    // Encapsulate dependecies
    this.sspApi = new SspApi()
    this.popupLib = new PopupLib({
      updateConfirmModal: this.updateConfirmModal,
      updateWaitingModal: this.updateWaitingModal,
      wallet: props.appData.wallet
    })
  }

  async componentDidMount () {
    await this.loadTokens()

    // console.log('ping01 from store-map/index.js componentDidMount()')
  }

  render () {
    // Generate the JSX for the modal.
    // const modal = this.getModal()

    const mapProps = {
      // Default map settings.
      mapCenterLat: 43.4691314,
      mapCenterLong: -103.2816322,
      zoom: 4,

      // Portland
      // mapCenterLat: 45.5767026,
      // mapCenterLong: -122.6437683,

      markers: this.state.markers,
      appData: this.state.appData,

      // Pass handle to the function that updates the store feed when the map
      // is moved or zoomed.
      updateMapFilterBox: this.updateMapFilterBox
    }
    this.popupLib.confirmTokenId = this.state.confirmTokenId
    this.popupLib.confirmType = this.state.confirmType
    mapProps.appData.popupLib = this.popupLib

    // console.log('mapProps: ', mapProps)

    const mapFilterBoxProps = {
      appData: this.state.appData,
      mapFilterBox: this.state.mapFilterBox
    }

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
            <Col xs={12} lg={8}>
              <MapOfStores mapObj={mapProps} />
            </Col>
            <Col xs={12} lg={4}>
              <StoreFeed mapFilterBoxProps={mapFilterBoxProps} />
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
                closeFunc={this.onCloseModal}
              />
              )
            : null
        }

        {
          this.state.showConfirmModal
            ? (
              <ModalConfirm
                heading='Flag NSWF'
                onContinue={this.popupLib.handleContinueFlag}
                onCancel={this.popupLib.handleCancelFlag}
                body={this.state.confirmModalBody}
                closeFunc={this.onCloseModal}
              />
              )
            : null
        }
      </>
    )
  }

  // Update the store feed, to the right of the map.
  updateMapFilterBox (mapFilterBox) {
    // console.log('updateMapFilterBox() mapFilterBox: ', mapFilterBox)
    this.setState({ mapFilterBox })
  }

  // This function is called when the component is loaded, from componentDidMount()
  // It loads the tokens from the blockchain, retrieves their mutable data,
  // and generates a pin on the map if the token has lat and long coordinates.
  async loadTokens () {
    try {
      // Get all the stores from the ssp-api
      const allStoreData = await this.sspApi.getAllStores()
      // console.log(`allStoreData: ${JSON.stringify(allStoreData, null, 2)}`)

      const markers = []

      // Loop through each store.
      const stores = allStoreData.stores
      for (let i = 0; i < stores.length; i++) {
        const thisStore = stores[i]
        const storeData = thisStore.storeData
        // console.log(`storeData: ${JSON.stringify(storeData, null, 2)}`)

        // Skip this entry if it does not include the store data from the mutable data.
        if (!storeData) continue

        const lat = storeData.location.geo.latitude
        const long = storeData.location.geo.longitude
        // console.log(`lat,long: ${lat},${long}`)

        let products = storeData.products
        // console.log(`loadTokens() storeData for ${storeData.name}: `, storeData)
        // console.log(`loadTokens() products for ${storeData.name}: `, products)
        if (!products) products = []

        const marker = {
          lat,
          long,
          id: 1,
          name: storeData.name,
          description: storeData.description,
          tokenId: thisStore.tokenId,
          moreInfoLink: storeData.moreInfoLink,
          products
        }

        markers.push(marker)
      }

      // console.log(`Updating state with these markers: ${JSON.stringify(markers, null, 2)}`)
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
  async onCloseModal () {
    console.log('onCloseModal() called')
    this.setState({
      showModal: false
    })
  }

  // This function is passed to lower-level components, so that they can directly
  // control the waiting modal in this parent component.
  async updateWaitingModal (inObj) {
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
    const { showConfirmModal, confirmModalBody, tokenId, confirmType } = inObj
    console.log('updateConfirmModal() tokenId: ', tokenId)

    if (tokenId) {
      await this.setState({
        showConfirmModal,
        confirmModalBody,
        confirmTokenId: tokenId,
        confirmType
      })
    } else {
      await this.setState({
        showConfirmModal,
        confirmModalBody
      })
    }

    console.log('this.state.confirmTokenId: ', this.state.confirmTokenId)

    // window.currentTokenId = tokenId
  }

  // END CONFIRMATION MODAL
}

export default StoreMap

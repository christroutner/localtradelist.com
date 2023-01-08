/*
  This Sweep component allows users to sweep a private key and transfer any
  BCH or SLP tokens into their wallet.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Modal, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import "leaflet/dist/leaflet.css"


// let _this

class StoreMap extends React.Component {
  constructor (props) {
    super()

    this.state = {
      appData: props.appData,
      wifToSweep: '',

      // Modal control
      showModal: false,
      statusMsg: '',
      hideSpinner: false,
      shouldRefreshOnModalClose: false,

      // Map
      markers: []
    }

    // Bind this to event handlers
    // this.handleSweep = this.handleSweep.bind(this)
    // this.updateWalletState = this.updateWalletState.bind(this)

    // _this = this
  }

  async componentDidMount() {
    await this.loadTokens()
  }

  render () {
    // Generate the JSX for the modal.
    const modal = this.getModal()

    // Starting coordinates
    const latitude = 48.5979506
    const longitude = -122.9446977

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
              <MapContainer
                center={[latitude, longitude]}
                zoom={12}
                style={{ height: '70vh' }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />

                <Markers markers={this.state.markers}/>
              </MapContainer>
            </Col>
            <Col>
              Loading stores from blockchain...
            </Col>
          </Row>
        </Container>

        {
          this.state.showModal
            ? modal
            : null
        }
      </>
    )
  }

  // Load the tokens from the blockchain.
  // Right now this is mocked by loading a hard-coded array of token IDs.
  async loadTokens() {
    try {
      const tokenIds = [
        'e2d78b130bd84573b17a2a5cb1b52eaa3e95ac75a17e1ed44405ef0aefdd86e7' // Orcas Landing
      ]

      const wallet = this.state.appData.wallet

      const tokenData = await wallet.getTokenData2(tokenIds[0])
      // console.log(`tokenData: ${JSON.stringify(tokenData, null, 2)}`)

      // const storeData = JSON.parse(tokenData.mutableData.jsonLd)
      const storeData = tokenData.mutableData.jsonLd.storeData
      console.log(`storeData: ${JSON.stringify(storeData, null, 2)}`)

      console.log('location: ', storeData.location)
      const lat = storeData.location.geo.latitude
      const long = storeData.location.geo.longitude
      console.log(`lat,long: ${lat},${long}`)

      const marker = {
        lat,
        long,
        id: 1,
        name: storeData.name,
        description: storeData.description
      }
      this.setState({
        markers: [marker]
      })

    } catch(err) {
      console.error('Error in loadTokens(): ', err)
    }
  }


  // Generate the info modal that is displayed when the button is clicked.
  getModal () {
    // const token = this.state.token
    // console.log(`token: ${JSON.stringify(token, null, 2)}`)

    return (
      <Modal show={this.state.showModal} size='lg' onHide={(e) => this.handleCloseModal(this)}>
        <Modal.Header closeButton>
          <Modal.Title>Sweeping...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col style={{ textAlign: 'center' }}>
                Sweeping private key... {
                  this.state.hideSpinner ? null : <Spinner animation='border' />
                }
              </Col>
            </Row>
            <br />

            <Row>
              <Col style={{ textAlign: 'center' }}>
                {this.state.statusMsg}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    )
  }

  // This handler function is called when the modal is closed.
  async handleCloseModal () {
    this.setState({
      showModal: false
    })
  }
}

function Markers(props) {
  console.log('Marker props: ', props)

  const {markers} = props

  const map = useMap()

  if(markers.length) {
    const {lat, long, id, name, description} = markers[0]

    const icon = L.icon({
      iconSize: [25, 41],
      iconAnchor: [10, 41],
      popupAnchor: [2, -40],
      iconUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.7/dist/images/marker-shadow.png'
    })

    const pin = L.marker([lat, long], {id, icon})
    pin.addTo(map)

    const popUpHtml = `
    <p><b>Name</b>: ${name}</p>
    <p><b>Description</b>: ${description}</p>
    `

    pin.bindPopup(popUpHtml)
  }

  return(
    <>
    </>
  )
}

export default StoreMap

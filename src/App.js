/*
  This is an SPA.
*/

// Global npm libraries
import React, { useState, useEffect } from 'react'
import { useQueryParam, StringParam } from 'use-query-params'

// Local libraries
import './App.css'
import LoadScripts from './components/load-scripts'
import WaitingModal from './components/waiting-modal'
import AsyncLoad from './services/async-load'
import SelectServerButton from './components/servers/select-server-button'
import Footer from './components/footer'
import NavMenu from './components/nav-menu'
import AppBody from './components/app-body'
import useLocalStorageState from 'use-local-storage-state'

// Default alternative servers.
const defaultServerOptions = [
  { value: 'https://free-bch.fullstack.cash', label: 'https://free-bch.fullstack.cash' },
  { value: 'https://bc01-ca-bch-consumer.fullstackcash.nl', label: 'https://bc01-ca-bch-consumer.fullstackcash.nl' },
  { value: 'https://pdx01-usa-bch-consumer.fullstackcash.nl', label: 'https://pdx01-usa-bch-consumer.fullstackcash.nl' },
  { value: 'https://wa-usa-bch-consumer.fullstackcash.nl', label: 'https://wa-usa-bch-consumer.fullstackcash.nl' }
]

function App (props) {
  // BEGIN STATE

  // Get the CashStack URL from a query parameter, if it exists.
  let [restURL] = useQueryParam('restURL', StringParam)
  // Otherwise default to free-bch.fullstack.cash
  if (!restURL) restURL = 'https://free-bch.fullstack.cash'
  // console.log('restURL: ', restURL)
  const [serverUrl, setServerUrl] = useState(restURL)

  // App State
  const [menuState, setMenuState] = useState(0)
  const [wallet, setWallet] = useState(false)
  const [servers, setServers] = useState(defaultServerOptions)

    this.state = {
      // State specific to this top-level component.
      walletInitialized: false,
      bchWallet: false, // BCH wallet instance
      menuState: 0, // The current View being displayed in the app
      queryParamExists: false, // Becomes true if query parameters are detected in the URL.
      serverUrl, // Stores the URL for the currently selected server.
      servers: defaultServerOptions, // A list of back end servers.
      mutableData: null, // Placeholder. Will contain store mutable data after wallet init (if available)

    // Progressively overwrite the LocalStorage state.
    const newObj = Object.assign({}, lsState, lsObj)
    // console.log(`updateLocalStorage() output: ${JSON.stringify(newObj, null, 2)}`)

    setLSState(newObj)
  }
  const mnemonic = lsState.mnemonic

  // Startup state
  // When the page is loaded, it goes through a series of async network calls
  // to initialize the app. These variables track the state of this startup
  // process.
  const [asyncInitStarted, setAsyncInitStarted] = useState(false)
  const [asyncInitFinished, setAsyncInitFinished] = useState(false)
  const [asyncInitSucceeded, setAsyncInitSucceeded] = useState(null)

  // Startup Modal
  const [showStartModal, setShowStartModal] = useState(true)
  const [modalBody, setModalBody] = useState([])
  const [hideSpinner, setHideSpinner] = useState(false)
  const [denyClose, setDenyClose] = useState(false)

  // The wallet state makes this a true progressive web app (PWA). As
  // balances, UTXOs, and tokens are retrieved, this state is updated.
  // properties are enumerated here for the purpose of documentation.
  const [bchWalletState, setBchWalletState] = useState({
    mnemonic: undefined,
    address: undefined,
    cashAddress: undefined,
    slpAddress: undefined,
    privateKey: undefined,
    publicKey: undefined,
    legacyAddress: undefined,
    hdPath: undefined,
    bchBalance: 0,
    slpTokens: [],
    bchUsdPrice: 150
  })

    // Bind the 'this' object to event handlers
    this.passMnemonic = this.passMnemonic.bind(this)
    this.getMutableData = this.getMutableData.bind(this)

    _this = this
  }

  // END STATE

  // Encasulate dependencies
  const asyncLoad = new AsyncLoad()

  useEffect(() => {
    async function asyncEffect () {
      // console.log('asyncInitStarted: ', asyncInitStarted)
      if (!asyncInitStarted) {
        try {
          setAsyncInitStarted(true)

          addToModal('Loading minimal-slp-wallet', appData)

          setDenyClose(true)

      // If this wallet has created a token already, then download the mutable data.
      await this.getMutableData(bchWallet)

      // Get the BCH balance of the wallet.
      this.addToModal('Getting BCH balance')
      await this.asyncLoad.getWalletBchBalance(bchWallet, this.updateBchWalletState)

          addToModal('Getting alternative servers', appData)
          const gistServers = await asyncLoad.getServers()
          setServers(gistServers)
          // console.log('servers: ', servers)

          addToModal('Initializing wallet', appData)
          console.log(`Initializing wallet with back end server ${serverUrl}`)

          const walletTemp = await asyncLoad.initWallet(serverUrl, mnemonic, appData)
          setWallet(walletTemp)

          // Get the BCH balance of the wallet.
          addToModal('Getting BCH balance', appData)
          await asyncLoad.getWalletBchBalance(walletTemp, updateBchWalletState, appData)

          // Get the SLP tokens held by the wallet.
          addToModal('Getting SLP tokens', appData)
          await asyncLoad.getSlpTokenBalances(walletTemp, updateBchWalletState, appData)

    // This is a macro object that is passed to all child components. It gathers
    // all the data and handlers used throughout the app.
    const appData = {
      // Wallet and wallet state
      bchWallet: this.state.bchWallet,
      wallet: this.state.bchWallet,
      bchWalletState: this.state.bchWalletState,
      lsState: this.lsState,
      mutableData: this.state.mutableData,
      getMutableData: this.getMutableData,

          // Update state
          setShowStartModal(false)
          setDenyClose(false)

          // Update the startup state.
          setAsyncInitFinished(true)
          setAsyncInitSucceeded(true)
          console.log('App.js useEffect() startup finished successfully')
        } catch (err) {
          console.error('Error in App.js useEffect(): ', err)

          const errModalBody = [
            `Error: ${err.message}`,
            'Try selecting a different back end server using the drop-down menu at the bottom of the app.'
          ]
          setModalBody(errModalBody)

    return (
      <>
        <GetRestUrl />
        <LoadScripts />
        <LoadLocalStorage passMnemonic={this.passMnemonic} />
        <NavMenu menuHandler={this.onMenuClick} appData={appData} />

          // Update the startup state.
          setAsyncInitFinished(true)
          setAsyncInitSucceeded(false)
        }
      }
    }
    asyncEffect()
  })

  return (
    <>
      <LoadScripts />

  // This function retrieves the mutable data for an SSP token controlled by
  // the wallet. It looks for a Group minting baton held by the wallet. If
  // found, and if the token contains SSP in the ticker, then the mutable
  // data for that token is retrieved and saved to the state.
  async getMutableData (wallet, updateCache = false) {
    try {
      const groupMintBaton = wallet.utxos.utxoStore.slpUtxos.group.mintBatons[0]
      console.log('groupMintBaton: ', groupMintBaton)

      if (groupMintBaton && groupMintBaton.tokenId) {
        console.log('getMutableData updateCache: ', updateCache)

        // Get the mutable data
        const tokenData = await wallet.getTokenData2(groupMintBaton.tokenId, updateCache)
        console.log('tokenData: ', tokenData)

        if (tokenData.mutableData) {
          // Add the token ID to the mutable data.
          tokenData.mutableData.tokenId = tokenData.tokenStats.tokenId
          console.log('mutableData with tokenId: ', tokenData.mutableData)

          // console.log('token data found.')
          await this.setState({
            mutableData: JSON.stringify(tokenData.mutableData, null, 2)
          })
        } else {
          // this.setState({
          //   mutableData: `Mutable data for token named ${tokenData.tokenStats.name} (Token ID ${groupMintBaton.tokenId}) could not be retrieved.`
          // })

          console.log(`Mutable data for token named ${tokenData.tokenStats.name} (Token ID ${groupMintBaton.tokenId}) could not be retrieved.`)
        }
      }

      console.log('App.js getMutableData(): ', this.state.mutableData)
    } catch (err) {
      console.error('Error in getMutableData(): ', err)
    }
  }

  // Add a new line to the waiting modal.
  addToModal (inStr) {
    const modalBody = this.state.modalBody

      {
        showStartModal
          ? (<UninitializedView appData={appData} />)
          : (<InitializedView menuState={menuState} appData={appData} />)
      }

      <SelectServerButton menuHandler={onMenuClick} appData={appData} />
      <Footer appData={appData} />
    </>
  )
}

// This function is passed to child components in order to update the wallet
// state. This function is important to make this wallet a PWA.
function updateBchWalletState (inObj = {}) {
  try {
    const { walletObj, appData } = inObj

    // Debuging
    // console.log('updateBchWalletState() walletObj: ', walletObj)
    // console.log('updateBchWalletState() appData: ', appData)

    appData.setBchWalletState(oldState => {
      const newBchWalletState = Object.assign({}, oldState, walletObj)
      // console.log('newBchWalletState: ', newBchWalletState)

      return newBchWalletState
    })

    // console.log(`New wallet state: ${JSON.stringify(bchWalletState, null, 2)}`)
  } catch (err) {
    console.error('Error in App.js updateBchWalletState()')
    throw err
  }
}

// Add a new line to the waiting modal.
function addToModal (inStr, appData) {
  // console.log('addToModal() inStr: ', inStr)

  appData.setModalBody(prevBody => {
    // console.log('prevBody: ', prevBody)
    prevBody.push(inStr)
    return prevBody
  })
}

// This handler is passed into the child menu component. When an item in the
// nav menu is clicked, this handler will update the state. The state is
// used by the AppBody component to determine which View component to display.
function onMenuClick (menuState, appData) {
  // console.log('onMenuClick() menuState: ', menuState)

  appData.setMenuState(menuState)
}

// This is rendered *before* the BCH wallet is initialized.
function UninitializedView (props = {}) {
  // console.log('UninitializedView props: ', props)

  const heading = 'Connecting to BCH blockchain...'

  return (
    <>
      <WaitingModal
        heading={heading}
        body={props.appData.modalBody}
        hideSpinner={props.appData.hideSpinner}
        denyClose={props.appData.denyClose}
      />
      {
        props.asyncInitFinished
          ? <AppBody menuState={100} wallet={props.appData.wallet} appData={props.appData} />
          : null
      }
    </>
  )
}

// This is rendered *after* the BCH wallet is initialized.
function InitializedView (props) {
  return (
    <>
      <br />
      <AppBody menuState={props.menuState} appData={props.appData} />
    </>
  )
}

export default App

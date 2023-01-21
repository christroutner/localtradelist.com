/*
  This is a *library* and not a *component*. This library holds functions
  for handling the Confirm and Waiting modals for the map-of-stores.js component.

  This library is initialized by the index.js top-level component, and the
  instance of it is passed to the child components through props.
*/

// Global npm libraries
import TradelistLib from '@chris.troutner/tradelist-lib'

class PopupLib {
  constructor (initObj = {}) {
    // Dependency Injection
    this.updateConfirmModal = initObj.updateConfirmModal
    if (!this.updateConfirmModal) {
      throw new Error('updateConfirmModal required when instantiating popup-lib.js')
    }
    this.updateWaitingModal = initObj.updateWaitingModal
    if (!this.updateWaitingModal) {
      throw new Error('updateWaitingModal required when instatiating popup-lib.js')
    }
    this.wallet = initObj.wallet
    if (!this.wallet) {
      throw new Error('wallet instance of minimal-slp-wallet requires when instantiating popup-lib.js')
    }

    // These values are passed on refresh, when the user clicks a button in a popup
    // bound to a pin. It contains the Token ID for the token that the pin
    // represents.
    this.confirmTokenId = null
    this.confirmType = null

    // Bind the 'this' object to subfunctions.
    this.handleContinueFlag = this.handleContinueFlag.bind(this)
    this.handleCancelFlag = this.handleCancelFlag.bind(this)
    this.flagStore = this.flagStore.bind(this)
  }

  // This function is called when the 'Continue' button is clicked on the
  // Confirmation Modal.
  async handleContinueFlag (event) {
    // console.log('handleContinueFlag() called')
    console.log(`handleContinueFlag() called. Token ID: ${this.confirmTokenId}`)
    console.log(`Confirmation type: ${this.confirmType}`)

    // Hide the Confirm modal.
    const modalObj = {
      showConfirmModal: false
    }
    await this.updateConfirmModal(modalObj)

    // Determine the type of flag this is: nsfw, garbage, or other.
    if (this.confirmType.includes('nsfw')) {
      await this.flagStore(this.confirmTokenId, 103)
    } else if (this.confirmType.includes('garbage')) {
      await this.flagStore(this.confirmTokenId, 104)
    } else {
      throw new Error('Confirmation type could not be determined. confirmType: ', this.confirmType)
    }
  }

  // This function is called when the 'Cancel' button is clicked on the
  // Confirmation Modal.
  handleCancelFlag () {
    console.log('handleCancelFlag() called')

    const modalObj = {
      showConfirmModal: false
    }

    this.updateConfirmModal(modalObj)
  }

  // This is an onclick event handler for the button inside the pin dialog.
  // When clicked, it will call this function and pass the Token ID.
  // This function is used for all Claims. They type of Claim is passed in as
  // a variable.
  //
  // Types:
  // 100 = test, ignored
  // 101 = simple comment, unstructured JSON
  // 102 = review or complex comment with structured JSON
  // 103 = NSFW flag
  // 104 = junk flag, signals that the token is junk and should be ignored or not included on the map
  // 105 = admin. Signed by a specific key. Used to remove tokens from the database and map.
  async flagStore (tokenId, flagType = 100) {
    try {
      console.log('Entering flagStore()')
      console.log('flagStore() tokenId: ', tokenId)
      console.log('flagType: ', flagType)

      // Start the waiting modal
      const modalBody = ['Publishing data to IPFS...']
      const modalHeader = 'Flagging Store As NSFW'
      let modalObj = {
        showModal: true,
        modalHeader,
        modalBody,
        hideSpinner: false,
        denyClose: true
      }
      await this.updateWaitingModal(modalObj)

      const tradelistLib = new TradelistLib({ wallet: this.wallet })

      const data = {
        about: tokenId
      }

      // Instantiate the support libraries.
      await tradelistLib.util.instantiateWrite()
      await tradelistLib.util.instantiatePin()

      // Generate flag data and pin it to IPFS.
      const cid = await tradelistLib.util.pinJson({ data })
      // const cid = 'bafybeicy2ynkojfji4nbwslcpaf6yimpw3f7z6ohdefbeg3tyygnoqtoru'
      console.log('IPFS CID: ', cid)

      // Update modal
      modalBody.push('...published to IPFS pinning cluster:')
      modalBody.push(<a href={`https://p2wdb-gateway-678.fullstack.cash/ipfs/${cid}/data.json`} target='_blank' rel='noreferrer'>{cid}</a>)
      modalBody.push('Writing IPFS CID to BCH blockchain...')
      modalObj = {
        showModal: true,
        modalHeader,
        modalBody,
        hideSpinner: false,
        denyClose: true
      }
      await this.updateWaitingModal(modalObj)

      // Generate the OP_RETURN TX for a claim
      const opReturnObj = {
        cid,
        storeTokenId: tokenId,
        type: flagType
      }
      const hex = await tradelistLib.util.writeCidToBlockchain(opReturnObj)

      // Broadcast the transaction
      const txid = await this.wallet.broadcast(hex)

      modalBody.push('Claim written to blockchain. TXID:')
      modalBody.push(<a href={`https://blockchair.com/bitcoin-cash/transaction/${txid}`} target='_blank' rel='noreferrer'>{txid}</a>)
      modalBody.push(' ')

      // Signal success
      modalBody.push('Flag successfully published to blockchain!')
      modalObj = {
        showModal: true,
        modalHeader,
        modalBody,
        hideSpinner: true,
        denyClose: false
      }
      await this.updateWaitingModal(modalObj)
    } catch (err) {
      // This is a top-level function. Errors must be handled and not thrown.

      // Display the error in the modal
      const modalObj = {
        showModal: true,
        modalHeader: 'Error Flagging Store',
        modalBody: [err.message],
        hideSpinner: true,
        denyClose: false
      }
      await this.updateWaitingModal(modalObj)

      console.log('Error in flagStore(): ', err)
    }
  }
}

export default PopupLib

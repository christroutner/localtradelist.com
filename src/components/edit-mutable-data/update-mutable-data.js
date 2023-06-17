/*
  This library exports a function that can be used by other components to update
  the mutable data for the store token.
*/

// Global npm libraries
import { SlpMutableData } from 'slp-mutable-data'

const MDA_HD_INDEX = 1

async function updateMutableData (inObj = {}) {
  const { mutableData, wallet } = inObj

  try {
    let newMutableData = null
    try {
      newMutableData = JSON.parse(mutableData)
    } catch (err) {
      throw new Error('JSON parsing error: the mutable data could not be parsed from text to an object.')
    }

    // Instantiate the slp-mutable-data library
    const slpMutableData = new SlpMutableData({ wallet })

    // Update the mutable data for the token.
    let cidMutable = await slpMutableData.data.createTokenData(newMutableData)
    cidMutable = `ipfs://${cidMutable}`
    console.log(`new mutable data CID: ${cidMutable}`)

    // Get a key pair from the wallet library.
    const keyPair = await wallet.getKeyPair(MDA_HD_INDEX)
    console.log('keyPair: ', keyPair)

    // Instantiate a wallet based on the Mutable Data Address (MDA) private key
    let BchWallet = null
    if (typeof window !== 'undefined' && window.SlpWallet) {
      BchWallet = window.SlpWallet
    } else {
      throw new Error('Could not find wallet library.')
    }

    // Initialize the MDA wallet.
    const mdaWallet = new BchWallet(keyPair.wif, { interface: 'consumer-api' })
    await mdaWallet.initialize()

    // Generate an OP_RETURN transaction from the MDA.
    const mdaMutableData = new SlpMutableData({ wallet: mdaWallet })
    const hex = await mdaMutableData.data.writeCIDToOpReturn(cidMutable)

    // Broadcast the transaction.
    const txid = await mdaWallet.broadcast({hex})
    console.log('MDA update txid: ', txid)

    // Wait for the transaction to propegate.
    await mdaWallet.bchjs.Util.sleep(2000)

    return txid
  } catch (err) {
    console.error('Error in handleUpdateMutableData()')
    throw err
  }
}

export default updateMutableData

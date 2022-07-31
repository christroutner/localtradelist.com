/*
  This component controlls the Wallet View.
*/

// Global npm libraries
import React from 'react'

// Local Libraries
import WebWalletWarning from './warning'
import WalletSummary from './wallet-summary'
import WalletClear from './clear-wallet'
import WalletImport from './import-wallet'

class BchWallet extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      appData: props.appData,
      bchWallet: props.appData.bchWallet,
      bchWalletState: props.appData.bchWalletState,
      delMnemonic: props.appData.delMnemonic,
      setMnemonic: props.appData.setMnemonic
    }
  }

  render () {
    return (
      <>
        <WebWalletWarning />
        <br />
        <WalletSummary bchWallet={this.state.bchWallet} bchWalletState={this.state.bchWalletState} appData={this.state.appData} />
        <br />
        <WalletClear delMnemonic={this.state.delMnemonic} />
        <br />
        <WalletImport bchWallet={this.state.bchWallet} setMnemonic={this.state.setMnemonic} />
      </>
    )
  }

  async componentDidMount () {
    try {
      await this.state.bchWallet.walletInfoPromise

      const bchBalance = await this.state.bchWallet.getBalance()
      console.log('bchBalance: ', bchBalance)

      this.setState({
        bchBalance
      })
    } catch (err) {
      console.error('Error in wallets.js component when trying to load BCH wallet balances: ', err)
    }
  }
}

export default BchWallet

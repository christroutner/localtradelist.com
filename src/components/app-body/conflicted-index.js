/*
  This Body component is a container for all the different Views of the app.
  Views are equivalent to 'pages' in a multi-page app. Views are hidden or
  displayed to simulate the use of pages in an SPA.
  The Body app contains all the Views and chooses which to show, based on
  the state of the Menu component.
*/

// Global npm libraries
import React from 'react'

// Local libraries
import BchWallet from '../bch-wallet'
import BchSend from '../bch-send'
import SlpTokens from '../slp-tokens'
import ServerSelectView from '../servers/select-server-view'
import Sweep from '../sweep'
import Sign from '../sign'
<<<<<<< HEAD
import StoreMap from '../store-map'
import CreateToken from '../create-token'
import EditMutableData from '../edit-mutable-data'
import About from '../about'
=======

function AppBody (props) {
  // Dependency injection through props
  const appData = props.appData
  const menuState = props.menuState
  // console.log('AppBody() menuState: ', menuState)
>>>>>>> upstream/master

  function chooseView (menuState) {
    // console.log(`chooseView() menuState: ${menuState}`)

    switch (menuState) {
      case 0:
<<<<<<< HEAD
        return (<StoreMap appData={this.state.appData} />)
      case 1:
        return (<CreateToken appData={this.state.appData} />)
      case 2:
        return (<BchSend appData={this.state.appData} />)
      case 3:
        return (<SlpTokens appData={this.state.appData} />)
      case 4:
        return (
          <BchWallet
            appData={this.state.appData}
          />
        )
      case 5:
        return (<Sweep appData={this.state.appData} />)
      case 6:
        return (<Sign appData={this.state.appData} />)
      case 7:
        return (<EditMutableData appData={this.state.appData} />)
      case 8:
        return (<About appData={this.state.appData} />)
=======
        return (<BchSend appData={appData} />)
      case 1:
        return (<SlpTokens appData={appData} />)
      case 2:
        return (<BchWallet appData={appData} />)
      case 3:
        return (<Sweep appData={appData} />)
      case 4:
        return (<Sign appData={appData} />)
>>>>>>> upstream/master

        // Special Views
      case 100:
        return (<ServerSelectView appData={appData} />)
      default:
<<<<<<< HEAD
        return (<StoreMap appData={this.state.appData} />)
=======
        return (<BchSend appData={appData} />)
>>>>>>> upstream/master
    }
  }

  return (
    <>
      {chooseView(menuState)}
    </>
  )
}

export default AppBody

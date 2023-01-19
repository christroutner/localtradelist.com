/*
  This is a *library* and not a *component*. This library holds functions
  for handling the Confirm and Waiting modals for the map-of-stores.js component.

  This library is initialized by the index.js top-level component, and the
  instance of it is passed to the child components through props.
*/

class PopupLib {
  constructor(initObj = {}) {
    // Dependency Injection
    this.updateConfirmModal = initObj.updateConfirmModal
    if(!this.updateConfirmModal) {
      throw new Error('updateConfirmModal required when instantiating popup-lib.js')
    }
    // this.updateWaitingModal = initObj.updateWaitingModal
    // if(!this.updateWaitingModal) {
    //   throw new Error('updateWaitingModal required when instatiating popup-lib.js')
    // }

    // Bind the 'this' object to subfunctions.
    // this.updateModal = this.updateModal.bind(this)
    // this.updateConfirmModal = this.updateConfirmModal.bind(this)
    this.handleContinueFlag = this.handleContinueFlag.bind(this)
    this.handleCancelFlag = this.handleCancelFlag.bind(this)
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

    const modalObj = {
      showConfirmModal: false
    }

    this.updateConfirmModal(modalObj)
  }
}

export default PopupLib

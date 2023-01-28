/*
  This library is used to interact with the ssp-api REST API.
*/

// Global npm libraries
const axios = require('axios')

const SERVER = 'http://localhost:5020'
// const SERVER = process.env.SSP_SERVER
// const SERVER = 'http://5.78.64.121:5020'

class SspApi {
  constructor () {
    // Encapsulate dependencies.
    this.axios = axios
  }

  // Get all the stores in the database.
  // Note: This endpoint will be removed in the future, as it won't scale.
  async getAllStores () {
    try {
      const endpoint = '/store/all'
      const url = `${SERVER}${endpoint}`
      console.log('Server URL: ', url)

      const result = await this.axios.get(url)

      return result.data
    } catch (err) {
      console.error('Error in getAllStores()')
      throw err
    }
  }

  async updateStore(tokenId) {
    try {
      const endpoint = `/store/update/${tokenId}`
      const url = `${SERVER}${endpoint}`
      console.log('Server URL: ', url)

      const result = await this.axios.get(url)

      return result.data
    } catch(err) {
      console.error('Error in updateStore()')
      throw err
    }
  }
}

export default SspApi

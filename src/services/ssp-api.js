/*
  This library is used to interact with the ssp-api REST API.
*/

// Global npm libraries
const axios = require('axios')

class SspApi {
  constructor () {
    // Encapsulate dependencies.
    this.axios = axios
  }

  // Get all the stores in the database.
  // Note: This endpoint will be removed in the future, as it won't scale.
  async getAllStores () {
    try {
      const server = 'http://localhost:5020'
      const endpoint = '/store/all'

      const result = await this.axios.get(`${server}${endpoint}`)

      return result.data
    } catch (err) {
      console.error('Error in getAllStores()')
      throw err
    }
  }
}

export default SspApi
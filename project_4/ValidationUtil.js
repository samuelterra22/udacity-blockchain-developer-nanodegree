// Configure LevelDB to access data
const level = require('level')
const chainDB = './chaindata'
const db = level(chainDB)
const defaultWindow = 300

function currentTimeStamp () {
  return new Date().getTime()
}

function generateMessage (address) {
  return `${address}:${currentTimeStamp()}:starRegistry`
}

function isExpired (requestTimeStamp) {
  // time left < five minutes
  return requestTimeStamp < Date.now() - (5 * 60 * 1000)
}

const validateUtil = {

  saveRequestValidation: (address) => {
    const message = generateMessage(address)

    const data = {
      address: address,
      message: message,
      requestTimeStamp: currentTimeStamp(),
      validationWindow: defaultWindow
    }

    db.put(data.address, JSON.stringify(data))

    return data
  },

  getPendingAddress: (address) => {
    return new Promise((resolve, reject) => {
      db.get(address, (error, value) => {
        if (value === undefined) {
          return reject(new Error('Not found'))
        } else if (error) {
          return reject(error)
        }

        value = JSON.parse(value)

        if (isExpired(value.requestTimeStamp)) {
          resolve(this.saveRequestValidation(address))
        } else {
          const data = {
            address: address,
            message: value.message,
            requestTimeStamp: value.requestTimeStamp,
            validationWindow: Math.floor((value.requestTimeStamp - Date.now() - (5 * 60 * 1000)) / 1000)
          }

          resolve(data)
        }
      })
    })
  }

}

module.exports = validateUtil
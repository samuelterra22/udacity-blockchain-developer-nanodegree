/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256')

// Configure LevelDB to persist blockchain data
const level = require('level')
const chainDB = './databases/chaindata'
const db = level(chainDB)

// import util libs
const util = require('./util')

// import block class
const Block = require('../models/Block')

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain {
  constructor () {
    // CRITERION: Genesis block persist as the first block in the blockchain using LevelDB.
    this.getBlockHeight().then(height => {
      // console.log(height)  // DEBUG
      if (height === -1)
        this.addBlock(new Block('Genesis block')).then(() => console.log('Genesis block stored!'))
    })
  }

  // Add new block
  // CRITERION: addBlock(newBlock) function includes a method to store newBlock with LevelDB.
  async addBlock (newBlock) {
    // previous block height
    let previousBlockHeight = parseInt(await this.getBlockHeight())
    // Block height
    newBlock.height = previousBlockHeight + 1
    // UTC timestamp
    newBlock.time = new Date()
      .getTime()
      .toString()
      .slice(0, -3)
    // previous block hash
    if (newBlock.height > 0) {
      let previousBlock = await this.getBlock(previousBlockHeight)
      newBlock.previousBlockHash = previousBlock.hash
    }
    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString()

    // Adding block object to levelDB
    await this.addLevelDBData(newBlock.height, JSON.stringify(newBlock))

    // return the new block
    return newBlock
  }

  // Get block height
  // CRITERION: Modify getBlockHeight() function to retrieve current block height within the LevelDB chain.
  async getBlockHeight () {
    return await this.getBlockHeightLevel()
  }

  // get block
  // CRITERION: Modify getBlock() function to retrieve a block by it's block heigh within the LevelDB chain.
  async getBlock (blockHeight) {
    let block = JSON.parse(await this.getLevelDBData(blockHeight))

    // verify if ins't the Genesis block
    if (parseInt(block.height) > 0) {
      block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString()
    }
    // return object
    return block
  }

  // get block by address
  // CRITERION: Get endpoint with URL parameter for wallet address
  async getBlocksByAddress (address) {
    const blocks = []
    let block = {}

    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on('data', data => {
          if (data.key !== 0) {
            block = JSON.parse(data.value)

            if (block.body.address === address) {
              block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString()
              blocks.push(block)
            }
          }
        })
        .on('error', error => {
          return reject(error)
        })
        .on('close', () => {
          return resolve(blocks)
        })
    })
  }

  // get block by address
  // CRITERION: Get endpoint with URL parameter for star block hash JSON Response
  async getBlockByHash (hash) {
    let block = {}

    return new Promise((resolve, reject) => {
      db.createReadStream()
        .on('data', data => {
          block = JSON.parse(data.value)

          if (util.isStringChainEquals(block.hash, hash)) {
            if (data.key !== 0) {
              block.body.star.storyDecoded = Buffer.from(block.body.star.story, 'hex').toString()
              return resolve(block)
            } else {
              return resolve(block)
            }
          }
        })
        .on('error', error => {
          return reject(error)
        })
        .on('close', () => {
          return reject('Block not found')
        })
    })
  }

  // validate block
  // CRITERION: Modify the validateBlock() function to validate a block stored within levelDB
  async validateBlock (blockHeight) {
    // get block object
    let block = await this.getBlock(blockHeight)
    // get block hash
    let blockHash = block.hash
    // remove block hash to test block integrity
    block.hash = ''

    // generate block hash
    let validBlockHash = SHA256(JSON.stringify(block)).toString()

    // Compare
    if (blockHash === validBlockHash) {
      // return true if block is valid
      return true
    } else {
      console.log('Block #' + blockHeight + ' invalid hash:\n' + blockHash + '<>' + validBlockHash)
      return false
    }
  }

  // Validate blockchain
  // CRITERION: Modify the validateChain() function to validate blockchain stored within levelDB
  async validateChain () {
    let errorLog = []
    let blockChainHeight = await this.getBlockHeight()

    for (let i = 0; i < blockChainHeight; i++) {
      // validate a single block
      if (!this.validateBlock(i)) errorLog.push(i)

      // compare blocks hash link
      let blockHash = this.getBlock(i).hash
      let previousHash = this.getBlock(i + 1).previousBlockHash
      if (blockHash !== previousHash) {
        errorLog.push(i)
      }
    }

    if (errorLog.length > 0) {
      console.log('Block errors = ' + errorLog.length)
      console.log('Blocks: ' + errorLog)
    } else {
      console.log('No errors detected')
    }
  }

  /* ===== level db methods =====================================
  |  Methods responsible for persisting data     		          |
  |  Learn more: level: https://github.com/Level/level      	|
  |  ==========================================================*/

  getBlockHeightLevel () {
    return new Promise((resolve, reject) => {
      let height = -1
      db.createReadStream()
        .on('data', () => {
          height++
        })
        .on('error', err => {
          console.log('Unable to read data stream!', err)
          reject(err)
        })
        .on('close', () => {
          // console.log('Blockchain height is #' + height) // DEBUG
          resolve(height)
        })
    })
  }

  // Add data to levelDB with key/value pair
  addLevelDBData (key, value) {
    return new Promise((resolve, reject) => {
      db.put(key, value, err => {
        if (err) {
          console.log('Block ' + key + ' submission failed', err)
          reject(err)
        } else {
          console.log('Block #' + key + ' stored')
          resolve(value)
        }
      })
    })
  }

  // Get data from levelDB with key
  getLevelDBData (key) {
    return new Promise((resolve, reject) => {
      db.get(key, (err, value) => {
        if (err) {
          console.log('Not found!', err)
          reject(err)
        } else {
          // console.log('Value = ' + value)  // DEBUG
          resolve(value)
        }
      })
    })
  }
}

module.exports = Blockchain

// import dependencies
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const path = require('path')

// import validator
const {check, validationResult} = require('express-validator/check')

// lib to validate
const bitcoin = require('bitcoinjs-lib')
const bitcoinMessage = require('bitcoinjs-message')

const express = require('express')
const app = express()

app.listen(8000, () => console.log('App listening on port 8000!'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000
// Return the doc
app.get('/', (req, res) => {

  let address = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ'
  let signature = 'IJtpSFiOJrw/xYeucFxsHvIRFJ85YSGP8S1AEZxM4/obS3xr9iz7H0ffD7aM2vugrRaCi/zxaPtkflNzt5ykbc0='
  let message = '142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532330740:starRegistry'

  console.log(bitcoinMessage.verify(message, address, signature))

  res.sendFile(path.join(__dirname + '/README.md'))
})
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/requestValidation
// Validate User Request
app.post('/requestValidation',
  [
    // address must be required
    check('address').not().isEmpty(),
  ], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    res.json({address: req.body.address})
  })

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/message-signature/validate
// Allow User Message Signature
app.post('/message-signature/validate',
  [
    // address must be required
    check('address').not().isEmpty(),
    // signature must be required
    check('signature').not().isEmpty(),
  ], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    res.json({
      address: req.body.address,
      signature: req.body.signature
    })
  })

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/address:address
// Blockchain Wallet Address
app.get('/stars/address:address', async (req, res) => {
  blockchain.getBlocksByAddress(req.params.address.slice(1)).then(success => {
    res.send(success)
  }).catch(() => {
    res.json({error: 'Block not found'})
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/hash:hash
// Star Block Hash
app.get('/stars/hash:hash', async (req, res) => {
  res.json(req.params.hash.slice(1))
})

//----------------------------------------------------------------------------------------------------------------------
// DONE
// URL get http://localhost:8000/block/{BLOCK_HEIGHT}
// Star Block Height
app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight).then(success => {
    // The block contents must respond to GET request with block contents in JSON format
    res.json(success)
  }).catch(error => {
    res.json(error)
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/block
// Post block in blockchain - Star Registration Endpoint
// Todo: validate start object
app.post('/block',
  [
    // address must be required
    check('address').not().isEmpty(),
    // star must be required
    check('star').not().isEmpty(),
  ], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    // organize the block to create
    const block = {
      address: req.body.address,
      star: req.body.star
    }

    blockchain.addBlock(new Block(block)).then(success => {
      // Note: addBlock method was modified to return the block created
      res.json(success)
    }).catch(() => {
      // return a message in json format with error
      res.json({error: 'There was an error generating a new block'})
    })
  })
//----------------------------------------------------------------------------------------------------------------------


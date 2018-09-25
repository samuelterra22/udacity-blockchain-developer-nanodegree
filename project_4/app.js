// import dependencies
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const path = require('path')

// import validator
const {check, validationResult} = require('express-validator/check')

const validateUtil = require('./ValidationUtil')
const util = require('./util')

const express = require('express')
const app = express()

app.listen(8000, () => console.log('App listening on port 8000!'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000
// Return the doc
app.get('/', (req, res) => {
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
  ], async (req, res) => {

    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    let data = {}

    try {
      data = await validateUtil.getPendingAddress(req.body.address)
    } catch (err) {
      console.log(err)
      data = await validateUtil.saveRequestStarValidation(req.body.address)
    }

    res.json(data)

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
  ], async (req, res) => {

    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    try {
      const response = await validateUtil.validateMessageSignature(req.body.address, req.body.signature)

      if (response.registerStar) {
        res.json(response)
      } else {
        res.status(401).json(response)
      }
    } catch (error) {
      res.json({error: error.message})
    }

  })

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/address:address
// Blockchain Wallet Address
app.get('/stars/address:address', async (req, res) => {
  blockchain.getBlocksByAddress(req.params.address.slice(1))
    .then(success => {
      res.send(success)
    }).catch(() => {
    res.json({error: 'Block not found'})
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/hash:hash
// Star Block Hash
app.get('/stars/hash:hash', async (req, res) => {
  blockchain.getBlockByHash(req.params.hash.slice(1))
    .then(success => {
      res.send(success)
    }).catch(() => {
    res.json({error: 'Block not found'})
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL get http://localhost:8000/block/{BLOCK_HEIGHT}
// Star Block Height
app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight)
    .then(success => {
      // The block contents must respond to GET request with block contents in JSON format
      res.json(success)
    }).catch(error => {
    res.json(error)
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/block
// Post block in blockchain - Star Registration Endpoint
app.post('/block',
  [
    // address must be required
    check('address').not().isEmpty(),
    // star must be required
    check('star').custom(star => {
      // CRITERION: Star object and properties are stored within the body of the block.
      // CRITERION: Star properties include the coordinates with encoded story.
      // CRITERION: Star story supports ASCII text, limited to 250 words (500 bytes), and hex encoded.
      if (util.empty(star)) {
        return Promise.reject('Star object is required')
      }
      if (util.empty(star.ra)) {
        return Promise.reject('Ra is required')
      }
      if (util.empty(star.dec)) {
        return Promise.reject('Dec is required')
      }
      if (util.empty(star.story)) {
        return Promise.reject('Story is required')
      }
      if (star.story.length > 250) {
        return Promise.reject('Story is limited to 250 words')
      }
      if (!util.isASCII(star.story)) {
        return Promise.reject('Story contains non-ASCII symbols')
      }
      if (new Buffer(star.story).length > 500) {
        return Promise.reject('Story too is long. Maximum size is 500 bytes')
      }
      return true
    })
  ], (req, res) => {

    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    // CRITERION: Star story must be encoded to hex before adding the block.
    let star = req.body.star
    star.story = new Buffer(req.body.star.story).toString('hex')

    // organize the block to create
    const block = {
      address: req.body.address,
      star: star
    }

    blockchain.addBlock(new Block(block))
      .then(success => {
        // Note: addBlock method was modified to return the block created
        res.status(201).send(success)
      }).catch(() => {
      // return a message in json format with error
      res.json({error: 'There was an error generating a new block'})
    })
  })
//----------------------------------------------------------------------------------------------------------------------
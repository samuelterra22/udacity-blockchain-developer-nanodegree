// import dependencies
const Blockchain = require('./helpers/Blockchain')
const blockchain = new Blockchain()
const Block = require('./models/Block')

// import validator
const { check, validationResult } = require('express-validator/check')

// import util libs
const validateUtil = require('./helpers/ValidationUtil')
const util = require('./helpers/util')

const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.listen(8000, () => console.log('Server started and listening on port 8000!'))

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/requestValidation
// Validate User Request
app.post(
  '/requestValidation',
  [
    // address must be required
    check('address')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    let data = {}

    try {
      data = await validateUtil.getPendingAddress(req.body.address)
    } catch (err) {
      console.log(err)
      data = await validateUtil.saveRequestStarValidation(req.body.address)
    }

    res.json(data)
  }
)

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/message-signature/validate
// Allow User Message Signature
app.post(
  '/message-signature/validate',
  [
    // address must be required
    check('address')
      .not()
      .isEmpty(),
    // signature must be required
    check('signature')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      const response = await validateUtil.validateMessageSignature(
        req.body.address,
        req.body.signature
      )

      if (response.registerStar) {
        res.json(response)
      } else {
        res.status(401).json(response)
      }
    } catch (error) {
      res.status(404).json({
        status: 404,
        message: error.message
      })
    }
  }
)

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/address:address
// Blockchain Wallet Address
app.get('/stars/address:address', async (req, res) => {
  blockchain
    .getBlocksByAddress(req.params.address.slice(1))
    .then(success => {
      res.send(success)
    })
    .catch(() => {
      res.status(404).json({
        status: 404,
        message: 'Block not found'
      })
    })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/stars/hash:hash
// Star Block Hash
app.get('/stars/hash:hash', async (req, res) => {
  blockchain
    .getBlockByHash(req.params.hash.slice(1))
    .then(success => {
      res.send(success)
    })
    .catch(() => {
      res.status(404).json({
        status: 404,
        message: 'Block not found'
      })
    })
})

//----------------------------------------------------------------------------------------------------------------------
// URL get http://localhost:8000/block/{BLOCK_HEIGHT}
// Star Block Height
app.get('/block/:blockHeight', (req, res) => {
  blockchain
    .getBlock(req.params.blockHeight)
    .then(success => {
      // The block contents must respond to GET request with block contents in JSON format
      res.json(success)
    })
    .catch(() => {
      res.status(404).json({
        status: 404,
        message: 'Block not found'
      })
    })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/block
// Post block in blockchain - Star Registration Endpoint
app.post(
  '/block',
  [
    // address must be required
    check('address')
      .not()
      .isEmpty(),
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
      if (star.story.length > 500) {
        return Promise.reject('Story is limited to 500 words. Maximum size is 500 bytes')
      }
      if (!util.isASCII(star.story)) {
        return Promise.reject('Story contains non-ASCII symbols')
      }
      return true
    })
  ],
  async (req, res) => {
    // check data entries
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }

    try {
      // Deny registration of a block if he/she did not send a valid signature
      const isValid = await validateUtil.isValidSignature(req.body.address)

      if (!isValid) {
        throw new Error('Signature is not valid')
      }
    } catch (error) {
      res.status(401).json({
        status: 401,
        message: error.message
      })

      return
    }

    // CRITERION: Star story must be encoded to hex before adding the block.
    let star = req.body.star
    // Encode the star story to hex here before making the block.
    star.story = Buffer.from(req.body.star.story).toString('hex')

    // organize the block to create
    const block = {
      address: req.body.address,
      star: star
    }

    blockchain
      .addBlock(new Block(block))
      .then(success => {
        // Override the previous request to prevent the user from placing additional blocks.
        // He/she should return to request Validation and sign a new message in order to add another block.
        validateUtil.invalidateSignature(req.body.address)

        // Note: addBlock method was modified to return the block created
        res.status(201).send(success)
      })
      .catch(() => {
        // return a message in json format with error
        res.json({ error: 'There was an error generating a new block' })
      })
  }
)
//----------------------------------------------------------------------------------------------------------------------
// Send 404 erro, route not found
app.get('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Route not found. Check documentation.'
  })
})
//----------------------------------------------------------------------------------------------------------------------

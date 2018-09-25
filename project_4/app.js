// import dependencies
const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const path = require('path')

// import validator
const {check, validationResult} = require('express-validator/check')

const express = require('express')
const app = express()

app.listen(8000, () => console.log('App listening on port 8000!'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000 - (Return the doc)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/README.md'))
})
//----------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/requestValidation
// Requirement 3: Validate User Request
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
// Requirement 4: Allow User Message Signature
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
// URL get http://localhost:8000/block/{BLOCK_HEIGHT}
app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight).then(success => {
    // The block contents must respond to GET request with block contents in JSON format
    res.send(JSON.stringify(success))
  }).catch(error => {
    res.send(res.send(JSON.stringify(error)))
  })
})

//----------------------------------------------------------------------------------------------------------------------
// URL post http://localhost:8000/block
app.post('/block',
  [
    // body must be required
    check('body').not().isEmpty(),
  ], (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({errors: errors.array()})
    }

    blockchain.addBlock(new Block(req.body.body)).then(success => {
      // Note: addBlock method was modified to return the block created
      res.send(success)
    }).catch(() => {
      // return a message in json format with error
      res.send(JSON.stringify({error: 'There was an error generating a new block'}))
    })
  })
//----------------------------------------------------------------------------------------------------------------------


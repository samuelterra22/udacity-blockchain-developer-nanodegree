// https://nordicapis.com/13-node-js-frameworks-to-build-web-apis/

const express = require('express')
const app = express()

const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
const Block = require('./Block')
const util = require('./util')
const bodyParser = require('body-parser')

app.listen(3000, () => console.log('Example app listening on port 3000!'))
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/block/:blockHeight', (req, res) => {
  blockchain.getBlock(req.params.blockHeight).then(success => {
    res.send(JSON.stringify(success))
  }).catch(error => {
    res.send(res.send(JSON.stringify(error)))
  })
})

// CRITERION: POST Block endpoint using key/value pair within request body.
app.post('/block', (req, res) => {
  if (!util.empty(req.body.body)) {

    blockchain.addBlock(new Block(req.body.body)).then(success => {
      // CRITERION: The block contents must respond to POST request with block contents in JSON format
      // Note: addBlock method was modified to return the block created
      res.send(success)
    }).catch(() => {
      res.send(JSON.stringify({error: 'There was an error generating a new block'}))
    })

  } else {
    res.send(JSON.stringify({error: 'Parameter error'}))
  }

})

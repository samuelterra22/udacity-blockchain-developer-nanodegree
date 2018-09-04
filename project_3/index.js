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

app.post('/block', (req, res) => {
  if (!util.empty(req.body.body)) {

    blockchain.addBlock(new Block(req.body.body)).then(res => {
      const height = blockchain.getBlockHeight()
      const response = blockchain.getBlock(height)
      res.send(response)
    }).catch(err => {
      res.send(JSON.stringify({error: err}))
    })

  } else {
    res.send(JSON.stringify({error: 'Parameter error'}))
  }

})

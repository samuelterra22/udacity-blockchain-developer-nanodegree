// https://nordicapis.com/13-node-js-frameworks-to-build-web-apis/

const express = require('express')
const app = express()

const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()
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

app.get('/block/:blockHeight', function (req, res) {
  blockchain.getBlock(req.params.blockHeight).then(res => {
    res.send(res)
  }).catch(err => {
    res.send(err)
  })
})

app.post('/block', (req, res) => {
  if (!util.empty(req.body.body)) {
    console.log(req.body.body)
    res.send(JSON.stringify(req.body))
  } else {
    console.log('vazio')
  }

})

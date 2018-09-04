// https://nordicapis.com/13-node-js-frameworks-to-build-web-apis/

const express = require('express')
const app = express()

const Blockchain = require('./Blockchain')
const blockchain = new Blockchain()

app.listen(3000, () => console.log('Example app listening on port 3000!'))

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
  console.log(req.body.body)
  res.send(JSON.stringify({}))

})

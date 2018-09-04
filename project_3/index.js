// https://nordicapis.com/13-node-js-frameworks-to-build-web-apis/

const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))
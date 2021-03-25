const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

require('dotenv').config()

const app = express()

var corsOptions = {
  origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

// parse requests of content-type - application/json
app.use(express.json())

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}))

// database initialize
const db = require('./app/models')
db.sequelize.sync().then(_ => {
  require('./app/controllers/job.controller').fillMock()
})

// routes
require('./app/routes')(app)

// set port, listen for requests
const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
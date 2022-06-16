//Global Variables
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
require('dotenv').config()
let db, 
    connectionString = process.env.DB_STRING,
    dbName = 'icd_api'

//Connect to MongoDB Database
MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName)
        console.log(`connected to ${dbName}`)
    })

//Base API URL
app.get('/', (request, response)=> {
    db.collection('icd10_codes').find().toArray()
})

app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on PORT ${process.env.PORT || PORT}`)
})
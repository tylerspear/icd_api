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
    response.sendFile(__dirname + '/index.html')
})

app.get('/api/:name', (request, response) => {
    const conditionName = request.params.name.toLowerCase()
    console.log(conditionName)
    db.collection('icd10_codes').aggregate([ { $search: { "text": { "query": conditionName, "path": "desc_lower"} } } ]).toArray((err, res) => {
        if(err){
            console.error(err)
        } else {
            response.send(res)
        }
    })
})


app.listen(process.env.PORT || PORT, () => {
    console.log(`server is running on PORT ${process.env.PORT || PORT}`)
})
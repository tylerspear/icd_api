//Global Variables
const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 8000
const cors = require('cors')


app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

require('dotenv').config()
let db, 
    dbName = 'icd_api'

//Connect to MongoDB Database
MongoClient.connect(process.env.DB_STRING, { useUnifiedTopology: true })
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
    db.collection('icd10_codes').aggregate([ { $search: { "text": { "query": conditionName, "path": "desc_lower"} } }, { $limit: 30 } ]).toArray((err, res) => {
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
const express = require('express');
const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




app.get('/', (req, res) =>{
    res.send('Electrical Solution server is running');
})

app.listen(port, () =>{
    console.log(`Electrical Solution running on: ${port}`)
})
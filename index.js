const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.ES_DB}:${process.env.ES_DB_PASSWORD}@cluster0.tjxwcci.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        const serviceCollection = client.db('electricalSolution').collection('services');

        const reviewCollection = client.db('electricalSolution').collection('reviews');

        app.get('/', async (req, res) => {
            const query = {}
            const options = {
                sort: { date: -1 }
            };
            const cursor = serviceCollection.find(query, options);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/service/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = serviceCollection.findOne(query);
            const eachService = await cursor;
            res.send(eachService);
        });

        //Add Service
        app.post('/addservice', async (req, res) => {
            const service = req.body;
            service.date = new Date();
            const result = await serviceCollection.insertOne(service);
            res.send(result);
        });

        //Reviews
        app.get('/myreviews', async (req, res) => {
            let query = {}

            if (req.query.reveiwerEmail) {
                query = {
                    reveiwerEmail: req.query.reveiwerEmail
                }
            }

            const cursor = reviewCollection.find(query);
            const myReviews = await cursor.toArray();
            res.send(myReviews);
        });

        app.get('/servicereviews', async (req, res) => {
            let query = {}

            if (req.query.serviceId) {
                query = {
                    serviceId: req.query.serviceId
                }
            }

            const options = {
                sort: { date: -1 }
            };

            const cursor = reviewCollection.find(query, options);
            const serviceReviews = await cursor.toArray();
            res.send(serviceReviews);
        });

        //Create
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            review.date = new Date();
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        //delete
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        //Update
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const cursor = reviewCollection.findOne(query);
            const eachReview = await cursor;
            res.send(eachReview);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            console.log(req.body);
            const query = { _id: ObjectId(id) };
            const option = {upsert: true};
            const updatedDoc = {
                $set: {
                    review: update.review
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc, option);
            res.send(result);
        });
    }
    finally {

    }
}
run().catch(err => console.error(err));

// app.get('/', (req, res) =>{
//     res.send('Electrical Solution server is running');
// })

app.listen(port, () => {
    console.log(`Electrical Solution running on: ${port}`)
})
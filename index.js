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
            const cursor = serviceCollection.find(query);
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

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body.update;
            const query = { _id: ObjectId(id) };
            const updatedDoc ={
                $set: {
                    review: update
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc);
            res.send(result);
        });


        // app.get('/services', async(req, res) =>{
        // const page = parseInt(req.query.page);
        // const size = parseInt(req.query.size);
        //             console.log(page, size);
        // const query = {}
        // const cursor = serviceCollection.find(query);
        // const products = await cursor.skip(page*size).limit(size).toArray();
        //             const count = await productCollection.estimatedDocumentCount();
        // res.send({count, products});
        // });

        //         app.post('/productsByIds', async(req, res) =>{
        //             const ids = req.body;
        //             const objectIds = ids.map(id => ObjectId(id))
        //             const query = {_id: {$in: objectIds}};
        //             const cursor = productCollection.find(query);
        //             const products = await cursor.toArray();
        //             res.send(products);
        //         })

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
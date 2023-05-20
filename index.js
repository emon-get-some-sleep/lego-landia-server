const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlware

app.use(express.json());

app.use(cors());

const port = process.env.PORT || 5000;

const toys = require('./toys.json');


app.get('/', (req, res) => {
    res.send('Lego Landia is online');
})




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kteeg.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection


    const legoLibrary = client.db('legoSets').collection('legoCollection');




    app.get('/toys', async(req, res) => {
        const queryString = req.query.category;
        const query = {subCategory : queryString};
        const result = await legoLibrary.find(query).toArray();
        res.send(result);
        
    })
    app.get('/alltoys', async(req, res) => {
        
        
        const result = await legoLibrary.find().toArray();
        res.send(result);
        
    })

    // find by id to view details
    
    app.get('/toys/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = {_id : new ObjectId(id)};
      const result = await legoLibrary.findOne(query);
      res.send(result);
    })

    // add a new toy
    app.post('/newtoy', async(req, res) => {
      const newToy = req.body;
      const result = await legoLibrary.insertOne(newToy);
      res.send(result);
    })
    





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`lego landia server has been started on port ${port}`);
})
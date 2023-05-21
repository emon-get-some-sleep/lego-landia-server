const express = require('express');

const app = express();

const cors = require('cors');

require('dotenv').config();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middlware

app.use(express.json());

app.use(cors());

const port = process.env.PORT || 5000;




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
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    client.connect((err) => {
      if(err){
        console.error(err);
        return;
      }
    });
    // Send a ping to confirm a successful connection


    const legoLibrary = client.db('legoSets').collection('legoCollection');
    const blogs = client.db('legoSets').collection('blogs');
    const gallary = client.db('legoSets').collection('gallary');




    app.get('/toys', async(req, res) => {
        const queryString = req.query.category;
        const query = {subCategory : queryString};
        const result = await legoLibrary.find(query).toArray();
        res.send(result);
        
    })
    // api for my toys 
    app.get('/mytoys', async(req, res) => {
        const queryString = req.query.email;
        const query = {sellerEmail : queryString};
        const result = await legoLibrary.find(query).sort({price: -1}).toArray();
        res.send(result);
        
    })

    // api for gallary

    app.get('/gallary', async(req, res) => {
      const result = await gallary.find().toArray();
      res.send(result);
    })

    // api for all toys

    app.get('/alltoys', async(req, res) => {
        
        
        const result = await legoLibrary.find().limit(20).toArray();
        res.send(result);
        
    })

    // api for all blogs

    app.get('/blogs', async(req, res) => {
        
        
        const result = await blogs.find().toArray();
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
    
    // api for updating toys
    app.put('/update/:id', async(req, res) => {
      const id = req.params.id;
      console.log(id);
      const newInfo = req.body;
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          picture: newInfo.picture,
          toyName: newInfo.toyName,
          sellerName: newInfo.sellerName,
          sellerEmail: newInfo.sellerEmail,
          price: newInfo.price,
          rating: newInfo.rating,
          availableQuantity: newInfo.availableQuantity,
          description: newInfo.description,
          subCategory: newInfo.subCategory
        }
      }

      const result = await legoLibrary.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    // api to find toy by search

    app.get('/findtoys/:text', async(req, res) => {
      // const toyText = req.params.id;
      const queryString = req.params.text;
      const query = { toyName: { $regex: queryString, $options: "i" } }
      const result = await legoLibrary.find(query).toArray();
      res.send(result);
    });

    // api for deleting toys

    app.delete('/delete/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)};
      const result = await legoLibrary.deleteOne(query);

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
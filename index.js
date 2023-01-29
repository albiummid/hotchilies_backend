
const express = require('express')
const app = express()
const port = process.env.PORT || 5000;
const cors = require("cors");
require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.gpn2l.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const foodCollection = client.db(`${process.env.DB_NAME}`).collection("foods");
  const userCollection = client.db(`${process.env.DB_NAME}`).collection("users");
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  console.log("database Connected , error:", err);

  // add food
  app.post('/addFood', (req, res) => {
    const food = req.body;
    foodCollection.insertOne(food)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/addUser', (req, res) => {
    const user = req.body;
    userCollection.insertOne(user)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertMany(order)
      .then(result => {
        console.log(result);
        res.send(result.insertedCount > 0)
      })
  })
  app.delete('/deleteOrder/:id', (req, res) => {
    ordersCollection.deleteOne({ _id: ObjectId(`${req.params.id}`) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })

  })






  app.get('/foods/:type', (req, res) => {
    foodCollection.find({ type: req.params.type })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/foods', (req, res) => {
    foodCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/users', (req, res) => {
    userCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/userOrders', (req, res) => {
    console.log(req.query.email);
    ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })
  app.get('/food/:id', (req, res) => {
    foodCollection.find({ _id: ObjectId(`${req.params.id}`) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })






  // end of MongoDB
});

app.listen(port, () => {
  console.log("SERVER STARTED AT PORT:" + port)
})
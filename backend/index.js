const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
console.log("DB user name ", process.env.DB_USER);

// MongoDB Atlas Connection 
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?appName=Project-Site`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// Créer un MongoClient avec un objet MongoClientOptions pour définir la version Stable API
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

// Lancer le serveur
app.get('/', (req, res) => {
  res.send('Bonjour les developpeurs !')
})

// Lire le port du serveur
app.listen(port, () => {
  console.log(`Cet application est demarrée sur le port ${port}`)
})

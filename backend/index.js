const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');  // Ajout de cors
const { MongoClient, ServerApiVersion } = require('mongodb');

const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

// DB Connection
console.log("DB user name ", process.env.DB_USER);

// MongoDB Atlas Connection 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?appName=Project-Site`;

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
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // Connect to the database and collections after a successful connection
    const database = client.db("insertDB");
    const userCollections = database.collection("users");
    const classesCollections = database.collection("classes");
    const cartCollections = database.collection("cart");
    const paymantCollections = database.collection("paymants");
    const enrolledCollections = database.collection("enrolled");
    const appliedCollections = database.collection("applied");

    // Définition des routes après la connexion à la base de données

    // La requete post pour envoyer les donnée dans la base de donée
    app.post('/new-class', async (req, res) => {
      const newClass = req.body;
      const result = await classesCollections.insertOne(newClass);
      res.send(result);
    });

    //La requête pour récuperer les données
    app.get('/classes', async (req, res) => {
      const query = {status: "approved"};
      const result = await classesCollections.find(query).toArray();
      res.send(result);
  })
    // app.get('/classes', async (req, res) => {
    //   const newClass = req.body;
    //   const result = await classesCollections.insertOne(newClass);
    //   res.json(result);
    // });

    // Lancer le serveur après la connexion réussie à la base de données
    app.get('/', (req, res) => {
      res.send('Bonjour les développeurs !');
    });

    app.listen(port, () => {
      console.log(`Cette application est démarrée sur le port ${port}`);
    });

  } catch (err) {
    console.error(err);
  }
}

// Appel de la fonction run pour démarrer la connexion à la base de données
run();

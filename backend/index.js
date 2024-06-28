const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

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
    const paymentCollections = database.collection("payments");
    const enrolledCollections = database.collection("enrolled");
    const appliedCollections = database.collection("applied");

    // Définition des routes après la connexion à la base de données

    // La requete post pour envoyer les donnée dans la base de donée
    app.post('/new-class', async (req, res) => {
      const newClass = req.body;
      const result = await classesCollections.insertOne(newClass);
      res.send(result);
    });

    // La requête pour récuperer les données
    app.get('/classes', async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    // Get class by instructor email address
    app.get('/classes-by-email/:email', async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    // manage classes
    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollections.find().toArray();
      res.send(result);
    });

    // update classes
    app.put('/change-status', async (req, res) => {
      const id = req.body.id;
      const status = req.body.status;
      const reason = req.body.reason;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: status,
          reason: reason
        }
      };
      const result = await classesCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Get classes approved
    app.get('/approved-classes', async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    // Get the single class
    app.get('/classes/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classesCollections.findOne(query);
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ message: 'Class not found' });
      }
    });

    // update class details 'all data
    app.put('/update-class/:id', async (req, res) => {
      const id = req.params.id;
      const updateClass = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateClass.name,
          description: updateClass.description,
          price: updateClass.price,
          availableSeats: parseInt(updateClass.availableSeats),
          videoLink: updateClass.videoLink,
          status: 'approved',
        }
      };
      const result = await classesCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    // Cart route 
    app.post('/add-to-cart', async (req, res) => {
       const newCartItem = req.body;
       const result = await cartCollections.insertOne(newCartItem);
       res.send(result);
    })
    
    // Get cart Item by id
    app.get('/cart-item/:id', async (req, res) => {
        const id = req.params.id;
        const mail = req.body.email;
        const query = {
          classId: id,
          userMail: email
        };
        const projection = {classId: 1};
        const result = await cartCollections.findOne(query, {projection: projection});
        res.send(result);
    })

    // Cart info by user email
    app.get('cart/:email', async (req, res) => {
        const email = req.params.email;
        const query = {userMail: email};
        const projection = {classId: 1};
        const carts = await cartCollection.find(query, {projection: projection});
        const classIds = carts.map((cart) => new ObjectId(cart.classId));
        const query2 = { _id: { $in: classIds } };
        const result = await classesCollections.find(query2).toArray();
        res.send(result);
    })

    // Delete cart item by id 
    // Suppression des cadre par l'identifiant Id
    app.delete('/delete-cart-item/:id', async (req, res) => {
        const id = req.params.id;
        const query = {classId: id};
        const result = await cartCollections.deleteOne(query);
        res.send(result);
    })







    // Middleware pour ajouter un nonce et définir la CSP
    app.use((req, res, next) => {
      res.locals.nonce = crypto.randomBytes(16).toString('base64');
      res.setHeader("Content-Security-Policy", `default-src 'none'; script-src 'nonce-${res.locals.nonce}'`);
      next();
    });

    // Lancer le serveur après la connexion réussie à la base de données
    app.get('/', (req, res) => {
      res.send(`
        <html>
          <head>
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${res.locals.nonce}'">
          </head>
          <body>
            <script nonce="${res.locals.nonce}">
              console.log('Bonjour les développeurs !');
            </script>
          </body>
        </html>
      `);
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


const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.PAYMENT_SECRET);
const jwt = require('jsonwebtoken');

const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ message: 'Authorization invalide' });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.ASSESS_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: 'Forbidden access' });
    }
    req.decoded = decoded;
    next();
  });
};

// DB Connection
console.log("DB user name ", process.env.DB_USER);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/?appName=Project-Site`;

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

    const database = client.db("insertDB");
    const userCollections = database.collection("users");
    const classesCollections = database.collection("classes");
    const cartCollections = database.collection("cart");
    const paymentCollections = database.collection("payments");
    const enrolledCollections = database.collection("enrolled");
    const appliedCollections = database.collection("applied");

    // Token Endpoint
    app.post('/api/set-token', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ASSESS_SECRET, { 
        expiresIn: '24h' });
      res.send({ token });
    });

    // widdleware for admin and instructor
    // Le widdleware pour l'admin et l'instructor
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email};
      const user = await usersCollection.findOne(query);
      if (user?.role === 'admin') {
        next();
      } else {
        return res.status(401).send({ message: 'Unautharisation Access' });
      }
    }

    const verifyInstructor = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email};
      const user = await usersCollection.findOne(query);
      if (user?.role === 'instructor') {
        next();
      } else {
        return res.status(401).send({ message: 'Autharisation Access' });
      }
    }

    



    // User Routes
    app.post('/new-user', async (req, res) => {
      const newUser = req.body;
      const result = await userCollections.insertOne(newUser);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollections.findOne(query);
      res.send(result);
    });

    app.get('/user/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollections.findOne(query);
      res.send(result);
    });

    app.delete('/delete-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollections.deleteOne(query);
      res.send(result);
    });

    app.put('/update-user/:id', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const updateUser = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateUser.name,
          email: updateUser.email,
          role: updateUser.options,
          address: updateUser.address,
          about: updateUser.about,
          photoUrl: updateUser.photoUrl,
          skills: updateUser.skills ? updateUser.skills : null,
        }
      };
      const result = await userCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // Class Routes
    app.post('/new-class', verifyJWT, verifyInstructor, async (req, res) => {
      const newClass = req.body;
      const result = await classesCollections.insertOne(newClass);
      res.send(result);
    });

    app.get('/classes', async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    app.get('/classes/:email', verifyJWT, verifyInstructor, async (req, res) => {
      const email = req.params.email;
      const query = { instructorEmail: email };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollections.find().toArray();
      res.send(result);
    });

    app.put('/change-status', verifyJWT, verifyAdmin, async (req, res) => {
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

    app.get('/approved-classes', async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

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

    app.put('/update-class/:id', verifyJWT, verifyInstructor, async (req, res) => {
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

    // Cart Routes
    app.post('/add-to-cart', verifyJWT, async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollections.insertOne(newCartItem);
      res.send(result);
    });

    app.get('/cart-item/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;
      const query = { classId: id, userMail: email };
      const projection = { classId: 1 };
      const result = await cartCollections.findOne(query, { projection: projection });
      res.send(result);
    });

    app.get('/cart/:email', verifyJWT, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };
      const carts = await cartCollections.find(query, { projection: projection }).toArray();
      const classIds = carts.map((cart) => new ObjectId(cart.classId));
      const query2 = { _id: { $in: classIds } };
      const result = await classesCollections.find(query2).toArray();
      res.send(result);
    });

    app.delete('/delete-cart-item/:id', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollections.deleteOne(query);
      res.send(result);
    });

    // Payment Routes
    app.post('/create-payment-intent', async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price) * 100;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post('/payment-info', async (req, res) => {
      const paymentInfo = req.body;
      const classesId = paymentInfo.classId.map(id => new ObjectId(id));
      const userMail = paymentInfo.userMail;
      const singleClassId = req.query.classId;

      let query;
      if (singleClassId) {
        query = { classId: singleClassId, userMail: userMail };
      } else {
        query = { classId: { $in: classesId } };
      }

      const classesQuery = { _id: { $in: classesId } };
      const classes = await classesCollections.find(classesQuery).toArray();

      const options = { upsert: true };
      const updateEnrolled = {
        $set: {
          status: 'enrolled'
        }
      };

      const payments = await paymentCollections.insertOne(paymentInfo);
      await cartCollections.deleteMany(query);
      await classesCollections.updateMany(classesQuery, { $inc: { availableSeats: -1, enrolledStudents: 1 } });
      await enrolledCollections.updateOne({ email: userMail }, { $addToSet: { classesId: { $each: classesId } } }, options);

      res.send({ payments, classes });
    });

    app.get('/payment-info/:email', verifyJWT, verifyInstructor, async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const result = await paymentCollections.find(query).toArray();
      res.send(result);
    });

    app.get('/enrolled-classes/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const projection = { classesId: 1, _id: 0 };
      const result = await enrolledCollections.findOne(query, { projection: projection });

      if (result && result.classesId) {
        const classIds = result.classesId.map(id => new ObjectId(id));
        const classQuery = { _id: { $in: classIds } };
        const enrolledClasses = await classesCollections.find(classQuery).toArray();
        res.send(enrolledClasses);
      } else {
        res.send([]);
      }
    });

    // Verification des rôles
    const verifyRole = (role) => {
      return (req, res, next) => {
        const email = req.decoded.email;
        const query = { email: email };
        userCollections.findOne(query).then(user => {
          if (user?.role !== role) {
            return res.status(403).send({ message: 'Forbidden' });
          }
          next();
        });
      };
    };

    // Roles
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      res.send({ admin: user?.role === 'admin' });
    });

    app.get('/users/instructor/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      res.send({ instructor: user?.role === 'instructor' });
    });

    app.get('/users/role/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      res.send({ role: user?.role });
    });

    app.put('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        }
      };
      const result = await userCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.put('/ass-instructor', verifyJWT, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        }
      };
      const result = await userCollections.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.get('/applied-instructors/:email', async (req, res) => {
        const email = req.params.email;
        const result = await appliedCollections.findOne({ email });
        res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");


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

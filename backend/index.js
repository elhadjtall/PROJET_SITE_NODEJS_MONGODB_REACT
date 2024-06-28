const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const crypto = require('crypto');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { pipeline } = require('stream');
const stripe = require("stripe")(process.env.PAYEMENT_SECRET);  // Correction : suppression de l'appel direct d'une chaîne de caractères

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

    // Connect to the database and collections after a successful connection
    const database = client.db("insertDB");
    const userCollections = database.collection("users");
    const classesCollections = database.collection("classes");
    const cartCollections = database.collection("cart");
    const paymentCollections = database.collection("payments");
    const enrolledCollections = database.collection("enrolled");
    const appliedCollections = database.collection("applied");

    // Définition des routes après la connexion à la base de données

    // La requête post pour envoyer les données dans la base de données
    app.post('/new-class', async (req, res) => {
      const newClass = req.body;
      const result = await classesCollections.insertOne(newClass);
      res.send(result);
    });

    // La requête pour récupérer les données
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

    // Manage classes
    app.get('/classes-manage', async (req, res) => {
      const result = await classesCollections.find().toArray();
      res.send(result);
    });

    // Update classes
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

    // Get approved classes
    app.get('/approved-classes', async (req, res) => {
      const query = { status: "approved" };
      const result = await classesCollections.find(query).toArray();
      res.send(result);
    });

    // Get single class
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

    // Update class details
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

    // Cart routes
    app.post('/add-to-cart', async (req, res) => {
      const newCartItem = req.body;
      const result = await cartCollections.insertOne(newCartItem);
      res.send(result);
    });

    // Get cart item by ID
    app.get('/cart-item/:id', async (req, res) => {
      const id = req.params.id;
      const email = req.body.email;  // Correction: email au lieu de mail
      const query = { classId: id, userMail: email };
      const projection = { classId: 1 };
      const result = await cartCollections.findOne(query, { projection: projection });
      res.send(result);
    });

    // Cart info by user email
    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const projection = { classId: 1 };
      const carts = await cartCollections.find(query, { projection: projection }).toArray();
      const classIds = carts.map((cart) => new ObjectId(cart.classId));
      const query2 = { _id: { $in: classIds } };
      const result = await classesCollections.find(query2).toArray();
      res.send(result);
    });

    // Delete cart item by ID
    app.delete('/delete-cart-item/:id', async (req, res) => {
      const id = req.params.id;
      const query = { classId: id };
      const result = await cartCollections.deleteOne(query);
      res.send(result);
    });

    // Payment routes
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
      const newEnrolledData = {
        userMail: userMail,
        classId: classesId,
        transactionId: paymentInfo.transactionId
      };

      const updateDoc = {
        $set: {
          totalEnrolled: classes.reduce((total, current) => total + current.totalEnrolled, 0) + 1,
          availableSeats: classes.reduce((total, current) => total + current.availableSeats, 0) - 1,
        }
      };

      const updateResult = await classesCollections.updateMany(classesQuery, updateDoc, { upsert: true });
      const enrolledResult = await enrolledCollections.insertOne(newEnrolledData);
      const deleteResult = await cartCollections.deleteMany(query);
      const paymentResult = await paymentCollections.insertOne(paymentInfo);

      res.send({ paymentResult, deleteResult, enrolledResult, updateResult });
    });

    // Get payment history
    app.get('/payment-history/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const result = await paymentCollections.find(query).sort({ date: -1 }).toArray();
      res.send(result);
    });

    // Payment history length
    app.get('/payment-history-length/:email', async (req, res) => {
      const email = req.params.email;
      const query = { userMail: email };
      const total = await paymentCollections.countDocuments(query);
      res.send({ total });
    });

    // Enrollment routes
    app.get('/popular_classes', async (req, res) => {
      const result = await classesCollections.find().sort({ totalEnrolled: -1 }).limit(6).toArray();
      res.send(result);
    });

    app.get('/popular-instructors', async (req, res) => {
      const pipeline = [
        {
          $group: {
            _id: "$instructorEmail",
            totalEnrolled: { $sum: "$totalEnrolled" }
          }
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "email",
            as: "instructor"
          }
        },
        {
          $project: {
            _id: 0,
            instructor: { $arrayElemAt: ["$instructor", 0] },
            totalEnrolled: 1
          }
        },
        {
          $sort: { totalEnrolled: -1 }
        },
        {
          $limit: 6
        }
      ];

      try {
        const result = await classesCollections.aggregate(pipeline).toArray();  // Correction : classesCollections au lieu de classesCollection
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).send({ message: "Server error" });
      }
    });

    // Admin
    app.get('/admin-stats', async (req, res) => {
      const approvedClasses = (await ((await classesCollections.find({status: 'approved'})).toArray())).length;
      const pendingClasses = ((await classesCollection.find({status: 'pending'})).toArray()).length;
      const instructors = ((await usersCollection.find({role: 'instructor'})).toArray()).length;
      const totalClasses = (await classesCollections.find()).toArray().length;
      const totalEnrolled = (await enrolledCollections.find()).toArray().length;
      
      const result = {
        approvedClasses,
        pendingClasses,
        instructors,
        totalClasses,
        totalEnrolled
      }

      res.send(result);
    })

    // Get  ll instructor
    app.get('/instructors', async (req, res) => {
        const result = await usersCollections.find({role: 'instructor'}).toArray();
        res.send(result);
    })

    app.get('/enrolled-classes/:email', async (req, res) => {
        const email = req.params.email;
        const query = { userMail: email};
        const pipeline = [
          {
            $match: query
          },
          {
            $lookup: {
              from: "classes",
              localField: "classesId",
              foreignField: "_id",
              as: "classes"
            }
          }, {
            $urwind: "$classes"
          }, {
            $lookup: {
              from: "users",
              localField: "classes.instructorEmail",
              foreignField: "email",
              as: "instructor"
            }
          }, {
            $project: {
              _id: 0,
              instructor: { $arrayElemAt: ["$instructor", 0] 
              },
              classes: 1
            }
          }
        ];
        const result = await enrolledCollection.aggregate(pipeline).toArray();
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

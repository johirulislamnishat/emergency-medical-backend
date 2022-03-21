const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const BodyParser = require("body-parser");
const port = process.env.PORT || 8000;
const app = express();

require("dotenv").config();
app.use(BodyParser.json());
app.use(cors());
// app.use(express.static("emergencyMedical"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.z6ulz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect((err) => {
  const usersCollection = client.db("emergency_medical").collection("users");
  const doctorsCollection = client
    .db("emergency_medical")
    .collection("doctors");
  const blogsCollection = client.db("emergency_medical").collection("blogs");

  console.log("Emergency Medical DataBase Connected");

  // Root Route
  app.get("/", (req, res) => res.send("Welcome To Emergency Medical Database"));

  //USER POST API
  app.post("/users", async (req, res) => {
    const user = req.body;
    const result = await usersCollection.insertOne(user);
    // console.log(result);
    res.json(result);
  });

  app.get("/users", async (req, res) => {
    const cursor = usersCollection.find({});
    const user = await cursor.toArray();
    res.send(user);
  });

  app.put("/users/admin", async (req, res) => {
    const user = req.body;
    // console.log(user);
    const filter = { email: user.email };
    const options = { upsert: true };

    const updateDoc = { $set: { role: "admin" } };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
  });

  app.get("/users/:email", async (req, res) => {
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    let isAdmin = false;
    if (user?.role === "admin") {
      isAdmin = true;
    }
    res.json({ admin: isAdmin });
  });

  //DELETE USER API
  app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await usersCollection.deleteOne(query);
    // console.log(result);
    res.send(result);
  });

  //DOCTORS POST API
  app.post("/doctors", async (req, res) => {
    const doctors = req.body;
    const result = await doctorsCollection.insertOne(doctors);
    // console.log(result);
    res.json(result);
  });

  //DOCTORS GET API
  app.get("/doctors", async (req, res) => {
    const cursor = doctorsCollection.find({});
    const doctors = await cursor.toArray();
    res.send(doctors);
  });

  //DOCTORS Single Doctor
  app.get("/doctors/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await doctorsCollection.findOne(query);
    res.send(result);
  });

  //DELETE DOCTORS API
  app.delete("/doctors/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await doctorsCollection.deleteOne(query);
    // console.log(result);
    res.send(result);
  });

  //BLOGS POST API
  app.post("/blogs", async (req, res) => {
    const blogs = req.body;
    const result = await blogsCollection.insertOne(blogs);
    // console.log(result);
    res.json(result);
  });

  //BLOGS GET API
  app.get("/blogs", async (req, res) => {
    const cursor = blogsCollection.find({});
    const blogs = await cursor.toArray();
    res.send(blogs);
  });
});

app.listen(port, (err) =>
  err
    ? console.log("Filed to Listen on Port", port)
    : console.log("Listing for Port", port)
);

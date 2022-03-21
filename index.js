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
  const doctorsCollection = client
    .db("emergency_medical")
    .collection("doctors");
  console.log("Emergency Medical DataBase Connected");

  // Root Route
  app.get("/", (req, res) => res.send("Welcome To Emergency Medical Database"));

  //DOCTORS POST API
  app.post("/doctors", async (req, res) => {
    const doctors = req.body;
    const result = await doctorsCollection.insertOne(doctors);
    // console.log(result);
    res.json(result);
  });

  app.get("/doctors", async (req, res) => {
    const cursor = doctorsCollection.find({});
    const doctors = await cursor.toArray();
    res.send(doctors);
  });
});

app.listen(port, (err) =>
  err
    ? console.log("Filed to Listen on Port", port)
    : console.log("Listing for Port", port)
);

const express = require("express");
const cors = require("cors");
const app = express();

// Root Route
app.get("/", (req, res) => res.send("Welcome To Emergency Medical Database"));

app.listen(port, (err) =>
  err
    ? console.log("Filed to Listen on Port", port)
    : console.log("Listing for Port", port)
);

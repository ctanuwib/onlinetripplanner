const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const eventRoutes = require('./routes/customerevent');
const userRoutes = require('./routes/user');

const app = express();

mongoose.connect('mongodb+srv://mpek6d:'+ process.env.MONGO_ATLAS_PASSWORD +'@cluster0-gx7ou.mongodb.net/calendarevent?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!')
  }).catch(() => {
    console.log('Cannot connect to database!')
  });

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  next();
});

app.use("/api/events", eventRoutes);
app.use("/api/user", userRoutes);


module.exports = app;

const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

const DB_URL = 'mongodb://localhost:27017/farmStand';
const mongoose = require('mongoose');
const Product = require('./models/product');
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Mongo DB connection is successful');
  })
  .catch((error) => {
    console.log('Mongo DB connection is failed');
    console.log(error);
  });

//Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//View engine and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Routes
app.get('/', async (req, res) => {
  const products = await Product.find({});
  res.render('products/index.ejs', { products });
});
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render('products/details.ejs', { product });
});

//Route fallback
app.get('*', (req, res) => {
  res.send('This page doesnt exist');
});
//Start server
app.listen(port, (req, res) => {
  console.log('Express server is listening on port 8080');
});

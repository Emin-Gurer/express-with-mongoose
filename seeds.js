const mongoose = require('mongoose');
const Product = require('./models/product');
const Store = require('./models/store');
const DB_URL = 'mongodb://localhost:27017/myStore';
const stores = require('./stores.json');
const products = require('./products.json');

const insertSeeds = async function () {
  await mongoose.connect(DB_URL);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongoDB connection error'));
  db.once('open', () => {
    console.log('mongoDB connection is open');
  });
  //Note that if one element fails to be validated nothing will be inserted
  //Mongoose validate all elements in one pass than decide to put them to DB or not
  await Store.insertMany(stores)
    .then((res) => {
      console.log('Stores seeds are inserted');
    })
    .catch((e) => {
      console.log('Stores seeds cannot be inserted');
      console.log(e);
    });

  await Product.insertMany(products)
    .then((res) => {
      console.log('Products seeds are inserted');
    })
    .catch((e) => {
      console.log('Products seeds cannot be inserted');
      console.log(e);
    });
  await db.close();
  console.log('seeds.js executed');
};

insertSeeds();

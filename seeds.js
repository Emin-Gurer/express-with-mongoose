const mongoose = require('mongoose');
const Product = require('./models/product');
const DB_URL = 'mongodb://localhost:27017/farmStand';

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log('Mongo DB connection is successful');
  })
  .catch((error) => {
    console.log('Mongo DB connection is failed');
    console.log(error);
  });

//This is how to create one product and save at a time

// const product1 = new Product({
//   name: 'Ruby Grapefruit',
//   price: 19.99,
//   category: 'fruit',
// });
// product1
//   .save()
//   .then(() => {
//     console.log(product1);
//   })
//   .catch((e) => {
//     console.log(e);
//   });

const seedProducts = [
  {
    name: 'Egg Plant',
    price: 15.6,
    category: 'vegetable',
  },
  {
    name: 'Organic Goddess Melon',
    price: 15.6,
    category: 'fruit',
  },
  {
    name: 'Organic Celery',
    price: 15.6,
    category: 'vegetable',
  },
  {
    name: 'Chocolate Whole Milk',
    price: 15.6,
    category: 'dairy',
  },
];

//Note that if one element fails to be validated nothing will be inserted
//Mongoose validate all elements in one pass than decide to put them to DB or not
Product.insertMany(seedProducts)
  .then((res) => {
    console.log('Seeds are inserted');
    console.log(res);
  })
  .catch((e) => {
    console.log('Seeds cannot be inserted');
    console.log(e);
  });

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const DB_URL = 'mongodb://localhost:27017/myStore';
const Product = require('./models/product');
const Store = require('./models/store');

const writeFile = async function () {
  await mongoose.connect(DB_URL);
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'mongoDB connection error'));
  db.once('open', () => {
    console.log('mongoDB connection is open');
  });
  const stores = await Store.find({});
  const products = await Product.find({});

  fs.writeFileSync(
    path.join(__dirname, 'stores.json'),
    JSON.stringify(stores),
    (e) => {
      if (e) {
        console.log('Error fs');
        console.log(e);
      }
      console.log('Fs write succeed');
    }
  );
  fs.writeFileSync(
    path.join(__dirname, 'products.json'),
    JSON.stringify(products),
    (e) => {
      if (e) {
        console.log('Error fs');
        console.log(e);
      }
      console.log('Fs write succeed');
    }
  );
  await db.close();
  console.log('Database readed and writed to files');
  console.log('Please check ./stores.json');
  console.log('Please check ./products.json');
};

writeFile();

const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const methodOverride = require('method-override');
const AppError = require('./AppError');
const wrapAsync = require('./errorUtilities/asyncWrap');
const DB_URL = 'mongodb://localhost:27017/farmStand';
const mongoose = require('mongoose');
const Product = require('./models/product');
const ejsMate = require('ejs-mate');
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
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
//View engine and static assets
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsMate);

//Routes

//Products
app.get(
  '/',
  wrapAsync(async (req, res) => {
    const products = await Product.find({});
    res.render('products/products.ejs', { products });
  })
);
app.get(
  '/products/id=:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      //You have to pass error to next if error is coming from async promise
      throw new AppError('Product is not found', 404);
    }
    res.render('products/details.ejs', { product });
  })
);

//Create
app.get('/products/create', (req, res) => {
  const categories = Product.schema.path('category').enumValues;
  res.render('products/create.ejs', { categories });
});
app.post(
  '/products/create',
  wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.redirect(`/products/id=${newProduct._id}`);
  })
);

//Update
app.get(
  '/products/id=:id/update',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const categories = Product.schema.path('category').enumValues;
    const product = await Product.findById(id);
    res.render(`products/update.ejs`, { product, categories });
  })
);
app.put(
  '/products/id=:id/update',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let product = {};
    product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/products/id=${product.id}`);
  })
);

//Delete
app.delete(
  '/products/id=:id/delete',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Product.findByIdAndDelete(id);
    res.redirect('/');
  })
);

//Route fallback
app.get('*', (req, res) => {
  res.send('This page doesnt exist');
});
//Error handler middleware
app.use((err, req, res, next) => {
  const { status = 500, message = 'Something went wrong' } = err;
  console.log(err);
  res.status(status).send(message);
});
//Start server
app.listen(port, (req, res) => {
  console.log(`Express server is listening on http://localhost:${port}`);
});

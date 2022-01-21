const express = require('express');
const app = express();
const path = require('path');
const port = 8080;
const methodOverride = require('method-override');
const AppError = require('./AppError');
const wrapAsync = require('./errorUtilities/asyncWrap');
const DB_URL = 'mongodb://localhost:27017/myStore';
const mongoose = require('mongoose');
const Product = require('./models/product');
const Store = require('./models/store');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

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
//Session
app.use(
  session({
    secret: 'devsecret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
//Routes

//All products
app.get(
  '/',
  wrapAsync(async (req, res) => {
    const products = await Product.find({}).populate('store');
    res.render('products/products.ejs', {
      products,
    });
  })
);

//All stores
app.get(
  '/stores',
  wrapAsync(async (req, res) => {
    const stores = await Store.find({});
    res.render('stores/stores.ejs', { stores });
  })
);

//Details
//Products
app.get(
  '/products/id=:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate('store');
    if (!product) {
      //You have to pass error to next if error is coming from async promise
      throw new AppError('Product is not found', 404);
    }
    res.render('products/details.ejs', {
      product,
      message: req.flash('success'),
    });
  })
);
//Stores
app.get(
  '/stores/id=:id',
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    const products = await Product.find({ store: store.id });
    if (!store) {
      //You have to pass error to next if error is coming from async promise
      throw new AppError('Product is not found', 404);
    }
    res.render('stores/details.ejs', {
      store,
      products,
      message: req.flash('success'),
    });
  })
);

//Create

//Product
app.get(
  '/products/create',
  wrapAsync(async (req, res, next) => {
    const categories = Product.schema.path('category').enumValues;
    const stores = await Store.find({});
    res.render('products/create.ejs', {
      categories,
      stores,
    });
  })
);
app.post(
  '/products/create',
  wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    req.flash('success', 'Product is created');
    res.redirect(`/products/id=${newProduct._id}`);
  })
);
//Store
app.get('/stores/create', (req, res) => {
  res.render('stores/create.ejs');
});
app.post(
  '/stores/create',
  wrapAsync(async (req, res, next) => {
    const newStore = new Store(req.body);
    await newStore.save();
    req.flash('success', 'Store is created');
    res.redirect(`/stores/id=${newStore._id}`);
  })
);

//Update
//Products
app.get(
  '/products/id=:id/update',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const categories = Product.schema.path('category').enumValues;
    const stores = await Store.find({});
    const product = await Product.findById(id);
    res.render(`products/update.ejs`, { product, categories, stores });
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
//Stores
app.get(
  '/stores/id=:id/update',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const store = await Store.findById(id);
    res.render(`stores/update.ejs`, { store });
  })
);
app.put(
  '/stores/id=:id/update',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let store = {};
    store = await Store.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.redirect(`/stores/id=${store.id}`);
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
app.delete(
  '/stores/id=:id/delete',
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    const response = await Store.findByIdAndDelete(id);
    res.redirect('/stores');
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

const mongoose = require('mongoose');
const { Schema } = mongoose;
const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product must have a name'],
  },
  price: {
    type: Number,
    required: [true, 'Product must have a price'],
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Product must have an image url'],
  },
  category: {
    type: String,
    enum: ['Fruit', 'Vegetable', 'Dairy'],
    required: [true, 'Product must have a category'],
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
    required: [true, 'Product must have a store.'],
  },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

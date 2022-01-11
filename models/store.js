const mongoose = require('mongoose');
const { Schema } = mongoose;
const Product = require('./product');

const storeSchema = new Schema({
  email: {
    type: String,
    required: [true, 'Store must have an email'],
  },
  name: {
    type: String,
    required: [true, 'Store must have a name'],
  },
  location: {
    type: String,
    required: [true, 'Store must have a location'],
  },
});

storeSchema.post('findOneAndDelete', async function (store) {
  const result = await Product.deleteMany({ store: store.id });
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;

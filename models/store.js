const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;

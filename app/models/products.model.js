const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  img: String,
  category_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
},

});

productSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true
});

productSchema.findById = function (cb) {
  return this.model('Products').find({id: this.id}, cb);
};

const Products = mongoose.model("Products", productSchema);

const findById = (id) => {
  return Products.findById(id)
      .then((result) => {
          result = result.toJSON();
          delete result._id;
          delete result.__v;
          return result;
      });
};

const createProducts = (productData) => {
  const product = new Products(productData);
  return product.save();
};

const list = (perPage, page) => {
  return new Promise((resolve, reject) => {
    Products.find()
          .limit(perPage)
          .skip(perPage * page)
          .exec(function (err, products) {
              if (err) {
                  reject(err);
              } else {
                  resolve(products);
              }
          })
  });
};

const patchProducts = (id, productsData) => {
  return Products.findOneAndUpdate({
      _id: id
  }, productsData);
};

const removeById = (productId) => {
  return new Promise((resolve, reject) => {
    Products.deleteMany({_id: productId}, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve(err);
          }
      });
  });
};

module.exports = {
  Products,
  createProducts,
  list,
  findById,
  patchProducts,
  removeById
};

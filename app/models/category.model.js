const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  status: String
});

categorySchema.virtual('id').get(function () {
  return this._id.toHexString();
});

categorySchema.set('toJSON', {
  virtuals: true
});

categorySchema.findById = function (cb) {
  return this.model('Category').find({id: this.id}, cb);
};

const Category = mongoose.model("Category", categorySchema);

exports.findById = (id) => {
  return Category.findById(id)
      .then((result) => {
          result = result.toJSON();
          delete result._id;
          delete result.__v;
          return result;
      });
};

exports.createCategory = (categoryData) => {
  const category = new Category(categoryData);
  return category.save();
};

exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
      Category.find()
          .limit(perPage)
          .skip(perPage * page)
          .exec(function (err, categorys) {
              if (err) {
                  reject(err);
              } else {
                  resolve(categorys);
              }
          })
  });
};

exports.patchCategory = (id, categoryData) => {
  return Category.findOneAndUpdate({
      _id: id
  }, categoryData);
};

exports.removeById = (categoryId) => {
  return new Promise((resolve, reject) => {
      Category.deleteMany({_id: categoryId}, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve(err);
          }
      });
  });
};
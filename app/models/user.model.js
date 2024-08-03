const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
});

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

userSchema.set('toJSON', {
  virtuals: true
});

userSchema.findById = function (cb) {
  return this.model('User').find({id: this.id}, cb);
};

const User = mongoose.model("User", userSchema);

const findById = (id) => {
  return User.findById(id).exec()
      .then((result) => {
          result = result.toJSON();
          delete result._id;
          delete result.__v;
          return result;
      });
};

const list = (perPage, page) => {
  return new Promise((resolve, reject) => {
      User.find()
          .limit(perPage)
          .skip(perPage * page)
          .exec(function (err, users) {
              if (err) {
                  reject(err);
              } else {
                  resolve(users);
              }
          })
  });
};

const patchUser = (id, userData) => {
  return User.findOneAndUpdate({
      _id: id
  }, userData);
};

const removeById = (userId) => {
  return new Promise((resolve, reject) => {
      User.deleteMany({_id: userId}, (err) => {
          if (err) {
              reject(err);
          } else {
              resolve(err);
          }
      });
  });
};

module.exports = {
  User,
  list,
  findById,
  patchUser,
  removeById
};
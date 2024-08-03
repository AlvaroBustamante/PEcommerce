const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products',
        required: true
    },
    estado_pago: {
        type: String,
        enum: ['pendiente', 'completado', 'fallido'],
        default: 'pendiente'
    },
    total_final: {
        type: Number,
        required: true
    },
    fecha_orden: {
        type: Date,
        default: Date.now
    },
});


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
orderSchema.set('toJSON', {
    virtuals: true
});

orderSchema.findById = function (cb) {
    return this.model('Order').find({id: this.id}, cb);
};

const Order = mongoose.model('Order', orderSchema);

exports.findById = (id) => {
    return Order.findById(id)
        .then((result) => {
            if(result){
                result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
            }else {
                return null;
            };
        })
};

exports.createOrder = (orderData) => {
    const order = new Orden(orderData);
    return order.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Order.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, orders) {
                if (err) {
                    reject(err);
                } else {
                    resolve(orders);
                }
            })
    });
};

exports.patchOrder = (id, orderData) => {
    return Order.findOneAndUpdate({
        _id: id
    }, orderData);
};

exports.pagarOrder = (orderId) => {
    return Order.findOneAndUpdate(
        {_id: orderId},
        { $set: { estado_pago: 'completado' } },);
};

exports.removeById = (orderId) => {
    return new Promise((resolve, reject) => {
        Order.deleteMany({_id: orderId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

module.exports = Order;


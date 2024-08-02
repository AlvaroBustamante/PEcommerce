const OrderModel = require('../models/order.model');

exports.insert = (req, res) => {
    try {
        return OrderModel.createOrder(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
    } catch (error) {
        res.status(400).send(error);
    }
    
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    OrderModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    OrderModel.findById(req.params.orderId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.pagoById = (req, res) => {
    OrderModel.pagarOrder(req.params.orderId)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.patchById = (req, res) => {
    OrderModel.patchOrder(req.params.orderId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

exports.removeById = (req, res) => {
    OrderModel.removeById(req.params.orderId)
        .then((result)=>{
            res.status(204).send({});
        });
};
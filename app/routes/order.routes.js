const ProductsModel = require('../models/products.model');
const OrderModel = require('../models/order.model');
const { authJwt } = require("../middlewares");
const OrderController = require("../controllers/order.controller");

const cors = require("cors"); 
require("dotenv").config(); 
const express = require("express"); 
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); 

const app = express(); 

app.use(express.json()); 
app.use(cors()); 


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get('/order', 
        OrderController.list
    );
    app.get('/order/:orderId', 
        OrderController.getById
    );
    app.patch('/order/:orderId',
        [authJwt.verifyToken, authJwt.isModerator],
        OrderController.patchById
    );
    app.patch('/order/:orderId/pagar', 
        [authJwt.verifyToken],
        OrderController.pagoById
    );

    app.post("/api/create-checkout-session", 
        [authJwt.verifyToken],
        async (req, res) => {
          const { productId, userId } = req.body;
          const product = await ProductsModel.findById(productId);
            if (!product) {
                return res.status(404).send("producto no encontrado");
            }
          const newOrder = await OrderModel.createOrder({
                user_id: userId,
                product_id: productId,
                total_final: product.price
            });
  
              const session = await stripe.checkout.sessions.create({
                  payment_method_types: ["card"],
                  line_items: [
                      {
                          price_data: {
                              currency: "pen",
                              product_data: {
                                  name: product.name,
                              },
                              unit_amount: product.price * 100,
                          },
                          quantity: 1,
                      },
                  ],
                  mode: "payment",
                  success_url: `http://localhost:8080/success?order_id=${newOrder._id}`,
                  cancel_url: "http://localhost:8080/cancel",
              });
  
              res.json({ id: session.id });
          } 
   );
  

    app.delete('/order/:orderId', 
        [authJwt.verifyToken, authJwt.isAdmin],
        OrderController.removeById
    );
};

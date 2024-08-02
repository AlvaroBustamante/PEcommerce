const { authJwt } = require("../middlewares");
const ProductsController = require("../controllers/products.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/products', 
        [authJwt.verifyToken],
        ProductsController.insert
    );
    app.get('/products', 
        ProductsController.list
    );

    app.get('/products/:productId', 
        ProductsController.getById
    );
    app.patch('/products/:productId',
        [authJwt.verifyToken, authJwt.isModerator],
        ProductsController.patchById
    );
    app.delete('/products/:productId', 
        [authJwt.verifyToken, authJwt.isAdmin],
        ProductsController.removeById
    );
}
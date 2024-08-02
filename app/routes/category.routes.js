const { authJwt } = require("../middlewares");
const CategoryController = require("../controllers/category.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.post('/category', 
        [authJwt.verifyToken],
        CategoryController.insert
    );
    app.get('/category', 
        CategoryController.list
    );

    app.get('/category/:categoryId', 
        CategoryController.getById
    );
    app.patch('/category/:categoryId',
        [authJwt.verifyToken, authJwt.isModerator],
        CategoryController.patchById
    );
    app.delete('/category/:categoryId', 
        [authJwt.verifyToken, authJwt.isAdmin],
        CategoryController.removeById
    );
}
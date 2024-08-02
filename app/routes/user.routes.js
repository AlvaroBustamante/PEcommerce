const { authJwt } = require("../middlewares");
const UserController = require("../controllers/user.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });
    app.get('/users', 
        UserController.list
    );
    app.get('/users/:userId', 
        UserController.getById
    );
    app.patch('/users/:userId',
        [authJwt.verifyToken, authJwt.isModerator],
        UserController.patchById
    );
    app.delete('/users/:userId', 
        [authJwt.verifyToken, authJwt.isAdmin],
        UserController.removeById
    );
}
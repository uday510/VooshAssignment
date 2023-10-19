const authController = require("../controllers/auth.controller");
const orderController = require("../controllers/order.controller");
const { authUser } = require("../middleware/index");

module.exports = (app) => {

    app.post(
        '/url/add-user/',
        [authUser.validateSignupRequest], //db calls all in one place
        authController.signup
    ); // for user creation

    app.post(
        '/url/login-user/:param1/',
        [authUser.validateSigninRequest],
        authController.signin
    ); // for user signin

    app.post('/url/add-order/', [authUser.verifyToken], orderController.createOrder);

    app.get('/url/get-order/', [authUser.verifyToken], orderController.getOrderDetails);
};

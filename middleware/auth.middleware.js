const jwt = require("jsonwebtoken");
const Config = require("../configs/auth.config");
const User = require("../models/user.model");
const Util = require("../utils/util");

// To Validate whether the sign in request contains name and password
validateSigninRequest = (req, res, next) => {
    // check for the name in body
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed ! userId is not provided",
        });
    }
    // check for the password in body
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed ! password is not provided",
        });
    }
    const login_by = req.params['param1'].slice(1);

    console.log(login_by.toLowerCase());

    console.log(login_by.toLowerCase() != 'normal');
    console.log(login_by.toLowerCase() != 'google');


    if (login_by.toLowerCase() != 'google' && login_by.toLowerCase() != 'normal') {
        return res.status(400).send({
            message: "only Google or normal login allowed.",
        });
    }
    // if required fields are provided the frwarding the request to the controller
    next();
};
// To Validate whether the sign up request contains name and password
validateSignupRequest = async (req, res, next) => {
    // Validate if fields that are required are provided
    if (!req.body.name) {
        return res.status(400).send({
            message: "Failed ! name is not provided",
        });
    }
    if (!req.body.userId) {
        return res.status(400).send({
            message: "Failed ! UserId is not provided",
        });
    }
    if (!req.body.phoneNumber) {
        return res.status(400).send({
            message: "Failed ! phoneNumber is not provided",
        });
    }
    if (!req.body.password) {
        return res.status(400).send({
            message: "Failed ! Password is not provided",
        });
    }

    // Validate if the userId is already exists
    const user = await User.findOne({ userId: req.body.userId });
    if (user != null) {
        return res.status(400).send({
            message: "Failed ! User Id already exists",
        });
    }


    // validate Password using Regular Expression

    if (!Util.validatePassword(req.body.password)) {
        return res.status(400).send({
            message: "Failed ! Password id not valid",
            hint: "Password should be min 8 length, with at least a symbol, upper and lower case letters and a number ",
        });
    }

    // If all OK then
    next(); // Revert back to the controller
};

// Verify the Provided Token
verifyToken = (req, res, next) => {
    // Read the token from the header

    const token = req.headers["x-access-token"];

    if (!token) {
        return res.status(401).send({
            message: "No token provided",
        });
    }

    //If the token was provided, we need to verify it against
    jwt.verify(token, Config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Login expired, please login again",
            });
        }
        // Try to read the userId from the decoded token and store it in the req.userId property
        req.userId = decoded.id;
        next(); // revert back to the controller
    });
};

// Exposing the functions to outside of this file
const authUser = {
    validateSignupRequest: validateSignupRequest,
    validateSigninRequest: validateSigninRequest,
    verifyToken: verifyToken,
};

module.exports = authUser;

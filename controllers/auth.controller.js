const bcrypt = require("bcryptjs");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const config = require("../configs/auth.config");

// for user signup
exports.signup = async (req, res) => {
    // User sign up Object
    console.log(req.body);
    const userObj = {
        userId: req.body.userId,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password, 8),
    };

    //  Insert this new user into the database
    try {
        const userCreated = await User.create(userObj);
        // Return the response
        const userCreationResponse = {
            name: userCreated.name,
            userId: userCreated.userId,
        };

        res.status(201).send({
            statusCode: 201,
            data: userCreationResponse,
            message: "User created successfully"
        });
    } catch (err) {
        console.error("Error while creating user", err.message);
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error while creating user",
        });
    }
};

// Controller for sign-in
exports.signin = async (req, res) => {
    try {
        // Search the user if exists
        const user = await User.findOne({ userId: req.body.userId });

        if (user == null) {
            return res.status(400).send({
                statusCode: 400,
                message: "Failed ! userId doesn't exist",
            });
        }

        // User is existing, so now will do the password matching
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).send({
                statusCode: 401,
                message: "Invalid Password",
            });
        }

        /**
         * Successful  login
         * Need to generate access token now
         */
        const token = jwt.sign({ id: user.userId }, config.secret, {
            expiresIn: 600, // Expires 10 Minutes
        });

        // Send the response
        res.status(200).send({
            statusCode: 200,
            data: {
                name: user.name,
                userId: user.userId,
                email: user.email,
                accessToken: token,
            },
            message: "Token sent successfully",
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({
            statusCode: 500,
            error: err.message,
            message: "Internal server error while signing user",
        });
    }
};

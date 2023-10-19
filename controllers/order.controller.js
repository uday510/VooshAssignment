const Order = require('../models/order.model');
const User = require('../models/user.model');


exports.createOrder = async (req, res) => {

    if (!req.body.subTotal) {
        return res.status(401).send({
            message: "subTotal required to create order.",
        });
    }
    if (!req.body.userId) {
        return res.status(401).send({
            message: "userId required to create order.",
        });
    }

    try {
        const userId = req.userId;
        const user = await User.findOne({ userId: userId });
        if (user.userId != req.body.userId) {
            return res.status(401).send({
                message: "provide the valid userId.",
            });
        }

        const order = new Order({
            userId: user._id,
            subTotal: req.body.subTotal,
            phoneNumber: user.phoneNumber
        });

        console.log(order);

        const savedOrder = await order.save();

        if (!savedOrder) {
            console.error("Error saving order:", savedOrder);
            return res.status(500).send({
                message: "Unable to create order, please try again later",
            });
        }
        return res.status(200).send({
            message: "Order created successfully",
            order: savedOrder,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Unable to create order, please try again later",
        });
    }
}

exports.getOrderDetails = async (req, res) => {

    console.log(req.query);

    if (!req.query.userId) {
        return res.status(401).send({
            message: "userId required to get order details.",
        });
    }

    try {
        const userId = req.userId;
        const user = await User.findOne({ userId: userId });

        if (req.query.userId != user.userId) {
            return res.status(401).send({
                message: "provide the valid userId.",
            });
        }

        const orders = await Order.find({ userId: user._id });

        return res.status(200).send({
            data: orders,
            message: "orders fetched successfully"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).send({
            message: "Unable to get orders, please try again later",
        });
    }
}
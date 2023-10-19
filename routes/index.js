const authRoutes = require("./auth.routes");

// index file for all routes
module.exports = (app) => {
    authRoutes(app)
};

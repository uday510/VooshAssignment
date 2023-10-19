const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dbConfig = require("./configs/db.config");
const app = express(); // Initialize express instance

console.clear(); // clear the console to remove previous logging

app.use(bodyParser.json()); // used to parse the request and extract the information
app.use(bodyParser.urlencoded({ extended: true }));

// for testing purposes
app.get("/", (req, res) => {
    res.send("Welcome!");
});

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, PATCH, OPTIONS"
    );
    next();
});


require("./routes")(app); // Initialize the route/s

// Connect to the Database
mongoose
    .connect(dbConfig.DB_URL, {
        useNewUrlParser: true, // To avoid Deprecation Warning
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log(`Connection established.`);
        app.listen(4000, () => {
            console.log(`Server is running.`);
        });
    })
    .catch((err) => {
        console.log(err);
    });

// require('./app/db/db.connect');

const express = require('express');
const routes = require('./routes.js');
const mongoose = require("mongoose");
const core = require('crypto-js/core');
const app = express();
const path = require("path")
const cors = require('cors');

const port = process.env.PORT || 5500; // set our port
app.use(cors())
app.use('/', routes);
app.use("/", express.static("../build/"))
app.use("/home", async (req, res) => {
    res.sendFile(path.join(__dirname, "../build/index.html")
    )
})
app.use((err, req, res, next) => {
    res.status(err.status || 400).json({
        success: false,
        message: err.message || 'An error occured.',
        errors: err.error || [],
    });
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Resource not found.' });
});

// Start the server
app.listen(port);

console.log(`Server started on port ${port}`);
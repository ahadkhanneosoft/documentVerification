// require('./app/db/db.connect');

const express = require('express');
const routes = require('./routes.js');
const mongoose = require("mongoose");
const core = require('crypto-js/core');
const app = express();
const cors= require ('cors');

const port = process.env.PORT || 5000; // set our port
app.use(cors())
app.use('/', routes);

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
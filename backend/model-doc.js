const mongoose = require('mongoose');


// Schema for documents
const DocumentSchema = new mongoose.Schema({
    FileOwner: {
        type: String,
        required: true,
    },
    FileName: {
        type: String,
        required: true,
    },
    hash: {
        type: String,
        required: true,
        unique: true,
    },
    txHash: {
        type: String,
        required: true,
        unique: true,
    },
    blockNumber: {
        type: String,
        required: true,
        unique: true,
    },
    uri: {
        type: String,
        required: true,
        unique: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const document = mongoose.model('documents', DocumentSchema);

module.exports = document;
const routes = require('express').Router();
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const docs = require('./model-doc');

routes.use(bodyParser.urlencoded({ extended: true }));
routes.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/documentVerification', {
    useNewUrlParser: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function() {
    console.log("Connected to DB successfully");
});
let document = require("./model-doc")



routes.use((req, res, next) => {
    console.log(`Resource requested: ${req.method} ${req.originalUrl}`);
    next(); 
});
routes.get('/demo', (req, res) => {
    res.status(200).json({ success: true, message: 'Hello world!' });
});


// Uploading
routes.post("/uploadDocument", async(req, resp) => {
    console.log("BODY: " + JSON.stringify(req.body));
    try {
        const documents = new document(req.body);
        console.log("This is: " + documents);
        let result = await documents.save();
        result = result.toObject();

        console.log(result);
        if (result) {
            return resp.send(result);
        } else {
            return resp.send("Failed to save doc");
        }

    } catch (e) {
        resp.send("Something Went Wrong");
    }
});

// Fetch user documents
async function Find(acc) {
    let allDocuments = await docs.find({FileOwner: acc})
    console.log(allDocuments,'-----all docs-----');
    return allDocuments;
}

routes.post("/viewDocument", async(req, resp) => {
try{

    let Acc = req.body.Acc;
    console.log("Account: "+Acc);
   const accData= await Find(Acc)
    return resp.send(accData);


}
catch(err){
    console.error(err)
}
    
});

// Fetch all docs from DB
async function Get() {
    let allDocuments = await docs.find()
    console.log(allDocuments,'-----all docs-----');
    return allDocuments;
}

routes.post("/getDocument", async(req, resp) => {
try{
   const accData= await Get()
    return resp.send(accData)
}
catch(err){
    console.error(err)
}
    
});
//=================

module.exports = routes;
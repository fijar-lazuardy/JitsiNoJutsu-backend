'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
var parser = require('xml2json-light');

// Constants
const PORT = 8000;

// App
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');

app.get('/', (req, res) => {
    res.status(200).json({
        'message': "Hello World!"
    })
})

app.get("/user/:ticketId", async (req, res, next) => {
    const ticket = req.params.ticketId
    const URL_REDIRECT = "http://localhost:8000"
    try {
        const data = await axios.post(
            `https://sso.ui.ac.id/cas2/serviceValidate?ticket=${ticket}&service=${URL_REDIRECT}`
        )
        var json = parser.xml2json(data.data)
        console.log(json)
        res.send(data)
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT);
console.log('Server listening on port: ' + PORT);
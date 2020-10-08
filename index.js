'use strict';

const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(PORT);
console.log('Server listening on port: ' + PORT);
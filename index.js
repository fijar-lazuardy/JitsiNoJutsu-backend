'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
var cors = require('cors')
var convert = require('xml-js');
require('dotenv').config()

// Constants
const PORT = 8000;

// App
const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./routes');

const BASE_URL = process.env.URL 


app.get('/api', (req, res) => {
    res.status(200).json({
        'message': "Hello World!"
    })
})
console.log("URL:",BASE_URL)
app.post("/api/user", async (req, res, next) => {
    const ticket = req.query.ticketId
  
    try {
        let {data} = await axios.get(
            `https://akun-kp.cs.ui.ac.id/cas/serviceValidate?service=${BASE_URL}&ticket=${ticket}`
        )
        console.log("data raw from servce validate:",data)
        data = data.replace(/>\s*/g, '>');  // Replace "> " with ">"
        data = data.replace(/\s*</g, '<');  // Replace "< " with "<"
        data = data.replace(
            // Replace out the new line character.
            new RegExp( "\\n", "g" ), 
            "" 
            );
        var json = convert.xml2json(data)
        console.log("after validate convert html:",json)
        let result = {}
        json = JSON.parse(json)
        console.log("parse to json:",json)
        if(json.elements[0].elements[0].name==="cas:authenticationSuccess"){    
            const element = json.elements[0].elements[0].elements
            console.log("element:",element)
            const username = element[0].elements[0].text
            console.log("username:",element)
            
            const role = element[1].elements[1].elements[0].text
            console.log("role:",element)
         
            const name = element[1].elements[6].elements[0].text
            console.log("name:",element)
    
            const email = element[1].elements[8].elements[0].text
            console.log("email:",element)

            result['message'] = 'success'
            result['data']={'username':username,'role':role,'name':name,'email':email}
            res.send(result)
        }
        else{
            result['message'] = 'invalid ticket'
            res.send(result)
            
        }
        
        
    } catch (error) {
        console.log(error)
    }
});

app.listen(PORT);
console.log('Server listening on port: ' + PORT);
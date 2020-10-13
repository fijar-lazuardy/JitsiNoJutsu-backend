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

const BASE_URL = process.env.NODE_ENV === "prod" || process.env.NODE_ENV ==="production" ? process.env.PROD_URL :process.env.DEV_URL


app.get('/api', (req, res) => {
    res.status(200).json({
        'message': "Hello World!"
    })
})

app.post("/api/user", async (req, res, next) => {
    const ticket = req.query.ticketId
  
    try {
        let {data} = await axios.get(
            `https://akun-kp.cs.ui.ac.id/cas/serviceValidate?service=${BASE_URL}&ticket=${ticket}`
        )
        data = data.replace(/>\s*/g, '>');  // Replace "> " with ">"
        data = data.replace(/\s*</g, '<');  // Replace "< " with "<"
        data = data.replace(
            // Replace out the new line character.
            new RegExp( "\\n", "g" ), 
            "" 
            );
        var json = convert.xml2json(data)
      
        let result = {}
        json = JSON.parse(json)
      
        if(json.elements[0].elements[0].name==="cas:authenticationSuccess"){    
            const element = json.elements[0].elements[0].elements
           
            const username = element[0].elements[0].text
            
            const role = element[1].elements[1].elements[0].text
         
            const name = element[1].elements[6].elements[0].text
    
            const email = element[1].elements[8].elements[0].text

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
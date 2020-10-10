'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const axios = require("axios");
var cors = require('cors')
var convert = require('xml-js');

// Constants
const PORT = 8000;

// App
const app = express();
app.use(cors())

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes');

app.get('/', (req, res) => {
    res.status(200).json({
        'message': "Hello World!"
    })
})

app.post("/user", async (req, res, next) => {
    const ticket = req.query.ticketId
    const URL_REDIRECT = "http://localhost:3001"
    try {
        let {data} = await axios.post(
            `https://sso.ui.ac.id/cas2/serviceValidate?ticket=${ticket}&service=${URL_REDIRECT}`
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
     
            const role = element[1].elements[2].elements[0].text
         
            const name = element[1].elements[3].elements[0].text
    
            const npm = element[1].elements[4].elements[0].text

            result['message'] = 'success'
            result['data']={'username':username,'role':role,'name':name,'npm':npm}
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
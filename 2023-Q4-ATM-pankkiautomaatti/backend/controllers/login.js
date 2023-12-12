const express = require("express");
const router = express.Router();
const card = require('../models/card_model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

router.post('/', 
  function(request, response) {
    console.log(request.body);
    if(request.body.id_card && request.body.pin){
      const id = request.body.id_card;
      const pin = request.body.pin;

        card.checkPin(id, function(err, fetched_pin) {
          if(err){
            response.json(dbError);
          }
          else{
            if (fetched_pin.length > 0) {
              console.log(fetched_pin)
              bcrypt.compare(pin, fetched_pin[0].pin, function(err,compareResult) {
                console.log(fetched_pin)
                if(compareResult) {
                  console.log("succes");
                  const token = generateAccessToken({ username: id });
                  response.send(token);
                }
                else {
                    console.log("wrong password");
                    //response.status(401);
                    response.send(false);
                }			
              }
              );
            }
            else{
              console.log("user does not exists");
              response.send(false);
            }
          }
          }
        );
      }
    else{
      console.log("username or password missing");
      response.send(false);
    }
  }
);

router.get('/:pin', function(request, response){
  bcrypt.hash(request.params.pin, 10, function(errr, hash) {
    response.json(hash);
  })
});

function generateAccessToken(username) {
    dotenv.config();
    return jwt.sign(username, process.env.MY_TOKEN, { expiresIn: '1800s' });
  }

module.exports = router;
const express = require("express");
const router = express.Router();
const card = require('../models/card_model');

router.get('/', function(request, response) {
    card.getAllCards(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/:id', function(request, response) {
    card.getOneCard(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            if(data.length > 0) {
                response.json(data[0].type);
            }
            else {
                response.json(false);
            }    
        }
    });
});

router.post('/', function(request, response) {
    card.addCard(request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});


router.put('/:id', function(request, response) {
    card.updatePin(request.params.id, request.body.pin, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.delete('/:id', function(request, response) {
    card.deleteCard(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

module.exports = router;
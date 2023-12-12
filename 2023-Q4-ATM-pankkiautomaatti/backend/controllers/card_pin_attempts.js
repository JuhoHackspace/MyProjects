const express = require("express");
const router = express.Router();
const card = require('../models/card_model');

router.get('/:id', function(request, response) {
    card.checkAttempts(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data[0].attempts);
        }
    });
});

router.post('/addAttempt', function(request, response) {
    card.addAttempt(request.body.id_card, request.body.automat_id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(true);
        }
    });
});

router.post('/clear', function(request, response) {
    card.clearAttempts(request.body.id_card, request.body.automat_id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(true);
        }
    });
});

router.get('/cardType/:id', function(request, response) {
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

module.exports = router;
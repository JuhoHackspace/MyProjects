const express = require("express");
const router = express.Router();
const automat = require('../models/automat_model');

router.get('/', function(request, response) {
    automat.getAllAutomats(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/:id', function(request, response) {
    automat.getOneAutomat(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/getAtmLimit/:id', function(request, response) {
    automat.getAtmLimit(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data[0].max_withdrawal);
        }
    });
})

router.post('/', function(request, response) {
    automat.addAutomat(request.body, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.delete('/:id', function(request, response) {
    automat.deleteAutomat(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/getBalances/:id', function(request, response) {
    automat.getBalances(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data[0]);
        }
    });
});

router.put('/addMoney/:denomination', function(request, response) {
    automat.addMoney(request.params.denomination, request.body, function(err, data) {
        if(err) {
            console.log(err);
            response.json(err);
        }
        else {
            console.log(data);
            response.json("succes");
        }
    });
});

router.put('/setATMLimit/', function(request, response) {
    automat.setATMLimit(request.body, function(err, data) {
        if(err) {
            console.log(err);
            response.json(err);
        }
        else {
            console.log(data);
            response.json("success");
        }
    });
});


module.exports = router;
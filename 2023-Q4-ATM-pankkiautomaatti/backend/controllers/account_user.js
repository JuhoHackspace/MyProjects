const express = require("express");
const router = express.Router();
const account = require('../models/account_user_model');

router.get('/', function(request, response) {
    account.getAllAccountUsers(function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.get('/:id', function(request, response) {
    account.getOneAccountUser(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

router.delete('/:id', function(request, response) {
    account.deleteAccountUser(request.params.id, function(err, data) {
        if(err) {
            response.json(err);
        }
        else {
            response.json(data);
        }
    });
});

// put
// post 

module.exports = router;
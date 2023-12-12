const db = require("../database");

const account_user = {
    getAllAccountUsers: function(callback) {
        return db.query("SELECT * FROM accountuser",callback);
    },
    getOneAccountUser: function(id, callback) {
        return db.query("SELECT * FROM accountuser WHERE id_accountuser=?",[id],callback);
    },
    deleteAccountUser: function(id, callback) {
        return db.query("DELETE FROM accountuser WHERE id_accountuser=?",[id],callback);
    }
    
    // put
    // post 
};

module.exports = account_user;
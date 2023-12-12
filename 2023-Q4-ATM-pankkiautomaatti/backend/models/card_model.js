const db = require("../database");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const card = {
    getAllCards: function(callback) {
        return db.query("SELECT * FROM card",callback);
    },
    getOneCard: function(id, callback) {
        return db.query("SELECT type FROM card WHERE id_card=?",[id],callback);
    },
    addCard: function(newData, callback) {
        bcrypt.hash(newData.pin, saltRounds, function(err, hashedPin) {
            return db.query("INSERT INTO card(type,pin,id_user,attempts) VALUES(?,?,?,?)",
            [newData.type,hashedPin,newData.id_user,newData.attempts],
            callback);
        });    
    },
    updateCard: function(id, newData, callback) {
        bcrypt.hash(newData.pin, saltRounds, function(err, hashedPin) {
            return db.query("UPDATE card SET type=?,pin=?,id_user=?,attempts=? WHERE id_card=?",
            [newData.type,hashedPin,newData.id_user,newData.attempts, id],
            callback);
        });    
    },
    updatePin: function(id, newPin, callback) {
        bcrypt.hash(newPin, saltRounds, function(err, hashedPin) {
            return db.query("UPDATE card SET pin=? where id_card=?",
            [hashedPin,id],callback);
        });
    },
    checkPin: function(id, callback) {
        return db.query("SELECT pin FROM card WHERE id_card=?",[id],callback);
    },
    deleteCard: function(id, callback) {
        return db.query("DELETE FROM card WHERE id_card=?",[id],callback);
    },
    checkAttempts: function(id, callback) {
        return db.query("SELECT attempts FROM card WHERE id_card=?",[id], callback);
    },
    addAttempt: function(cardID, automatID, callback) {
        return db.query("call addAttemptAndLog(?,?)",[cardID,automatID],callback);
    },
    clearAttempts: function(cardID, automatID, callback) {
        return db.query("call clearAttemptsAndLog(?,?)", [cardID,automatID], callback);
    }


};

module.exports = card;
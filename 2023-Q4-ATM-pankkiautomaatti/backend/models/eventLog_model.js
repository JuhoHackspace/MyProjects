const db = require('../database');

const eventLog={
    getEventData: function(callback){
        return db.query("SELECT * FROM eventlog", callback);
    },
    getOneEvent: function(id, callback){
        return db.query("SELECT * FROM eventlog where id_event=?", [id], callback);
    },
    addLogoutEvent: function(newEvent, callback){
        return db.query("call logout(?,?)",
         [newEvent.id_automat, newEvent.id_card], callback);
    },
    getEventsByAccountId: function(id_account, offset, callback) {
        return db.query("SELECT * FROM eventlog WHERE id_account=? AND event_type='withdrawal' ORDER BY time desc, id_event desc LIMIT 5 OFFSET ?",
        [id_account, offset], callback);
    },

    getEventsCountByAccountId: function(id_account, callback) {
        return db.query("SELECT count(id_account) as countEvents FROM eventlog WHERE id_account=? AND event_type='withdrawal'",
        [id_account], callback);
    },
    getAllEvents: function(offset, automatID, callback) {
        return db.query("SELECT * FROM eventlog WHERE id_automat=? ORDER BY time desc, id_event desc LIMIT 5 OFFSET ?", [automatID, offset], callback);
    },
    getEventsCountByEventId: function(automatID, callback) {
        return db.query("SELECT count(id_event) as countEvents FROM eventlog WHERE id_automat=?",[automatID], callback);
    }
};

module.exports=eventLog;

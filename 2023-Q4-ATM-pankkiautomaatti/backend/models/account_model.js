const db = require("../database");

const account = {
    getAllAccounts: function(callback) {
        return db.query("SELECT * FROM account",callback);
    },
    getOneAccount: function(id, callback) {
        return db.query("SELECT * FROM account WHERE id_account=?",[id],callback);
    },
    addAccount: function(newData, callback) {
        return db.query("INSERT INTO account(account_nmbr,bank_name,account_type,balance,max_withdrawal_per_day,credit_limit) VALUES(?,?,?,?,?,?)",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit],
        callback);
    },
    updateAccount: function(id, newData, callback) {
        return db.query("UPDATE account SET account_nmbr=?,bank_name=?,account_type=?,balance=?,max_withdrawal_per_day=?,credit_limit=? WHERE id_account=?",
        [newData.account_nmbr,newData.bank_name,newData.account_type,newData.balance,newData.max_withdrawal_per_day,newData.credit_limit,id],
        callback);
    },
    deleteAccount: function(id, callback) {
        return db.query("DELETE FROM account WHERE id_account=?",[id],callback);
    },
    getAccountInfoByCardID: function(cardInfo, callback) {
        return db.query("SELECT firstname, lastname, bank_name, account_nmbr, balance FROM account INNER JOIN accountuser ON account.id_account = accountuser.id_account INNER JOIN user ON user.id_user = accountuser.id_user WHERE accountuser.id_card=? AND account.account_type=?",
        [cardInfo.id_card,cardInfo.account_type],callback);
    },
    getAccountID: function(id_card, account_type, callback) {
        return db.query("SELECT account.id_account FROM account INNER JOIN accountuser ON account.id_account = accountuser.id_account WHERE accountuser.id_card=? AND account.account_type=?",
        [id_card, account_type], callback);
    },
    getBalance: function(id, callback) {
        return db.query("SELECT balance, credit_limit FROM account WHERE id_account=?",[id],callback);
    },

    attemptWithdrawal: function(values, callback) {
        return db.query("call checkLimitAndWithdraw(?,?,?,?)", [values.id_account, values.id_card, values.id_automat, values.amount], callback);
    }

};

module.exports = account;
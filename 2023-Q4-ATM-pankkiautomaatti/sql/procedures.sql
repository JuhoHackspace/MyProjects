DELIMITER //
CREATE PROCEDURE withdrawal(IN account_nbr INT, IN id_card INT, IN automat_nbr INT, IN w_balance INT)
BEGIN
  DECLARE test1, test2 INT DEFAULT 0;
  DECLARE amount INT;
  DECLARE bal_100, bal_50, bal_20, bal_10 INT DEFAULT 0;
  SET amount=w_balance;
  	IF ((select balance_10 from automat where id_automat = automat_nbr)=0 AND amount%20>0 AND amount>50) THEN 
		SET amount=amount-50;
		SET bal_50=1;
		SET bal_100 = LEAST((SELECT balance_100 from automat where id_automat = automat_nbr), (amount / 100)-0.49);
		SET amount=amount-bal_100*100;
		SET bal_20 = LEAST((SELECT balance_20 from automat where id_automat = automat_nbr), (amount / 20)-0.49);
		SET amount=amount-bal_20*20;
	
	ELSE
  		SET bal_100 = LEAST((SELECT balance_100 from automat where id_automat = automat_nbr), (amount / 100)-0.49);
  		SET amount=amount-bal_100*100;
  		SET bal_50 = LEAST((SELECT balance_50 from automat where id_automat = automat_nbr), (amount / 50)-0.49);
  		SET amount=amount-bal_50*50;
  		SET bal_20 = LEAST((SELECT balance_20 from automat where id_automat = automat_nbr), (amount / 20)-0.49);
  		SET amount=amount-bal_20*20;
  		SET bal_10 = LEAST((SELECT balance_10 from automat where id_automat = automat_nbr), (amount / 10)-0.49);
  		SET amount=amount-bal_10*10;
	END IF;	
	
	IF (amount > 0) THEN
		INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
			VALUES(automat_nbr,account_nbr,id_card,'withdrawal attempt, not enough bills', w_balance, NOW());
		SELECT 'not enough bills' as result;
	ELSE
		START TRANSACTION;
  		BEGIN
		UPDATE account SET balance = balance - w_balance
		WHERE id_account = account_nbr AND balance + credit_limit - w_balance >=0;
		SET test1=ROW_COUNT();
		UPDATE automat SET balance_100=balance_100-bal_100, balance_50=balance_50-bal_50, balance_20=balance_20-bal_20, 
		balance_10=balance_10-bal_10 WHERE id_automat=automat_nbr;
		SET test2=ROW_COUNT();
    		END;
	
			IF (test1 > 0 AND test2 >0) THEN
				COMMIT;
	  			INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
				VALUES(automat_nbr, account_nbr,id_card,'withdrawal', w_balance, NOW());
                		SELECT 'withdrawal ok' as result;
                
			ELSE
	  			ROLLBACK;
	  			INSERT INTO eventlog(id_automat,id_account, id_card, event_type, amount, time) 
					VALUES(automat_nbr, account_nbr,id_card,'withdrawal attempt, not enough', w_balance, NOW());
                		SELECT 'not enough balance' as result;    
			END IF;
	END IF;
END //
DELIMITER ;

DELIMITER //
create procedure checkLimitAndWithdraw(IN accountID INT, IN cardID INT, IN automatNmbr INT, IN w_amount INT)
begin
DECLARE withdrawn_today INT DEFAULT 0;
DECLARE daily_limit INT DEFAULT 0;
SELECT sum(amount) into withdrawn_today from eventlog where id_account = accountID and DATE(time) = CURRENT_DATE and event_type = 'withdrawal';
SELECT max_withdrawal_per_day into daily_limit FROM account where id_account = accountID;
IF(withdrawn_today IS NULL) THEN
	set withdrawn_today = 0;
END IF;
IF((daily_limit - withdrawn_today) >= w_amount) THEN
	call withdrawal(accountID, cardID, automatNmbr, w_amount);
ELSE
	SELECT 'account limit exceeded' as result;
END IF;	    
end //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE addAttemptAndLog(IN cardID INT, IN automatID INT)
begin
declare cnt_attempts INT default 0;
UPDATE card SET attempts = attempts+1 WHERE id_card = cardID;
INSERT INTO eventlog(id_automat, id_card, event_type, time) VALUES(automatID, cardID, "login attempt", NOW());
select attempts into cnt_attempts from card where id_card = cardID;
IF(cnt_attempts = 3) THEN
	INSERT INTO eventlog(id_automat, id_card, event_type, time) VALUES(automatID, cardID, "card locked", NOW());
END IF;
end//
DELIMITER ;

DELIMITER //
CREATE PROCEDURE clearAttemptsAndLog(IN cardID INT, IN automatID INT)
begin
UPDATE card SET attempts = 0 WHERE id_card = cardID;
INSERT INTO eventlog(id_automat, id_card, event_type, time) VALUES(automatID, cardID, "login", NOW());
end//
DELIMITER ;

DELIMITER //
create procedure logout(IN automatNmbr INT, IN cardID INT)
begin
insert into eventlog(id_automat, id_card, event_type, time) values(automatNmbr, cardID, "logout", NOW());
end//
DELIMITER ;


DELIMITER //
create procedure addMoneyAndLog(IN automatNmbr INT, IN cardID INT, IN denomination INT, IN amount INT)
begin
IF(denomination = 10) THEN
	update automat set balance_10 = balance_10 + amount where id_automat = automatNmbr;
    insert into eventlog(id_automat, id_card, event_type, amount, time) values(automatNmbr, cardID, "added money 10", amount, NOW());
ELSEIF(denomination = 20) THEN
	update automat set balance_20 = balance_20 + amount where id_automat = automatNmbr;
    insert into eventlog(id_automat, id_card, event_type, amount, time) values(automatNmbr, cardID, "added money 20", amount, NOW());
ELSEIF(denomination = 50) THEN
	update automat set balance_50 = balance_50 + amount where id_automat = automatNmbr;
    insert into eventlog(id_automat, id_card, event_type, amount, time) values(automatNmbr, cardID, "added money 50", amount, NOW());
ELSE
	update automat set balance_100 = balance_100 + amount where id_automat = automatNmbr;
    insert into eventlog(id_automat, id_card, event_type, amount, time) values(automatNmbr, cardID, "added money 100", amount, NOW());
END IF;
end//
DELIMITER ;

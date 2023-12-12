use bank_automat;

# Suorita, jos haluat esim. poistaa testidatan ja ajaa sen puhtaana sisään

SET SQL_SAFE_UPDATES = 0;

ALTER TABLE `eventlog` DROP FOREIGN KEY `event_account`;
ALTER TABLE `eventlog` ADD CONSTRAINT `event_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE CASCADE;
ALTER TABLE `card` DROP FOREIGN KEY `card_user`;
ALTER TABLE `card` ADD CONSTRAINT `card_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE CASCADE;

delete from accountuser;
delete from account;
delete from user;
delete from automat;
delete from card;
delete from eventlog;

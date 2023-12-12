use bank_automat;

--
-- Insert test data into tables 
--

ALTER TABLE  `user` AUTO_INCREMENT = 1;
INSERT INTO `user` (`firstname`, `lastname`, `address`, `city`) 
VALUES 
('Sofia','Virtanen','Ruusukatu 12','Helsinki'),
('Markus','Mustonen','Tammentie 34','Tampere'),
('Anni','Koivisto','Kuuselantie 7','Turku'),
('Mikko','Laaksonen','Kalliotie 21','Oulu'),
('Simo','Järvinen','Mäntyläntie 3','Jyväskylä'),
('Laura','Järvinen','Mäntyläntie 3','Jyväskylä'),
('Juha','Ranta','Merenranta 9','Vaasa'),
('Elina','Koskinen','Koiranta 3','Rovaniemi'),
('Tapani','Matalamäki','Pielitie 4','Helsinki'),
('Juuso','Neulanen','Sorvarannankatu 1','Espoo'),
('Miki','Kolttinen','Tietokatu 42','Janakkala'),
('Emilia','Metso','Isokiesinkuja 3','Porvoo'),
('Risto','Rievä','Kuiluntie 3','Espoo'),
('Jonna-Maria','Älyhoikko','Sirppitie 8','Kotka'),
('Eevertti','Teurasvaara','Helakatu 10','Loviisa'),
('Esko','Isotuuli','Pinojoenreuna 2','Turku'),
('Lauriina','Halkonen','Lepokatu 2','Vaasa'),
('Paavo','Tietty','Pankkiirintie 15','Pirkkala'),
('Mauri','Ala-Vesko','Sieväkatu 9','Tampere'),
('Tiina','Tärskynen','Pikkuhiirunkuja 2','Kangasala'),
('ROBOT','FRAMEWORK','AUTOMATION','TESTING'),
('Lassi','Järvinen','Mäntyläntie 3','Jyväskylä');

ALTER TABLE  `account` AUTO_INCREMENT = 1;
INSERT INTO `account` (`account_nmbr`, `bank_name`, `account_type`, `balance`, `max_withdrawal_per_day`, `credit_limit`) 
VALUES
('FI6757406151000966','OP','debit',337460.00,1500,0.00),
('FI4518512110001009','Nordea','debit',575.00,900,0.00),
('FI4356350869000747','OP','credit',0.00,400,8000.00),
('FI8124472240001985','Nordea','credit',0.00,500,4000.00),
('FI0888221250006035','Danske','debit',2443.00,800,0.00),
('FI9557008180000601','OP','debit',136700.00,900,0.00),
('FI2047826257000011','POP','credit',0.00,100,1000.00),
('FI1924662630002698','Nordea','credit',0.00,300,1000.00),
('FI2085184780009213','Danske','debit',486.00,500,0.00),
('FI8151109395000935','OP','credit',0.00,400,1000.00),
('FI8247876568000341','POP','debit',648.00,200,0.00),
('FI6864368220006138','Ålandsbanken','debit',58.00,500,0.00),
('FI0431470740000938','Handelsbanken','credit',0.00,400,2000.00),
('FI9688806580005721','Danske','debit',1287.00,600,0.00),
('FI9334879810009677','Danske','debit',10600.52,150,0.00),
('FI8347735554000063','Danske','debit',26.75,400,0.00),
('FI5734526830003939','Danske','credit',0.00,1000,5000.00),
('FI2986096610007853','Danske','debit',13.00,1200,0.00),
('FI9639417620006834','S-Pankki','debit',27654.28,500,0.00),
('FI4558506014000738','OP','debit',245.78,200,0.00),
('FI7936819450006748','S-Pankki','debit',6709.23,900,0.00),
('FI1739670770007438','S-Pankki','credit',0.00,400,7500.00),
('FI9347825117000377','S-Pankki','credit',0.00,500,2000.00),
('FI2540531573000508','Aktia Pankki','debit',45501.89,800,0.00),
('FI8939336190007453','S-Pankki','debit',765.12,900,0.00),
('FI8814044420008171','Nordea','credit',0.00,100,4500.00),
('FI5436267120007813','S-Pankki','credit',0.00,300,5000.00),
('FI0652695467000349','OP','debit',8765.43,500,0.00),
('FI4634734620007488','Danske','debit',1098.76,400,0.00),
('FI5371354040002664','Citibank','debit',5432.1,200,0.00),
('FI7434884180001833','Danske','debit',9876.54,500,0.00),
('FI5136646110005921','S-Pankki','debit',3210.98,400,0.00),
('FI0931444250001479','Handelsbanken','credit',0.00,600,5500.00),
('FI2817508830004274','Nordea','credit',0.00,200,2500.00),
('FI2058147944000215','OP','debit',210.34,200,0.00),
('FI4617868230001217','Nordea','debit',876.98,900,0.00),
('FI0241037528000162','Säästöpankki','credit',0.00,400,8000.00),
('FI9436341760008637','S-Pankki','credit',0.00,500,1500.00),
('FI1240527740000249','Aktia','debit',2345.67,800,0.00),
('FI3836856950000003','S-Pankki','credit',0.00,900,6500.00),
('FI6468109990001107','Ålandsbanken','debit',543.21,1000,0.00),
('FI4856071711000053','OP','debit',789.12,300,0.00),
('FI2631211790006155','Handelsbanken','credit',0.00,500,3000.00),
('FI0842127633000899','Säästöpankki','debit',8765.21,400,0.00),
('FI2034651590004701','Danske','debit',1098.43,200,0.00),
('FI8436757750000666','S-Pankki','debit',65423.87,500,0.00),
('FI4287175370001857','Danske','credit',0.00,400,9000.00),
('FI4582799790005969','Danske','debit',4321.09,600,0.00),
('FI5268695660000882','Ålandsbanken','debit',5678.90,1500,0.00),
('ROBOTFW','AUTOMATION TESTING','admin',0.00,0,0.00);

SELECT id_user FROM user;

-- || jos tarvii hashata uudestaan, niin ||
-- || cmd : curl localhost:3000/login/1234 ||
-- || 1234 tilalle pin koodi ||
ALTER TABLE  `card` AUTO_INCREMENT = 1;
INSERT INTO `card` (`type`, `pin`, `id_user`, `attempts`) 
VALUES
-- pin:
-- 9447
('debit','$2a$10$.sd7wgEvDqYVovZGCekutOJWmuT/UbSkKnziiHJ/PEHjLNpcGvT/2',1,0),
-- 5860 
('debit','$2a$10$aN/zewaV8CL3jYQE0I/LA.P0IZVMUBm7WKaB9x30zNCc2GtBgJYI6',2,0),
-- 1733
('credit','$2a$10$SeSnzNgfIHcRN762pVzP.eTxHAZ54PUTJU9/Oe4nbwgXpr9L2A1tW',3,0),
-- 4322
('debit','$2a$10$L98HWiHh.p6fc7uPQ2tOfu9lfnAjseztEqHnNZNBuk7wBOX0Ij12K',4,0),
-- 8254
('debit','$2a$10$7Hl048Rp2TMEddzMB9qETuoTFQ.5uneik2pM0086kIG1s7wifP06m',5,0),
-- 1998
('debit','$2a$10$GOgKGbGAvblTl22mQxKqgeUzPB0MUghbKjxSH8vVoZGnFPl4/344C',6,0),
-- 3002
('debit','$2a$10$8bklPdiOMp.BCBSn6lNg9O3UTYVno.5ExTcUDulwkjw10YdvdhIWa',7,0),
-- 4105
('debit','$2a$10$ro6qAViOdugq04jedNuq8upRjurImj7gaFnGQuhd/5kGMRv6CCmmW',8,0),
-- 4809
('admin','$2a$10$5sceyVyziaaxRoG8zBcY8eSlJP04QF.8DN5R8Nid0WDCi6JD2ewwO',1,0),
-- 3944
('credit','$2a$10$djftLN657IIIug90A8vDde.ZSlkZpUt6bIUbbql8.UOgq2GqT1GCK',9,0),
-- 4755
('debit','$2a$10$Teau3aLIyl9Dy08zn2zzSONUDwLxGP22XwC2zyH6qaeUpNP/V8Ef2',4,0),
-- 3226
('debit','$2a$10$L2NjIxmvQucEX9RrkriBwOSURd0ITBV8XXfodVqEDccWU6ibNhS7y',5,0),
-- 6499
('debit','$2a$10$dmjQcu7P/rwChhhl.56foelwJsPXs3cAfgmKGYcqIoqQ4LNOwsuta',10,0),
-- 6877
('debit','$2a$10$D9MmIjAh7/DXQXqFkYsVb.HYqTCyV382a9yBYnI50Cuxe4SziIIpu',14,0),
-- 2331
('debit','$2a$10$u32TnvdQIETlYkgTZzMwQuHxZCDWcmSPGMmgF6XR1uJjMxhvwxoM6',15,0),
-- 3422
('credit/debit','$2a$10$XWrBB4kQnUFZId6iwm7IQu1YypE8HoIlIjxiCUjjeTwQOJDCzgegC',13,0),
-- 1665
('debit','$2a$10$VU4azfFqhbugRWZOwC0XwOkT5JV/WmC030O5ZEpc08YF0Z3jN4ar.',11,0),
-- 2942
('debit','$2a$10$NnQbWtK0rEsdtyShz/plGeGc/bC8M2WBFVRnWVdJt.iDb.BCM6Rq6',17,0),
-- 2498
('debit','$2a$10$6Bn88h6C4vGFsseK7XycFu.BGLg6PqelNWc.ZexptgTUxYiqvwTTu',19,0),
-- 2452
('admin','$2a$10$R7fw5jpjUmQfv0bbF8cbH.syU//LfWu7PchSvX/6Dya8nMOYIIhNO',20,0);

# esim. käyttäjällä 19 on nyt kortti (16) kahteen tiliin (30) debit (33) credit
# esim. käyttäjällä 2 ja 3 on yhteinen tili (2) debit
# esim. käyttäjällä 4 ja 5 on yhteinen tili (5) debit
# esim. käyttäjillä 7 ja 11 admin  oikeudet 
ALTER TABLE  `accountuser` AUTO_INCREMENT = 1;
# /id_user /id_card /id_account
INSERT INTO `accountuser` ( `id_user`, `id_card`, `id_account`) 
VALUES
(1,1,1),
(2,2,2),
(3,3,3),
(4,4,5),
(5,5,6),
(6,6,6),
(7,7,11),
(8,8,12),
(1,9,null),
(9,10,4),
(4,11,14),
(5,5,15),
(10,13,16),
(14,14,18),
(15,15,19),
(13,16,7),
(13,16,20),
(11,17,21),
(17,18,24),
(19,19,25),
(20,20,null),
(22,null,31),
(5,5,31);

ALTER TABLE  `automat` AUTO_INCREMENT = 1;
INSERT INTO `automat` (`balance_10`, `balance_20`, `balance_50`, `balance_100`, `max_withdrawal`) 
VALUES
(45, 14, 21, 0, 500),
(60, 76, 79, 2, 500),
(70, 90, 55, 50, 500),
(110, 100, 82, 39, 500);

INSERT INTO `eventlog` (`id_automat`, `id_account`, `id_card`, `event_type`, `amount`, `time`) 
VALUES 

(1,1,1,'withdrawal',510,'2023-09-01 22:20:44'),
(2,1,1,'withdrawal',1230,'2023-08-28 15:25:27'),
(3,1,1,'withdrawal',1710,'2023-05-30 06:30:25'),
(4,1,1,'withdrawal',1620,'2023-04-15 00:41:03'),
(1,1,1,'withdrawal',360,'2023-05-09 01:53:57'),
(4,2,2,'withdrawal',20,'2023-01-24 14:05:28'),
(1,2,2,'withdrawal',620,'2023-10-17 14:27:28'),
(4,2,2,'withdrawal',40,'2023-06-04 21:50:09'),
(1,2,2,'withdrawal',1900,'2023-05-06 09:41:20'),
(1,2,2,'withdrawal',50,'2023-02-28 04:37:37'),
(4,3,3,'withdrawal',1400,'2023-05-20 21:28:46'),
(2,3,3,'withdrawal',550,'2023-08-27 11:29:57'),
(4,3,3,'withdrawal',1190,'2023-09-18 12:37:34'),
(3,3,3,'withdrawal',1440,'2023-10-13 03:18:22'),
(4,3,3,'withdrawal',1560,'2023-09-02 11:47:12'),
(1,3,3,'withdrawal',20,'2023-07-23 05:42:39'),
(3,3,3,'withdrawal',1860,'2023-11-18 06:23:47'),
(2,5,4,'withdrawal',370,'2023-02-28 06:02:23'),
(2,5,4,'withdrawal',600,'2023-08-27 10:43:58'),
(3,5,4,'withdrawal',160,'2023-07-10 10:28:58'),
(2,5,4,'withdrawal',1460,'2023-08-14 11:19:09'),
(3,6,5,'withdrawal',1910,'2023-04-26 04:46:45'),
(2,6,5,'withdrawal',510,'2023-07-09 14:52:54'),
(3,6,5,'withdrawal',590,'2023-10-12 08:11:33'),
(1,6,5,'withdrawal',1970,'2023-12-02 20:10:10'),
(3,6,5,'withdrawal',610,'2023-06-21 21:38:50'),
(4,6,6,'withdrawal',1950,'2023-12-08 10:38:35'),
(4,6,6,'withdrawal',1030,'2023-08-31 10:30:16'),
(4,6,6,'withdrawal',120,'2023-01-27 13:30:18'),
(4,6,6,'withdrawal',1260,'2023-07-11 19:31:33'),
(1,6,6,'withdrawal',1880,'2023-09-08 04:19:15'),
(1,4,10,'withdrawal',1530,'2023-06-30 07:05:33'),
(1,4,10,'withdrawal',630,'2023-02-07 01:19:42'),
(3,4,10,'withdrawal',460,'2023-03-26 14:24:31'),
(4,4,10,'withdrawal',1100,'2023-05-03 06:26:20'),
(1,4,10,'withdrawal',980,'2023-11-04 04:10:34'),
(1,7,16,'withdrawal',920,'2023-12-07 01:57:41'),
(1,7,16,'withdrawal',1190,'2023-06-25 01:42:23'),
(2,7,16,'withdrawal',1190,'2023-02-02 16:49:38'),
(1,7,16,'withdrawal',210,'2023-08-12 12:49:25'),
(3,7,16,'withdrawal',1070,'2023-04-16 11:24:20'),
(1,11,7,'withdrawal',840,'2023-07-05 00:12:12'),
(4,11,7,'withdrawal',300,'2023-06-11 14:01:09'),
(3,11,7,'withdrawal',1350,'2023-05-09 05:13:27'),
(3,11,7,'withdrawal',1160,'2023-05-01 01:48:01'),
(2,11,7,'withdrawal',380,'2023-01-03 05:57:52'),
(1,12,8,'withdrawal',300,'2023-10-18 07:28:28'),
(1,12,8,'withdrawal',1330,'2023-02-10 19:19:49'),
(3,12,8,'withdrawal',150,'2023-09-07 10:41:57'),
(3,12,8,'withdrawal',1430,'2023-07-09 19:58:00'),
(4,12,8,'withdrawal',510,'2023-01-11 06:18:12'),
(1,12,8,'withdrawal',880,'2023-03-09 07:17:53'),
(3,14,11,'withdrawal',730,'2023-10-07 09:46:53'),
(1,14,11,'withdrawal',820,'2023-09-30 16:31:49'),
(1,14,11,'withdrawal',830,'2023-02-12 08:58:50'),
(2,14,11,'withdrawal',1960,'2023-02-14 06:57:28'),
(1,14,11,'withdrawal',1660,'2023-08-25 06:40:08'),
(3,14,11,'withdrawal',250,'2023-01-07 22:10:46'),
(1,15,12,'withdrawal',1300,'2023-01-26 01:21:41'),
(4,15,12,'withdrawal',1040,'2023-03-27 23:37:03'),
(1,15,12,'withdrawal',1900,'2023-08-17 09:17:06'),
(4,15,12,'withdrawal',1330,'2023-08-12 12:17:38'),
(3,15,12,'withdrawal',1420,'2023-09-27 16:20:49'),
(3,15,12,'withdrawal',40,'2023-10-24 03:09:05'),
(2,15,12,'withdrawal',1740,'2023-03-03 14:36:56'),
(3,15,12,'withdrawal',1400,'2023-09-08 04:05:14'),
(1,16,13,'withdrawal',760,'2023-01-18 20:53:41'),
(1,16,13,'withdrawal',1730,'2023-08-07 03:25:41'),
(1,16,13,'withdrawal',940,'2023-07-16 10:03:24'),
(1,16,13,'withdrawal',1720,'2023-06-12 15:44:54'),
(1,16,13,'withdrawal',1040,'2023-08-02 19:26:08'),
(3,16,13,'withdrawal',1020,'2023-07-16 16:21:08'),
(1,16,13,'withdrawal',1880,'2023-03-02 23:53:39'),
(2,16,13,'withdrawal',200,'2023-02-02 14:15:20'),
(3,16,13,'withdrawal',290,'2023-04-15 11:23:19'),
(3,16,13,'withdrawal',450,'2023-04-05 03:28:01'),
(4,16,13,'withdrawal',50,'2023-07-26 16:02:40'),
(3,18,14,'withdrawal',400,'2023-02-06 10:46:52'),
(3,18,14,'withdrawal',1430,'2023-02-25 16:45:32'),
(2,18,14,'withdrawal',1090,'2023-01-02 21:30:15'),
(1,18,14,'withdrawal',550,'2023-04-11 17:03:49'),
(3,18,14,'withdrawal',520,'2023-10-27 23:21:01'),
(3,18,14,'withdrawal',1850,'2023-11-26 19:10:12'),
(1,18,14,'withdrawal',1470,'2023-05-02 19:32:40'),
(2,18,14,'withdrawal',690,'2023-05-31 16:10:53'),
(3,18,14,'withdrawal',800,'2023-06-11 03:25:44'),
(1,19,15,'withdrawal',880,'2023-09-22 14:40:10'),
(4,19,15,'withdrawal',1080,'2023-08-28 18:21:44'),
(1,19,15,'withdrawal',1470,'2023-11-25 14:07:23'),
(3,19,15,'withdrawal',950,'2023-04-28 07:14:11'),
(3,20,16,'withdrawal',330,'2023-07-23 15:01:20'),
(2,20,16,'withdrawal',830,'2023-08-02 13:08:22'),
(1,20,16,'withdrawal',1740,'2023-01-13 15:53:59'),
(2,20,16,'withdrawal',1650,'2023-10-07 23:49:46'),
(4,21,17,'withdrawal',560,'2023-06-26 23:56:54'),
(1,21,17,'withdrawal',1240,'2023-05-18 11:53:31'),
(2,24,18,'withdrawal',340,'2023-10-18 10:32:39'),
(1,25,19,'withdrawal',1390,'2023-06-19 19:03:09'),
(2,24,18,'withdrawal',820,'2023-04-22 12:38:44'),
(2,25,19,'withdrawal',290,'2023-09-19 11:47:32'),
(1,21,17,'withdrawal',1020,'2023-10-11 16:51:18');


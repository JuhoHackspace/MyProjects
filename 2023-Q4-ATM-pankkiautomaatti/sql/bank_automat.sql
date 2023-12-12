-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: banaccountk_automataccountid_accountid_userfirstnamePRIMARYaccountuserid_user
-- ------------------------------------------------------
-- Server version	8.0.31


create database if not exists bank_automat;

use bank_automat;

-- SET time_zone = 'Europe/Helsinki';

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `id_account` int NOT NULL AUTO_INCREMENT,
  `account_nmbr` char(18),
  `bank_name` varchar(255),
  `account_type` enum('credit','debit', 'admin') NOT NULL DEFAULT 'debit',
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `max_withdrawal_per_day` int NOT NULL DEFAULT '300',
  `credit_limit` decimal(15,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id_account`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `accountuser`
--

DROP TABLE IF EXISTS `accountuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accountuser` (
  `id_accountUser` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_card` int DEFAULT NULL,
  `id_account` int DEFAULT NULL,
  PRIMARY KEY (`id_accountUser`),
  KEY `accountUser_user_idx` (`id_user`),
  KEY `accountUser_card_idx` (`id_card`),
  KEY `accountUser_account_idx` (`id_account`),
  CONSTRAINT `accountUser_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `accountUser_card` FOREIGN KEY (`id_card`) REFERENCES `card` (`id_card`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `accountUser_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accountuser`
--

LOCK TABLES `accountuser` WRITE;
/*!40000 ALTER TABLE `accountuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `accountuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `automat`
--

DROP TABLE IF EXISTS `automat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `automat` (
  `id_automat` int NOT NULL AUTO_INCREMENT,
  `balance_10` int NOT NULL,
  `balance_20` int NOT NULL,
  `balance_50` int NOT NULL,
  `balance_100` int NOT NULL,
  `max_withdrawal` int NOT NULL DEFAULT '500',
  PRIMARY KEY (`id_automat`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `automat`
--

LOCK TABLES `automat` WRITE;
/*!40000 ALTER TABLE `automat` DISABLE KEYS */;
/*!40000 ALTER TABLE `automat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `card`
--

DROP TABLE IF EXISTS `card`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `card` (
  `id_card` int NOT NULL AUTO_INCREMENT,
  `type` enum('credit','debit','credit/debit','admin') NOT NULL DEFAULT 'debit',
  `pin` varchar(255) NOT NULL,
  `id_user` int NOT NULL,
  `attempts` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id_card`),
  KEY `card_user_idx` (`id_user`),
  CONSTRAINT `card_user` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `card`
--

LOCK TABLES `card` WRITE;
/*!40000 ALTER TABLE `card` DISABLE KEYS */;
/*!40000 ALTER TABLE `card` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventlog`
--

DROP TABLE IF EXISTS `eventlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventlog` (
  `id_event` int NOT NULL AUTO_INCREMENT,
  `id_automat` int NOT NULL,
  `id_account` int DEFAULT NULL,
  `id_card` int NOT NULL,
  `event_type` varchar(45) NOT NULL,
  `amount` decimal(15,2) DEFAULT NULL,
  `time` timestamp NOT NULL,
  PRIMARY KEY (`id_event`),
  KEY `event_automat_idx` (`id_automat`),
  KEY `automat_card_idx` (`id_card`),
  KEY `automat_account_idx` (`id_account`),
  CONSTRAINT `event_account` FOREIGN KEY (`id_account`) REFERENCES `account` (`id_account`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `event_automat` FOREIGN KEY (`id_automat`) REFERENCES `automat` (`id_automat`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `event_card` FOREIGN KEY (`id_card`) REFERENCES `card` (`id_card`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventlog`
--

LOCK TABLES `eventlog` WRITE;
/*!40000 ALTER TABLE `eventlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id_user` int NOT NULL AUTO_INCREMENT,
  `firstname` varchar(45) NOT NULL,
  `lastname` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `city` varchar(45) NOT NULL,
  PRIMARY KEY (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-11-08 13:38:07

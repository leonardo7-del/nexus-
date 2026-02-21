-- MySQL dump 10.13  Distrib 8.0.45, for Linux (x86_64)
--
-- Host: localhost    Database: database_login
-- ------------------------------------------------------
-- Server version	8.0.45-0ubuntu0.24.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned DEFAULT NULL,
  `action` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `details` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `audit_logs_user_id_foreign` (`user_id`),
  CONSTRAINT `audit_logs_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=191 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,3,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmai.com\"}','2026-02-18 04:42:41'),(34,7,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"marianita01986@gmail.com\"}','2026-02-19 05:31:00'),(35,7,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":19}','2026-02-19 05:33:42'),(36,7,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"marianita01986@gmail.com\"}','2026-02-19 05:34:58'),(39,NULL,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"deyvismachco@gmail.com\"}','2026-02-19 05:43:46'),(40,8,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"deyvismachco@gmail.com\"}','2026-02-19 05:44:12'),(41,8,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":22}','2026-02-19 05:46:41'),(42,9,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"ale.manrique190@gmail.com\"}','2026-02-19 06:48:41'),(43,9,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":23}','2026-02-19 06:49:02'),(60,NULL,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-20 09:36:11'),(61,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-20 09:43:10'),(62,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":32}','2026-02-20 09:43:23'),(63,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:23:04'),(64,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":33}','2026-02-21 01:23:16'),(65,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:25:04'),(66,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:25:08'),(67,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:25:26'),(68,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":34}','2026-02-21 01:25:58'),(69,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:27:37'),(70,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":35}','2026-02-21 01:27:54'),(71,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 01:51:23'),(72,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":41}','2026-02-21 01:51:34'),(73,11,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"popige5214@bitonc.com\"}','2026-02-21 01:58:15'),(74,11,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":43}','2026-02-21 01:58:42'),(75,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:06:23'),(76,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":45}','2026-02-21 02:06:43'),(77,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:21:05'),(78,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:21:12'),(79,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":46}','2026-02-21 02:21:26'),(80,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:22:18'),(81,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:22:26'),(82,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":48}','2026-02-21 02:22:33'),(83,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 02:28:32'),(84,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 02:28:56'),(85,11,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"popige5214@bitonc.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 02:29:42'),(86,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:35:03'),(87,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:35:53'),(88,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":51}','2026-02-21 02:36:01'),(89,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:36:09'),(90,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:36:12'),(91,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:36:13'),(92,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:36:15'),(93,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 02:36:17'),(94,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:39:15'),(95,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:39:21'),(96,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:39:23'),(97,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:39:38'),(98,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":52}','2026-02-21 02:39:47'),(99,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:40:36'),(100,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:40:45'),(101,10,'OTP_VERIFICATION_FAILED','127.0.0.1','{\"reason\":\"invalid_code\"}','2026-02-21 02:40:53'),(102,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":54}','2026-02-21 02:41:02'),(103,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 02:41:55'),(104,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":56}','2026-02-21 02:42:00'),(105,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 03:52:17'),(106,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 03:53:03'),(107,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":58}','2026-02-21 03:53:13'),(108,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 03:59:42'),(109,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":59}','2026-02-21 03:59:52'),(110,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:05:31'),(111,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:05:34'),(112,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:05:36'),(113,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:05:44'),(114,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":61}','2026-02-21 04:05:55'),(115,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:23:45'),(116,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":62}','2026-02-21 04:23:52'),(117,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:10'),(118,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":63}','2026-02-21 04:29:16'),(119,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:42'),(120,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:45'),(121,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:47'),(122,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:50'),(123,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:29:53'),(124,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 04:29:55'),(125,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 04:30:04'),(126,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 04:31:04'),(127,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 04:31:49'),(128,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":65}','2026-02-21 04:31:57'),(129,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 08:10:12'),(130,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 08:10:19'),(131,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 08:11:10'),(132,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":67}','2026-02-21 08:11:19'),(133,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:08:25'),(134,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:08:34'),(135,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":68}','2026-02-21 09:08:40'),(136,3,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmai.com\"}','2026-02-21 09:50:22'),(137,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:50:45'),(138,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:50:50'),(139,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:52:26'),(140,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":71}','2026-02-21 09:52:33'),(141,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:53:16'),(142,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:53:22'),(143,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:53:24'),(144,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:53:26'),(145,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:53:27'),(146,10,'LOGIN_BLOCKED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\",\"reason\":\"too_many_failed_attempts\"}','2026-02-21 09:53:29'),(147,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:55:26'),(148,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 09:55:37'),(149,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":72}','2026-02-21 09:55:54'),(150,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 10:01:38'),(151,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":73}','2026-02-21 10:01:56'),(152,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 10:11:51'),(153,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":74}','2026-02-21 10:11:59'),(154,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 10:12:28'),(155,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":75}','2026-02-21 10:12:34'),(156,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 10:12:43'),(157,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-21 10:12:54'),(158,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":76}','2026-02-21 10:13:06'),(159,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 00:02:02'),(160,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 00:02:10'),(161,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":77}','2026-02-22 00:02:19'),(162,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 00:03:48'),(163,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 00:03:57'),(168,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:06:01'),(169,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:06:08'),(170,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:07:16'),(171,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":83}','2026-02-22 03:07:23'),(178,NULL,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"neverevening1@gmail.com\"}','2026-02-22 03:15:29'),(179,NULL,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"neverevening1@gmail.com\"}','2026-02-22 03:15:34'),(180,14,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"neverevening1@gmail.com\"}','2026-02-22 03:16:09'),(181,14,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":87}','2026-02-22 03:16:21'),(182,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:40:48'),(183,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":88}','2026-02-22 03:41:38'),(184,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:50:40'),(185,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":89}','2026-02-22 03:50:47'),(186,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:51:09'),(187,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":90}','2026-02-22 03:51:15'),(188,10,'LOGIN_ATTEMPT_FAILED','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:53:24'),(189,10,'LOGIN_ATTEMPT_SUCCESS','127.0.0.1','{\"email\":\"leonardohuarachadelvillar@gmail.com\"}','2026-02-22 03:53:38'),(190,10,'OTP_VERIFICATION_SUCCESS','127.0.0.1','{\"otp_code_id\":91}','2026-02-22 03:53:45');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

LOCK TABLES `cache` WRITE;
/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`),
  KEY `cache_locks_expiration_index` (`expiration`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

LOCK TABLES `cache_locks` WRITE;
/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `failed_jobs`
--

DROP TABLE IF EXISTS `failed_jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `failed_jobs`
--

LOCK TABLES `failed_jobs` WRITE;
/*!40000 ALTER TABLE `failed_jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `failed_jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job_batches`
--

DROP TABLE IF EXISTS `job_batches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job_batches`
--

LOCK TABLES `job_batches` WRITE;
/*!40000 ALTER TABLE `job_batches` DISABLE KEYS */;
/*!40000 ALTER TABLE `job_batches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'0001_01_01_000000_create_users_table',1),(2,'0001_01_01_000001_create_cache_table',1),(3,'0001_01_01_000002_create_jobs_table',1),(4,'2025_08_14_170933_add_two_factor_columns_to_users_table',1),(5,'2026_02_17_000001_create_otp_codes_table',1),(6,'2026_02_17_000002_create_audit_logs_table',1),(7,'2026_02_20_000003_add_remember_token_to_users_table',2);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp_codes`
--

DROP TABLE IF EXISTS `otp_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp_codes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `code` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `otp_codes_user_id_foreign` (`user_id`),
  CONSTRAINT `otp_codes_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp_codes`
--

LOCK TABLES `otp_codes` WRITE;
/*!40000 ALTER TABLE `otp_codes` DISABLE KEYS */;
INSERT INTO `otp_codes` VALUES (1,3,'932328','2026-02-17 23:47:41',0),(7,1,'812565','2026-02-18 00:13:44',0),(19,7,'218987','2026-02-19 00:35:56',1),(20,7,'341144','2026-02-19 00:39:53',0),(22,8,'335946','2026-02-19 00:49:08',1),(23,9,'060916','2026-02-19 01:53:37',1),(32,10,'871614','2026-02-20 04:48:06',1),(33,10,'727766','2026-02-20 20:28:00',1),(34,10,'485565','2026-02-20 20:30:23',1),(35,10,'017569','2026-02-20 20:32:34',1),(36,10,'831081','2026-02-20 20:41:37',1),(37,10,'500326','2026-02-20 20:43:11',1),(38,10,'923936','2026-02-20 20:46:45',1),(39,10,'183777','2026-02-20 20:51:05',1),(40,10,'277747','2026-02-20 20:55:41',1),(41,10,'202908','2026-02-20 20:56:20',1),(42,11,'864589','2026-02-20 21:02:19',1),(43,11,'391412','2026-02-20 21:03:11',1),(44,10,'957465','2026-02-20 21:10:37',1),(45,10,'025522','2026-02-20 21:11:19',1),(46,10,'573472','2026-02-20 21:26:09',1),(47,10,'964202','2026-02-20 21:26:41',1),(48,10,'752987','2026-02-20 21:27:23',1),(49,10,'289074','2026-02-20 21:28:22',1),(50,10,'703781','2026-02-20 21:40:15',1),(51,10,'000037','2026-02-20 21:40:50',1),(52,10,'206123','2026-02-20 21:44:34',1),(53,10,'479484','2026-02-20 21:45:33',0),(54,10,'844684','2026-02-20 21:45:41',1),(55,10,'839143','2026-02-20 21:46:14',1),(56,10,'823325','2026-02-20 21:46:51',1),(57,10,'718508','2026-02-20 22:57:24',1),(58,10,'378222','2026-02-20 22:58:00',1),(59,10,'929770','2026-02-20 23:04:39',1),(60,10,'088589','2026-02-20 23:09:47',1),(61,10,'254810','2026-02-20 23:10:41',1),(62,10,'014616','2026-02-20 23:28:42',1),(63,10,'741382','2026-02-20 23:34:07',1),(64,10,'847834','2026-02-20 23:36:20',1),(65,10,'638215','2026-02-20 23:36:45',1),(66,10,'135234','2026-02-21 03:15:30',1),(67,10,'946951','2026-02-21 03:16:06',1),(68,10,'468334','2026-02-21 04:13:29',1),(69,3,'230146','2026-02-21 04:55:19',0),(70,10,'740931','2026-02-21 04:56:00',1),(71,10,'194752','2026-02-21 04:57:22',1),(72,10,'448712','2026-02-21 05:00:31',1),(73,10,'360793','2026-02-21 05:06:35',1),(74,10,'206329','2026-02-21 05:16:46',1),(75,10,'299894','2026-02-21 05:17:24',1),(76,10,'342516','2026-02-21 05:17:49',1),(77,10,'193231','2026-02-21 19:07:06',1),(78,10,'708931','2026-02-21 19:08:54',0),(82,10,'276631','2026-02-21 22:11:14',1),(83,10,'398692','2026-02-21 22:12:13',1),(87,14,'027179','2026-02-21 22:21:05',1),(88,10,'283948','2026-02-21 22:45:45',1),(89,10,'852603','2026-02-21 22:55:37',1),(90,10,'297991','2026-02-21 22:56:06',1),(91,10,'218744','2026-02-21 22:58:33',1);
/*!40000 ALTER TABLE `otp_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `password_reset_tokens`
--

LOCK TABLES `password_reset_tokens` WRITE;
/*!40000 ALTER TABLE `password_reset_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `password_reset_tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'leonardoh@gmai.com','$2y$12$720/mi2NqNDp01JcWZ2RJOvFiB5MvI7hl0On7LjjFKmkD4X0i/KTe','2026-02-18 03:27:50',NULL),(2,'potitogamer@gmail.com','$2y$12$Y.EcZB0eVGLvK/t/CEVY8.3pIRJNal/R92UHAgzwjQ/E7wEAQMZtK','2026-02-18 03:30:51',NULL),(3,'leonardohuarachadelvillar@gmai.com','$2y$12$0LdzOk/w.e3ByzfG4hyEPuoU2ysjQlLdyKBF4JJYsNN6HYMQWfvFy','2026-02-18 03:37:38',NULL),(4,'texture@gmai.com','$2y$12$uVAL.02ecEhqpvpDKoy70.3PBwJZewU8Yv4k6ehlEq9XDpBVEzFZu','2026-02-18 03:45:50',NULL),(5,'man@gmail.com','$2y$12$J7s4jy7n6.Hb6.UH5oTxf.Oc4VgBIqn6BVmICHtQxZZZz/GkMgYYy','2026-02-18 04:32:13',NULL),(7,'marianita01986@gmail.com','$2y$12$FY6MAYhw.d3crveuILCKFuEcAJO7GBszzabJScIhrpivdT1fogHVu','2026-02-19 05:30:17',NULL),(8,'deyvismachco@gmail.com','$2y$12$B.oRFFz/9fDg10QH1J3s4OxnaNlQ.flL620qS9Gy.Yy5irynJ/BQ2','2026-02-19 05:43:55',NULL),(9,'ale.manrique190@gmail.com','$2y$12$wCPGSBRbZhzlY/xXMV71GugQGuZD2Mko1Xp./7MSLHz7HEwXL2/36','2026-02-19 06:48:22',NULL),(10,'leonardohuarachadelvillar@gmail.com','$2y$12$1smMQbDVTm50xz48Pxs6k.ZCFa77zuOASNXn10Dq.58cQYi1K3Tqa','2026-02-20 09:36:26','K9jYEPDhYJQ8Fd9kRU6MaK1BpGLpjvXS4xLUBKnvDcqQUzenzWxJsRLEweMP'),(11,'popige5214@bitonc.com','$2y$12$Y9GbQJ//gk9/QKBr5nuHSu4IU.P4S9krIHV2OFFGkbHLmU.gBV04y','2026-02-21 01:57:01','wq22jDxL8GgiBo1GW2kbrXqMLOX9WeEPg0RgnpIEGoDZECZQgpn6dBXeOShJ'),(12,'1590329@senati.pe','$2y$12$CMIU9eYKGxUufyddyE2RkucXZvJvCTa79CwKL.tCaA5eI0HjnGcVW','2026-02-21 09:48:52',NULL),(14,'neverevening1@gmail.com','$2y$12$T3fBc5Gn3ofHOmqoqALncune97Ll3AvPQvaFoZwyQvu4Vz.4Bhofa','2026-02-22 03:15:53',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-21 18:26:46

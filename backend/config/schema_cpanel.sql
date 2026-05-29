-- =====================================
-- Koye Fache Prosperity Party
-- Live Electors Count - Database Schema
-- =====================================
-- IMPORTANT for cPanel:
-- 1. Create the database via cPanel MySQL Wizard FIRST
-- 2. Select the created database in phpMyAdmin
-- 3. Then import this file (without CREATE DATABASE / USE)
-- =====================================
-- CREATE DATABASE IF NOT EXISTS live_electors;
-- USE live_electors;
-- =====================================

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS electors_submissions;
DROP TABLE IF EXISTS settings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50) DEFAULT NULL,
  election_location VARCHAR(255) DEFAULT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin', 'super_admin') DEFAULT 'user',
  status ENUM('pending', 'approved', 'suspended') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE electors_submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  elector_number BIGINT NOT NULL,
  description TEXT DEFAULT NULL,
  attachment VARCHAR(255) DEFAULT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  approved_by INT DEFAULT NULL,
  approved_date DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  logo VARCHAR(255) DEFAULT NULL,
  header_text VARCHAR(255) DEFAULT 'LIVE ELECTORS COUNT',
  subtitle_text VARCHAR(255) DEFAULT 'Total Electors',
  footer_text VARCHAR(255) DEFAULT 'Developed By Amanuel ICT Solution',
  footer_enabled TINYINT(1) DEFAULT 1,
  header_font_size VARCHAR(20) DEFAULT '48px',
  header_font_style VARCHAR(100) DEFAULT 'Arial',
  header_color VARCHAR(20) DEFAULT '#ffffff',
  background_color VARCHAR(20) DEFAULT '#1a1a2e',
  text_color VARCHAR(20) DEFAULT '#ffffff',
  card_color VARCHAR(20) DEFAULT '#16213e',
  button_style VARCHAR(50) DEFAULT 'rounded',
  font_family VARCHAR(100) DEFAULT 'Arial',
  layout VARCHAR(50) DEFAULT 'modern',
  counter_size VARCHAR(20) DEFAULT '120px',
  counter_color VARCHAR(20) DEFAULT '#e94560',
  screen_background VARCHAR(20) DEFAULT '#0f3460',
  theme VARCHAR(20) DEFAULT 'light',
  countdown_enabled TINYINT(1) DEFAULT 0,
  countdown_title VARCHAR(255) DEFAULT 'Days Left',
  countdown_target_date DATETIME DEFAULT NULL,
  phone1 VARCHAR(50) DEFAULT '09-84-19-40-54',
  phone2 VARCHAR(50) DEFAULT '09-40-96-77-77',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO settings (id, logo, header_text, subtitle_text, footer_text, theme, background_color, text_color, card_color, header_color, counter_color, screen_background, countdown_enabled, countdown_title, countdown_target_date, phone1, phone2)
VALUES (1, NULL, 'KOYE FACHE PROSPERITY PARTY', 'LIVE ELECTORS COUNT', 'Developed By Amanuel ICT Solution', 'light', '#ffffff', '#1a1a2e', '#f8f9fa', '#e94560', '#e94560', '#ffffff', 0, 'Days Left', DATE_ADD(NOW(), INTERVAL 30 DAY), '09-84-19-40-54', '09-40-96-77-77');

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  action VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

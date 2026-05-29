-- =============================================
-- Migration: Add countdown and phone fields
-- Run this on existing databases only
-- =============================================

ALTER TABLE `settings`
  ADD COLUMN IF NOT EXISTS `countdown_enabled` TINYINT(1) DEFAULT 0 AFTER `theme`,
  ADD COLUMN IF NOT EXISTS `countdown_title` VARCHAR(255) DEFAULT 'Days Left' AFTER `countdown_enabled`,
  ADD COLUMN IF NOT EXISTS `countdown_target_date` DATETIME DEFAULT NULL AFTER `countdown_title`,
  ADD COLUMN IF NOT EXISTS `phone1` VARCHAR(50) DEFAULT '09-84-19-40-54' AFTER `countdown_target_date`,
  ADD COLUMN IF NOT EXISTS `phone2` VARCHAR(50) DEFAULT '09-40-96-77-77' AFTER `phone1`;

UPDATE `settings` SET
  `countdown_enabled` = COALESCE(`countdown_enabled`, 0),
  `countdown_title` = COALESCE(`countdown_title`, 'Days Left'),
  `countdown_target_date` = COALESCE(`countdown_target_date`, DATE_ADD(NOW(), INTERVAL 30 DAY)),
  `phone1` = COALESCE(`phone1`, '09-84-19-40-54'),
  `phone2` = COALESCE(`phone2`, '09-40-96-77-77')
WHERE `id` = 1;

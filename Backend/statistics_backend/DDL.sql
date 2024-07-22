CREATE TABLE users (
  email VARCHAR(255) PRIMARY KEY,
  firstName VARCHAR(255),
  lastName VARCHAR(255),
  userType VARCHAR(255),
  is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE logs (
  email VARCHAR(255),
  login_date DATE,
  login_time TIME,
  PRIMARY KEY (email, login_date, login_time)
);

DELIMITER //
CREATE PROCEDURE update_is_active_status()
BEGIN
  DECLARE user_email VARCHAR(255);
  DECLARE last_login DATETIME;
  DECLARE done INT DEFAULT 0;
  DECLARE cursor1 CURSOR FOR SELECT email, MAX(CONCAT(login_date, ' ', login_time)) FROM logs GROUP BY email;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN cursor1;
  read_loop: LOOP
    FETCH cursor1 INTO user_email, last_login;
    IF done THEN
      LEAVE read_loop;
    END IF;

    IF TIMESTAMPDIFF(MINUTE, last_login, NOW()) > 30 THEN
      UPDATE users SET is_active = FALSE WHERE email = user_email;
    END IF;
  END LOOP;
  CLOSE cursor1;
END //
DELIMITER ;

CREATE EVENT IF NOT EXISTS update_is_active_event
ON SCHEDULE EVERY 30 MINUTE
DO
  CALL update_is_active_status();
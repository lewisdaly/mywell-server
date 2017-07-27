-- A list of queries to be executed for stats etc.



--TODO: setup:

create table days (`date` date);

TRUNCATE days;
DROP PROCEDURE IF EXISTS filldates;

--TODO: add to startup script

DELIMITER |
CREATE PROCEDURE filldates(dateStart DATE, dateEnd DATE)
BEGIN
  WHILE dateStart <= dateEnd DO
    INSERT INTO days (`date`) VALUES (dateStart);
    SET dateStart = date_add(dateStart, INTERVAL 1 DAY);
  END WHILE;
END;
|
DELIMITER ;
CALL filldates('2011-01-01','2017-12-31');



-- Get all readings for a resourceId:
SELECT * from reading where postcode = 313603 AND resourceId = 1111;

-- Get average weekly readings for postcode & resourceId:

-- not so simple: we need null values for the dates that don't exist
SELECT days.date, SUM(weekly_average) FROM (
  select * from days WHERE date >= STR_TO_DATE('2014-01-01', '%Y-%m-%d') AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
) as days
LEFT JOIN (
  select AVG(value) as weekly_average, cast(date as DATE) as date FROM reading where postcode = 313603 AND resourceId = 1112 GROUP BY YEAR(date), WEEKOFYEAR(date)
) as averages
ON days.date = averages.date
GROUP BY YEAR(days.date), WEEKOFYEAR(days.date)
ORDER BY days.date;


-- Get cumulative weekly readings for postcode & resourceId:
SELECT days.date, SUM(weekly_average) FROM days
LEFT JOIN (
  select SUM(value) as weekly_average, cast(date as DATE) as date FROM reading where postcode = 313002 AND resourceId = 1170 GROUP BY YEAR(date), WEEKOFYEAR(date)
) as averages
ON days.date = averages.date
GROUP BY YEAR(days.date), WEEKOFYEAR(days.date)
ORDER BY days.date;



-- Average weekly reading by type (this might not work for raingauges, as we want cumulative for each, and then average)
select AVG(value) as weekly_average, cast(date as DATE) as date FROM reading where postcode = 313603 AND villageId = 11 GROUP BY YEAR(date), WEEKOFYEAR(date)

select * from days WHERE date >= STR_TO_DATE('2016-01-01', '%Y-%m-%d') AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d');


STR_TO_DATE('2016-01-01', '%Y-%m-%d');


-- cumulative readings (by week)
set @cumulative_value := 0;
select value, (@cumulative_value := @cumulative_value + value) as cumulative_value, cast(date as DATE) as date
FROM reading
WHERE postcode = 313603
  AND resourceId = 1111
  AND date >= STR_TO_DATE('2016-01-01', '%Y-%m-%d')
  AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d');


set @cumulative_value := 0;
SELECT cumulative_readings.date, cumulative_value FROM (
  select * from days WHERE date >= STR_TO_DATE('2015-12-28', '%Y-%m-%d') AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
) as days
LEFT OUTER JOIN (
  SELECT week, date, (@cumulative_value := @cumulative_value + weekly_sum) as cumulative_value
  FROM (
    SELECT SUM(value) as weekly_sum, cast(date as DATE) as date, WEEKOFYEAR(date) as week
    FROM reading
    WHERE postcode = 313603
      AND resourceId = 1111
      AND date >= STR_TO_DATE('2015-12-28', '%Y-%m-%d')
      AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
    GROUP BY YEAR(date), WEEKOFYEAR(date)
  ) as weekly_readings
) as cumulative_readings
ON days.date = cumulative_readings.date
WHERE cumulative_readings.date IS NOT NULL
GROUP BY YEAR(cumulative_readings.date), WEEKOFYEAR(cumulative_readings.date)
ORDER BY cumulative_readings.date;


SELECT * FROM (
  select * from days WHERE date >= STR_TO_DATE('2016-01-01', '%Y-%m-%d') AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
) as days
GROUP BY YEAR(days.date), WEEKOFYEAR(days.date)
ORDER BY days.date;


-- cumulative readings (by month)

set @cumulative_value := 0;
SELECT cumulative_readings.date, cumulative_value FROM (
  select * from days WHERE date >= STR_TO_DATE('2015-12-28', '%Y-%m-%d') AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
) as days
LEFT OUTER JOIN (
  SELECT week, date, (@cumulative_value := @cumulative_value + weekly_sum) as cumulative_value
  FROM (
    SELECT SUM(value) as weekly_sum, cast(date as DATE) as date, MONTH(date) as week
    FROM reading
    WHERE postcode = 313603
      AND resourceId = 1111
      AND date >= STR_TO_DATE('2015-12-28', '%Y-%m-%d')
      AND date <= STR_TO_DATE('2017-01-01', '%Y-%m-%d')
    GROUP BY YEAR(date), MONTH(date)
  ) as weekly_readings
) as cumulative_readings
ON days.date = cumulative_readings.date
WHERE cumulative_readings.date IS NOT NULL
GROUP BY YEAR(cumulative_readings.date), MONTH(cumulative_readings.date)
ORDER BY cumulative_readings.date;

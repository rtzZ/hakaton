begin;

drop table if exists for_model;
drop view if exists data_to_model;
drop view if exists building_v;

CREATE VIEW building_v AS SELECT
    o.id,
    -- building.name,
    a.address, -- полный адрес
    a.u, -- улица
    a.d, -- дом
    a.k, -- корпус
    a.s, -- строеник
    a.soor, -- сооружение
    o.unom,
    o.col_781_id,
    o.col_775_id,
    o.col_772,
    o.col_771,
    o.col_770_id,
    o.col_769_id,
    o.col_767,
    o.col_766,
    o.col_765,
    o.col_764,
    o.col_763,
    o.col_762,
    o.col_761,
    o.col_760,
    o.col_759,
    o.col_758_id,
    o.col_757,
    o.col_756,
    o.col_755,
    o.col_754,
    o.col_3468,
    o.col_3363,
    o.col_3243_id,
    o.col_3163_id,
    o.col_2463_id,
    o.col_2156_id,
    o.col_103506_id
FROM object o
join address a on o.unom = a.id
WHERE o.col_2463_id = 42875644 AND o.col_3163_id = 58761330;


--вью для забора сырых данных для модели
/*
CREATE VIEW data_to_model AS
SELECT
    a2.work_type_id,
    a1.unom,
    a1.col_754,
    a1.col_755,
    a1.col_756,
    a1.col_757,
    a1.col_758_id,
    a1.col_759,
    a1.col_760,
    a1.col_761,
    a1.col_762,
    a1.col_763,
    a1.col_764,
    a1.col_765,
    a1.col_766,
    a1.col_767,
    a1.col_769_id,
    a1.col_770_id,
    a1.col_771,
    a1.col_772,
    a1.col_775_id,
    a1.col_781_id,
    a1.col_2156_id,
    a1.col_2463_id,
    a1.col_3163_id,
    a1.col_3243_id,
    a1.col_3363,
    a1.col_103506_id
FROM object a1
LEFT JOIN work a2 ON a1.unom = a2.unom
WHERE a1.col_2463_id = 42875644 AND a1.col_3163_id = 58761330;
*/

--таблица для записи предобработанных данных для модели
-- create table if not exists for_model (
-- 	work_type_id integer,
-- 	unom integer,
-- 	col_754 integer,
-- 	col_755 integer,
-- 	col_756 integer,
-- 	col_757 integer,
-- 	col_758_id integer,
-- 	col_759 integer,
-- 	col_760 integer,
-- 	col_761 integer,
-- 	col_762 integer, --numeric
-- 	col_763 integer, --numeric
--     col_764 integer,  --numeric
-- 	col_765 integer,  --numeric
-- 	col_766 integer,  --numeric
-- 	col_767 integer,  --text
-- 	col_769_id integer,
-- 	col_770_id integer,
--     col_771 integer,
-- 	col_772 integer,
-- 	col_775_id integer,
-- 	col_781_id integer,
-- 	col_2156_id integer,
--     col_2463_id integer,
-- 	col_3163_id integer,
-- 	col_3243_id integer,
-- 	col_3363 integer,
--     col_103506_id integer
-- );
	
--вью для забора сырых данных для модели
CREATE VIEW data_to_model AS
SELECT w.work_type_id,
    o.unom,
    o.col_754,
    o.col_755,
    o.col_756,
    o.col_757,
    o.col_758_id,
    o.col_759,
    o.col_760,
    o.col_761,
    o.col_762,
    o.col_763,
    o.col_764,
    o.col_765,
    o.col_766,
    o.col_767,
    o.col_769_id,
    o.col_770_id,
    o.col_771,
    o.col_772,
    o.col_775_id,
    o.col_781_id,
    o.col_2156_id,
    o.col_2463_id,
    o.col_3163_id,
    o.col_3243_id,
    o.col_3363,
    o.col_103506_id
FROM object o
LEFT JOIN work w ON o.unom = w.unom
WHERE o.col_2463_id = 42875644 AND o.col_3163_id = 58761330;

commit ;
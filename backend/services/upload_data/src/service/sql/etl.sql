begin;

insert into col_103506
select * from stg_col_103506
where id not in (select id from col_103506);

insert into col_2156
select * from stg_col_2156
where id not in (select id from col_2156);

insert into col_2463
select * from stg_col_2463
where id not in (select id from col_2463);

insert into col_3163
select * from stg_col_3163
where id not in (select id from col_3163);

insert into col_758
select * from stg_col_758
where id not in (select id from col_758);

insert into col_769
select * from stg_col_769
where id not in (select id from col_769);

insert into col_770
select * from stg_col_770
where id not in (select id from col_770);

insert into col_775
select * from stg_col_775
where id not in (select id from col_775);

insert into col_781
select * from stg_col_781
where id not in (select id from col_781);

insert into col_3243
select * from stg_col_3243
where id not in (select id from col_3243);

-- Адреса из объектов
insert into address
select col_782, TRIM(LEADING 'Дом по адресу ' FROM name),
TRIM(LEADING 'Дом по адресу ' FROM SUBSTRING(name FROM '(.+?)(, )?(д[.][ ]?[\wА-Яа-я]+)(, )?(к[.][\d]+)?(, )?(с[.].+)?(, )?(сооружение .+)?')),
SUBSTRING(name FROM ', (д[.][ ]?[\w\/]+)'),
SUBSTRING(name FROM ', (к\.[\w-]+)'),
SUBSTRING(name FROM ', (с\..+)'),
SUBSTRING(name FROM ', (сооружение [\w]+)')
from stg_building
where col_782 not in (select id from address);


insert into object
select
    id,
    col_782,
    col_781_id,
    col_775_id,
    col_772,
    col_771,
    col_770_id,
    col_769_id,
    col_767,
    col_766,
    col_765,
    col_764,
    col_763,
    col_762,
    col_761,
    col_760,
    col_759,
    col_758_id,
    col_757,
    col_756,
    col_755,
    col_754,
    col_3468,
    col_3363,
    col_3243_id,
    col_3163_id,
    col_2463_id,
    col_2156_id,
    col_103506_id
from stg_building
where id not in (select id from object);


drop view if exists object_flat ;

create view object_flat as
select
    o.id,
    o.unom,
    a.address,
    a.d,
    a.k,
    a.s,
    a.soor,
    a1.name as col_781,
    a2.name as col_775,
    o.col_772,
    o.col_771,
    a3.name as col_770,
    a4.name as col_769,
    o.col_767,
    o.col_766,
    o.col_765,
    o.col_764,
    o.col_763,
    o.col_762,
    o.col_761,
    o.col_760,
    o.col_759,
    a5.name as col_758,
    o.col_757,
    o.col_756,
    o.col_755,
    o.col_754,
    o.col_3468,
    o.col_3363,
    a6.name as col_3243,
    a7.name as col_3163,
    a8.name as col_2463,
    a9.name as col_2156,
    a10.name as col_103506
    from object o
    left join address a on a.id = o.unom
    left join col_781 a1 on a1.id = o.col_781_id
    left join col_775 a2 on a2.id = o.col_775_id
    left join col_770 a3 on a3.id = o.col_770_id
    left join col_769 a4 on a4.id = o.col_769_id
    left join col_758 a5 on a5.id = o.col_758_id
    left join col_3243 a6 on a6.id = o.col_3243_id
    left join col_3163 a7 on a7.id = o.col_3163_id
    left join col_2463 a8 on a8.id = o.col_2463_id
    left join col_2156 a9 on a9.id = o.col_2156_id
    left join col_103506 a10 on a10.id = o.col_103506_id
    WHERE o.col_2463_id = 42875644 AND o.col_3163_id = 58761330;


-- Не забираем адреса из инцидентов и работ!
/*
--Адреса из инцидентов
insert into address
select unom, max(address)
from stg_incident
where unom not in (select id from address)
group by unom;

-- Адреса из работ
insert into address
select unom, max(address)
from stg_work
where unom not in (select id from address)
group by unom;
*/

-- Не забираем источник из событий (только из инцидентов!)
/*
-- Источник из событий
insert into system (name)
select distinct system
from stg_event_system
where system not in (select name from system);
*/

-- Источник из инцидентов
insert into system (name)
select distinct source
from stg_incident
where source not in (select name from system);

-- Событие из инцидентов
insert into event (description)
select distinct name
from stg_incident
where name not in (select description from event);


-- Типы работ
-- Из stg_work_type
insert into work_type (
    code,
    name,
    name_common,
    work_type,
    work_group,
    work_short_name
)
select
    code,
    name,
    name_common,
    work_type,
    work_group,
    work_short_name
from stg_work_type
where name not in (select name from work_type);

-- Из work -- могут быть работы отсутстующие в work_type, либо некорректно написанные
-- insert into work_type (name)
-- select distinct work_name
-- from stg_work
-- where work_name not in (select name from work_type);


-- Работы

-- Создаем временную таблицу с работами, т.к. в work_types работы указаны не коректно
-- HARDCODE(
create temp table tmp_work_names (id serial primary key, work_name text);
insert into tmp_work_names values
(2, 'ремонт подъездов, направленный на восстановление их надлежащего состояния и проводимый при выполнении иных работ по капитальному ремонту общего имущества в многоквартирном доме'),
(3, 'замена оконных блоков, расположенных в помещениях общего пользования'),
(6, 'ремонт внутридомовых инженерных систем теплоснабжения (разводящие магистрали)'),
(7, 'ремонт внутридомовых инженерных систем водоотведения (канализации) (выпуски и сборные трубопроводы)'),
(8, 'ремонт внутридомовых инженерных систем горячего водоснабжения (разводящие магистрали)'),
(9, 'ремонт внутридомовых инженерных систем холодного водоснабжения (разводящие магистрали)'),
(10, 'ремонт мусоропровода'),
(11, 'ремонт пожарного водопровода'),
(13, 'ремонт внутридомовых инженерных систем электроснабжения'),
(14, 'ремонт внутридомовых инженерных систем газоснабжения'),
(15, 'ремонт подвальных помещений, относящихся к общему имуществу в многоквартирном доме'),
(16, 'ремонт внутридомовых инженерных систем теплоснабжения (стояки)'),
(17, 'ремонт внутридомовых инженерных систем водоотведения (канализации) (стояки)'),
(18, 'ремонт внутридомовых инженерных систем горячего водоснабжения (стояки)'),
(20, 'ремонт внутридомовых инженерных систем холодного водоснабжения (стояки)'),
(21, 'ремонт крыши'),
(22, 'ремонт внутреннего водостока'),
(24, 'ремонт фасадов'),
(29, 'замена лифтового оборудования');

-- Заполняем наименования работ из временной таблицы
insert into work
select
    sw.global_id,
    sw.period,
    wn.id,
    sw.num_entrance,
    sw.elevatornumber,
    sw.plan_date_start,
    sw.plan_date_end,
    sw.fact_date_start,
    sw.fact_date_end,
    sw.unom
from stg_work sw
join tmp_work_names wn on wn.work_name = sw.work_name
where sw.global_id not in (select id from work);

-- Удаляем временную таблицу
drop table tmp_work_names;

-- Полный перезалив в incident
truncate table incident;
insert into incident
select
    si.id,
    e.id,
    s.id,
    si.date_ext_created,
    si.date_completed,
    si.date_ext_completed,
    si.unom
from stg_incident si
join event e on e.description = si.name
join system s on s.name = si.source;

-- Такой запрос (дозапись) выполняется очень долго (((
/*
insert into incident
select
    si.id,
    e.id,
    s.id,
    si.date_ext_created,
    si.date_completed,
    si.date_ext_completed,
    si.unom
from stg_incident si
join event e on e.description = si.name
join system s on s.name = si.source
where si.date_completed  not in (select date_completed  from incident)

 */

commit;
Begin;
--drop view if exists data_to_model;
--drop view if exists data_to_model2;
--drop view if exists work_addr;

drop table if exists stg_building cascade;
drop table if exists stg_col_781 cascade;
drop table if exists stg_col_775 cascade;
drop table if exists stg_col_770 cascade;
drop table if exists stg_col_769 cascade;
drop table if exists stg_col_758 cascade;
drop table if exists stg_col_3243 cascade;
drop table if exists stg_col_3163 cascade;
drop table if exists stg_col_2463 cascade;
drop table if exists stg_col_2156 cascade;
drop table if exists stg_col_103506 cascade;
drop table if exists stg_incident;
drop table if exists stg_work;
drop table if exists stg_work_type;
drop table if exists stg_work_type_common;
drop table if exists stg_event_system;


-- Материалы кровли по БТИ
create table if not exists stg_col_781 (
    id serial primary key,	-- Идентификатор
    name text not null -- Наименование
);

-- Очередность уборки кровли
create table if not exists stg_col_775 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Признак аварийности здания
create table if not exists stg_col_770 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Материалы стен (раскрытие)
create table if not exists stg_col_769 (
    id integer primary key,	-- Идентификатор
    name text not null  -- Наименование
);

-- Серии проектов
create table if not exists stg_col_758 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Статусы управления МКД
create table if not exists stg_col_3243 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Статусы МКД
create table if not exists stg_col_3163 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Типы жилищного фонда
create table if not exists stg_col_2463 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Виды социальных объектов
create table if not exists stg_col_2156 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Категория МКД
create table if not exists stg_col_103506 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Данные о объекте с технико-экономическими характеристиками
-- для определения типа объекта - многоквартирный дом, необходимо выполнить фильтрацию данных, соответствующую следующим условиям: COL_2463 = 42875644 И COL_3163 = 58761330
create table if not exists stg_building (
    id serial primary key,
    name text, -- адрес
    login text,
    parent_id integer,
    col_782	integer, -- UNOM
    col_781_id integer, -- Идентификатор материала кровли, внешний ключ на справочник OBJ_988 – «Материалы кровли по БТИ»
    col_775_id integer, -- Идентификатор очередности уборки кровли, внешний ключ на справочник OBJ_983 – «Очередность уборки кровли»
    col_772	integer, -- Количество грузопассажирских лифтов
    col_771	integer, -- Количество пассажирских лифтов
    col_770_id integer, -- Идентификатор признака аварийности здания, внешний ключ на справочник OBJ_1182 – «Признак аварийности здания»
    col_769_id integer, -- Идентификатор материала стен, внешний ключ на справочник OBJ_305 – «Материалы стен»
    col_767	text, -- Класс энергоэффективности
    col_766	numeric, -- Износ объекта (по БТИ)
    col_765	numeric, -- Строительный объем
    col_764	numeric, -- Общая площадь нежилых помещений
    col_763	numeric, -- Общая площадь жилых помещений
    col_762	numeric, -- Общая площадь
    col_761	integer, -- Количество квартир
    col_760	integer, -- Количество подъездов
    col_759	integer, -- Количество этажей
    col_758_id integer, -- Идентификатор серии проекта, внешний ключ на справочник OBJ_323 – «Серии проектов»
    col_757	integer, -- Год реконструкции
    col_756	integer, -- Год постройки
    col_755	text, -- Форма собственности
    col_754	text, -- Назначение
    col_3468 text, -- Причина изменения статуса
    col_3363 integer, -- Количество грузовых лифтов
    col_3243_id integer, -- Идентификатор статуса управления МКД, внешний ключ на справочник OBJ_1560 – «Статусы управления МКД»
    col_3163_id integer, -- Идентификатор статуса МКД, внешний ключ на справочник OBJ_1540 – «Статусы МКД»
    col_2463_id integer, -- Идентификатор типа жилищного фонда, внешний ключ на справочник OBJ_1240 – «Типы жилищного фонда»
    col_2156_id integer, -- Идентификатор вида социального объекта, внешний ключ на справочник OBJ_1022 – «Виды социальных объектов»
    col_103506_id integer -- Идентификатор категории МКД, внешний ключ на справочник OBJ_10708 – «Категория МКД»
    -- foreign key(col_781_id) references stg_col_781(id),
    -- foreign key(col_775_id) references stg_col_775(id),
    -- foreign key(col_770_id) references stg_col_770(id),
    -- foreign key(col_769_id) references stg_col_769(id),
    -- foreign key(col_758_id) references stg_col_758(id),
    -- foreign key(col_3243_id) references stg_col_3243(id),
    -- foreign key(col_3163_id) references stg_col_3163(id),
    -- foreign key(col_2463_id) references stg_col_2463(id),
    -- foreign key(col_2156_id) references stg_col_2156(id),
    -- foreign key(col_103506_id) references stg_col_103506(id)
);


-- Данные о событиях на объекте
-- Инциденты, зарегистрированные на объектах городского хозяйства
create table if not exists stg_incident (
    id serial primary key,
    name text, -- Наименование
    source text, -- Источник
    date_ext_created timestamp, -- Дата создания во внешней системе
    date_completed timestamp, -- Дата закрытия
    district text, -- Округ
    address text, -- Адрес
    unom integer, -- UNOM
    date_ext_completed timestamp -- Дата и время завершения события во
);

-- Классификатор видов работ, проводимых на различных типах объектов
-- Виды работ по капитальному ремонту многоквартирных домов
create table if not exists stg_work_type (
    id serial primary key, -- № п/п
    code integer, -- Код
    name text, -- Наименование
    name_common text, -- Наименование объекта общего имущества
    work_type text, -- Тип работ
    work_group text, -- Группа работ
    work_short_name text -- Сокращенное наименование работы
);

-- Данные о работах, проведенных в прошлых периодах
-- Работы по капитальному ремонту, проведенные в многоквартирных домах
create table if not exists stg_work (
    global_id serial primary key, -- Уникальный идентификатор работы на объекте (в таблице)
    period integer, -- Период работы
    work_name text, -- Наименование работы
    num_entrance integer, -- Подъезд
    elevatornumber text, -- Номер лифта
    plan_date_start	timestamp, -- Плановая дата начала работы
    plan_date_end timestamp, -- Плановая дата окончания работы
    fact_date_start	timestamp, -- Фактическая дата начала работы
    fact_date_end timestamp, -- Фактическая дата окончания работы
    admarea	text, -- Административный округ
    district text, -- Район
    address	text, -- Адрес
    unom integer -- Код адреса по АР
);

-- Виды работ по содержанию и ремонту общего имущества многоквартирных домов
create table if not exists stg_work_type_common (
    id serial primary key,-- Идентификатор
    name text, -- Наименование
    login text, -- Код
    parent_id integer, -- Идентификатор родительской группы работ, внешний ключ на справочник OBJ_1327 – «Группы видов работ по содержанию и ремонту общего имущества МКД»
    col_4923 integer, -- Данные актуальные до отчетного года
    col_4764 integer, -- Данные актуальны до 2015
    col_4489 integer, -- Рекомендуемая периодичность. Величина
    col_4488 integer, -- Идентификатор периодичности проведения работ, внешний ключ на справочник OBJ_596 – «Периодичность проведения работ»
    col_1239 text, -- Номер
    col_1157 text, -- Описание
    col_1045 integer, -- Идентификатор единицы измерения, внешний ключ на справочник OBJ_296 – «Единицы измерения»
    col_1044 text, -- Рекомендуемая периодичность
    col_20062 integer,	-- Идентификатор родительского вида работ, внешний ключ на справочник OBJ_597 – «Виды работ по содержанию и ремонту общего имущества МКД»
    col_20063 integer,-- Идентификатор связанного с видом работ элемента имущества, внешний ключ на справочник OBJ_11000 – «Тип элемента общего имущества»
    col_20060 integer, -- Хз
    col_20061 integer -- Хз
);

-- Классификатор типов событий, регистрируемых на объектах в мастер-системах
-- Типы событий, регистрируемых по типу объекта - многоквартирный дом
create table if not exists stg_event_system (
    id uuid primary key,-- Идентификатор
    name text, -- Наименование типа события
    system text	-- Информационная система – источник события
);

commit;
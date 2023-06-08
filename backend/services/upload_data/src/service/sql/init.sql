Begin;

drop table if exists object cascade;
drop table if exists col_781;
drop table if exists col_775;
drop table if exists col_770;
drop table if exists col_769;
drop table if exists col_758;
drop table if exists col_3243;
drop table if exists col_3163;
drop table if exists col_2463;
drop table if exists col_2156;
drop table if exists col_103506;
drop table if exists incident;
drop table if exists address;
drop table if exists work;
drop table if exists work_type;
drop table if exists event;
drop table if exists system;


-- Материалы кровли по БТИ
create table if not exists col_781 (
    id serial primary key,
    name text not null
);

-- Очередность уборки кровли
create table if not exists col_775 (
    id serial primary key,
    name text not null
);

-- Признак аварийности здания
create table if not exists col_770 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Материалы стен (раскрытие)
create table if not exists col_769 (
    id integer primary key,	-- Идентификатор
    name text not null  -- Наименование
);

-- Серии проектов
create table if not exists col_758 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Статусы управления МКД
create table if not exists col_3243 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Статусы МКД
create table if not exists col_3163 (
    id serial primary key, -- Идентификатор
    name text not null  -- Наименование
);

-- Типы жилищного фонда
create table if not exists col_2463 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Виды социальных объектов
create table if not exists col_2156 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

-- Категория МКД
create table if not exists col_103506 (
    id serial primary key, -- Идентификатор
    name text not null   -- Наименование
);

create table if not exists address (
  id serial primary key,
  address text,
  u text,
  d text,
  k text,
  s text,
  soor text
);

-- Данные о объекте с технико-экономическими характеристиками
-- для определения типа объекта - многоквартирный дом, необходимо выполнить фильтрацию данных, соответствующую следующим условиям: COL_2463 = 42875644 И COL_3163 = 58761330
create table if not exists object (
    id serial primary key,
    unom integer, -- UNOM
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
    col_103506_id integer, -- Идентификатор категории МКД, внешний ключ на справочник OBJ_10708 – «Категория МКД»
    foreign key(col_781_id) references col_781(id),
    foreign key(col_775_id) references col_775(id),
    foreign key(col_770_id) references col_770(id),
    foreign key(col_769_id) references col_769(id),
    foreign key(col_758_id) references col_758(id),
    foreign key(col_3243_id) references col_3243(id),
    foreign key(col_3163_id) references col_3163(id),
    foreign key(col_2463_id) references col_2463(id),
    foreign key(col_2156_id) references col_2156(id),
    foreign key(col_103506_id) references col_103506(id),
    foreign key(unom) references address(id)
);

-- Данные о событиях на объекте
-- Инциденты, зарегистрированные на объектах городского хозяйства
create table if not exists incident (
    id serial primary key,
    event_id integer,
    system_id integer,
    date_ext_created timestamp,
    date_completed timestamp,
    date_ext_completed timestamp,
    unom integer
);

-- Классификатор видов работ, проводимых на различных типах объектов
-- Виды работ по капитальному ремонту многоквартирных домов
create table if not exists work_type (
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
create table if not exists work (
    id serial primary key, -- Уникальный идентификатор работы на объекте (в таблице)
    period integer, -- Период работы
    work_type_id integer,
    num_entrance integer, -- Подъезд
    elevatornumber text, -- Номер лифта
    plan_date_start	timestamp, -- Плановая дата начала работы
    plan_date_end timestamp, -- Плановая дата окончания работы
    fact_date_start	timestamp, -- Фактическая дата начала работы
    fact_date_end timestamp, -- Фактическая дата окончания работы
    unom integer -- Код адреса по АР
);

-- Классификатор типов событий, регистрируемых на объектах в мастер-системах
-- Типы событий, регистрируемых по типу объекта - многоквартирный дом
create table if not exists event (
  id serial primary key,
  description text  -- Наименование типа события
);

-- Информационная система – источник события
create table if not exists system (
  id serial primary key,
  name text
);

commit;
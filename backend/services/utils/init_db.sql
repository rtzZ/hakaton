begin;

create table learning_model
(
    id          uuid not null constraint learning_model_pkey primary key,
    name        varchar,
    username    varchar,
    created     timestamp default now(),
    is_selected boolean,
    facts       varchar
);

/*
alter table learning_model
    owner to root;
*/

create table users
(
    id      uuid not null constraint users_pkey primary key,
    username varchar,
    password varchar
);

/*
alter table users
    owner to root;
*/

create table roles
(
    id   uuid not null constraint roles_pkey primary key,
    role varchar
);

insert into roles (id, role) values
('e5ce6ff5-82b0-4889-a947-e00d6cf914cd', 'user'),
('f9072d74-e8d9-40b1-85b3-75a7d08124e2', 'admin');

/*
alter table roles
    owner to root;
 */

create table user_roles
(
    id      uuid not null constraint user_roles_pkey primary key,
    user_id uuid constraint user_roles_user_id_fkey
            references users
            on delete cascade,
    role_id uuid constraint user_roles_role_id_fkey
            references roles
            on delete cascade
);

/*
alter table user_roles
    owner to root;
*/

commit;
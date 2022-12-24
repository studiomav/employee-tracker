use employee_db;
drop table if exists departments;
drop table if exists roles;
drop table if exists employees;

create table departments
(
    id int not null auto_increment primary key,
    department_name varchar(50)
);

create table roles
(
    id int not null auto_increment primary key,
    role_name varchar(50),
    salary int not null,
    department_id int not null,
    foreign key(department_id) references departments(id) on delete cascade
);

create table employees
(
    id int not null auto_increment primary key,
    first_name varchar(50),
    last_name varchar(50),
    role_id int not null,
    manager_id int,
    foreign key(role_id) references roles(id) on delete cascade
);
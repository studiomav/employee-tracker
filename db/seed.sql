use employee_db;

insert into departments(id, department_name) values
(1, "Sales"),
(2, "Engineering"),
(3, "Human Resources"),
(4, "Administration");

insert into roles(id, role_name, salary, department_id) values
(1, "Salesperson", 40000, 1),
(2, "Senior Salesperson", 60000, 1),
(3, "Sales Manager", 70000, 1),
(4, "Engineer", 60000, 2),
(5, "Senior Engineer", 70000, 2),
(6, "Engineering Manager", 80000, 2),
(7, "HR Coordinator", 65000, 3),
(8, "Administrative Assistant", 45000, 4),
(9, "Lead Administrator", 65000, 4);

insert into employees(id, first_name, last_name, role_id, manager_id) values
(1, "Greg", "Jones", 4, 3),
(2, "Samantha", "Blackstone", 5, 3),
(3, "Mike", "Pondsmith", 6, null),
(4, "Terra", "Firma", 1, 6),
(5, "Carrie", "Overwood", 2, 6),
(6, "Homer", "Millard", 3, null),
(7, "Felix", "Day", 7, null),
(8, "Violet", "Blith", 8, 12),
(9, "James", "Pond", 8, 12),
(10, "Carlos", "Sinatra", 4, 3),
(11, "Amy", "Shrimpman", 4, 3),
(12, "Sam", "Wells", 9, null);
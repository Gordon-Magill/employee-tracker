USE company_db;

INSERT INTO departments (deptName)
VALUES ('Cell Culture'),
('Purification'),
('ADQC');

INSERT INTO roles (title, salary, department_id)
VALUES ('CC Principal Engineer', 150000.00, 1),
('CC Senior Engineer', 125000.00,1),
('PurDev Senior Engineer', 100000.00, 2),
('ADQC Research associate', 70000.00, 3);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('mr firstname','lastname',1, NULL),
('intern firstname','intern lastname',4,1),
('engineer firstname', 'engineer lastname',2,1);
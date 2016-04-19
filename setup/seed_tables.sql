/*	This file seeds the static tables with data. 
 *  
 *  This script should be run ONLY ONE TIME, directly following the creation of the tables in the database. 
 *
 * 	psql -h localhost -U postgres -d io_stream -a -f create_tables.sql
 */


INSERT INTO subject
VALUES
	('Anthropology'),
	('Art'),
	('Astronomy'),
	('Business'),
	('Business Law'),
	('Chemistry'),
	('Chinese'),
	('Biology'),
	('Civil Engineering'),
	('Civil Engineering Technology'),
	('Communication'),
	('Community & Behavioral Health'),
	('Computer Engr Technology'),
	('Accounting'),
	('Computer Information Science'),
	('Computer Information Systems'),
	('Computer Science'),
	('Criminal Justice'),
	('Economics'),
	('Electrical Engr. Technology'),
	('Electrical/Computer Engineerng'),
	('Engineering Science'),
	('English'),
	('Finance'),
	('First Year Seminar'),
	('Fitness'),
	('French'),
	('Graduate Continuous Registration'),
	('Health Information Management'),
	('History'),
	('Human Resource Management'),
	('Information Design & Technlgy'),
	('Interdisciplinary Studies'),
	('Management'),
	('Management Info Systems'),
	('Management Science'),
	('Marketing'),
	('Mathematics'),
	('Mechanical Engineering'),
	('Mechanical Engr. Technology'),
	('Nanoscale Engineering'),
	('Nanoscale Science'),
	('Nanoscale Science & Engineering'),
	('Network and Computer Security'),
	('Nursing'),
	('Philosophy'),
	('Physics'),
	('Political Science'),
	('Psychology'),
	('Recreation'),
	('Sociology'),
	('Spanish'),
	('Statistics'),
	('Technology Innovation Management'),
	('Telecommunications')
;




INSERT INTO semester
VALUES
	('Fall'),
	('Winter'),
	('Spring'),
	('Summer')
;



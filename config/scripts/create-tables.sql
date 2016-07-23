/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 *
 *    psql -h localhost -U postgres -d io_stream -a -f create_tables.sql
 *    CAREFUL NOW!
 */

DROP TABLE upload_token;
DROP TABLE favorite;
DROP TABLE subscription;
DROP TABLE video;
DROP TABLE course;
DROP TABLE topic;
DROP TABLE subject;
DROP TABLE semester;
DROP TABLE person;






CREATE TABLE person (
	id          varchar(50)   PRIMARY KEY,
	faculty     boolean       NOT NULL,
	super_user  boolean       NOT NULL,
	first_name  varchar(100)  NOT NULL,
	last_name   varchar(100)  NOT NULL,
	hash        char(60)      NOT NULL
); 





CREATE TABLE subject (
	id     SERIAL          PRIMARY KEY, 
	title  varchar(100)    NOT NULL
);





CREATE TABLE semester (
	id     SERIAL       PRIMARY KEY, 
	title  varchar(10)  NOT NULL
);





CREATE TABLE topic (
	id             char(11)       PRIMARY KEY,
	subject_id     int            NOT NULL,
	title          varchar(250)   NOT NULL,
	description    varchar(1000)  NULL,
	date_created   date           NOT NULL     DEFAULT CURRENT_DATE
);

ALTER TABLE topic ADD CONSTRAINT topic_subject 
	FOREIGN KEY (subject_id)
	REFERENCES subject (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





CREATE TABLE course (
	id             char(11)       PRIMARY KEY,
	topic_id       CHAR(11)       NOT NULL,
	semester_id    int            NOT NULL,
	year           int            NOT NULL,
	section        CHAR(1)        NULL,
	person_id      varchar(50)    NOT NULL
);

ALTER TABLE course ADD CONSTRAINT course_topic
	FOREIGN KEY (topic_id)
	REFERENCES topic (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;

ALTER TABLE course ADD CONSTRAINT course_person 
	FOREIGN KEY (person_id)
	REFERENCES person (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;

ALTER TABLE course ADD CONSTRAINT topic_semester 
	FOREIGN KEY (semester_id)
	REFERENCES semester (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





CREATE TABLE video (
	id                 char(11)        PRIMARY KEY,
	duration           decimal(255,2)  NULL,
	date_uploaded      timestamp       NULL,
	date_modified      timestamp       NOT NULL      DEFAULT CURRENT_TIMESTAMP,
	course_id  char(11)        NOT NULL,
	title              varchar(100)    NULL,
	description        varchar(500)    NULL,
	src                varchar(1000)   NULL,
	thumbnail_src      varchar(1000)   NULL
);


ALTER TABLE video ADD CONSTRAINT video_course 
	FOREIGN KEY (course_id)
	REFERENCES course (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





CREATE TABLE favorite (
	id          bigserial     PRIMARY KEY,
	video_id    char(11)      NOT NULL,
	person_id   varchar(50)   NOT NULL
);


ALTER TABLE favorite ADD CONSTRAINT favorite_person 
	FOREIGN KEY (person_id)
	REFERENCES person (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;

ALTER TABLE favorite ADD CONSTRAINT favorite_video 
	FOREIGN KEY (video_id)
	REFERENCES video (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





CREATE TABLE subscription (
	id          bigserial    PRIMARY KEY,
	person_id   varchar(50)  NOT NULL,
	course_id   char(11)     NOT NULL
);


ALTER TABLE subscription ADD CONSTRAINT subscription_course
	FOREIGN KEY (course_id)
	REFERENCES course (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;


ALTER TABLE subscription ADD CONSTRAINT subscription_person 
	FOREIGN KEY (person_id)
	REFERENCES person (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





CREATE TABLE upload_token (
	video_id   char(11)       NOT NULL,
	file_id    varchar(250)   PRIMARY KEY
);

ALTER TABLE upload_token ADD CONSTRAINT upload_video 
	FOREIGN KEY (video_id)
	REFERENCES video (id)
	NOT DEFERRABLE 
	INITIALLY IMMEDIATE 
;





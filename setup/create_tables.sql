/*
 * Author:   Lucas Parzych
 * Email:    parzycl1@sunyit.edu
 *
 *    psql -h localhost -U postgres -d io_stream -a -f create_tables.sql
 *    CAREFUL NOW!
 */

 
DROP TABLE upload_in_progress;
DROP TABLE subject;
DROP TABLE semester;
DROP TABLE favorite;
DROP TABLE subscription;
DROP TABLE video;
DROP TABLE course;
DROP TABLE person;






CREATE TABLE person (
    id          varchar(50)   NOT NULL,
    faculty     boolean       NOT NULL,
    super_user  boolean       NOT NULL,

    CONSTRAINT person_pk PRIMARY KEY (id)
);





CREATE TABLE subject (
    id     SERIAL          NOT NULL, 
    title  varchar(100)    NOT NULL,

    CONSTRAINT subject_pk PRIMARY KEY (id)
);





CREATE TABLE semester (
    id     SERIAL       NOT NULL, 
    title  varchar(10)  NOT NULL,

    CONSTRAINT semester_pk PRIMARY KEY (id)
);





CREATE TABLE course (
    id             char(11)       NOT NULL,
    semester_id    int            NOT NULL,
    year           int            NOT NULL,
    subject_id     int            NOT NULL,
    title          varchar(250)   NOT NULL,
    description    varchar(1000)  NULL,
    date_created   date           NOT NULL     DEFAULT CURRENT_DATE,
    person_id      varchar(50)    NOT NULL,
    
    CONSTRAINT course_pk PRIMARY KEY (id)
);


ALTER TABLE course ADD CONSTRAINT course_person 
    FOREIGN KEY (person_id)
    REFERENCES person (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

ALTER TABLE course ADD CONSTRAINT course_semester 
    FOREIGN KEY (semester_id)
    REFERENCES semester (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

ALTER TABLE course ADD CONSTRAINT course_subject 
    FOREIGN KEY (subject_id)
    REFERENCES subject (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;





CREATE TABLE video (
    id             char(11)        NOT NULL,
    duration       decimal(255,2)  NOT NULL,
    date_uploaded  timestamp       NOT NULL      DEFAULT CURRENT_TIMESTAMP,
    date_modified  timestamp       NOT NULL      DEFAULT CURRENT_TIMESTAMP,
    course_id      char(11)        NOT NULL,
    
    CONSTRAINT video_pk PRIMARY KEY (id)
);


ALTER TABLE video ADD CONSTRAINT video_course 
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;





CREATE TABLE favorite (
    id          bigserial     NOT NULL,
    video_id    char(11)      NOT NULL,
    person_id   varchar(50)   NOT NULL,

    CONSTRAINT favorite_pk PRIMARY KEY (id)
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
    id          bigserial    NOT NULL,
    person_id   varchar(50)  NOT NULL,
    course_id   char(11)     NOT NULL,
    
    CONSTRAINT subscription_pk PRIMARY KEY (id)
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





CREATE TABLE upload_in_progress (
    video_id   char(11)       NOT NULL,
    file_id    varchar(250)   NOT NULL,

    CONSTRAINT upload_in_progress_pk PRIMARY KEY (file_id)
);

ALTER TABLE upload_in_progress ADD CONSTRAINT upload_video 
    FOREIGN KEY (video_id)
    REFERENCES video (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;





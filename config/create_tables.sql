-- Last modification date: 2016-04-01 23:27:42.072




-- tables
-- Table: course
CREATE TABLE course (
    id char(22)  NOT NULL,
    semester varchar(10)  NOT NULL,
    year int  NOT NULL,
    subject varchar(100)  NOT NULL,
    title varchar(250)  NOT NULL,
    description varchar(1000)  NULL,
    user_uid varchar(50)  NOT NULL,
    CONSTRAINT course_pk PRIMARY KEY (id)
);



-- Table: favorite
CREATE TABLE favorite (
    id bigserial  NOT NULL,
    video_id char(22)  NOT NULL,
    user_uid varchar(50)  NOT NULL,
    CONSTRAINT favorite_pk PRIMARY KEY (id)
);



-- Table: subscription
CREATE TABLE subscription (
    id bigserial  NOT NULL,
    user_uid varchar(50)  NOT NULL,
    course_id char(22)  NOT NULL,
    CONSTRAINT subscription_pk PRIMARY KEY (id)
);



-- Table: "user"
CREATE TABLE "user" (
    uid varchar(50)  NOT NULL,
    faculty boolean  NOT NULL,
    super_user boolean  NOT NULL,
    CONSTRAINT user_pk PRIMARY KEY (uid)
);



-- Table: video
CREATE TABLE video (
    id char(22)  NOT NULL,
    duration decimal(255,2)  NOT NULL,
    date_uploaded date  NOT NULL,
    date_modified date  NOT NULL,
    course_id char(22)  NOT NULL,
    CONSTRAINT video_pk PRIMARY KEY (id)
);







-- foreign keys
-- Reference:  course_user (table: course)

ALTER TABLE course ADD CONSTRAINT course_user 
    FOREIGN KEY (user_uid)
    REFERENCES "user" (uid)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

-- Reference:  favorite_user (table: favorite)

ALTER TABLE favorite ADD CONSTRAINT favorite_user 
    FOREIGN KEY (user_uid)
    REFERENCES "user" (uid)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

-- Reference:  favorite_video (table: favorite)

ALTER TABLE favorite ADD CONSTRAINT favorite_video 
    FOREIGN KEY (video_id)
    REFERENCES video (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

-- Reference:  subscription_course (table: subscription)

ALTER TABLE subscription ADD CONSTRAINT subscription_course 
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

-- Reference:  subscription_user (table: subscription)

ALTER TABLE subscription ADD CONSTRAINT subscription_user 
    FOREIGN KEY (user_uid)
    REFERENCES "user" (uid)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;

-- Reference:  video_course (table: video)

ALTER TABLE video ADD CONSTRAINT video_course 
    FOREIGN KEY (course_id)
    REFERENCES course (id)
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE 
;


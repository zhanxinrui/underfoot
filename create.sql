create database underfoot;
grant all privileges on underfoot.* to 'www'@'%' identified by 'www';

use underfoot;

create table user(
	id varchar(50)  primary key not null,
	name varchar(100) not null,
	gender bool not null,
	password varchar(50) not null,
	birth varchar(10) not null,
	version  bigint not null,
	createdAt bigint not null,
	updatedAt bigint not null,
	vocation varchar(50) 

)


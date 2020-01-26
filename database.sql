drop database if exists MIDB;
create database MIDB;
use MIDB;
create table UserInfo(
	UserId int primary key not null auto_increment,
    UserName nvarchar(20) not null unique,
    UserPass nvarchar(20) not null,
    UserMail nvarchar(30) not null 
);

insert into UserInfo values(0,'gamaliel','gamaliel','gamaliel');

select * from UserInfo;

create table levelsData(
    LevelId int primary key not null unique auto_increment,
    LevelName nvarchar(15) not null unique
);
insert into levelsData values(0,'Jupiter');
insert into levelsData values(0,'Tierra');
insert into levelsData values(0,'Mercurio');
insert into levelsData values(0,'Marte');
insert into levelsData values(0,'Pluton');
insert into levelsData values(0,'Saturno');
insert into levelsData values(0,'Venus');
insert into levelsData values(0,'Sol');
select * from levelsData;
-- select * from levelsData;

create table levelsScore(
    LevelId int not null unique,
    UserId int not null,
    UserScore int not null,
    foreign key (LevelId) references levelsData(LevelId),
    foreign key (UserId) references UserInfo(UserId)
);


-- Procedures

delimiter **
-- login/register
create procedure procAltaUser(in userid int, in username nvarchar(20),in userpass nvarchar(20),in usermail nvarchar(25))
begin

insert into UserInfo(UserId,UserName,UserPass,UserMail) values(userid,username,userpass,usermail);

end;**

create procedure procLogUser(in username nvarchar(20))
begin

select UserInfo.UserId,UserInfo.UserName,UserInfo.UserPass,UserInfo.UserMail from UserInfo where UserName=username;

end;**

create procedure procChgMail(in username nvarchar(20))
begin

end;**
-- Validacion
create procedure procCompUser(in usern nvarchar(20))
begin
select UserInfo.UserName from UserInfo where UserName=usern;
end;**

create procedure procID(in username nvarchar(20))
begin
select UserInfo.UserId from UserInfo where UserInfo.UserName = username; 
end;**

-- Procedures para juego
create procedure procShowAllScores(in userid int)
begin
select levelsScore.UserScore, levelsData.LevelName from levelsScore inner join levelsData on levelsScore.LevelId = levelsData.LevelId where levelsScore.UserId=userid;
end;**

create procedure procScore(in levelid int, in userid int, in userscore int)
begin

end;**

delimiter ;

-- Triggers

delimiter **

delimiter ;
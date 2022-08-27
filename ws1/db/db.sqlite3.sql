BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "role" (
	"id"	INTEGER,
	"name"	TEXT,
	"description"	TEXT,
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "roles_users" (
	"id"	INTEGER,
	"user_id"	INTEGER,
	"role_id"	INTEGER,
	FOREIGN KEY("role_id") REFERENCES "role"("id"),
	FOREIGN KEY("user_id") REFERENCES "auth"("id"),
	PRIMARY KEY("id")
);
CREATE TABLE IF NOT EXISTS "auth" (
	"id"	INTEGER,
	"username"	TEXT,
	"email"	TEXT UNIQUE,
	"password"	TEXT,
	"active"	INTEGER,
	"fs_uniquifier"	TEXT UNIQUE,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "logs" (
	"id"	INTEGER,
	"time"	TEXT NOT NULL,
	"value"	TEXT NOT NULL,
	"notes"	TEXT,
	"tid"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "dummy" (
	"f1"	INTEGER,
	"f2"	TEXT,
	"f3"	TEXT,
	PRIMARY KEY("f1")
);
CREATE TABLE IF NOT EXISTS "trackers" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"uid"	INTEGER NOT NULL,
	"desc"	INTEGER,
	"ttype"	INTEGER,
	"options"	TEXT,
	FOREIGN KEY("uid") REFERENCES "auth"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
);
INSERT INTO "auth" ("id","username","email","password","active","fs_uniquifier") VALUES (1,NULL,'abc@gmail.com','$2b$12$9dlmljD5mDGbUg5ThfjQW.akffeV.g6A7HL.rEr4tPvnrjp4zAXs6',1,'wdjkbjkcb');
INSERT INTO "dummy" ("f1","f2","f3") VALUES (1,'abcd','a@123');
INSERT INTO "dummy" ("f1","f2","f3") VALUES (2,'bcde','fd@432');
INSERT INTO "dummy" ("f1","f2","f3") VALUES (3,'dfwe','re@g543');
INSERT INTO "trackers" ("id","name","uid","desc","ttype","options") VALUES (1,'haha',1,'random',1,NULL);
INSERT INTO "trackers" ("id","name","uid","desc","ttype","options") VALUES (2,'name',1,'desc',1,'options');
INSERT INTO "trackers" ("id","name","uid","desc","ttype","options") VALUES (3,'recocvbvgrd.name',1,'recorj,njkd.desc',1,'record.cghghv');
COMMIT;

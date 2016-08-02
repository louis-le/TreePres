import sqlite3

conn = sqlite3.connect("users.db")
cursor = conn.cursor()
cursor.execute("CREATE TABLE Users (\
                    UserHostName varchar(255),                  \
                    LastName varchar(255),                      \
                    FirstName varchar(255),                     \
                    GroupName varchar(255),                     \
                    DownloadPaths TEXT, 						\
                    DownloadTime TIMESTAMP DEFAULT (datetime('now','localtime'))	\
                );")

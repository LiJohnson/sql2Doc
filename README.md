# sql2Doc

## usage

mysqldump -h $HOST -P $PORT -u $USER -p$PASS  -d $DB | node sql2gitbook.js $OUT
mysqldump -h $HOST -P $PORT -u $USER -p$PASS  -d $DB | node sql2adoc.js $OUT/db.md
pg_dump --dbname=postgresql://postgres:123456@127.0.0.1:5432/postgres -s | SQL_TYPE=postgresql node sql2adoc.js /tmp/pg_docs

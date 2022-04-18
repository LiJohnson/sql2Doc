# sql2Doc

## usage

mysqldump -h $HOST -P $PORT -u $USER -p$PASS  -d $DB | node sql2gitbook.js $OUT
mysqldump -h $HOST -P $PORT -u $USER -p$PASS  -d $DB | node sql2adoc.js $OUT

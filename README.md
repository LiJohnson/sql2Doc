# sql2Doc

## usage
mysqldump -h $HOST -P $PORT -u $USER -p$PASS  -d $DB | node json2gitbook.js $OUT

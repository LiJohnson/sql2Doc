# mysqldump -plcs -d shuzigongchang | node sql2erDiagram.js  /tmp/1
# http://mysql.myfriends973.com
# 49.7.225.253
# patent6_qualify
# Y3SR7WhSa2MA8TPS


OUT=/tmp/sql_doc
DB=patent6_qualify
mkdir $OUT
rm -rf $OUT/*

mysqldump -h49.7.225.253 -upatent6_qualify -pY3SR7WhSa2MA8TPS -d $DB | node sql2adoc.js $OUT
asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 $OUT/sql.adoc -o $OUT/sql-doc.html

mysqldump -h49.7.225.253 -upatent6_qualify -pY3SR7WhSa2MA8TPS -d $DB | node sql2erDiagram.js $OUT/数据表关系.md
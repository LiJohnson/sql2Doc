#!/bin/bash
# by lcs
# 2019-04-26

OUT=/tmp/sql_doc
mkdir $OUT
rm -rf $OUT/*

#sql=$(mysqldump -h kx-mysql -u root -proot -d kx_salary)
sql=$(mysqldump -h 192.168.1.109 -u root -p123456 -d microgrid)
# sql=$(mysqldump -h10.9.0.5 -ugas -pgas -d microgrid)

# echo $sql
# sql=$(cat /tmp/1)
echo $sql | node sql2adoc.js $OUT
asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 $OUT/sql.adoc -o $OUT/sql-doc.html
echo $sql | node sql2erDiagram.js $OUT/数据表关系.md

mmdc -i  $OUT/数据表关系.md -o  $OUT/数据表关系.svg

echo $OUT/sql.adoc
echo $OUT/sql-doc.html
echo $OUT/数据表关系.md
echo $OUT/数据表关系.svg

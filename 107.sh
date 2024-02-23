#!/bin/bash
# by lcs
# 2019-04-26

OUT=/tmp/sql_doc
DB=zhibao
mkdir $OUT
rm -rf $OUT/*

mysqldump -h10.9.0.5 -ugas -pgas -d $DB | node sql2adoc.js $OUT
asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 $OUT/sql.adoc -o $OUT/sql-doc.html

mysqldump -h10.9.0.5 -ugas -pgas -d $DB | node sql2erDiagram.js $OUT/数据表关系.md

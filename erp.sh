#!/bin/zsh
# by lcs
# 2019-04-26

pushd $(dirname $0)
OUT=/tmp/sql_doc
mkdir $OUT
rm -rf $OUT/*

sql=$(mysqldump -h192.168.1.109 -uerp -perp -d --compact --databases erp_ht | sed -e 's/^\/\*![0-4][0-9]\{4\}.*\/;$//g')

echo $sql | node sql2adoc.js $OUT
echo $sql | node sql2md.js $OUT
echo $sql | node pd.js $OUT
asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 $OUT/sql.adoc -o $OUT/sql-doc.html
echo $sql | node sql2erDiagram.js $OUT/数据表关系.md

# mmdc --configFile=/Users/lcs/github/sql2Doc/mmdc-config.json \
#   --backgroundColor="#252a34" \
#   -i  $OUT/数据表关系.md -o  $OUT/数据表关系.svg
mmdc -t dark -b '#292f3c'  -i  $OUT/数据表关系.md -o  $OUT/数据表关系.svg
echo "$sql" > $OUT/db.sql
echo "$sql" > /Users/Shared/data/kx/erp/db/9.erp_ht.sql

echo $OUT/sql.adoc
echo $OUT/sql-doc.html
echo $OUT/数据表关系.md
echo $OUT/数据表关系.svg
echo $OUT/pd.pdm
echo $OUT/db.sql

scp $OUT/pd.pdm win10.jh.com:/c/Users/lcs/Desktop/erp-db-designer/erp/哈尔滨变压器.pdm
scp $OUT/sql-doc.html zs-109:/tmp/erp/erp_ht.html

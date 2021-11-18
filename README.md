# sql2Doc

## usage demo

```shell

OUT=/tmp/sql_doc
mkdir $OUT
rm -rf $OUT/*

cat  /tmp/1 | node sql2adoc.js $OUT
asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 $OUT/sql.adoc -o $OUT/sql-doc.html
```

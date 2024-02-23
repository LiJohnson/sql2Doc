#!/bin/bash
# by lcs
# 2019-04-26


 /usr/local/opt/postgresql@15/bin/pg_dump --dbname=postgresql://postgres:123456@192.168.1.110:5432/postgres -s | SQL_TYPE=postgresql node sql2adoc.js /tmp/pg_docs


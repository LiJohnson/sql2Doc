/**
 * by lcs
 * 2019-04-22
 */

/**
{
    name: "table name",
    comment: "table comment",
    columns: [{
        name: "column name",
        type: "data type",
        canNull: "can be null",
        default: "default value",
        comment: "column comment",
        keyTypes: "PRIMARY|INDEX|FOREIGN"
    }]
}
**/

/**

## IDEA

create table USER_INFO
(
  ID NUMBER(18) not null
    constraint USER_PK
      primary key,
  USER_NAME VARCHAR2(50) not null,
  NAME VARCHAR2(50),
  PASSWORD VARCHAR2(50) not null,
  SALT VARCHAR2(20) not null,
  ROLE VARCHAR2(50),
  CREATE_TIME DATE,
  IS_DEL NUMBER(1)
)
/

comment on table USER_INFO is '后台用户'
/

comment on column USER_INFO.ID is '主键'
/

comment on column USER_INFO.USER_NAME is '用户名'
/

comment on column USER_INFO.NAME is '姓名'
/

comment on column USER_INFO.PASSWORD is '密码'
/

comment on column USER_INFO.SALT is 'salt值'
/

comment on column USER_INFO.ROLE is '角色'
/

comment on column USER_INFO.CREATE_TIME is '创建时间'
/

comment on column USER_INFO.IS_DEL is '是否删除'
/

create unique index DATE_USER_NAME_UINDEX
  on USER_INFO (USER_NAME)
/
*/

/**********************************************************************************/

/**
 * PLsql

create table USER_INFO
(
  id          NUMBER(18) not null,
  user_name   VARCHAR2(50) not null,
  name        VARCHAR2(50),
  password    VARCHAR2(50) not null,
  salt        VARCHAR2(20) not null,
  role        VARCHAR2(50),
  create_time DATE,
  is_del      NUMBER(1)
)
;
comment on table USER_INFO
  is '后台用户';
comment on column USER_INFO.id
  is '主键';
comment on column USER_INFO.user_name
  is '用户名';
comment on column USER_INFO.name
  is '姓名';
comment on column USER_INFO.password
  is '密码';
comment on column USER_INFO.salt
  is 'salt值';
comment on column USER_INFO.role
  is '角色';
comment on column USER_INFO.create_time
  is '创建时间';
comment on column USER_INFO.is_del
  is '是否删除';
create unique index DATE_USER_NAME_UINDEX on USER_INFO (USER_NAME);
alter table USER_INFO
  add constraint USER_PK primary key (ID);
 */

/**
 * 获取所有表、字段注释
 */
function getComments(text) {
    let comments = {};
    (text.match(/comment\son\s(table|column)\s[^\/]+\n\//ig) || [])
        .forEach(line => {
            let name = line.replace(/^comment\son\s(table|column)\s/, '').match(/^[\w\.]+/)[0];
            let comment = line.replace(/^comment\son\s(table|column)\s/, '').split(' is ').pop().replace(/\n\/$/, '').replace(/^'|'$/g, '');
            comments[name] = comment;
        });
    return comments;
}

/**
 * 所引信息
 */
function getKeyType(text) {
    let indexs = {};
    (text.match(/create[\s\w]+index\w\n\s*on[^\/]+\n\//ig) || [])
        .map(line => line.replace(/^create[\s\w]+index\w\n/i, ''))
        .map(line => line.replace(/\n\/$/, ''))
        .map(line => line.match(/on[^\/]+/)[0].replace(/\s*on\s*/i, ''))
        .forEach(line => {
            let table = line.split(' ')[0];
            line.match(/\([\)]+\)/)[0].replace(/^\(|\)$/, '').split(',').forEach(col => {
                indexs[`${table}.${col}`] = ['INDEX'];
            })
        });
    return indexs;
}
/**
 * 列信息
 */
function getColumns(craeteTableText, comments, keyTypes, tableName) {
    return craeteTableText
        .replace(/^CREATE[^(]+\(/i, '')
        .replace(/\s*SEGMENT\sCREATION[^;]+/i, '')
        // .replace(/\n\)\n\/$/, '')
        .trim()
        .match(/[^,]+(NUMBER\([\d\,\s]+\))?[^,]*(,\n|\n\))/gi)
        .map(line => {
            let lineArr = line.trim().split(/\s+/);
            let column = {};
            column.name = lineArr[0];
            column.type = lineArr[1].replace(/\,$/g, '').replace(/\n\)$/,'');
            column.canNull = line.match(/NOT NULL/i) ? 'N' : 'Y';

            column.default = (line.match(/DEFAULT\s\S+[\s,]/i) || [""])[0].match(/\s.+/);
            column.default = (column.default || [""])[0].trim().replace(/(\'|,$)/g, "") || "";

            column.comment = comments[`${tableName}.${column.name}`];
            column.keyTypes = keyTypes[`${tableName}.${column.name}`] || [];
            if (line.match(/PRIMARY\sKEY/i)) {
                column.keyTypes.push('PRIMARY')
            }
            return column;
        });
}

function toJson(text) {
    text = text.replace(/\)\n\;\n/g,')\n/\n').replace(/;\n/g,'\n\/\n');
    let comments = getComments(text);
    let keyTypes = getKeyType(text);
    return (text.match(/CREATE\s+TABLE[^\/]+\n\//ig) || []).map(craeteTableText => {
        let table = {};
        table.name = craeteTableText.match(/^CREATE\s+TABLE\s+[`\w]+/i)[0].replace(/^CREATE\s+TABLE\s+/i, '').replace(/`/g, '');
        table.comment = comments[table.name];
        // console.log("table.comment",table.comment,table.name)
        table.cloumns = getColumns(craeteTableText, comments, keyTypes, table.name)
        return table;
    })
}

function readFromStdin() {
    let p = new Promise((ok, refuse) => {
        var textArray = [];
        process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            let chunk = process.stdin.read();
            if (chunk !== null) {
                textArray.push(chunk)
            }
        });

        process.stdin.on('end', () => {
            let data = toJson(textArray.join(''));
            ok(data)
            console.debug(JSON.stringify(data, ' ', ' '));
        });
    });
    return p;
}

exports.toJson = toJson;
exports.readFromStdin = readFromStdin;
// readFromStdin()
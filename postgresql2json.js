/**
 * by lcs
 * 2023-03-20
 * 解析postgresql
 */

// console.log(readFromStdin().then(a=>console.log(a)))
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
SET default_tablespace = '';
SET default_table_access_method = heap;
CREATE TABLE public.device_metrics (
    "time" timestamp with time zone NOT NULL,
    ctrl_machine character varying(100) NOT NULL,
    org_code character varying(100) NOT NULL,
    device_id character varying(100) NOT NULL,
    metrics_key character varying(100) NOT NULL,
    metrics_value double precision
);


ALTER TABLE public.device_metrics OWNER TO postgres;
COMMENT ON TABLE public.device_metrics is '数据采集';
COMMENT ON COLUMN public.device_metrics."time" IS '时间';
COMMENT ON COLUMN public.device_metrics.ctrl_machine IS '机房';
COMMENT ON COLUMN public.device_metrics.org_code IS '企业';
COMMENT ON COLUMN public.device_metrics.device_id IS '设备id';
COMMENT ON COLUMN public.device_metrics.metrics_key IS '指标名';
COMMENT ON COLUMN public.device_metrics.metrics_value IS '指标值';
COPY public.device_metrics ("time", ctrl_machine, org_code, device_id, metrics_key, metrics_value) FROM stdin;
\.
CREATE INDEX device_metrics_time_idx ON public.device_metrics USING btree ("time" DESC);
CREATE TRIGGER ts_insert_blocker BEFORE INSERT ON public.device_metrics FOR EACH ROW EXECUTE FUNCTION _timescaledb_internal.insert_blocker();
GRANT SELECT ON TABLE public.device_metrics TO zsyc;
*/

/**
 * 获取所有表、字段注释
 */
function getComments(text) {
    let comments = {};
    (text.match(/comment\son\s(table|column)\s[^;]+;/ig) || [])
        .forEach(line => {
            let colInfo = line.replace(/^comment\son\s(table|column)\s[^\.]+\./i, '');
            let name = colInfo.match(/^[\w\."]+/)[0];
            let comment = colInfo.split(/\s+is\s+/i).pop().replace(/\n\/$/, '').replace(/^'|';$/g, '');
            comments[name] = comment;
        });
    return comments;
}

/**
 * 表注释
 */
function getTableComment(craeteTableText) {
    // console.debug("craeteTableText",craeteTableText)
    let comment = craeteTableText.match(/\)[^\)]+COMMENT=[\s\S]+;$/gi);
    // console.debug(comment)
    if (!comment) return "";
    return comment.pop().match(/COMMENT=\S+/i).pop().replace(/COMMENT=/i, '').replace(/'|;/g, '');
}

/**
 * 所引信息
 */
function getKeyType(craeteTableText,columnName) {
    let keyTypes = [];
    let lineArr = craeteTableText
        .split('\n')
        .map(line=>line.trim());

    return lineArr.filter(line=>{
        return line.indexOf('PRIMARY KEY') == 0 && line.indexOf('`' + columnName + '`') != -1
    }).map(line=>'PRIMARY').concat(lineArr.filter(line=>{
        return line.indexOf('KEY') == 0 && line.indexOf('`' + columnName + '`') != -1
    }).map(line=>'INDEX'));
}
/**
 * 列信息
 */
function getColumns(craeteTableText,comments,tableName) {
    return craeteTableText.replace(/^[^\(]+\(/,'').match(/\s+"?\w+"?\s+\w+(\s+.+)?/gi)
        .filter(line=>/^\s+/.test(line))
        .map(line=>{
            let lineArr = line.trim().split(' ');
            let column = {};
            column.name = lineArr[0];
            column.type = lineArr[1].replace(/\,$/g,'');
            column.canNull = line.match(/NOT NULL/i) ? 'N' : 'Y';

            //fixme
            column.default = (line.match(/DEFAULT\s\S+[\s,]/i)||[""])[0].match(/\s.+/);
            column.default = (column.default||[""])[0].trim().replace(/(\'|,$)/g,"") || "";

            column.comment = comments[`${tableName}.${column.name}`]
            //fixme
            column.keyTypes = getKeyType(craeteTableText,column.name);
            return column;
        });
}

function toJson(text) {
    let comments = getComments(text);
    let createTableReg = /CREATE\s+TABLE[^;]+['\)];/gi
    let match = text.match( createTableReg )
    return (match||[]).map(craeteTableText => {
        let table = {};
        table.name = craeteTableText.match(/^CREATE\s+TABLE\s+[^\(]+\(/i)[0].replace(/^CREATE\s+TABLE\s+/, '').replace(/\($/g, '').split('.').pop().trim();
        table.comment = comments[table.name]
        table.cloumns = getColumns(craeteTableText,comments,table.name)
        return table;
    })
}


exports.toJson = toJson;
// debug
require("./readFromStdin").readFromStdin().then(text=>console.log(JSON.stringify(toJson(text))))
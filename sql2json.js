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
CREATE TABLE `gps_message` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sid` varchar(50) DEFAULT NULL,
  `device_ip` varchar(20) DEFAULT NULL,
  `device_port` int(11) DEFAULT NULL,
  `data_source` varchar(20) DEFAULT NULL,
  `recive_time` datetime(6) DEFAULT NULL,
  `weight` decimal(20,3) DEFAULT NULL COMMENT '载重（吨）',
  `iz_supp` int(11) DEFAULT 0 COMMENT '是否补传（0实时、1补传）',
  `lat` decimal(20,15) DEFAULT NULL,
  `lon` decimal(20,15) DEFAULT NULL,
  `speed` decimal(20,15) DEFAULT NULL COMMENT '速度（km/h）',
  `iz_weight_effective` int(11) DEFAULT 1 COMMENT '吨位是否有效（1有效、0无效）',
  `direction` decimal(10,6) DEFAULT NULL,
  `create_time` datetime DEFAULT NULL,
  `height` decimal(20,3) DEFAULT NULL COMMENT '高程（米）',
  `weight_waring` decimal(20,3) DEFAULT NULL COMMENT '载重报警：0：代表正常，1代表重量有突然下降，2代表重量有突然上升',
  `weight_status` decimal(20,3) DEFAULT NULL COMMENT '载重状态1个字节，0：代表车辆正常载货，1代表车辆空载，2代表车辆重载，3代表车辆超载',
  `decode_err_msg` varchar(500) DEFAULT NULL COMMENT '解析过程中发生的错误',
  `gps_data` tinyblob NOT NULL COMMENT 'gps原始报文数据',
  `sharding_key` varchar(20) DEFAULT NULL COMMENT '用于分表(receive_time + sid)',
  PRIMARY KEY (`id`),
  KEY `gps_message_index1` (`sid`,`recive_time`,`weight_status`),
  KEY `gps_message_index2` (`recive_time`),
  KEY `gps_message_index3` (`sid`),
  KEY `gps_message_sharding_key_index` (`sharding_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备的gps数据';
*/

/**
 * 表注释
 */
function getTableComment(craeteTableText) {
    console.debug(craeteTableText)
    let comment = craeteTableText.match(/\)[^\)]+COMMENT=[\s\S]+;$/gi);
    console.debug(comment)
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
function getColumns(craeteTableText) {
    return craeteTableText
        .split('\n')
        .filter(line=>line.trim().match(/^`/))
        .map(line=>{
            let lineArr = line.trim().split(' ');
            let column = {};
            column.name = line.match(/`.+`/).pop().replace(/`/g,'');
            column.type = lineArr[1].replace(/\,$/g,'');
            column.canNull = line.match(/NOT NULL/i) ? 'N' : 'Y';

            column.default = (line.match(/DEFAULT\s\S+[\s,]/i)||[""])[0].match(/\s.+/);
            column.default = (column.default||[""])[0].trim().replace(/(\'|,$)/g,"") || "";

            column.comment = (line.match(/COMMENT\s'[^']+'/) || [''])[0].replace(/^COMMENT\s'/,'').replace(/'$/,'');
            column.keyTypes = getKeyType(craeteTableText,column.name);
            return column;
        });
}

function toJson(text) {
    return text.match(/CREATE\s+TABLE[^;]+;/ig).map(craeteTableText => {
        let table = {};
        table.name = craeteTableText.match(/^CREATE\s+TABLE\s+[`\w]+/i)[0].replace(/^CREATE\s+TABLE\s+/, '').replace(/`/g, '');
        table.comment = getTableComment(craeteTableText);
        table.cloumns = getColumns(craeteTableText)
        return table;
    })
}

function readFromStdin() {
    let p = new Promise((ok,refuse)=>{
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
            console.debug(JSON.stringify(data,' ',' '));
        });
    });
    return p;
}

exports.toJson = toJson;
exports.readFromStdin = readFromStdin;
// readFromStdin()
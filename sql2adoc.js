/**
 * by lcs
 * 2019-04-22
 */
const fs = require('fs');
let outPut = process.argv[2];

console.assert(outPut, "无效输出目录");

function writeContent(fileName, content) {
    console.debug(`${outPut}/${fileName}`)
    fs.writeFileSync(`${outPut}/${fileName}`, content);
};
function formatType(type) {
    if (type.match(/enum/i)) return "string";
    if (type.match(/varchar/i)) return "string";
    if (type.match(/int/i)) return "number";
    if (type.match(/time/i)) return "datetime";
    if (type.match(/date/i)) return "datetime";
    if (type.match(/NUMBER\(18\)/i)) return "long";
    if (type.match(/NUMBER\((4|1)\)/i)) return "int";
    if (type.match(/NUMBER\(\d+\,\d+\)/i)) return "double";

    if (!/^enum.+\,.+/.test("enum('EXCHANGE','REFUND','FOLLOWUP','PROCESSED')")) return type;
    return type.replace(/\,/g, ',<br/>');
}
function formatName(column) {
    if (column.keyTypes.indexOf('PRIMARY') != -1) {
        return `__**${column.name}**__`
    }
    if (column.keyTypes.indexOf('INDEX') != -1) {
        return `__${column.name}__`
    }
    return column.name;
}
require('./sql2json').readFromStdin().then(data => {

    let readme = ['= sql doc\n', '[options="header", cols=".^1a,.^3a,.^9a"]','|=== ', '| | 表 | 注释 '].concat(data.map((table, index) => `|${index + 1}| ${table.name}|${table.comment}`)).concat('|=== \n');
    let contents = data.map(table => {
        let content = [`== ${table.name}`];
        content.push('\n');
        content.push(table.comment);
        content.push('\n');
        content.push('[options="header", cols=".^1a,.^3a,.^3a,.^1a,.^3a,.^5a"]');
        content.push('|===');
        content.push(`|序号|字段名|数据类型|可空|默认|描述`);
        // content.push(`|:--|:----|:------|:--|:---|:--|`);
        content = content.concat(table.cloumns.map((column, index) => `|${index + 1}|${formatName(column)}|${formatType(column.type)}|${column.canNull}|${column.default}|${column.comment}`));
        content.push('|===');
        content.push('\n');
        return content.join('\n');
    });
    writeContent('sql.adoc', readme.concat(contents).join('\n'));
}).then(()=>{
    console.log(`asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 ${outPut}/sql.adoc -o ${outPut}/sql.html`)
});


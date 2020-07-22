/**
 * by lcs
 * 2019-04-22
 */
const fs = require('fs');
let outPut = process.argv[2];

console.assert(outPut,"无效输出目录");

function writeContent(fileName,content){
    console.debug(`${outPut}/${fileName}`)
    fs.writeFileSync(`${outPut}/${fileName}`, content);
};
function formatType(type){
    if(type.match(/enum/i))return "string";
    if(type.match(/varchar/i))return "string";
    if(type.match(/int/i))return "number";
    if(type.match(/time/i))return "datetime";
    if(type.match(/date/i))return "datetime";
    if(!/^enum.+\,.+/.test("enum('EXCHANGE','REFUND','FOLLOWUP','PROCESSED')"))return type;
    return type.replace(/\,/g,',<br/>');
}
function formatName(column){
    if(column.keyTypes.indexOf('PRIMARY') != -1){
        return `<font color="#2196F3"><b>${column.name}</b></font>`
    }
    if(column.keyTypes.indexOf('INDEX')!= -1){
        return `<font color="#c57907"><b>${column.name}</b></font>`
    }
    return column.name;
}
require('./sql2json').readFromStdin().then(data=>{
    let summary = ['# Summary'].concat(data.map(table=>`* [${table.name}/${table.comment}](${table.name}.md)`));
    let readme = ['| | 表 | 注释 |','|:--|:--|:----|'].concat(data.map((table,index)=>`|${index+1}| [${table.name}](${table.name}.md)|[${table.comment}](${table.name}.md)|`));


    writeContent('README.md',readme.join('\n'));

    writeContent('SUMMARY.md',summary.join('\n\n'));

    data.forEach(table=>{
        let content = [`# ${table.name}`];
        content.push('\n');
        content.push(table.comment);
        content.push('\n');
        content.push(`|序号|字段名|数据类型|可空|默认|描述|`);
        content.push(`|:--|:----|:------|:--|:---|:--|`);
        content = content.concat(table.cloumns.map((column,index)=>`|${index+1}|<font >${formatName(column)}|${formatType(column.type)}|${column.canNull}|${column.default}|${column.comment}|`));
        writeContent(`${table.name}.md`,content.join('\n'))
    });

});


/**
 * by lcs
 * 2022-04-20
 */
const fs = require('fs');
let outPutFile = process.argv[2];

console.assert(outPutFile, "无效输出文件");

function writeContent(content) {
    fs.writeFileSync(`${outPutFile}`, content);
};
function formatType(type) {
    if (type.match(/varchar/i)) return "string";
    if (type.match(/int/i)) return "number";
    if (type.match(/time/i)) return "datetime";
    if (type.match(/date/i)) return "datetime";
    return type.split('(')[0]
}
function formatComment(comment){
    comment = (comment||'').match(/^[^\s\(]+/)
    return comment ? comment[0] : '-'
}

require('./sql2json').readFromStdin().then(data=>{
    return data.sort((table1,table2)=>table1.name.localeCompare(table2.name))
}).then(data=>{
     return data
     // .filter(table=>!/^sys/.test(table.name))
     .map(table=>{
        table.name = table.name.replace(/^sys_/,'')
        return table
    })
}).then(data => {
    let now = new Date()
    let contents = data.map(table => {
        let content = [`${table.name} {`];
        content = content.concat(table.cloumns.map((column) => `    ${formatType(column.type)} ${column.name} "${formatComment(column.comment )}"`));
        content.push('}\n');
        return content.join('\n');
    });

    let tableNames = data.map(t=>t.name)
    let refContent = data.map(table => table.cloumns
        .map(c=>c.name)
        .map(colName=>colName.replace(/_id$/,''))
        .filter(refTable=>tableNames.includes(refTable))
        .map(refTable=>`${refTable} ||--o{ ${table.name} : ${refTable}_id`)
    ).flat();

    let readme = ['# 数据表关系','','黎创盛 <lcs@gzzsyc.cn>',`(${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()})\n`]
    writeContent( readme.concat(['```mermaid','erDiagram','']).concat(contents).concat(refContent).concat(['```']).join('\n'));
});


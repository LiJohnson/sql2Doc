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

// const colRefsAlias = { }
const colRefsAlias = { 
    "users":["user", "room"],
    "actives":["active"],
    "coupons":["coupon"],
}

const fileCols = ["create_time","create_by","update_by","update_time","del_flag","delete_by","delete_time","disable_by","disable_time",'disable']

const fromAlias = (tableNames,refTable)=>{
    let t = Object.keys(colRefsAlias).filter(k=>colRefsAlias[k].includes(refTable))[0]
    return t && {name:t,col:`${refTable}_id`}
}


require('./sql2json').readFromStdin().then(data=>{
    return data.sort((table1,table2)=>table1.name.localeCompare(table2.name))
}).then(data=>{
     return data
     // .filter(table=>!/^sys/.test(table.name))
     .map(table=>{
        // table.name = table.name.replace(/^sys_/,'').replace(/^\w\w\w_/,'')
        return table
    })
}).then(data=>{
    return data.map(table=>{
        table.cloumns = table.cloumns.map(col=>({...col,name:col.name.replace(/^[_]+/,'')}))
        return table
    })
}).then(data => {
    let now = new Date()
    let tableNames = data.map(t=>t.name)
    let refInfo = data.map(table => table.cloumns
        .map(c=>c.name)
        .map(colName=>colName.replace(/_id$/,''))
        .map(refTable=>tableNames.includes(refTable) ? refTable : fromAlias(tableNames,refTable))
        .filter(refTable=>refTable)
        .map( refTable => ({refTableName: refTable.name || refTable , tableName:table.name , refTableCol: refTable.col || (refTable+'_id') } ) )
    ).flat()

    let contents = data
        // .filter( table=>refInfo.map(a=>[a.refTableName,a.tableName]).flat().includes(table.name) )
        .map(table => {
        let content = [`${table.name} {`];
        // console.log(table.cloumns)
        content = content.concat(table.cloumns.filter(column=>!!column.comment).filter(column=>!fileCols.includes(column.name)).map((column) => `    ${formatType(column.type)} ${column.name} "${formatComment(column.comment )}"`));
        content.push('}\n');
        return content.join('\n');
    });

    let refContent = data.map(table => {
        return table.cloumns.filter(col=>col.refTable).map(col=>`${ col.refTable } ||--o{ ${table.name} : ${col.name}`)
    }).flat()

    let readme = ['# 数据表关系','','黎创盛 <lcs@gzzsyc.cn>',`(${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()})\n`]
    writeContent( readme.concat(['```mermaid','erDiagram','']).concat(contents).concat(refContent).concat(['```']).join('\n'));
    // console.log(['erDiagram',''].concat(contents).concat(refContent).join('\n'))
});


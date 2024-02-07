/**
 * by lcs
 * 2019-04-22
 */
const fs = require('fs');
let outPut = process.argv[2];

console.assert(outPut, "无效输出目录");

function writeContent(fileName, content) {
    // console.debug(`${outPut}/${fileName}`)
    fs.writeFileSync(`${outPut}/${fileName}`, content);
};
function formatType(type) {
    return type
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

const colRefsAlias = { 
    "users":["user", "room"],
    "actives":["active"],
    "coupons":["coupon"],
}


const fromAlias = (tableNames,refTable)=>{
    let t = Object.keys(colRefsAlias).filter(k=>colRefsAlias[k].includes(refTable))[0]
    return t && {name:t,col:`${refTable}_id`}
}

function columnNode(column,tableName){
    return `
    <o:Column Id="C__${tableName}__${column.name}">
        <a:Name>${column.comment||column.name}</a:Name>
    <a:Code>${column.name}</a:Code>
    <a:CreationDate>1707286833</a:CreationDate>
    <a:Creator>lcs</a:Creator>
    <a:ModificationDate>1707286833</a:ModificationDate>
    <a:Modifier>lcs</a:Modifier>
    <a:Comment>${column.comment||column.name}</a:Comment>
    <a:DefaultValue>${column.default}</a:DefaultValue>
    <a:DataType>${column.type}</a:DataType>
    <a:Length></a:Length>
    </o:Column>
    `
}

let uuid = 0;
function refs({refTableName,tableName,refTableCol}){
    return `<o:Reference Id="ref__${refTableName}__${tableName}__${refTableCol}">
    <a:Name>FK__${refTableName}__${tableName}__${refTableCol}</a:Name>
    <a:Code>FK__${refTableName}__${tableName}__${refTableCol}</a:Code>
    
    <c:ParentTable>
        <o:Table Ref="T__${refTableName}" />
    </c:ParentTable>
    <c:ChildTable>
        <o:Table Ref="T__${tableName}" />
    </c:ChildTable>
    <c:Joins>
        <o:ReferenceJoin Id="uuid_${uuid++}">
            <c:Object1>
                <o:Column Ref="C__${refTableName}__id" />
            </c:Object1>
            <c:Object2>
                <o:Column Ref="C__${tableName}__${refTableCol}" />
            </c:Object2>
        </o:ReferenceJoin>
    </c:Joins>
</o:Reference>`
}
require('./sql2json').readFromStdin().then(data=>{
    return data.sort((table1,table2)=>table1.name.localeCompare(table2.name))
}).then(data=>{
    return data
    // .filter(table=>!/^sys/.test(table.name))
    .map(table=>{
       table.name = table.name.replace(/^sys_/,'').replace(/^sal_/,'')
       return table
   })
}).then(data => {
    let ts = Math.floor(new Date()/1000)

    let contents = data.map((table,index) => {
        return `
        <o:Table Id="T__${table.name}">
        <a:ObjectID>E066AAF7-6AEF-488B-9675-D0770FDAE997</a:ObjectID>
        <a:Name>${table.comment || table.name}</a:Name>
        <a:Code>${ table.name}</a:Code>
        <a:Comment>${table.comment || table.name}</a:Comment>
        <a:CreationDate>1707286833</a:CreationDate>
        <a:Creator>lcs</a:Creator>
        <a:ModificationDate>1707286833</a:ModificationDate>
        <a:Modifier>lcs</a:Modifier>
        <c:Columns>
            ${table.cloumns.map( (col,col_index)=>columnNode(col,table.name)).join("")}
        </c:Columns>
        <c:Keys>
            <o:Key Id="PK__${table.name}">
            <a:Name>PK__${table.name}"</a:Name>
            <a:Name>PK__${table.name}"</a:Name>
            <c:Key.Columns>
            <o:Column Ref="C__${table.name}__id" />
            </c:Key.Columns>
            </o:Key>
        </c:Keys>
        <c:PrimaryKey>
            <o:Key Ref="PK__${table.name}"/>
        </c:PrimaryKey>

        </o:Table>
        `
        // let content = [`## ${index+1}. ${table.name}`];
        // content.push(`<span id="${table.name.toLocaleLowerCase()}"></span>\n`);
        // content.push(table.comment || table.name);
        // content.push('\n');
        // content.push(`|序号|字段名|数据类型|可空|默认|描述|`);
        // content.push('|:---|:---|:---|:---|:---|:---|');
        // content = content.concat(table.cloumns.map((column, index) => `|${index + 1}|${formatName(column)}|${formatType(column.type).toLocaleUpperCase()}|${column.canNull}|${column.default}|${column.comment||''}`));
        // content.push('\n');
        // return content.join('\n');
    });

    let tableSymbol = data.map((table,index) => {
        return `
        <o:TableSymbol Id="TS__${table.name}">
            <a:CreationDate>1707295445</a:CreationDate>
            <a:ModificationDate>1707295448</a:ModificationDate>
            <a:IconMode>-1</a:IconMode>
            <a:Rect>((-2401,-10996), (2398,-6997))</a:Rect>
            <a:LineColor>12615680</a:LineColor>
            <a:FillColor>16570034</a:FillColor>
            <a:ShadowColor>12632256</a:ShadowColor>
        
            <a:BrushStyle>6</a:BrushStyle>
            <a:GradientFillMode>65</a:GradientFillMode>
            <a:GradientEndColor>16777215</a:GradientEndColor>
            <c:Object>
                <o:Table Ref="T__${table.name}"/>
            </c:Object>
        </o:TableSymbol>
        `
  
    });
    let refSymbols = function({refTableName,tableName,refTableCol}){
        return `
        <o:ReferenceSymbol Id="uuid_${uuid++}">
            <a:CreationDate>1707314909</a:CreationDate>
            <a:ModificationDate>1707314909</a:ModificationDate>
            <a:Rect>((42655,3945), (43905,14037))</a:Rect>
            <a:ListOfPoints>((43280,4345),(43280,13637))</a:ListOfPoints>
            <a:CornerStyle>1</a:CornerStyle>
            <a:ArrowStyle>1</a:ArrowStyle>
            <a:LineColor>12615680</a:LineColor>
            <a:ShadowColor>12632256</a:ShadowColor>
            <a:FontList>CENTER 0 新宋体,8,N
            SOURCE 0 新宋体,8,N
            DESTINATION 0 新宋体,8,N</a:FontList>

            <c:SourceSymbol>
                <o:TableSymbol Ref="TS__${refTableName}" />
            </c:SourceSymbol>
            <c:DestinationSymbol>
                <o:TableSymbol Ref="TS__${tableName}" />
            </c:DestinationSymbol>
            <c:Object>
                <o:Reference Ref="ref__${refTableName}__${tableName}__${refTableCol}" />
            </c:Object>
        </o:ReferenceSymbol>
        `
    }

    let tableNames = data.map(t=>t.name)
    let refList = data.map(table => table.cloumns
        .map(c=>c.name)
        .map(colName=>colName.replace(/_id$/,''))
        .map(refTable=>tableNames.includes(refTable) ? refTable : fromAlias(tableNames,refTable))
        .filter(refTable=>refTable)
        .map( refTable => ({refTableName: refTable.name || refTable , tableName:table.name , refTableCol: refTable.col || (refTable+'_id') } ) )
    ).flat();
    let refInfo = refList.map(ref=>refs(ref))
    let refSymbol = refList.map(ref=>refSymbols(ref))
// console.log(refInfo)
    writeContent('pd.pdm', 
    `<?xml version="1.0" encoding="UTF-8"?>
    <?PowerDesigner AppLocale="UTF16" ID="{0660C81F-B5A2-435A-AF99-55E6E1A8E951}" Label="" LastModificationDate="1707291982" Name="12" Objects="543" Symbols="24" Target="MySQL 5.0" Type="{CDE44E21-9669-11D1-9914-006097355D9B}" signature="PDM_DATA_MODEL_XML" version="16.5.0.3982"?>
    <Model xmlns:a="attribute" xmlns:c="collection" xmlns:o="object">
    
        <o:RootObject Id="o1">
            <c:Children>
                <o:Model Id="o2">
                    <a:ObjectID>0660C81F-B5A2-435A-AF99-55E6E1A8E951</a:ObjectID>
                    <a:Name>哈尔滨变压器</a:Name>
                    <a:Code>hrbbyq</a:Code>
                    <a:CreationDate>1707286745</a:CreationDate>
                    <a:Creator>lcs</a:Creator>
                    <a:ModificationDate>1707286745</a:ModificationDate>
                    <a:Modifier>lcs</a:Modifier>
                    
                    <c:DBMS>
                        <o:Shortcut Id="o3">
                            <a:ObjectID>5A63634E-2894-42CD-AFE6-05FB51C698BC</a:ObjectID>
                            <a:Name>MySQL 5.0</a:Name>
                            <a:Code>MYSQL50</a:Code>
                            <a:CreationDate>1707286745</a:CreationDate>
                            <a:Creator>lcs</a:Creator>
                            <a:ModificationDate>1707286745</a:ModificationDate>
                            <a:Modifier>lcs</a:Modifier>
                            <a:TargetStereotype />
                            <a:TargetID>F4F16ECD-F2F1-4006-AF6F-638D5C65F35E</a:TargetID>
                            <a:TargetClassID>4BA9F647-DAB1-11D1-9944-006097355D9B</a:TargetClassID>
                        </o:Shortcut>
                    </c:DBMS>
                    <c:DefaultDiagram>
                        <o:PhysicalDiagram Ref="o4" />
                    </c:DefaultDiagram>
                    <c:PhysicalDiagrams>
                        <o:PhysicalDiagram Id="o4">
                            <a:ObjectID>3D6F7E72-D5AE-4F9D-9DCD-E3E57A14749B</a:ObjectID>
                            <a:Name>表结构设计</a:Name>
                            <a:Code>表结构设计</a:Code>
                            <a:CreationDate>1707007941</a:CreationDate>
                            <a:Creator>lcs</a:Creator>
                            <a:ModificationDate>1707295448</a:ModificationDate>
                            <a:Modifier>lcs</a:Modifier>
                            <c:Symbols>
                            ${tableSymbol.join("")}
                            ${refSymbol.join("")}
                            </c:Symbols>
                        </o:PhysicalDiagram>
                    </c:PhysicalDiagrams>
                    <c:Tables>
                        ${contents.join("")}
                    </c:Tables>
    
                    <c:References>
                        ${refInfo.join("")}
                    </c:References>

                    <c:DefaultGroups>
                        <o:Group Id="o500">
                            <a:ObjectID>9C0C6A92-A3A9-4952-9C05-9D9FE25364DE</a:ObjectID>
                            <a:Name>PUBLIC</a:Name>
                            <a:Code>PUBLIC</a:Code>
                            <a:CreationDate>1707286737</a:CreationDate>
                            <a:Creator>lcs</a:Creator>
                            <a:ModificationDate>1707286737</a:ModificationDate>
                            <a:Modifier>lcs</a:Modifier>
                        </o:Group>
                    </c:DefaultGroups>
                    <c:TargetModels>
                        <o:TargetModel Id="o501">
                            <a:ObjectID>C8483651-4FD0-4E8B-9206-AB5C02C27A42</a:ObjectID>
                            <a:Name>MySQL 5.0</a:Name>
                            <a:Code>MYSQL50</a:Code>
                            <a:CreationDate>1707286745</a:CreationDate>
                            <a:Creator>lcs</a:Creator>
                            <a:ModificationDate>1707286745</a:ModificationDate>
                            <a:Modifier>lcs</a:Modifier>
                            <a:TargetModelURL>file:///%_HOME%/Resource Files/DBMS/mysql50.xdb</a:TargetModelURL>
                            <a:TargetModelID>F4F16ECD-F2F1-4006-AF6F-638D5C65F35E</a:TargetModelID>
                            <a:TargetModelClassID>4BA9F647-DAB1-11D1-9944-006097355D9B</a:TargetModelClassID>
                            <a:TargetModelLastModificationDate>1529940666</a:TargetModelLastModificationDate>
                            <c:SessionShortcuts>
                                <o:Shortcut Ref="o3" />
                            </c:SessionShortcuts>
                        </o:TargetModel>
                    </c:TargetModels>
                </o:Model>
            </c:Children>
        </o:RootObject>
    
    </Model>`
    );
}).then(()=>{
    // console.log(`asciidoctor -a doctype=pdf -a toc=left -a toclevels=3 ${outPut}/sql.adoc -o ${outPut}/sql.html`)
});


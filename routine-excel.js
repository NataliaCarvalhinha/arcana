(function(){
  const FORMAT_VERSION=1;
  const MIME="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const MAX_FILE_BYTES=8*1024*1024;
  const SHEETS=["Rotina","Hobbies","Configuração","Instruções"];
  const enc=new TextEncoder();
  const dec=new TextDecoder();

  function xmlEscape(value){
    return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")
  }
  function xmlText(value){
    return String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  }
  function xmlDecode(value){
    return String(value??"").replace(/&quot;/g,"\"").replace(/&apos;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&")
  }
  function columnName(index){
    let n=index+1,name="";
    while(n>0){
      const r=(n-1)%26;
      name=String.fromCharCode(65+r)+name;
      n=Math.floor((n-1)/26)
    }
    return name
  }
  function columnIndex(ref){
    const letters=String(ref||"").match(/[A-Z]+/i)?.[0]||"A";
    let n=0;
    for(const ch of letters.toUpperCase()){
      n=n*26+(ch.charCodeAt(0)-64)
    }
    return Math.max(0,n-1)
  }
  function crc32(bytes){
    let c=~0;
    for(const b of bytes){
      c^=b;
      for(let k=0;k<8;k+=1){
        c=(c>>>1)^(0xedb88320&-(c&1))
      }
    }
    return (~c)>>>0
  }
  function u16(n){return [n&255,(n>>>8)&255]}
  function u32(n){return [n&255,(n>>>8)&255,(n>>>16)&255,(n>>>24)&255]}
  function concat(parts){
    const total=parts.reduce((sum,part)=>sum+part.length,0),out=new Uint8Array(total);
    let offset=0;
    for(const part of parts){
      out.set(part,offset);
      offset+=part.length
    }
    return out
  }
  function makeZip(files){
    const local=[],central=[];
    let offset=0;
    for(const file of files){
      const name=enc.encode(file.name),data=typeof file.data==="string"?enc.encode(file.data):file.data,crc=crc32(data);
      const header=new Uint8Array([
        ...u32(0x04034b50),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0)
      ]);
      local.push(header,name,data);
      central.push(new Uint8Array([
        ...u32(0x02014b50),...u16(20),...u16(20),...u16(0),...u16(0),...u16(0),...u16(0),...u32(crc),...u32(data.length),...u32(data.length),...u16(name.length),...u16(0),...u16(0),...u16(0),...u16(0),...u32(0),...u32(offset)
      ]),name);
      offset+=header.length+name.length+data.length
    }
    const centralOffset=offset,centralBytes=concat(central);
    const end=new Uint8Array([...u32(0x06054b50),...u16(0),...u16(0),...u16(files.length),...u16(files.length),...u32(centralBytes.length),...u32(centralOffset),...u16(0)]);
    return new Blob([concat([...local,centralBytes,end])],{type:MIME})
  }
  function attr(tag,name){
    const match=String(tag||"").match(new RegExp(`${name}="([^"]*)"`));
    return match?xmlDecode(match[1]):""
  }
  function sheetXml(name,rows){
    const safeRows=(rows||[]).map(row=>Array.isArray(row)?row:[]);
    const maxCols=Math.max(1,...safeRows.map(row=>row.length));
    const body=safeRows.map((row,rowIndex)=>{
      const cells=row.map((value,colIndex)=>{
        if(value===null||value===undefined||value===""){
          return ""
        }
        const ref=`${columnName(colIndex)}${rowIndex+1}`;
        if(typeof value==="number"&&Number.isFinite(value)){
          return `<c r="${ref}"><v>${value}</v></c>`
        }
        return `<c r="${ref}" t="inlineStr"><is><t>${xmlText(value)}</t></is></c>`
      }).join("");
      return `<row r="${rowIndex+1}">${cells}</row>`
    }).join("");
    const widths=Array.from({length:maxCols},(_,index)=>`<col min="${index+1}" max="${index+1}" width="${index===0?22:24}" customWidth="1"/>`).join("");
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetPr><pageSetUpPr fitToPage="1"/></sheetPr><dimension ref="A1:${columnName(maxCols-1)}${Math.max(1,safeRows.length)}"/><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths}</cols><sheetData>${body}</sheetData>${safeRows.length>1?`<autoFilter ref="A1:${columnName(maxCols-1)}${safeRows.length}"/>`:""}</worksheet>`
  }
  function workbookXml(sheets){
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><workbookPr date1904="false"/><sheets>${sheets.map((sheet,index)=>`<sheet name="${xmlEscape(sheet.name)}" sheetId="${index+1}" r:id="rId${index+1}"/>`).join("")}</sheets></workbook>`
  }
  function workbookRelsXml(sheets){
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((sheet,index)=>`<Relationship Id="rId${index+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index+1}.xml"/>`).join("")}</Relationships>`
  }
  function createWorkbookBlob(workbook){
    const sheets=(workbook?.sheets||[]).filter(sheet=>sheet&&sheet.name&&Array.isArray(sheet.rows));
    if(!sheets.length){
      throw new Error("Nenhuma planilha para exportar.")
    }
    const files=[
      {name:"[Content_Types].xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>${sheets.map((sheet,index)=>`<Override PartName="/xl/worksheets/sheet${index+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}</Types>`},
      {name:"_rels/.rels",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`},
      {name:"docProps/core.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Arcana Routine Workbook</dc:title><dc:creator>Arcana</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created></cp:coreProperties>`},
      {name:"docProps/app.xml",data:`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Arcana</Application></Properties>`},
      {name:"xl/workbook.xml",data:workbookXml(sheets)},
      {name:"xl/_rels/workbook.xml.rels",data:workbookRelsXml(sheets)}
    ];
    sheets.forEach((sheet,index)=>files.push({name:`xl/worksheets/sheet${index+1}.xml`,data:sheetXml(sheet.name,sheet.rows)}));
    return makeZip(files)
  }
  function findEnd(buffer){
    const data=new DataView(buffer);
    for(let i=buffer.byteLength-22;i>=0&&i>buffer.byteLength-66000;i-=1){
      if(data.getUint32(i,true)===0x06054b50){
        return i
      }
    }
    throw new Error("Arquivo .xlsx inválido.")
  }
  async function inflateRaw(bytes){
    if(typeof DecompressionStream!=="function"){
      throw new Error("Este navegador não consegue ler planilhas XLSX compactadas.")
    }
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
    return new Uint8Array(await new Response(stream).arrayBuffer())
  }
  async function unzip(buffer){
    const view=new DataView(buffer),end=findEnd(buffer);
    const count=view.getUint16(end+10,true),centralOffset=view.getUint32(end+16,true),files={};
    let offset=centralOffset;
    for(let i=0;i<count;i+=1){
      if(view.getUint32(offset,true)!==0x02014b50){
        throw new Error("Diretório central XLSX inválido.")
      }
      const method=view.getUint16(offset+10,true),compressedSize=view.getUint32(offset+20,true),nameLen=view.getUint16(offset+28,true),extraLen=view.getUint16(offset+30,true),commentLen=view.getUint16(offset+32,true),localOffset=view.getUint32(offset+42,true);
      const name=dec.decode(new Uint8Array(buffer,offset+46,nameLen));
      const localNameLen=view.getUint16(localOffset+26,true),localExtraLen=view.getUint16(localOffset+28,true);
      const dataStart=localOffset+30+localNameLen+localExtraLen;
      const compressed=new Uint8Array(buffer,dataStart,compressedSize);
      if(method===0){
        files[name]=compressed
      }else if(method===8){
        files[name]=await inflateRaw(compressed)
      }
      offset+=46+nameLen+extraLen+commentLen
    }
    return files
  }
  function parseSharedStrings(xml){
    if(!xml){
      return []
    }
    return [...xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)].map(match=>[...match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(t=>xmlDecode(t[1])).join(""))
  }
  function parseSheet(xml,sharedStrings=[]){
    const rows=[];
    for(const rowMatch of xml.matchAll(/<row\b([^>]*)>([\s\S]*?)<\/row>/g)){
      const rowIndex=Number(attr(rowMatch[1],"r"))||rows.length+1,row=[];
      for(const cellMatch of rowMatch[2].matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)){
        const cellAttrs=cellMatch[1],body=cellMatch[2],idx=columnIndex(attr(cellAttrs,"r"));
        const type=attr(cellAttrs,"t"),valueMatch=body.match(/<v\b[^>]*>([\s\S]*?)<\/v>/),inline=[...body.matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)].map(t=>xmlDecode(t[1])).join("");
        let value="";
        if(type==="s"){
          value=sharedStrings[Number(valueMatch?.[1]||0)]||""
        }else if(type==="inlineStr"||type==="str"){
          value=inline||xmlDecode(valueMatch?.[1]||"")
        }else if(valueMatch){
          const raw=xmlDecode(valueMatch[1]),num=Number(raw);
          value=Number.isFinite(num)&&raw.trim()!==""?num:raw
        }
        row[idx]=value
      }
      rows[rowIndex-1]=row
    }
    while(rows.length&&(!rows[rows.length-1]||rows[rows.length-1].every(value=>value===""||value===undefined))){
      rows.pop()
    }
    return rows.map(row=>row||[])
  }
  function normalizePath(base,target){
    if(target.startsWith("/")){
      return target.slice(1)
    }
    const parts=base.split("/").slice(0,-1).concat(target.split("/")),out=[];
    for(const part of parts){
      if(!part||part==="."){
        continue
      }
      if(part===".."){
        out.pop()
      }else{
        out.push(part)
      }
    }
    return out.join("/")
  }
  async function parseWorkbookBuffer(buffer){
    const files=await unzip(buffer),workbook=files["xl/workbook.xml"];
    if(!workbook){
      throw new Error("Workbook XLSX sem xl/workbook.xml.")
    }
    const workbookXmlText=dec.decode(workbook),relsXml=dec.decode(files["xl/_rels/workbook.xml.rels"]||new Uint8Array()),sharedStrings=parseSharedStrings(files["xl/sharedStrings.xml"]?dec.decode(files["xl/sharedStrings.xml"]):"");
    const rels=new Map([...relsXml.matchAll(/<Relationship\b([^>]*)\/>/g)].map(match=>[attr(match[1],"Id"),attr(match[1],"Target")]));
    const sheets={};
    for(const match of workbookXmlText.matchAll(/<sheet\b([^>]*)\/>/g)){
      const name=attr(match[1],"name"),rid=attr(match[1],"r:id"),target=rels.get(rid);
      if(!name||!target){
        continue
      }
      const path=normalizePath("xl/workbook.xml",target),xml=files[path];
      if(xml){
        sheets[name]={name,rows:parseSheet(dec.decode(xml),sharedStrings)}
      }
    }
    return {formatVersion:FORMAT_VERSION,sheets}
  }
  async function parseWorkbookFile(file){
    if(!file){
      throw new Error("Selecione um arquivo .xlsx.")
    }
    if(file.size>MAX_FILE_BYTES){
      throw new Error("Arquivo muito grande para importar rotina.")
    }
    if(/\.xlsm$/i.test(file.name||"")){
      throw new Error("Arquivos com macros (.xlsm) não são aceitos.")
    }
    if(!/\.xlsx$/i.test(file.name||"")){
      throw new Error("Use um arquivo .xlsx.")
    }
    return parseWorkbookBuffer(await file.arrayBuffer())
  }

  window.ArcanaRoutineExcel={FORMAT_VERSION,MIME,MAX_FILE_BYTES,SHEETS,createWorkbookBlob,parseWorkbookBuffer,parseWorkbookFile,xmlEscape}
})();

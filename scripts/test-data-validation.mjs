import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import {mkdtempSync,writeFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
const dir=mkdtempSync(join(tmpdir(),"carpaintfinder-data-test-"));
const sample={manufacturer:"Example Motors",model:"Example",oemCode:"TEST-123",colorName:"Sample",yearFrom:2020,yearTo:2022,sourceUrl:"https://example.org/reference",sourcePublisher:"Example",sourceTitle:"Reference",reuseRights:"Review required",verification:"pending"};
function check(rows,expected){const file=join(dir,"input.json");writeFileSync(file,JSON.stringify(rows));const result=spawnSync(process.execPath,["scripts/validate-import.mjs",file],{encoding:"utf8"});assert.equal(result.status,expected,JSON.stringify({stdout:result.stdout,stderr:result.stderr}));}
try{check([sample],0);check([{...sample,verification:"verified"}],1);check([{...sample,yearFrom:2025,yearTo:2020}],1);check([{...sample,sourceUrl:"file:///etc/passwd"}],1);check([sample,sample],1);check([{...sample,sourceTitle:""}],1);console.log("Data validation regression tests passed.");}finally{rmSync(dir,{recursive:true,force:true})}

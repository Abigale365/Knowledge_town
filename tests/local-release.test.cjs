'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{freshCachePolicy}=require('../scripts/check-local-release.cjs');
test('local release requires an exact unqualified no-cache or no-store directive',()=>{
 for(const header of ['no-cache','private, NO-STORE','max-age=0, no-cache','  No-Cache  '])assert.equal(freshCachePolicy(header),true,header);
 for(const header of [null,'','max-age=3600, x-no-cache=1','no-store=1','no-cache="Set-Cookie"','max-age=3600, other="a,no-cache,b"','other="unfinished, no-cache'])assert.equal(freshCachePolicy(header),false,String(header));
});

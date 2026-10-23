'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),{staticRequires}=require('../scripts/static-requires.cjs');
test('dependency audit distinguishes executable literal calls from generated code strings and comments',()=>{
 const source=["const fs=require('node:fs');",'body.replaceAll("require(\'../engine.js\')", "replacement");',"// require('./comment.cjs')", "/* require('./comment2.cjs') */", "const value=require ( './actual.cjs' );",'const text=`require("./authored.js")`;',"notrequire('./other.js');", "const next=require(\"../next.js\");"].join('\n');
 assert.deepEqual(staticRequires(source),['./actual.cjs','../next.js']);
});
test('escaped quotes and comments in strings do not hide the next genuine dependency',()=>{
 assert.deepEqual(staticRequires(String.raw`const label="a \"quoted\""; require("./real.cjs");`),['./real.cjs']);
 assert.deepEqual(staticRequires("const label='/*'; require('./real.cjs');"),['./real.cjs']);
});
test('legal comments between CommonJS call tokens cannot hide a missing local dependency',()=>{
 assert.deepEqual(staticRequires("require/* comment */('./missing.cjs'); require // line\n ( /*before*/ './other.cjs' /*after*/ );"),['./missing.cjs','./other.cjs']);
});

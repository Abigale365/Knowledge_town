'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),http=require('node:http'),{once}=require('node:events');
const {ensureGameServer,portNumber,DEFAULT_PORT}=require('../scripts/launch-game.cjs');
test('launcher preserves origin, reuses a running game and never starts a duplicate',async t=>{
 const app=require('../server.cjs').createApp(require('../server.cjs').configuration({}));app.listen(0,'127.0.0.1');await once(app,'listening');t.after(()=>new Promise(r=>app.close(r)));
 const result=await ensureGameServer({port:app.address().port,startServer:()=>{throw Error('must reuse');}});assert.equal(result.reused,true);assert.ok(result.url.endsWith(':'+app.address().port+'/'));assert.equal(DEFAULT_PORT,8782);
});
test('launcher refuses a different service rather than moving the browser save to another port',async t=>{
 const other=http.createServer((req,res)=>res.end('Different project'));other.listen(0,'127.0.0.1');await once(other,'listening');t.after(()=>new Promise(r=>other.close(r)));
 await assert.rejects(ensureGameServer({port:other.address().port,startServer:()=>{throw Error('must not start');}}),/occupied/);
 for(const value of ['8782 & echo unsafe',0,99999,NaN])assert.throws(()=>portNumber(value));
});
test('launcher waits for a newly started local game before reporting its URL',async t=>{
 const reservation=http.createServer();reservation.listen(0,'127.0.0.1');await once(reservation,'listening');const port=reservation.address().port;await new Promise(r=>reservation.close(r));
 let app,starts=0;t.after(()=>app?new Promise(r=>app.close(r)):undefined);
 const result=await ensureGameServer({port,startServer:()=>{starts++;app=require('../server.cjs').createApp(require('../server.cjs').configuration({}));app.listen(port,'127.0.0.1');return app;}});
 assert.equal(starts,1);assert.equal(result.reused,false);assert.equal(result.port,port);
});
test('same entry HTML does not authorize reusing another checkout or stale server build',async t=>{
 const fs=require('node:fs'),path=require('node:path'),own=require('../apps/server/identity.cjs').gameIdentity();let fake={...own,projectId:'0'.repeat(64)};
 const server=http.createServer((req,res)=>{if(req.url==='/api/game-info'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(fake));}else if(req.url==='/api/config')res.end(JSON.stringify({configured:false}));else res.end(fs.readFileSync(path.join(__dirname,'../dist/index.html')));});
 server.listen(0,'127.0.0.1');await once(server,'listening');t.after(()=>new Promise(r=>server.close(r)));
 await assert.rejects(ensureGameServer({port:server.address().port}),/occupied/);fake={...own,buildId:'0'.repeat(64)};
 await assert.rejects(ensureGameServer({port:server.address().port}),/occupied/);
});

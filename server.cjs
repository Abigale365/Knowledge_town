'use strict';
// Compatible root startup and API module entry.
const server=require('./apps/server/index.cjs');
if(require.main===module)server.start();
module.exports=server;

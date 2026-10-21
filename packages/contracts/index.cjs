'use strict';
const core=require('./src/core.cjs');
module.exports={VERSION:1,ACTIVITY_TYPES:[...require('./runtime/task-workshop-engine.js').kinds],digest:core.digest,diagnostic:core.diagnostic,assertValid:core.assertValid,...require('./src/materials.cjs'),...require('./src/knowledge.cjs'),...require('./src/learning.cjs')};

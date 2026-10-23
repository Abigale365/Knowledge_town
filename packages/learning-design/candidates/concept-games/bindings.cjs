'use strict';
const crypto=require('node:crypto');
// Binding SHA256 hashes use JSON.stringify on the complete source objects in their
// original property order. Engine fingerprints are separate replay compatibility tags.
const hash=value=>crypto.createHash('sha256').update(JSON.stringify(value),'utf8').digest('hex');
function forLesson(course,lesson,knowledgeHash){if(!course?.id||!lesson?.id||!lesson.sourceUnitId)throw Error('Missing explicit course/lesson identity');return {courseId:course.id,courseHash:hash(course),lessonId:lesson.id,sourceUnitId:lesson.sourceUnitId,lessonHash:hash(lesson),knowledgeHash};}
function catalogSources(){return [
 ...Object.entries(require('../../../../scripts/teaching-catalog.cjs').catalog()).map(([name,entry])=>({name:'B4-'+name,course:entry.course,source:'scripts/teaching-catalog.cjs#catalog().'+name+'.course'})),
 ...Object.entries(require('../../../../scripts/teaching-catalog-v5.cjs').catalog()).map(([name,entry])=>({name:'B5-'+name,course:entry.course,source:'scripts/teaching-catalog-v5.cjs#catalog().'+name+'.course'}))
 ];}
module.exports={hash,forLesson,catalogSources};

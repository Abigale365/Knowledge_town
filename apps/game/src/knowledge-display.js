/* Reviewed language corrections are display projections, never course mutations. */
'use strict';
(()=>{
 const base=knowledgeText,hash=value=>ConceptGameHash.sha256(JSON.stringify(value));
 knowledgeText=function(lesson,key){
  const course=currentCourse(),matches=KnowledgeDisplayErrata.corrections.filter(c=>c.binding.courseId===course?.id&&c.binding.lessonId===lesson?.id&&c.field==='en.'+key);
  const correction=matches.find(c=>c.binding.courseHash===hash(course)&&c.binding.lessonHash===hash(lesson)&&c.sourceUnitId===lesson.sourceUnitId&&lesson.en?.[key]===c.before);
  return correction?TownLocale.text(lesson[key],correction.after,'zh'):base(lesson,key);
 };
})();

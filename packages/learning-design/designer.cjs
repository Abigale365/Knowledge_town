'use strict';
const C = require('../contracts');

// Blueprints contain authored tasks, never inferred facts or fabricated sources.
function createDesignAdapter({id = 'authored-learning', revision = 1, title, chapters, units: authored} = {}) {
  const blueprint = structuredClone({id, revision, title, chapters, authored});
  return async function design(pack, {signal} = {}) {
    signal?.throwIfAborted();
    C.assertValid(C.validateKnowledge(pack));
    const byId = new Map(pack.units.map(u => [u.id, u]));
    const plan = {schemaVersion: 1, id: blueprint.id, revision: blueprint.revision,
      knowledgePackId: pack.id, knowledgeRevision: pack.revision,
      title: structuredClone(blueprint.title), chapters: []};
    if (!Array.isArray(blueprint.chapters) || blueprint.chapters.length !== 4)
      throw Error('Design blueprint requires four chapters.');
    for (const [ci, chapter] of blueprint.chapters.entries()) {
      const ordered = [], seen = new Set(), visiting = new Set();
      function visit(id) {
        if (seen.has(id)) return;
        const unit = byId.get(id);
        if (!unit || !blueprint.authored?.[id]) throw Error('Missing knowledge or authored activity: ' + id);
        if (visiting.has(id)) throw Error('Cyclic prerequisite: ' + id);
        visiting.add(id);
        unit.prerequisiteIds.forEach(visit);
        visiting.delete(id); seen.add(id); ordered.push(id);
      }
      chapter.unitIds.forEach(visit);
      const size = chapter.maxUnitsPerSection ?? 1;
      if (!Number.isInteger(size) || size < 1 || size > 10) throw Error('Invalid section grouping size');
      const groups = [];
      for (let i = 0; i < ordered.length; i += size) groups.push(ordered.slice(i, i + size));
      const sections = groups.map((ids, si) => {
        signal?.throwIfAborted();
        const sectionId = `b-c${ci + 1}-s${si + 1}`, rounds = [], questions = [];
        for (const [ui, id] of ids.entries()) {
          const unit = byId.get(id), spec = structuredClone(blueprint.authored[id]);
          if (spec.knowledgeBasis && C.digest(JSON.stringify({explanation:unit.explanation,evidence:unit.evidence})) !== spec.knowledgeBasis)
            throw Error('Knowledge changed; re-author and review activity: ' + id);
          rounds.push(...spec.activity.rounds.map((r, ri) => ({...r, id:`u${ui + 1}-r${ri + 1}`, unitIds:[id]})));
          questions.push(...spec.questions.map((q, qi) => ({...q,
            q:`第${ci + 1}章 · ${q.q}`, en:{...q.en,q:`Chapter ${ci + 1}: ${q.en.q}`},
            id:`${sectionId}-u${ui + 1}-q${qi + 1}`,unitIds:[id],mode:'scenario'})));
        }
        const first = blueprint.authored[ids[0]], last = byId.get(ids.at(-1));
        const title = ids.length === 1 ? structuredClone(byId.get(ids[0]).title) : {
          zh:`${byId.get(ids[0]).title.zh} → ${last.title.zh}`,
          en:`${byId.get(ids[0]).title.en} → ${last.title.en}`};
        return {id:sectionId,title,prerequisiteSectionIds:si?[`b-c${ci + 1}-s${si}`]:[],
          learnUnitIds:ids,activity:{version:1,kind:first.activity.kind,title,brief:{
            zh:'先阅读本节全部基础知识卡，再完成形成性应用。整章学习交付后进入正式练习、复习与错题。'+first.activity.brief.zh,
            en:'Read all foundation cards in this section before formative application. Enter formal practice, review and error retry after chapter delivery. '+first.activity.brief.en},rounds},questions};
      });
      plan.chapters.push({id: `b-chapter-${ci + 1}`, title: structuredClone(chapter.title), sections});
    }
    try { C.assertValid(C.validateLearningPlan(pack, plan)); }
    catch (error) { error.candidate = plan; throw error; }
    return plan;
  };
}
module.exports = {createDesignAdapter};

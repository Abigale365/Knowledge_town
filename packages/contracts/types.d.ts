export type LocalizedText = { zh: string; en: string };
export interface MaterialBundle { schemaVersion: 1; id: string; revision: number; materials: {id:string; name:string; text:string; contentHash:string}[] }
export interface Evidence { materialId:string; locator:string; quote:string }
export interface KnowledgeUnit { id:string; objectiveIds:string[]; category:LocalizedText; title:LocalizedText; explanation:LocalizedText; examples:LocalizedText[]; misconceptions:LocalizedText[]; prerequisiteIds:string[]; evidence:Evidence[]; status:'supported'|'gap'|'needs-review'; interaction?:'read'|'assemble' }
export interface KnowledgePack { schemaVersion:1; id:string; revision:number; materialBundleId:string; materialRevision:number; objectives:{id:string; title:LocalizedText; unitIds:string[]}[]; units:KnowledgeUnit[]; gaps:{objectiveId:string; missing:string; requiredMaterial:string}[] }
export interface NamedItem { id:string; text:LocalizedText }
export interface RoundBase { id:string; unitIds:string[]; prompt:LocalizedText; reason:LocalizedText }
export interface Field { id:string; label:LocalizedText; expected:number|string; min?:number; max?:number; tolerance?:number }
export type ActivityRound = RoundBase & (
 {type:'sort'; bins:NamedItem[]; items:(NamedItem&{target:string})[]} |
 {type:'order'; items:NamedItem[]; expected:string[]} |
 {type:'choose'; options:NamedItem[]; expected:string[]} |
 {type:'number'|'rate'|'edit'; fields:Field[]} |
 {type:'matrix'; rows:NamedItem[]; columns:NamedItem[]; expected:string[]} |
 {type:'allocate'; items:(NamedItem&{cost:number; value:number; blocked?:boolean})[]; budget:number; minimumValue:number; required?:string[]}
);
export interface Activity { version:1; kind:string; title:LocalizedText; brief:LocalizedText; rounds:ActivityRound[] }
export interface PracticeQuestion { id:string; unitIds:string[]; q:string; a:string; wrong:string[]; en:{q:string; a:string; wrong:string[]}; quote:string; mode:'scenario' }
export interface LearningSection { id:string; title:LocalizedText; prerequisiteSectionIds:string[]; learnUnitIds:string[]; activity:Activity; questions:PracticeQuestion[] }
export interface LearningPlan { schemaVersion:1; id:string; revision:number; knowledgePackId:string; knowledgeRevision:number; title:LocalizedText; chapters:{id:string; title:LocalizedText; sections:LearningSection[]}[] }
export interface Diagnostic { severity:'error'|'warning'; code:string; path:string; message:string; sourceId?:string }
export interface KnowledgeOptions { signal?:AbortSignal; extract:(bundle:MaterialBundle,options:{signal?:AbortSignal})=>Promise<KnowledgePack> }
export interface DesignOptions { signal?:AbortSignal; design:(pack:KnowledgePack,options:{signal?:AbortSignal})=>Promise<LearningPlan> }

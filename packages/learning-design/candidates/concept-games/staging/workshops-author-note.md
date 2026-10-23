# Seven concept workshops (staging, no collection authority)

Pure UMD `content-workshops.js`: Node require or browser `ConceptContentWorkshops`. Exports `kinds`, `init(descriptor)` and `step(descriptor,data,action)`. Always use the returned data; inputs are not mutated. Root engine supplies acknowledge, binding, event replay and collection gates. Definitions are authored against frozen enriched KnowledgePack source units 2,5,9,10,11,18,19; all cases are explicitly synthetic exercise conditions. Root must attach original teaching/evidence/unit hashes and course/lesson bindings. No changes to frozen packages or game files.

| kind | Actions and rendering |
| --- | --- |
| model-flow | Render `feeds`, two `inputs`, visible `multiplier`, run outputs, `judgments`. `feed(choice)` → `execute(inputId)` for each input → `judge(itemId,choice)` → `check`. Feeding a wish or prior estimate prevents execution. Runs record unchanged fixed mapping, never imply training. |
| inventory-sim | Display forecast, stock range and choice; `stock(value)` → `reveal` (then display actual and lock stock) → `answer(itemId,value)` for shortage/excess/meaning → `check`. Numeric fields are numbers; meaning uses displayed options. No reward for choosing the future actual. |
| data-cleaner | Render columns/rows/source checks and options. `mark(rowId,choice)` for each → `subtotal(value)` → `conclude(choice)` → `check`. Structured variant ends in structure/accuracy distinction; quality variant requires original-source verification before full-total reporting. |
| text-extractor | Render passages, fields and evidenceOptions. `extract(fieldId,value,evidenceId)` per field → `check`. Negation and unstated IDs require distinct source decisions. |
| image-inspector | Render native paths from `image` and clickable `regions`. `inspect(regionId)` → `conclude(choice)` → `check`. Actual spatial gap is evidence; no image-only causal claim. Provide an accessible description of each contour’s visible continuity, not just a preselected answer. |

Each action object is `{type, ...arguments}` (table notation is shorthand). All IDs are hidden control values, never text learners must type. `check` supplies per-item natural-language feedback plus sourceUnitId for knowledge revisit; it preserves successful rows and all drafts. Do not display expected/suspectRegion/knownSubtotal or hidden actual before reveal. Descriptor payload is not an anti-cheating secret; C should render only documented visible fields. The wrapper should dispatch `check` after learner requests evaluation, not label draft selections as mastery. Passed means corrected practice completion, never formal independent mastery.

Validation: `node --test packages/learning-design/candidates/concept-games/staging/content-workshops.test.cjs`. This staging implementation requires root integration and independent model review; no real-browser claim.

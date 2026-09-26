import {at, defineMigration, set, unset} from 'sanity/migrate'

type Block = {
  _key?: string
  _type?: string
  style?: string
  children?: Array<{_key?: string; _type?: string; text?: string; marks?: string[]}>
  markDefs?: unknown[]
}

type MeasureShape = {
  _key?: string
  pros?: unknown
  cons?: unknown
  reasoning?: unknown
}

function asBlocks(value: unknown): Block[] {
  return Array.isArray(value) ? (value as Block[]) : []
}

function blockText(block: Block): string {
  return (block.children ?? []).map((child) => child.text ?? '').join('').trim()
}

/** Pros then cons, as normal paragraphs, skipping a repeated placeholder. */
function mergedWriteup(pros: unknown, cons: unknown, reasoning: unknown): Block[] | undefined {
  if (Array.isArray(reasoning) && reasoning.length > 0) return undefined
  const combined = [
    ...asBlocks(pros).map((block, index) => normalize(block, `pro-${index}`)),
    ...asBlocks(cons).map((block, index) => normalize(block, `con-${index}`)),
  ]
  const deduped: Block[] = []
  for (const block of combined) {
    const text = blockText(block)
    const previous = deduped[deduped.length - 1]
    if (previous && text.length > 0 && blockText(previous) === text) continue
    deduped.push(block)
  }
  return deduped.length > 0 ? deduped : undefined
}

function normalize(block: Block, key: string): Block {
  return {
    _type: block._type ?? 'block',
    _key: block._key ? `${key}-${block._key}` : key,
    style: 'normal',
    markDefs: block.markDefs ?? [],
    children: block.children ?? [],
  }
}

function writeupPatches(path: Array<string | {_key: string}>, measure: MeasureShape) {
  const patches = []
  const reasoning = mergedWriteup(measure.pros, measure.cons, measure.reasoning)
  if (reasoning) patches.push(at([...path, 'reasoning'], set(reasoning)))
  if (measure.pros !== undefined) patches.push(at([...path, 'pros'], unset()))
  if (measure.cons !== undefined) patches.push(at([...path, 'cons'], unset()))
  return patches
}

/**
 * Fold measure Pros and Cons into one write-up, then drop the old fields
 * so Studio does not flag them as unknown after the schema change.
 */
export default defineMigration({
  title: 'Replace measure pros and cons with one write-up',
  documentTypes: ['measure', 'region', 'specialDistrict'],
  filter:
    '_type == "measure" && (defined(pros) || defined(cons)) || _type in ["region", "specialDistrict"]',
  migrate: {
    document(doc) {
      if (doc._type === 'measure') {
        const patches = writeupPatches([], doc as MeasureShape)
        return patches.length ? patches : undefined
      }

      if (doc._type !== 'region' && doc._type !== 'specialDistrict') return

      const patches = []
      const sections = Array.isArray(doc.sections) ? doc.sections : []
      for (const section of sections) {
        if (!section || typeof section !== 'object' || !('_key' in section)) continue
        if ((section as {_type?: string})._type !== 'measureGroup') continue
        const sectionKey = (section as {_key: string})._key
        const measures = Array.isArray((section as {measures?: unknown}).measures)
          ? ((section as {measures: Array<MeasureShape>}).measures)
          : []
        for (const measure of measures) {
          if (!measure?._key) continue
          if (measure.pros === undefined && measure.cons === undefined) continue
          patches.push(
            ...writeupPatches(
              ['sections', {_key: sectionKey}, 'measures', {_key: measure._key}],
              measure,
            ),
          )
        }
      }
      return patches.length ? patches : undefined
    },
  },
})

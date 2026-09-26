import {at, defineMigration, unset, type NodePatch} from 'sanity/migrate'

type Json = null | boolean | number | string | Json[] | {[key: string]: Json}

type PathSegment = string | number | {_key: string}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Studio's "Convert to strong reference" patches a draft document. With
 * liveEdit, drafts are read-only (or missing), so that button throws
 * "Attempted to patch a read-only document". Unset `_weak` here instead.
 */
function unsetWeakRefs(value: unknown, path: PathSegment[] = []): NodePatch[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) => {
      const segment = isRecord(item) && typeof item._key === 'string' ? {_key: item._key} : index
      return unsetWeakRefs(item, [...path, segment])
    })
  }

  if (!isRecord(value)) return []

  if (value._type === 'reference' && value._weak) {
    return [at([...path, '_weak'], unset())]
  }

  return Object.entries(value).flatMap(([key, child]) => {
    if (key.startsWith('_')) return []
    return unsetWeakRefs(child as Json, [...path, key])
  })
}

export default defineMigration({
  title: 'Convert weak references to strong (liveEdit-safe)',
  migrate: {
    document(doc) {
      const patches = unsetWeakRefs(doc)
      return patches.length ? patches : undefined
    },
  },
})

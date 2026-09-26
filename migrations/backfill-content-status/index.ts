import {at, defineMigration, setIfMissing} from 'sanity/migrate'

type Status = 'pending' | 'published'

function publishedIf(condition: boolean): Status {
  return condition ? 'published' : 'pending'
}

function hasPortableText(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0
}

/**
 * One-time backfill for `contentStatus` on production documents that
 * predate the field. Missing values are NOT treated as a live frontend
 * fallback — run this migration once.
 *
 * Rules:
 * - entry: published if rating AND reasoning already exist, else pending
 * - measure / ballotMeasure: published if position AND reasoning exist, else pending
 * - race: published (already on the live guide; rating lives on child entries)
 * - ballotRace: published if it already has candidate references, else pending
 */
export default defineMigration({
  title: 'Backfill contentStatus on races, measures, entries, and ballot blocks',
  documentTypes: ['entry', 'race', 'measure', 'region', 'specialDistrict'],
  filter: '!defined(contentStatus) || _type in ["region", "specialDistrict"]',
  migrate: {
    document(doc) {
      if (doc._type === 'entry') {
        if (doc.contentStatus) return
        const ready = typeof doc.rating === 'string' && doc.rating.length > 0 && hasPortableText(doc.reasoning)
        return at('contentStatus', setIfMissing(publishedIf(ready)))
      }

      if (doc._type === 'race') {
        if (doc.contentStatus) return
        return at('contentStatus', setIfMissing('published'))
      }

      if (doc._type === 'measure') {
        if (doc.contentStatus) return
        const ready =
          typeof doc.position === 'string' &&
          doc.position.length > 0 &&
          hasPortableText(doc.reasoning)
        return at('contentStatus', setIfMissing(publishedIf(ready)))
      }

      if (doc._type !== 'region' && doc._type !== 'specialDistrict') return

      const patches = []
      const sections = Array.isArray(doc.sections) ? doc.sections : []
      for (const section of sections) {
        if (!section || typeof section !== 'object' || !('_key' in section)) continue
        const sectionKey = (section as {_key: string; _type?: string})._key

        if ((section as {_type?: string})._type === 'raceGroup') {
          const races = Array.isArray((section as {races?: unknown}).races)
            ? ((section as {races: Array<{_key?: string; contentStatus?: string; entries?: unknown}>}).races)
            : []
          for (const race of races) {
            if (!race?._key || race.contentStatus) continue
            const hasEntries = Array.isArray(race.entries) && race.entries.length > 0
            patches.push(
              at(
                ['sections', {_key: sectionKey}, 'races', {_key: race._key}, 'contentStatus'],
                setIfMissing(publishedIf(hasEntries)),
              ),
            )
          }
        }

        if ((section as {_type?: string})._type === 'measureGroup') {
          const measures = Array.isArray((section as {measures?: unknown}).measures)
            ? ((section as {measures: Array<{_key?: string; contentStatus?: string; position?: string; reasoning?: unknown}>}).measures)
            : []
          for (const measure of measures) {
            if (!measure?._key || measure.contentStatus) continue
            const ready =
              typeof measure.position === 'string' &&
              measure.position.length > 0 &&
              hasPortableText(measure.reasoning)
            patches.push(
              at(
                ['sections', {_key: sectionKey}, 'measures', {_key: measure._key}, 'contentStatus'],
                setIfMissing(publishedIf(ready)),
              ),
            )
          }
        }
      }

      return patches.length ? patches : undefined
    },
  },
})

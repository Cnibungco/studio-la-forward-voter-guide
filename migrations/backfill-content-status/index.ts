import {at, defineMigration, setIfMissing} from 'sanity/migrate'

type Status = 'pending' | 'published'

function publishedIf(condition: boolean): Status {
  return condition ? 'published' : 'pending'
}

function hasPortableText(value: unknown): boolean {
  return Array.isArray(value) && value.length > 0
}

/**
 * Backfill for `contentStatus` on production documents that predate the
 * field. Missing values are NOT treated as a live frontend fallback.
 * Safe to re-run: documents that already have a status are skipped.
 *
 * Rules for a missing status (a value already set is left alone):
 * - entry: published if rating AND reasoning already exist, else pending
 * - race: published (already on the live guide; rating lives on child entries)
 * - measure, ballotMeasure, ballotRace: pending
 *   A write-up may be a placeholder. Missing status is not published.
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
        return at('contentStatus', setIfMissing('pending'))
      }

      if (doc._type !== 'region' && doc._type !== 'specialDistrict') return

      const patches = []
      const sections = Array.isArray(doc.sections) ? doc.sections : []
      for (const section of sections) {
        if (!section || typeof section !== 'object' || !('_key' in section)) continue
        const sectionKey = (section as {_key: string; _type?: string})._key

        if ((section as {_type?: string})._type === 'raceGroup') {
          const races = Array.isArray((section as {races?: unknown}).races)
            ? ((section as {races: Array<{_key?: string; contentStatus?: string}>}).races)
            : []
          for (const race of races) {
            if (!race?._key || race.contentStatus) continue
            patches.push(
              at(
                ['sections', {_key: sectionKey}, 'races', {_key: race._key}, 'contentStatus'],
                setIfMissing('pending'),
              ),
            )
          }
        }

        if ((section as {_type?: string})._type === 'measureGroup') {
          const measures = Array.isArray((section as {measures?: unknown}).measures)
            ? ((section as {measures: Array<{_key?: string; contentStatus?: string}>}).measures)
            : []
          for (const measure of measures) {
            if (!measure?._key || measure.contentStatus) continue
            patches.push(
              at(
                ['sections', {_key: sectionKey}, 'measures', {_key: measure._key}, 'contentStatus'],
                setIfMissing('pending'),
              ),
            )
          }
        }
      }

      return patches.length ? patches : undefined
    },
  },
})

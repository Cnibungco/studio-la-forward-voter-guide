import {at, defineMigration, setIfMissing, unset} from 'sanity/migrate'

/**
 * `measure.recommendation` was renamed to `measure.position` in the §11
 * schema pass (docs/backend-strategy.md, voter-guide-app repo), on the
 * assumption no content existed yet. That assumption was wrong — at
 * least one `measure` document was saved with the old field name (likely
 * from a Studio tab that hadn't picked up the schema change yet). This
 * migration carries that data forward under the new field name.
 */
export default defineMigration({
  title: 'Rename measure.recommendation to measure.position',
  documentTypes: ['measure'],
  filter: 'defined(recommendation) && !defined(position)',
  migrate: {
    document(doc) {
      if (!doc.recommendation || doc.position) return
      return [at('position', setIfMissing(doc.recommendation)), at('recommendation', unset())]
    },
  },
})

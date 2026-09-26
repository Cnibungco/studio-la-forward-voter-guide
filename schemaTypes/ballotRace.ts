import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'

/**
 * Ballot Race
 *
 * The embedded-race counterpart to the top-level `race` document, used
 * only inside a `raceGroup` block (on a City-tier Region's `sections`, or
 * on a `specialDistrict`'s `sections`). Named `ballotRace` rather than
 * `race` because `race` is already taken by the state/county document
 * type — see docs/backend-strategy.md §11.
 *
 * Ownership here is by containment (this object lives inside a Region or
 * specialDistrict's `sections` array), not by reference — there's no
 * `region` field. Candidates are still real `entry` documents; this block
 * references them, rather than the other way around, since an embedded
 * object has no document `_id` an `entry` could reference back to.
 */
export const ballotRace = defineType({
  name: 'ballotRace',
  title: 'Race',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "City Council District 4", "Mayor"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      description: 'Used for deep-linking to this race within the city page.',
    }),
    defineField({
      name: 'office',
      title: 'Office',
      type: 'string',
      description: 'Optional: the role being elected, if different from the title.',
    }),
    defineField({
      name: 'district',
      title: 'District code',
      type: 'string',
      description:
        'Machine-matchable district identifier for address-based ballot matching, e.g. "CC4" for City ' +
        'Council District 4, "SB1" for a school board sub-district, "TA3" for a community college trustee ' +
        'area. No city prefix needed — this race already lives inside its city\'s Region. Leave blank for ' +
        'at-large/citywide races (Mayor, City Attorney) — they always show once their Region matches. ' +
        'See docs/address-matching-strategy.md.',
    }),
    defineField({
      name: 'context',
      title: 'Race context',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Optional general description of the race, shown above the candidate list.',
    }),
    contentStatusField,
    defineField({
      name: 'entries',
      title: 'Candidates',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'entry'}]}],
      description: 'Candidates in this race. Reference existing Entry documents or create new ones inline.',
    }),
  ],
  preview: {
    select: {title: 'title', office: 'office', entries: 'entries', status: 'contentStatus'},
    prepare({title, office, entries, status}) {
      const count = Array.isArray(entries) ? entries.length : 0
      return {
        title,
        subtitle: [status, office, `${count} candidate${count === 1 ? '' : 's'}`].filter(Boolean).join(' — '),
      }
    },
  },
})

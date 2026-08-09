import {defineField, defineType} from 'sanity'

/**
 * Race Group
 *
 * A labeled, ordered bucket of races (e.g. "City Council") — one of the
 * two block types that make up a City-tier Region's or a specialDistrict's
 * `sections` array. See docs/backend-strategy.md §11.
 *
 * No explicit `order` field on `races`: Studio's array editor natively
 * drag-reorders array items, and GROQ returns them in stored order.
 */
export const raceGroup = defineType({
  name: 'raceGroup',
  title: 'Race Group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Group label',
      type: 'string',
      description: 'e.g. "City Council"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'races',
      title: 'Races',
      type: 'array',
      of: [{type: 'ballotRace'}],
    }),
  ],
  preview: {
    select: {title: 'label', races: 'races'},
    prepare({title, races}) {
      const count = Array.isArray(races) ? races.length : 0
      return {title, subtitle: `Race group — ${count} race${count === 1 ? '' : 's'}`}
    },
  },
})

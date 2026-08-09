import {defineField, defineType} from 'sanity'

/**
 * Measure Group
 *
 * A labeled, ordered bucket of measures (e.g. "Ballot Measures") — one of
 * the two block types that make up a City-tier Region's or a
 * specialDistrict's `sections` array. See docs/backend-strategy.md §11.
 *
 * No explicit `order` field on `measures`: Studio's array editor natively
 * drag-reorders array items, and GROQ returns them in stored order.
 */
export const measureGroup = defineType({
  name: 'measureGroup',
  title: 'Measure Group',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Group label',
      type: 'string',
      description: 'e.g. "Ballot Measures"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'measures',
      title: 'Measures',
      type: 'array',
      of: [{type: 'ballotMeasure'}],
    }),
  ],
  preview: {
    select: {title: 'label', measures: 'measures'},
    prepare({title, measures}) {
      const count = Array.isArray(measures) ? measures.length : 0
      return {title, subtitle: `Measure group — ${count} measure${count === 1 ? '' : 's'}`}
    },
  },
})

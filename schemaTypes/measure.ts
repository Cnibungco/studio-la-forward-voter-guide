import {defineField, defineType} from 'sanity'

/**
 * Measure
 *
 * A ballot measure/proposition within a Region. Deliberately a separate
 * type from Race per PRD §3: "Races and Measures are distinct content
 * types, not variants of one type — races carry candidate/rating fields,
 * measures carry a pros/cons breakdown instead."
 *
 * `recommendation` scale confirmed: Support / Oppose / No Position.
 */
export const measure = defineType({
  name: 'measure',
  title: 'Measure',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Measure ULA", "Proposition 5"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'region',
      title: 'Region',
      type: 'reference',
      to: [{type: 'region'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Ballot question / summary',
      type: 'text',
      rows: 3,
      description: 'Plain-language summary of what the measure does.',
    }),
    defineField({
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'recommendation',
      title: 'Recommendation',
      type: 'string',
      options: {
        list: [
          {title: 'Support', value: 'support'},
          {title: 'Oppose', value: 'oppose'},
          {title: 'No Position', value: 'no_position'},
        ],
      },
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this Region.',
    }),
  ],
  preview: {
    select: {title: 'title', region: 'region.title'},
    prepare({title, region}) {
      return {title, subtitle: region}
    },
  },
})

import {defineField, defineType} from 'sanity'

/**
 * Entry
 *
 * A candidate within a Race. References the Race it belongs to (see
 * race.ts for why this is one-directional). Carries the rating and the
 * endorsement reasoning — PRD notes entries can run up to ~1,500 words
 * of rich text, hence `reasoning` is a block array, not a plain string.
 *
 * Rating scale confirmed: No Recommendation / Recommended / Endorsed.
 * ("Harm Reduction" was dropped from the draft scale.)
 */
export const entry = defineType({
  name: 'entry',
  title: 'Entry (Candidate)',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Candidate name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      description: 'Used for deep-linking to this candidate within a race.',
    }),
    defineField({
      name: 'race',
      title: 'Race',
      type: 'reference',
      to: [{type: 'race'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Candidate photo',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'string',
      options: {
        list: [
          {title: 'No Recommendation', value: 'no_recommendation'},
          {title: 'Recommended', value: 'recommended'},
          {title: 'Endorsed', value: 'endorsed'},
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'reasoning',
      title: 'Endorsement reasoning',
      type: 'array',
      of: [{type: 'block'}],
      description: 'The bio/reasoning text. Can run long — this is rich text, not a plain field.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this race.',
    }),
  ],
  preview: {
    select: {title: 'name', race: 'race.title', rating: 'rating', media: 'photo'},
    prepare({title, race, rating, media}) {
      return {title, subtitle: [race, rating].filter(Boolean).join(' — '), media}
    },
  },
})

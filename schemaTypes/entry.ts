import {defineField, defineType} from 'sanity'

import {richTextBlock} from './richTextBlock'

/**
 * Entry
 *
 * A candidate within a Race. Carries the rating and the endorsement
 * reasoning — PRD notes entries can run up to ~1,500 words of rich text,
 * hence `reasoning` is a block array, not a plain string. `reasoning` is
 * required for every rating value, including No Recommendation — a
 * rating with no explanation isn't publishable.
 *
 * Ownership is one of two shapes (see docs/backend-strategy.md §11):
 * - State/County: this Entry sets `race`, referencing the Race document
 *   it belongs to (see race.ts for why that relationship is
 *   one-directional).
 * - City ballots / special districts: `race` is left blank; instead this
 *   Entry is referenced from a `ballotRace.entries` array inside a city
 *   Region's (or specialDistrict's) `sections`.
 *
 * Rating scale confirmed: No Recommendation / Recommended / Endorsed.
 * ("Harm Reduction" was dropped from the draft scale and reconsidered —
 * still dropped — during the §11 schema work.)
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
      description:
        'Set this for a State/County candidate (references the Race document they run in). ' +
        "Leave blank for a city-ballot candidate — instead, add this Entry to the relevant race's " +
        '"Candidates" list inside the city Region (or specialDistrict)\'s ballot sections. ' +
        'See docs/backend-strategy.md §11.',
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
      of: [richTextBlock],
      description: 'The bio/reasoning text. Can run long — this is rich text, not a plain field.',
      validation: (Rule) => Rule.required().min(1),
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

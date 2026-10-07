import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'
import {ratingTitle, RATING_OPTIONS} from './ratingOptions'
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
  liveEdit: true,
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
    contentStatusField,
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'string',
      options: {
        list: [...RATING_OPTIONS],
        layout: 'radio',
      },
      description:
        'Required to mark this entry Published. May be empty while Draft or Pending. Three values only — no fourth tier.',
      validation: (Rule) =>
        Rule.custom((rating, context) => {
          const status = (context.parent as {contentStatus?: string} | undefined)?.contentStatus
          if (status === 'published' && !rating) {
            return 'Rating is required when Content status is Published'
          }
          return true
        }),
    }),
    defineField({
      name: 'reasoning',
      title: 'Endorsement reasoning',
      type: 'array',
      of: [richTextBlock],
      description:
        'One write-up, with no section heading. Required whenever a rating is set, including No Recommendation, and whenever this entry is Published.',
      validation: (Rule) =>
        Rule.custom((reasoning, context) => {
          const parent = context.parent as {contentStatus?: string; rating?: string} | undefined
          const empty = !Array.isArray(reasoning) || reasoning.length === 0
          if ((parent?.contentStatus === 'published' || parent?.rating) && empty) {
            return 'Reasoning is required when a rating is set, and when Content status is Published'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this race.',
    }),
  ],
  preview: {
    select: {title: 'name', race: 'race.title', rating: 'rating', status: 'contentStatus', media: 'photo'},
    prepare({title, race, rating, status, media}) {
      return {title, subtitle: [status, race, ratingTitle(rating)].filter(Boolean).join(' — '), media}
    },
  },
})

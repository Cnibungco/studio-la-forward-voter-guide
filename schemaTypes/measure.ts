import {defineField, defineType} from 'sanity'

import {richTextBlock} from './richTextBlock'

/**
 * Measure
 *
 * A ballot measure/proposition within a Region. Deliberately a separate
 * type from Race per PRD §3: "Races and Measures are distinct content
 * types, not variants of one type — races carry candidate/rating fields,
 * measures carry a pros/cons breakdown instead."
 *
 * `position` scale confirmed: Support / Oppose / No Position. Named
 * `position` (not `recommendation`, its original name) to match the term
 * already locked in docs/backend-strategy.md §1 and
 * .cursor/rules/project-overview.mdc. `position` and `pros`/`cons` are
 * both required — not either/or (see docs/backend-strategy.md §11).
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
      of: [richTextBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [richTextBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'position',
      title: 'Position',
      type: 'string',
      options: {
        list: [
          {title: 'Support', value: 'support'},
          {title: 'Oppose', value: 'oppose'},
          {title: 'No Position', value: 'no_position'},
        ],
      },
      validation: (Rule) => Rule.required(),
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

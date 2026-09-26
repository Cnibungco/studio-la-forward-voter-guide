import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'
import {richTextBlock} from './richTextBlock'

/**
 * Measure
 *
 * A ballot measure/proposition within a Region. Deliberately a separate
 * type from Race per PRD §3: "Races and Measures are distinct content
 * types, not variants of one type — races carry candidate/rating fields,
 * measures carry a position and one write-up."
 *
 * `position` scale confirmed: Support / Oppose / No Position. Named
 * `position` (not `recommendation`, its original name) to match the term
 * already locked in docs/backend-strategy.md §1 and
 * .cursor/rules/project-overview.mdc. `position` and `reasoning` are
 * required when Content status is Published. Draft/Pending measures may
 * leave them empty.
 */
export const measure = defineType({
  name: 'measure',
  title: 'Measure',
  type: 'document',
  liveEdit: true,
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
    contentStatusField,
    defineField({
      name: 'summary',
      title: 'Ballot question / summary',
      type: 'text',
      rows: 3,
      description: 'Plain-language summary of what the measure does.',
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
      description: 'Required to mark this measure Published. May be empty while Draft or Pending.',
      validation: (Rule) =>
        Rule.custom((position, context) => {
          const status = (context.parent as {contentStatus?: string} | undefined)?.contentStatus
          if (status === 'published' && !position) {
            return 'Position is required when Content status is Published'
          }
          return true
        }),
    }),
    defineField({
      name: 'reasoning',
      title: 'Write-up',
      type: 'array',
      of: [richTextBlock],
      description:
        'One write-up, with no section heading. Required when Content status is Published.',
      validation: (Rule) =>
        Rule.custom((reasoning, context) => {
          const status = (context.parent as {contentStatus?: string} | undefined)?.contentStatus
          if (status === 'published' && (!Array.isArray(reasoning) || reasoning.length === 0)) {
            return 'A write-up is required when Content status is Published'
          }
          return true
        }),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this Region.',
    }),
  ],
  preview: {
    select: {title: 'title', region: 'region.title', status: 'contentStatus'},
    prepare({title, region, status}) {
      return {title, subtitle: [status, region].filter(Boolean).join(' — ')}
    },
  },
})

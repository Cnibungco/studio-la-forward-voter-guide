import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'
import {richTextBlock} from './richTextBlock'

/**
 * Ballot Measure
 *
 * The embedded-measure counterpart to the top-level `measure` document,
 * used only inside a `measureGroup` block (on a City-tier Region's
 * `sections`, or on a `specialDistrict`'s `sections`). Named
 * `ballotMeasure` rather than `measure` because `measure` is already
 * taken by the state/county document type — see docs/backend-strategy.md
 * §11.
 *
 * Fully self-contained (no child entries to reference out to), so unlike
 * `ballotRace` there's no inversion here — just no `region` ownership
 * field, since ownership is by containment.
 *
 * `position` and `reasoning` are required when Content status is
 * Published. Draft/Pending measures may leave them empty.
 */
export const ballotMeasure = defineType({
  name: 'ballotMeasure',
  title: 'Measure',
  type: 'object',
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
      description: 'Used for deep-linking to this measure within the city page.',
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
        layout: 'dropdown',
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
  ],
  preview: {
    select: {title: 'title', position: 'position', status: 'contentStatus'},
    prepare({title, position, status}) {
      return {title, subtitle: [status, position].filter(Boolean).join(' — ')}
    },
  },
})

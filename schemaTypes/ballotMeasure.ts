import {defineField, defineType} from 'sanity'

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
      validation: (Rule) => Rule.required(),
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
  ],
  preview: {
    select: {title: 'title', position: 'position'},
    prepare({title, position}) {
      return {title, subtitle: position}
    },
  },
})

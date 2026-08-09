import {defineField, defineType} from 'sanity'

/**
 * Special District
 *
 * A district whose ballot content spans multiple cities (school boards,
 * community college boards — e.g. LACCD serves 36 cities, LAUSD 25+),
 * so it can't reference a single owning Region the way `race`/`measure`
 * do. Has its own `sections` (same raceGroup/measureGroup shape a City
 * uses) and a multi-reference to every City-tier Region it applies to.
 * See docs/backend-strategy.md §11.
 *
 * A city's page renders its own `sections` plus every specialDistrict
 * that lists it in `citiesServed`, combined into one ordered list.
 *
 * Known gap, not modeled this pass: some specialDistrict coverage (e.g.
 * LAUSD) extends into unincorporated LA County areas that have no City
 * Region document to reference. Not solved here.
 */
export const specialDistrict = defineType({
  name: 'specialDistrict',
  title: 'Special District',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Los Angeles Community College District"',
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
      name: 'description',
      title: 'Intro / description',
      type: 'text',
      rows: 3,
      description: 'Optional short blurb, e.g. "Serves 36 cities across the South Bay and southeast LA County."',
    }),
    defineField({
      name: 'citiesServed',
      title: 'Cities served',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'region'}],
          options: {filter: 'tier == "city"'},
        },
      ],
      description:
        'Every City-tier Region this district appears on. Known gap: districts extending into ' +
        'unincorporated LA County (e.g. LAUSD) have no Region to link for those areas — not modeled yet.',
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'sections',
      title: 'Ballot sections',
      type: 'array',
      of: [{type: 'raceGroup'}, {type: 'measureGroup'}],
      description: 'Ordered, editor-controlled race/measure groups for this district — same shape as a City uses.',
    }),
  ],
  preview: {
    select: {title: 'title', cities: 'citiesServed'},
    prepare({title, cities}) {
      const count = Array.isArray(cities) ? cities.length : 0
      return {title, subtitle: `${count} cit${count === 1 ? 'y' : 'ies'} served`}
    },
  },
})

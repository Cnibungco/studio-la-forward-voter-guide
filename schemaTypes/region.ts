import {defineField, defineType} from 'sanity'

/**
 * Region
 *
 * The unit Sea/David create when adding a new jurisdiction — a new city,
 * a new county subsection, etc. — without any code or schema change.
 * PRD §3: "Sea/David can add new entries *and new jurisdictions* without
 * code... a new jurisdiction likely means a new instance in the content
 * hierarchy, not just a new field value."
 *
 * `tier` maps to the three fixed top-level nav sections (State/County/City).
 * The tier buckets themselves are NOT content — they're hardcoded in the
 * frontend nav per the non-technical doc ("3 Tiers: City, State, County").
 * A Region is what lives *inside* one of those buckets, e.g. "City of
 * Santa Monica," "Countywide Offices," "State Legislature – Senate."
 */
export const region = defineType({
  name: 'region',
  title: 'Region / Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "City of Santa Monica", "Countywide Offices", "Statewide Propositions"',
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
      name: 'tier',
      title: 'Tier',
      type: 'string',
      description: 'Which top-level nav section this Region appears under.',
      options: {
        list: [
          {title: 'State', value: 'state'},
          {title: 'County', value: 'county'},
          {title: 'City', value: 'city'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first in the sidebar. Leave blank to sort alphabetically.',
    }),
    defineField({
      name: 'description',
      title: 'Intro / description',
      type: 'text',
      rows: 3,
      description: 'Optional short blurb shown at the top of this section.',
    }),
  ],
  preview: {
    select: {title: 'title', tier: 'tier'},
    prepare({title, tier}) {
      return {title, subtitle: tier ? tier.toUpperCase() : 'No tier set'}
    },
  },
})

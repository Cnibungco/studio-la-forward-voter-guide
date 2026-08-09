import {defineField, defineType} from 'sanity'

/**
 * Race
 *
 * A contested office within a Region (e.g. "LA City Council District 4").
 * Candidates are modeled as separate `entry` documents that reference
 * *this* race — not the other way around — so there's exactly one place
 * that owns the relationship (PRD §5: "an Entry must reference a valid
 * Race, which must reference a valid Region"). Avoids a race.entries
 * array and an entry.race reference drifting out of sync.
 */
export const race = defineType({
  name: 'race',
  title: 'Race',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "LA City Council District 4", "State Senate District 26"',
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
      name: 'office',
      title: 'Office',
      type: 'string',
      description: 'Optional: the role being elected, if different from the title (e.g. "City Attorney").',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this Region.',
    }),
    defineField({
      name: 'context',
      title: 'Race context',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Optional general description of the race, shown above the candidate list.',
    }),
  ],
  preview: {
    select: {title: 'title', region: 'region.title'},
    prepare({title, region}) {
      return {title, subtitle: region}
    },
  },
})

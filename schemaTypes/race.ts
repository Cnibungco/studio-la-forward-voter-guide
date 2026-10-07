import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'
import {richTextBlock} from './richTextBlock'

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
  liveEdit: true,
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
      name: 'district',
      title: 'District code',
      type: 'string',
      description:
        'Machine-matchable district identifier for address-based ballot matching, e.g. "CD4", "SD24", ' +
        '"AD54", "SUP2". Leave blank for at-large/statewide races (Governor, US Senate) — they always ' +
        'show once their Region matches, regardless of match precision. See docs/address-matching-strategy.md.',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers appear first within this Region.',
    }),
    contentStatusField,
    defineField({
      name: 'context',
      title: 'Race context',
      type: 'array',
      of: [richTextBlock],
      description:
        'Optional general description of the race, shown above the candidate list. Normal paragraphs only — no headings.',
    }),
  ],
  preview: {
    select: {title: 'title', region: 'region.title', status: 'contentStatus'},
    prepare({title, region, status}) {
      return {title, subtitle: [status, region].filter(Boolean).join(' — ')}
    },
  },
})

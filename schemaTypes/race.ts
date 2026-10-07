import {defineField, defineType} from 'sanity'

import {contentStatusField} from './contentStatus'
import {ratingTitle, RATING_OPTIONS} from './ratingOptions'
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
 *
 * A state or county race can also carry one candidate rating directly
 * (candidateName, rating, reasoning). That is what editors see on
 * Governor and the other statewide races. Separate entry documents, when
 * they exist, are what the public guide shows instead.
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
      name: 'candidateName',
      title: 'Candidate name',
      type: 'string',
      description:
        'Who this rating is for. Leave blank when the race title already includes the name, like “Governor - Xavier Becerra”.',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'string',
      options: {
        list: [...RATING_OPTIONS],
        layout: 'radio',
      },
      description:
        'No Recommendation, Recommended, or Endorsed. Leave empty to keep showing “Recommendation coming soon.” If this race has separate candidate entries, those ratings are what the public guide shows.',
      validation: (Rule) =>
        Rule.custom((rating, context) => {
          const reasoning = (context.parent as {reasoning?: unknown[]} | undefined)?.reasoning
          const hasWriteup = Array.isArray(reasoning) && reasoning.length > 0
          if (hasWriteup && !rating) return 'Choose a rating to go with this write-up'
          return true
        }),
    }),
    defineField({
      name: 'reasoning',
      title: 'Write-up',
      type: 'array',
      of: [richTextBlock],
      description:
        'One write-up, with no section heading. Required when a rating is set, including No Recommendation.',
      validation: (Rule) =>
        Rule.custom((reasoning, context) => {
          const rating = (context.parent as {rating?: string} | undefined)?.rating
          if (rating && (!Array.isArray(reasoning) || reasoning.length === 0)) {
            return 'A write-up is required when a rating is set, including No Recommendation'
          }
          return true
        }),
    }),
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
    select: {
      title: 'title',
      region: 'region.title',
      status: 'contentStatus',
      rating: 'rating',
      candidateName: 'candidateName',
    },
    prepare({title, region, status, rating, candidateName}) {
      return {
        title,
        subtitle: [status, candidateName, ratingTitle(rating), region].filter(Boolean).join(' — '),
      }
    },
  },
})

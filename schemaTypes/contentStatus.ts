import {defineField} from 'sanity'

export const CONTENT_STATUS_VALUES = ['draft', 'pending', 'published'] as const

export type ContentStatus = (typeof CONTENT_STATUS_VALUES)[number]

/**
 * Public-guide workflow. Studio uses liveEdit (no Sanity draft/publish
 * copies). This field is the remaining editorial control:
 *
 * - draft: hidden from every public GROQ filter
 * - pending: on the ballot, shown as "Recommendation coming soon"
 * - published: rating/position + reasoning are shown
 *
 * The public site also treats missing rating/position as pending.
 * "No Recommendation" is a real published rating, not an empty write-up.
 */
export const contentStatusField = defineField({
  name: 'contentStatus',
  title: 'Content status',
  type: 'string',
  initialValue: 'pending',
  options: {
    list: [
      {title: 'Draft — hidden from the public guide', value: 'draft'},
      {title: 'Pending — show “Recommendation coming soon”', value: 'pending'},
      {title: 'Published — show rating and reasoning', value: 'published'},
    ],
    layout: 'radio',
  },
  description:
    'Pending (or a published item with no rating/position yet) shows “Recommendation coming soon.” No Recommendation is a finished rating — not the same as empty.',
  validation: (Rule) => Rule.required(),
})

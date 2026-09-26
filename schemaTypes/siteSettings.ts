import {defineField, defineType} from 'sanity'

export const DEFAULT_DISCLAIMER =
  'These are races and measures where LA Forward has made recommendations.'

/**
 * Site-wide copy Sea/David can edit without a frontend redeploy.
 * Enforced as a singleton via Structure (`documentId: 'siteSettings'`).
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  liveEdit: true,
  fields: [
    defineField({
      name: 'disclaimer',
      title: 'Guide disclaimer',
      type: 'text',
      rows: 3,
      initialValue: DEFAULT_DISCLAIMER,
      description:
        'Shown on every page of the public guide. Placement may move; the copy lives here either way.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sampleBallotUrl',
      title: 'County sample ballot URL',
      type: 'url',
      description:
        'Link to the LA County sample ballot lookup (lavote.gov or equivalent). Shown near the disclaimer and on the address-not-found page.',
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})

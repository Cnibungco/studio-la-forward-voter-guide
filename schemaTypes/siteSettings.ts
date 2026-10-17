import {defineArrayMember, defineField, defineType} from 'sanity'

import {
  ABOUT_PARAGRAPHS,
  ABOUT_SUMMARY,
  CAMPAIGN_DONOR,
  DONATE_ASK,
  KEY_DATES,
  TRUST_STATEMENT,
} from './homeCopySeed'

export const DEFAULT_DISCLAIMER =
  'These are races and measures where LA Forward has made recommendations.'

/**
 * Site-wide copy Sea/David can edit without a frontend redeploy.
 * Enforced as a singleton via Structure (`documentId: 'siteSettings'`).
 * Home-page fields fall back to the app's copy when left blank, except
 * the announcement, which stays hidden until the text is filled in.
 */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  liveEdit: true,
  fieldsets: [
    {
      name: 'search',
      title: 'Search results',
      description:
        'The homepage title and description Google shows. Leave either one blank to keep the built-in wording. City and district pages build their own titles from the place name and the election name.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'announcement',
      title: 'Announcement',
      description: 'A short note on the home page. Leave the text blank to hide it.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'dates',
      title: 'Key dates',
      description: 'The deadline list on the home page. Drag rows to reorder them.',
      options: {collapsible: true, collapsed: false},
    },
    {
      name: 'about',
      title: 'About this guide',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'donate',
      title: 'Donate',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'campaign',
      title: 'Campaign footer',
      description: 'Only the donor line is editable. The rest of the legal footer stays as written.',
      options: {collapsible: true, collapsed: true},
    },
    {
      name: 'guide',
      title: 'Guide',
      description: 'Shown across the public guide, not only the home page.',
      options: {collapsible: true, collapsed: false},
    },
  ],
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      fieldset: 'search',
      description:
        'Homepage browser tab and Google title. Leave blank to build it from the election name. Google usually shows about 60 characters and may cut the rest.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 5,
      fieldset: 'search',
      description:
        'The text under the homepage title in Google. Leave blank to use the built-in description. Google usually shows about 160 characters.',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'announcement',
      title: 'Announcement',
      type: 'text',
      rows: 3,
      fieldset: 'announcement',
      description: 'Leave blank to hide the announcement.',
    }),
    defineField({
      name: 'announcementLinkLabel',
      title: 'Link label',
      type: 'string',
      fieldset: 'announcement',
      description: 'Optional. Shown after the announcement only when the URL is filled in too.',
    }),
    defineField({
      name: 'announcementLinkUrl',
      title: 'Link URL',
      type: 'url',
      fieldset: 'announcement',
      description: 'Optional. Shown only when the link label is filled in too.',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
          allowRelative: true,
        }),
    }),
    defineField({
      name: 'keyDates',
      title: 'Key dates',
      type: 'array',
      fieldset: 'dates',
      of: [defineArrayMember({type: 'keyDate'})],
      initialValue: KEY_DATES,
      description:
        'One row per deadline. If this list is empty, the site shows the original dates for the November 3, 2026 election.',
    }),
    defineField({
      name: 'aboutSummary',
      title: 'Summary',
      type: 'string',
      fieldset: 'about',
      initialValue: ABOUT_SUMMARY,
      description: 'The label on the expandable “About this guide” section.',
    }),
    defineField({
      name: 'aboutParagraphs',
      title: 'Paragraphs',
      type: 'array',
      fieldset: 'about',
      initialValue: ABOUT_PARAGRAPHS,
      description: 'Shown in order inside the About section. Drag to reorder.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'aboutParagraph',
          title: 'Paragraph',
          fields: [
            defineField({
              name: 'text',
              title: 'Text',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {text: 'text'},
            prepare({text}) {
              const value = typeof text === 'string' ? text.trim() : ''
              return {title: value || 'Paragraph'}
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'trustStatement',
      title: 'Trust statement',
      type: 'text',
      rows: 3,
      fieldset: 'about',
      initialValue: TRUST_STATEMENT,
      description:
        'The highlighted sentence in About this guide, and the same sentence on guide pages.',
    }),
    defineField({
      name: 'donateAsk',
      title: 'Donate line',
      type: 'text',
      rows: 3,
      fieldset: 'donate',
      initialValue: DONATE_ASK,
      description: 'The sentence above the donate button on the home page.',
    }),
    defineField({
      name: 'campaignDonor',
      title: 'Donor line',
      type: 'string',
      fieldset: 'campaign',
      initialValue: CAMPAIGN_DONOR,
      description:
        'Name and amount, for example: Elizabeth Thomas in the amount of $5,000. Shown in the footer on every page.',
    }),
    defineField({
      name: 'electionName',
      title: 'Election name',
      type: 'string',
      fieldset: 'guide',
      initialValue: 'November 2026',
      description:
        'Short label for page titles, the header, and the share card. Example: November 2026. Leave blank to keep "November 2026". The homepage SEO title overrides this when that field is filled in.',
      validation: (Rule) => Rule.max(30),
    }),
    defineField({
      name: 'disclaimer',
      title: 'Guide disclaimer',
      type: 'text',
      rows: 3,
      fieldset: 'guide',
      initialValue: DEFAULT_DISCLAIMER,
      description:
        'Shown on every page of the public guide. Placement may move; the copy lives here either way.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sampleBallotUrl',
      title: 'County sample ballot URL',
      type: 'url',
      fieldset: 'guide',
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

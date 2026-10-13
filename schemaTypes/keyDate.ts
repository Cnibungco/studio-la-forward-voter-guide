import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * One row in the home-page key dates list. The event is a single line:
 * bold and links only, so a deadline can include a phrase like
 * "Early Voting site" without a full rich-text toolbar.
 */
const keyDateText = defineArrayMember({
  type: 'block',
  styles: [{title: 'Normal', value: 'normal'}],
  lists: [],
  marks: {
    decorators: [{title: 'Strong', value: 'strong'}],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [
          defineField({
            name: 'href',
            type: 'url',
            title: 'URL',
            validation: (Rule) =>
              Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel'],
                allowRelative: true,
              }),
          }),
        ],
      },
    ],
  },
})

export const keyDate = defineType({
  name: 'keyDate',
  title: 'Key date',
  type: 'object',
  fields: [
    defineField({
      name: 'date',
      title: 'Date',
      type: 'string',
      description: 'Short label, like OCT 19 or NOV 3.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'event',
      title: 'What happens',
      type: 'array',
      of: [keyDateText],
      description: 'One short line. Bold a phrase, or select it and add a link.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'electionDay',
      title: 'Election Day',
      type: 'boolean',
      description: 'Highlights this row. Turn on for Election Day only.',
      initialValue: false,
    }),
  ],
  preview: {
    select: {date: 'date', electionDay: 'electionDay', event: 'event'},
    prepare({date, electionDay, event}) {
      const text = Array.isArray(event)
        ? event
            .flatMap((block) => (block && typeof block === 'object' && 'children' in block ? block.children : []))
            .map((child) =>
              child && typeof child === 'object' && 'text' in child && typeof child.text === 'string'
                ? child.text
                : '',
            )
            .join('')
            .trim()
        : ''
      return {
        title: typeof date === 'string' && date.trim() ? date : 'Key date',
        subtitle: electionDay ? 'Election Day' : text || undefined,
      }
    },
  },
})
